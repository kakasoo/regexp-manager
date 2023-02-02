import { RegExpBuilder } from '../../regexp-builder';

describe('Typed', () => {
    describe('TypedFrom', () => {
        it('TypedFrom first parameter is string type', () => {
            const test = new RegExpBuilder().typedFrom('test').typedGetRawOne();
            expect(test).toBe('test');
        });

        it('TypedFrom first paramter is TypedSubExpressionBuilder<T> type', () => {
            const test = new RegExpBuilder().typedFrom((sb) => sb.typedFrom('test')).typedGetRawOne();
            expect(test).toBe('test');
        });

        it('TypedFrom first paramter is TypedSubExpressionBuilder<T> type which return T string', () => {
            const test = new RegExpBuilder().typedFrom((sb) => sb.typedFrom('test').typedGetRawOne()).typedGetRawOne();
            expect(test).toBe('test');
        });
    });
});
