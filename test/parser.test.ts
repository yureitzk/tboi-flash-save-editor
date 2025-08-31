import { parseNumberSubArray } from '../src/utils/helpers';

describe('parseNumberSubArray', () => {
	it('Should handle an empty string', () => {
		const checkArray = ['a', 'b', 'c'];
		const result = parseNumberSubArray('', checkArray);
		expect(result).toEqual([0, 0, 0]);
	});

	it('Should parse a normal string', () => {
		const checkArray = ['a', 'b', 'c'];
		const result = parseNumberSubArray("'1'2'3'", checkArray);
		expect(result).toEqual([1, 2, 3]);
	});

	it('Should handle a zero string', () => {
		const checkArray = ['a', 'b', 'c'];
		const result = parseNumberSubArray('0', checkArray);
		expect(result).toEqual([0, 0, 0]);
	});
});
