import { World, Vector2, Entity } from "../../src/ecs";

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

describe('after associating entities can add component data', () => {
    it('should get ids', () => {
        const world = new World();
        type idTable = ["srv" | "cln" | null, string];

        const testData  : idTable[] = [
            [null, "0"],
            ["srv", "srv1"],
            ["cln", "cln2"],
            [null, "3"],
            [null,"4"],
            ["srv", "srv5"],
            ["srv", "srv6"],
            ["cln", "cln7"]
        ];

        for(var i = 0; i < testData.length; i++){
            var data = testData[i];       
            var entity = world.addEntity(data[0]);

            expect(entity).toEqual(data[1], `expected entry ${testData[0]} entry to have value ${testData[1]}`);
        }
    });
});