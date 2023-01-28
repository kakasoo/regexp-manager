import { RegExpBuilder } from '../../regexp-builder';

describe('structure of regexp-manager', () => {
    it('build 메서드는 pattern, RegExp instance, test-string을 반환한다.', () => {
        const response = new RegExpBuilder().from('one').build();

        expect(response.pattern).toBeDefined(); // it means regexp pattern, new RegExp(respnose.pattern) === response.regexp
        expect(response.regexp).toBeDefined(); // it means regexp
        expect(response.testString).toBeDefined(); // response.regexp.test(response.testString) === true
    });

    // it('RegExpBuilder의 생성자로 값을 넣는 것은 from에 값을 넣는 것과 동일하다.', () => {

    // });

    // it('test2', async () => {
    //     type NonEmptyArray<T> = [T, ...T[]];
    //     function isNonEmptyArray<T>(arr: any[]): arr is NonEmptyArray<any> {
    //         return arr.length > 0;
    //     }

    //     function push<T extends any[], U>(arr: [], val: U): readonly [U];
    //     function push<T extends any[], U>(arr: [T, ...T[]], val: U): readonly [...T, U];
    //     function push<T extends any[], U>(arr: [] | [T, ...T[]], val: U): readonly [...T, U] {
    //         if (isNonEmptyArray(arr)) {
    //             arr;
    //             return [...arr, val];
    //         }
    //     }

    //     const a: readonly [3] = [3];

    //     const b = push(a, 3 as const);
    //     const c = push(b, 4 as const);
    // });

    // it('test', () => {
    //     type Push<T extends any[] | [], val> = T extends [] ? readonly [val] : readonly [...T, val];
    //     type Status<T extends string, U extends string> = { readonly method: T; readonly value: U };

    //     type NonEmptyArray<T = Status<any, any>> = [T, ...T[]];

    //     function isNonEmptyArray<T>(arr: Status<any, any>[]): arr is NonEmptyArray<Status<any, any>> {
    //         return arr.length > 0;
    //     }

    //     function push<T extends Array<Status<any, any>>, U extends string, V extends string>(
    //         array: T,
    //         state: Status<U, V>,
    //     ): Push<T, Status<U, V>> {
    //         return [...array, state] as any;
    //     }

    //     // const array = [{ method: 'from', value: 'abc' }];

    //     const first = push([], { method: 'from', value: 'def' } as const);
    //     const second: [{ method: 'from'; value: 'def' }, { method: 'include'; value: 'ghi' }] = push([...first], {
    //         method: 'include',
    //         value: 'ghi',
    //     } as const);

    //     const testArray = [
    //         { method: 'from', value: 'def' },
    //         { method: 'include', value: 'ghi' },
    //     ] as const;

    //     second[0].value;
    // });

    // describe('from의 사용법 / 예시', () => {
    // it('단순히 값을 넣을 때는 from을 사용한다.', () => {
    //     const response = new RegExpBuilder().from('one').build();

    //     expect(response.pattern).toBe('one');
    //     expect(response.regexp.test('one')).toBe(true);
    // });

    // it('값을 넣을 때 from에서 서브빌더를 사용할 수 있어야 한다.', () => {
    //     const response = new RegExpBuilder()
    //         .from((sb) => {
    //             return sb.from('from').build();
    //         })
    //         .build();

    //     expect(response.pattern).toBe('one');
    //     expect(response.regexp.test('one')).toBe(true);
    // });

    // it('서브 빌드에서는 build 메서드를 생략해도 된다.', () => {
    //     const response = new RegExpBuilder()
    //         .from((sb) => {
    //             return sb.from('from');
    //         })
    //         .build();

    //     expect(response.pattern).toBe('one');
    //     expect(response.regexp.test('one')).toBe(true);
    // });

    // it('서브 빌드에서는 단순 string을 반환해도 상관없어야 한다', () => {
    //     const response = new RegExpBuilder()
    //         .from((sb) => {
    //             return 'from';
    //         })
    //         .build();

    //     expect(response.pattern).toBe('one');
    //     expect(response.regexp.test('one')).toBe(true);
    // });

    // it('join 메서드는 from 메서드 내부에서만 사용된다.', () => {
    //     const response = new RegExpBuilder()
    //         .from((sb) => {
    //             return sb.join(
    //                 [
    //                     (qb) => qb.from('one'),
    //                     (qb) => qb.from('two'),
    //                     (qb) => qb.from('three'),
    //                     (qb) => qb.from('four'),
    //                     (qb) => qb.from('five'),
    //                 ],
    //                 '|',
    //             );
    //         })
    //         .build();

    //     expect(new RegExpBuilder().join).toBeUndefined(); // 외부에서 사용할 경우 사용 방법에 대해서 혼란이 있을 것으로 보임
    //     expect(response.pattern).toBe('one|two|three|four|five');
    // });

    // it('or 메서드는 인자로 받은 값을 | 로 조인하는 메서드다.', async () => {
    //     const response = new RegExpBuilder().from('one').or('two').or('three').or('four').or('five').build();

    //     expect(response.pattern).toBe('one|two|three|four|five');
    // });

    // it('or 메서드는 여러 개의 인자를 받아 결합시킬 수 있다.', () => {
    //     const response = new RegExpBuilder('one').or('two', 'three', 'four', 'five').build();

    //     expect(response.pattern).toBe('one|two|three|four|five');
    // });

    // it('or 메서드를 사용할 때, 만약 from이 사용되지 않았다면 or의 첫 인자는 from으로 대체된다.', () => {
    //     const response = new RegExpBuilder().or('one', 'two', 'three', 'four', 'five').build();

    //     expect(response.pattern).toBe('one|two|three|four|five');
    // });

    // });
});
