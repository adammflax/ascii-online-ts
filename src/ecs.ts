export interface Comparable<T>{ compareTo(o1 : T) : number}

export type Predicate<T extends ComponentValue> =  (object: T) => boolean;


//{ test(object : T) : boolean }

export type ComponentValue =  Number | String | Boolean | Comparable<any>;

export function isComparable(value : any) : value is Comparable<any>{
    return (<Comparable<any>>value).compareTo !== undefined;
}

export type Component = { [key: string] : ComponentValue} 

//for each property in the type if its a function exclude it from
//type otherwise include it
export type ComponentKey<T extends Component> = {[P in keyof T]: 
                                                T[P] extends Function ? never : P}[keyof T];

//<T extends Component>

export type ComponentProperties<T extends Component, K extends keyof T> = {
    [P in K]: Predicate<T[P]>;
};

//Pick<T, ComponentKey<T>>;


export function find<T extends Component, K extends ComponentProperties<T, ComponentKey<T>>>(
    object : T,
    methodName : Partial<K>
)  : boolean{
     console.log(methodName);
    return  false;
}


export function eq<T extends ComponentValue>(value: T) : Predicate<T>{
    return (object: T) => isComparable(object) ? object.compareTo(value) === 0 : 
    object === value;
}