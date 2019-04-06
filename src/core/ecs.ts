//responsible for defining bow to compare 2 objects of the same class. Given o1 comparing
//to o2. a value < 0 will be returned if o1 is smaller then o2, a value of 0 will be returned if
//o1 == o2 and a value > 0 will be returned if o1 > o2.
export interface Comparable<T> {
  compareTo(o1: T): -1 | 0 | 1;
}

export class Vector3 implements Comparable<Vector3> {
  public value : Float32Array;

  public constructor(x: number, y: number, z: number) {
    this.value = new Float32Array(3);
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public get x() : number{
    return this.value[0];
  }

  public set x(x : number){
    this.value[0] = x;
  }

  public get y() : number{
    return this.value[1];
  }

  public set y(y : number){
    this.value[1] = y;
  }

  public get z() : number{
    return this.value[2];
  }

  public set z(z : number){
    this.value[2] = z;
  }

  compareTo(o1: Vector3): -1 | 0 | 1 {
    if (this.y > o1.y) {
      return 1;
    }

    if (this.y < o1.y) {
      return -1;
    }

    if(this.x > o1.x){
        return 1;
    }

    if(this.x < o1.x){
        return -1;
    }

    if(this.z > o1.z){
        return 1;
    }

    if(this.z < o1.z){
        return -1;
    }

    return 0;
  }

  public toString = (): string => {
    return `{${this.x},${this.y}, ${this.z}}`;
  };
}

export interface Positionable {
  position: Vector3;
  rotation?: number;
  width: number;
  height: number;
}

export type Predicate<T extends ComponentValue> = (object: T) => boolean;

export type ComponentValue = Number | String | Boolean | Comparable<any>;

function isComparable(value: any): value is Comparable<any> {
  return (<Comparable<any>>value).compareTo !== undefined;
}

//id are string as some entities are unique to client/server so can avoid coliisions
//by prefixing id with client/server
export interface Entity {
  readonly id: string;
  [k: string]: ComponentValue;
}

export function not<T extends ComponentValue>(
  predicate: Predicate<T>
): Predicate<T> {
  return (object: T) => !predicate(object);
}

export function eq<T extends ComponentValue>(value: T): Predicate<T> {
  return (object: T) =>
    isComparable(object) ? object.compareTo(value) === 0 : object === value;
}

export function lt<T extends ComponentValue>(value: T): Predicate<T> {
  return (object: T) =>
    isComparable(object) ? object.compareTo(value) === -1 : object < value;
}

export function lte<T extends ComponentValue>(value: T): Predicate<T> {
  return (object: T) => not(gt(value))(object);
}

export function gte<T extends ComponentValue>(value: T): Predicate<T> {
  return (object: T) => not(lt(value))(object);
}

export function gt<T extends ComponentValue>(value: T): Predicate<T> {
  return (object: T) =>
    isComparable(object) ? object.compareTo(value) === 1 : object > value;
}

export class World {
  private id: number = 0;
  private propertiesToEntities: Map<PropertyKey, Entity[]>;
  private idToEntity: Map<string, Entity>;

  constructor() {
    this.propertiesToEntities = new Map();
    this.idToEntity = new Map();
  }

  public createEntity(
    prefix: "srv" | "cln",
    extraValues?: { [k: string]: ComponentValue }
  ): Readonly<Entity> {
    const id = String(this.id++);
    const entity: Entity = {
      id: prefix != null ? prefix + id : id
    };

    this.idToEntity.set(entity.id, entity);

    if (extraValues != null) {
      this.addProperties(entity, extraValues);
    }

    return Object.freeze(Object.assign({}, entity));
  }

  public assign(
    entity: Entity,
    extraValues: { [k: string]: ComponentValue }
  ): Readonly<Entity> {
    const realEntity = this.idToEntity.get(entity.id);

    if (realEntity == null) {
      throw `we have failed to find an entity of id ${
        entity.id
      } when assigning data`;
    }

    this.addProperties(realEntity, extraValues);
    return Object.freeze(Object.assign({}, realEntity, extraValues));
  }

  private addProperties(
    entity: Entity,
    extraValues: { [k: string]: ComponentValue }
  ) {
    for (const prop in extraValues) {
      //update value to be what we asked for
      entity[prop] = extraValues[prop];
      //if we don't have a mapping for this property create the hash map
      if (!this.propertiesToEntities.has(prop)) {
        this.propertiesToEntities.set(prop, []);
      }

      const entitiesForProp = this.propertiesToEntities.get(prop);

      //should never be null but have to handle it due to typing
      if (entitiesForProp == null) {
        throw `somehow we have failed to find the prop ${prop} in our prop to entity map!`;
      }

      //check to see if we have this entity already, if we do we don't need to do anything
      const hasEntity = entitiesForProp.some(e => e.id === entity.id);

      if (!hasEntity) {
        entitiesForProp.push(entity);
      }
    }
  }

  public find(query: { [key: string]: Predicate<any> }): Entity[] {
    let results: Entity[] = [];

    //no query means return everything
    if (Object.keys(query).length == 0) {
      return [...this.idToEntity.values()];
    }

    for (const prop in query) {
      const predicate = query[prop];
      var newAdditions = (this.propertiesToEntities.get(prop) || []).filter(e =>
        predicate(e[prop])
      );

      //we've not had any entities before
      if (results.length == 0) {
        results = newAdditions;
      } else {
        results = results.filter(value => newAdditions.includes(value));
      }
    }

    return results;
  }
}
