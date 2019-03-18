//responsible for defining bow to compare 2 objects of the same class. Given o1 comparing
//to o2. a value < 0 will be returned if o1 is smaller then o2, a value of 0 will be returned if
//o1 == o2 and a value > 0 will be returned if o1 > o2.
export interface Comparable<T>{ compareTo(o1 : T) : -1 | 0 | 1}

export class Vector2 implements Comparable<Vector2> {
    public constructor(public x : number, public y : number){}

    compareTo(o1: Vector2):  -1 | 0 | 1 {
        if(this.y > o1.y){
            return 1;
        }

        if(this.y < o1.y){
            return -1;
        }

        if(this.y == o1.y && this.x == o1.x){
            return 0;
        }

        return this.x > o1.x ? 1 : -1;
    } 

    public toString = () : string => {
        return `{x:${this.x},y:${this.y}}`;
    }
}

export interface Positionable{ position: Vector2}

export type Predicate<T extends ComponentValue> =  (object: T) => boolean;

export type ComponentValue =  Number | String | Boolean | Comparable<any>;

function isComparable(value : any) : value is Comparable<any>{
    return (<Comparable<any>>value).compareTo !== undefined;
}

//id are string as some entities are unique to client/server so can avoid coliisions
//by prefixing id with client/server
export type Entity = String;
export type Component = { [key: string] : ComponentValue} 

//for each property in the type if its a function exclude it from
//type otherwise include it
type ComponentKey<T extends Component> = {[P in keyof T]: 
                                                T[P] extends Function ? never : P}[keyof T];

type ComponentProperties<T extends Component, K extends keyof T> = {
    [P in K]: Predicate<T[P]>;
};

export function eq<T extends ComponentValue>(value: T) : Predicate<T>{
    return (object: T) => isComparable(object) ? object.compareTo(value) === 0 : 
    object === value;
}

export class World{
    private static id: number = 0; 
    private componentOwner:  Map<Component, Entity> ;
    constructor(private entities : Entity[] = []){
        this.componentOwner = new Map(); 
    }

    public addEntity(prefix : "srv" | "cln" | null = null, ...componenets : (Component | Component & Positionable)[]) :Entity{
        const id = String(World.id++);
        const entity : Entity = prefix != null ? prefix + id : id;

        this.entities.push(entity);
        componenets.forEach(c => {
            this.componentOwner.set(c, entity);
        });

        return entity;
    }


    public find<T extends Component, K extends ComponentProperties<T, ComponentKey<T>>>(
        object : T,
        query : Partial<K>
    )  : boolean{
        let result = true
        console.log(query);
        return  false;
    }
}