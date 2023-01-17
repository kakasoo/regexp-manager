import { RegExpBuilder } from '../regexp-builder';

describe('isOptional', () => {
    it('IsOptional should add a question mark symbol.', () => {
        const numbers = new RegExpBuilder().from('[0-9]').getOne();
        expect(numbers.test('1234')).toBe(true);
        expect(numbers.test('abcd')).toBe(false);

        const optionalNumbers = new RegExpBuilder().from('[0-9]').isOptional().getOne();
        expect(optionalNumbers.test('1234')).toBe(true);
        expect(optionalNumbers.test('abcd')).toBe(true);
    });
});
