//responsible for defining bow to compare 2 objects of the same class. Given o1 comparing
//to o2. a value < 0 will be returned if o1 is smaller then o2, a value of 0 will be returned if
//o1 == o2 and a value > 0 will be returned if o1 > o2.
export interface Comparable<T> { compareTo(o1: T): -1 | 0 | 1 }

export class Vector2 implements Comparable<Vector2> {
    public constructor(public x: number, public y: number) { }

    compareTo(o1: Vector2): -1 | 0 | 1 {
        if (this.y > o1.y) {
            return 1;
        }

        if (this.y < o1.y) {
            return -1;
        }

        if (this.y == o1.y && this.x == o1.x) {
            return 0;
        }

        return this.x > o1.x ? 1 : -1;
    }

    public toString = (): string => {
        return `{x:${this.x},y:${this.y}}`;
    }
}

export interface Positionable { position: Vector2 }

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

export function eq<T extends ComponentValue>(value: T): Predicate<T> {
    return (object: T) => isComparable(object) ? object.compareTo(value) === 0 :
        object === value;
}

export class World {
    private id: number = 0;
    private propertiesToEntities: Map<PropertyKey, Entity[]>;
    private idToEntity: Map<string, Entity>;

    constructor() {
        this.propertiesToEntities = new Map();
        this.idToEntity = new Map();
    }

    public createEntity(prefix: "srv" | "cln", extraValues?: { [k: string]: ComponentValue }): Readonly<Entity> {
        const id = String(this.id++);
        const entity: Entity = {
            "id": prefix != null ? prefix + id : id
        }

        this.idToEntity.set(entity.id, entity);

        if (extraValues != null) {
            this.addProperties(entity, extraValues);
        }

        return Object.freeze(Object.assign({}, entity));
    }

    // const proxyEntity = ((world: World) => {
    //     return new Proxy(entity, {
    //         set: function (target: Entity, p: PropertyKey, value: ComponentValue, receiver: any): boolean {

    //             if (!world.propertiesToEntities.has(p)) {
    //                 world.propertiesToEntities.set(p, []);
    //             }

    //             const setOfEntities = world.propertiesToEntities.get(p);

    //             if (setOfEntities !== undefined) {
    //                 setOfEntities.push(target);
    //             }

    //             if (typeof p === "string") {
    //                 target[p] = value;
    //             }

    //             return true;
    //         },
    //         deleteProperty: function (target: Entity, p: PropertyKey): boolean {
    //             const setOfEntities = world.propertiesToEntities.get(p);

    //             if (setOfEntities !== undefined) {
    //                 setOfEntities.splice(setOfEntities.indexOf(target), 1);
    //             }

    //             if (typeof p === "string") {
    //                 delete target[p];
    //             }

    //             return true;
    //         }
    //     });
    // })(this);


    public assign(entity: Entity, extraValues: { [k: string]: ComponentValue }): Readonly<Entity> {
        const realEntity = this.idToEntity.get(entity.id);

        if (realEntity == null) {
            throw `we have failed to find an entity of id ${entity.id} when assigning data`;
        }

        this.addProperties(realEntity, extraValues);
        return Object.freeze(Object.assign({}, realEntity, extraValues));
    }

    private addProperties(entity: Entity, extraValues: { [k: string]: ComponentValue }) {
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

    public find(
        query: { [key: string]: Predicate<any> }
    ): Entity[] {
        let results: Entity[] = [];

        //no query means return everything
        if (Object.keys(query).length == 0) {
            return [...this.idToEntity.values()];
        }

        for (const prop in query) {
            const predicate = query[prop];
            var newAdditions = (this.propertiesToEntities.get(prop) || []).filter(e => predicate(e[prop]));

            //we've not had any entities before
            if (results.length == 0) {
                results = newAdditions;
            } else {
                results = results.filter(value => newAdditions.includes(value))
            }
        }

        return results;
    }
}