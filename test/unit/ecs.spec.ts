import { World, Vector2, Entity, eq } from "../../src/ecs";

describe('Vector2 unit tests', () => {
    it('vector further away from 0,0 y based should be greater then those closer to0,0', () => {
        type VectorTable = [Vector2, Vector2, -1 | 0 | 1];

        const testData : VectorTable[] = [
            [new Vector2(1, 1), new Vector2(1, 2), -1],
            [new Vector2(2, 1), new Vector2(2, 1), 0],
            [new Vector2(1, 21), new Vector2(1, 1), 1],
            [new Vector2(1, 1), new Vector2(2, 1), -1]
        ];

        for(var i = 0; i < testData.length; i++){
            var data = testData[i];       
            const compareValueReadable = data[2] ==  1 ? 'greater then' : data[2] == 0 ? 
                                        'equal' : 'less then'
            expect(data[0].compareTo(data[1])).toBe(data[2], `expected ${data[0]} to be ${compareValueReadable} ${data[1]}`)
        }
    });
}); 

describe('Entities can be queried and created by world', () => {
    it('should generate unique ids on new entity', () => {
        const world = new World();
        type idTable = ["srv" | "cln", string];

        const testData  : idTable[] = [
            ["srv", "srv0"],
            ["srv", "srv1"],
            ["cln", "cln2"],
            ["cln", "cln3"],
            ["cln","cln4"],
            ["srv", "srv5"],
            ["srv", "srv6"],
            ["cln", "cln7"]
        ];

        for(var i = 0; i < testData.length; i++){
            var data = testData[i];       
            var entity = world.createEntity(data[0]);
            expect(entity.id).toEqual(data[1], `expected entry ${testData[0]} entry to have value ${testData[1]}`);
        }
    });

    it('when creating entity with properties we get back a read only entity with id and properties', () => {
        const world = new World();
        const entity = world.createEntity("cln", {
            'bob': 7
        });

        expect(entity).toEqual({
            'id': 'cln0',
            'bob': 7
        });

        expect(Object.isFrozen(entity)).toBeTruthy();
    });

    it('with a read only entity the world an add additional properties to the entity', () => {
        const world = new World();
        let entity = world.createEntity("cln");
        entity = world.assign(entity, {
            'bob': 7
        });

        expect(entity).toEqual({
            'id': 'cln0',
            'bob': 7
        });

        expect(Object.isFrozen(entity)).toBeTruthy();
    });
    
    it('given entity has component of bob with equal value  to query should be returned in world', () => {
        const world = new World();
        const entity = world.createEntity("cln", {
            'bob': 7
        });

        const result = world.find({
            'bob': eq(7)
        });

        expect(result).toEqual([entity]);
    });

    it('given entity of 2 data values should fail as second property not equal', () => {
        const world = new World();
        let entity = world.createEntity("cln");
        entity = world.assign(entity, {
            'bob': 7,
            'bob2': 7
        });

        const result = world.find({
            'bob': eq(7),
            'bob2': eq(8)
        });

        expect(result).toEqual([]);
    });

    it('given no parameters should find everything', () => {
        const world = new World();
        const entity = world.createEntity("cln");
        const entity2 = world.createEntity("cln");

        const result = world.find({});

        expect(result).toEqual([entity, entity2]);
    });
});