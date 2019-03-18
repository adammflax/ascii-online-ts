import { World, Vector2 } from "../../src/ecs";

describe('Vector2 unit tests', () => {
    it('1,1 > 1,0 && vice versa', () => {
        let a = new Vector2(1, 1);
        let b = new Vector2(1, 0);

        expect(a.compareTo(b)).toBe(1);
        expect(b.compareTo(a)).toBe(-1);
    });

    it('1,1 = 1,1', () => {
        let a = new Vector2(1, 1);
        let b = new Vector2(1, 1);

        expect(a.compareTo(b)).toBe(0);
        expect(b.compareTo(a)).toBe(0);
    });

    it('vector further away from 0,0 y based should be greater then those closer to0,0', () => {
        type VectorTable = [Vector2, Vector2, -1 | 0 | 1];


        const tableData : VectorTable[] = [
            [new Vector2(1, 1), new Vector2(1, 2), -1],
            [new Vector2(2, 1), new Vector2(2, 1), 0],
            [new Vector2(1, 21), new Vector2(1, 1), 1],
            [new Vector2(1, 1), new Vector2(2, 1), -1]
        ];

        for(var i = 0; i < tableData.length; i++){
            var data = tableData[i];       
            const compareValueReadable = data[2] ==  1 ? 'greater then' : data[2] == 0 ? 
                                        'equal' : 'less then'
            expect(data[0].compareTo(data[1])).toBe(data[2], `expected ${data[0]} to be ${compareValueReadable} ${data[1]}`)
        }

    });
}); 