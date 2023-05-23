import typia, { Primitive } from 'typia';
import type {
    And,
    Add,
    Between,
    CapturingGroup,
    LessThan,
    LessThanOrEqual,
    Lookahead,
    Lookbehind,
    MoreThan,
    MoreThanOrEqual,
    NToNumber,
    NegativeLookahead,
    NegativeLookbehind,
    Or,
    Optional,
    Push,
    RegExpTypeName,
    Sub,
    _Prediction,
} from './type';

export class RegExpPatternBuilder<
    Pattern extends string = '',
    T extends Partial<Record<RegExpTypeName, string>>[] = [{ init: Pattern }],
    Depth extends number = 0,
    Prediction = _Prediction<Pattern>, // predict a random string type that matches the `Pattern`
> {
    private currentExpression: Pattern;
    private readonly status: T;

    constructor(currentExpression: Pattern = '' as Pattern, status: T = [{ init: currentExpression }] as any) {
        this.currentExpression = currentExpression;
        this.status = status;
    }

    get expression(): Pattern {
        return this.currentExpression;
    }

    get path(): T {
        return this.status;
    }

    /**
     * It is judged to be an impossible method, but I commit only this time for recording.
     */
    // predict() {
    //     return typia.random<Prediction>();
    //     // return typia.random<_Prediction<Pattern>>();
    // }

    /**
     * Check that the results of the two regular expression builders are the same.
     * Returns true if the final result is the same, even if it is made in different ways.
     *
     * @returns boolean
     */
    equals<P extends string>(comparable: RegExpPatternBuilder<P, any, any>): boolean {
        return this.expression.toString() === comparable.expression.toString();
    }

    getRegExp(): RegExp {
        return RegExp(this.expression);
    }

    /**
     * a letter or group that repeats less than that number
     * @param value limit
     */
    lessThan<P extends number>(
        value: P,
    ): RegExpPatternBuilder<LessThan<Pattern, P>, Push<T, { lessThan: `${P}` }>, NToNumber<Add<Depth, 1>>> {
        const operand: `${P}` = `${value}`;
        const status = this.option('lessThan', operand);
        const expression: LessThan<Pattern, P> = `${this.expression}{1,${(value - 1) as Sub<P, 1>}}`;
        return new RegExpPatternBuilder(expression, status);
    }

    /**
     * a letter or group that equals or repeats less than that number
     * @param value
     */
    lessThanOrEqual<P extends number>(
        value: P,
    ): RegExpPatternBuilder<
        LessThanOrEqual<Pattern, P>,
        Push<T, { lessThanOrEqual: `${P}` }>,
        NToNumber<Add<Depth, 1>>
    > {
        const operand: `${P}` = `${value}`;
        const status = this.option('lessThanOrEqual', operand);
        const expression: LessThanOrEqual<Pattern, P> = `${this.expression}{1,${value}}`;
        return new RegExpPatternBuilder(expression, status);
    }

    /**
     * a letter or group that repeats more than that number
     * @param value
     */
    moreThan<P extends number>(
        value: P,
    ): RegExpPatternBuilder<MoreThan<Pattern, P>, Push<T, { moreThan: `${P}` }>, NToNumber<Add<Depth, 1>>> {
        const operand: `${P}` = `${value}`;
        const status = this.option('moreThan', operand);
        const addOne = (value + 1) as Add<P, 1>;
        const expression: MoreThan<Pattern, P> = `${this.expression}{${addOne},}`;
        return new RegExpPatternBuilder(expression, status);
    }

    /**
     * a letter or group that equals or repeats more than that number
     * @param value
     */
    moreThanOrEqual<P extends number>(
        value: P,
    ): RegExpPatternBuilder<
        MoreThanOrEqual<Pattern, P>,
        Push<T, { moreThanOrEqual: `${P}` }>,
        NToNumber<Add<Depth, 1>>
    > {
        const operand: `${P}` = `${value}`;
        const status = this.option('moreThanOrEqual', operand);
        const expression: MoreThanOrEqual<Pattern, P> = `${this.expression}{${value},}`;
        return new RegExpPatternBuilder(expression, status);
    }

    /**
     * a letter or group that `moreThanOrEqual` value1 and `lessThanOrEqual` values
     * @param value1
     * @param value2
     */
    between<N1 extends number, N2 extends number>(
        value1: N1,
        value2: N2,
    ): RegExpPatternBuilder<Between<Pattern, N1, N2>, Push<T, { between: `${N1},${N2}` }>, NToNumber<Add<Depth, 1>>> {
        const operand: `${N1},${N2}` = `${value1},${value2}`;
        const status = this.option('between', operand);
        const expression: Between<Pattern, N1, N2> = `${this.expression}{${value1},${value2}}`;
        return new RegExpPatternBuilder(expression, status);
    }

    includes<P extends string>(
        direction: 'LEFT',
        value: P,
    ): RegExpPatternBuilder<Lookbehind<Pattern, P>, Push<T, { lookbehind: P }>, NToNumber<Add<Depth, 1>>>;
    includes<P extends string>(
        direction: 'LEFT',
        value: (qb: RegExpPatternBuilder<'', [], 0>) => RegExpPatternBuilder<P, Record<string, string>[], number> | P,
    ): RegExpPatternBuilder<Lookbehind<Pattern, P>, Push<T, { lookbehind: P }>, NToNumber<Add<Depth, 1>>>;
    includes<P extends string>(
        direction: 'RIGHT',
        value: P,
    ): RegExpPatternBuilder<Lookahead<Pattern, P>, Push<T, { lookahead: P }>, NToNumber<Add<Depth, 1>>>;
    includes<P extends string>(
        direction: 'RIGHT',
        value: (qb: RegExpPatternBuilder<'', [], 0>) => RegExpPatternBuilder<P, Record<string, string>[], number> | P,
    ): RegExpPatternBuilder<Lookahead<Pattern, P>, Push<T, { lookahead: P }>, NToNumber<Add<Depth, 1>>>;
    includes<P extends string>(
        direction: 'LEFT' | 'RIGHT',
        value:
            | P
            | ((qb: RegExpPatternBuilder<'', [], 0>) => RegExpPatternBuilder<P, Record<string, string>[], number> | P),
    ):
        | RegExpPatternBuilder<Lookahead<Pattern, P>, Push<T, { lookahead: P }>, NToNumber<Add<Depth, 1>>>
        | RegExpPatternBuilder<Lookbehind<Pattern, P>, Push<T, { lookbehind: P }>, NToNumber<Add<Depth, 1>>> {
        const operand = typeof value === 'string' ? value : this.getValue(value);
        if (direction === 'LEFT') {
            const status = this.option('lookbehind', operand);
            const expression: Lookbehind<Pattern, P> = `(?<=${operand})${this.expression}`;
            return new RegExpPatternBuilder(expression, status);
        } else {
            const status = this.option('lookahead', operand);
            const expression: Lookahead<Pattern, P> = `${this.expression}(?=${operand})`;
            return new RegExpPatternBuilder(expression, status);
        }
    }

    excludes<P extends string>(
        direction: 'LEFT',
        value: P,
    ): RegExpPatternBuilder<
        NegativeLookbehind<Pattern, P>,
        Push<T, { negativeLookbehind: P }>,
        NToNumber<Add<Depth, 1>>
    >;
    excludes<P extends string>(
        direction: 'LEFT',
        value: (qb: RegExpPatternBuilder<'', [], 0>) => RegExpPatternBuilder<P, Record<string, string>[], number> | P,
    ): RegExpPatternBuilder<
        NegativeLookbehind<Pattern, P>,
        Push<T, { negativeLookbehind: P }>,
        NToNumber<Add<Depth, 1>>
    >;
    excludes<P extends string>(
        direction: 'RIGHT',
        value: P,
    ): RegExpPatternBuilder<NegativeLookahead<Pattern, P>, Push<T, { negativeLookahead: P }>, NToNumber<Add<Depth, 1>>>;
    excludes<P extends string>(
        direction: 'RIGHT',
        value: (qb: RegExpPatternBuilder<'', [], 0>) => RegExpPatternBuilder<P, Record<string, string>[], number> | P,
    ): RegExpPatternBuilder<NegativeLookahead<Pattern, P>, Push<T, { negativeLookahead: P }>, NToNumber<Add<Depth, 1>>>;
    excludes<P extends string>(
        direction: 'LEFT' | 'RIGHT',
        value:
            | P
            | ((qb: RegExpPatternBuilder<'', [], 0>) => RegExpPatternBuilder<P, Record<string, string>[], number> | P),
    ):
        | RegExpPatternBuilder<
              NegativeLookahead<Pattern, P>,
              Push<T, { negativeLookahead: P }>,
              NToNumber<Add<Depth, 1>>
          >
        | RegExpPatternBuilder<
              NegativeLookbehind<Pattern, P>,
              Push<T, { negativeLookbehind: P }>,
              NToNumber<Add<Depth, 1>>
          > {
        const operand = typeof value === 'string' ? value : this.getValue(value);
        if (direction === 'LEFT') {
            const status = this.option('negativeLookbehind', operand);
            const expression: NegativeLookbehind<Pattern, P> = `(?<!${operand})${this.expression}`;
            return new RegExpPatternBuilder(expression, status);
        } else {
            const status = this.option('negativeLookahead', operand);
            const expression: NegativeLookahead<Pattern, P> = `${this.expression}(?!${operand})`;
            return new RegExpPatternBuilder(expression, status);
        }
    }

    join(): any {}

    optional<P extends string>(
        value: (qb: RegExpPatternBuilder<'', [], 0>) => RegExpPatternBuilder<P, Record<string, string>[], number> | P,
    ): RegExpPatternBuilder<Optional<P>, Push<T, { optional: P }>, NToNumber<Add<Depth, 1>>>;
    optional<P extends string>(
        value: P,
    ): RegExpPatternBuilder<Optional<P>, Push<T, { optional: P }>, NToNumber<Add<Depth, 1>>>;
    optional<P extends string>(
        value:
            | P
            | ((qb: RegExpPatternBuilder<'', [], 0>) => RegExpPatternBuilder<P, Record<string, string>[], number> | P),
    ): RegExpPatternBuilder<Optional<P>, Push<T, { optional: P }>, NToNumber<Add<Depth, 1>>> {
        const operand = typeof value === 'string' ? value : this.getValue(value);
        const status = this.option('optional', operand);
        const expression: Optional<P> = `${operand}?`;
        return new RegExpPatternBuilder(expression, status);
    }

    capturing<P extends string>(
        value: (qb: RegExpPatternBuilder<'', [], 0>) => RegExpPatternBuilder<P, Record<string, string>[], number> | P,
    ): RegExpPatternBuilder<CapturingGroup<P>, Push<T, { capturing: P }>, NToNumber<Add<Depth, 1>>>;
    capturing<P extends string>(
        value: P,
    ): RegExpPatternBuilder<CapturingGroup<P>, Push<T, { capturing: P }>, NToNumber<Add<Depth, 1>>>;
    capturing<P extends string>(
        value:
            | P
            | ((qb: RegExpPatternBuilder<'', [], 0>) => RegExpPatternBuilder<P, Record<string, string>[], number> | P),
    ): RegExpPatternBuilder<CapturingGroup<P>, Push<T, { capturing: P }>, NToNumber<Add<Depth, 1>>> {
        const operand = typeof value === 'string' ? value : this.getValue(value);
        const status = this.option('capturing', operand);
        const expression: CapturingGroup<P> = `(${operand})`;
        return new RegExpPatternBuilder(expression, status);
    }

    or<P extends string>(
        value: (qb: RegExpPatternBuilder<'', [], 0>) => RegExpPatternBuilder<P, Record<string, string>[], number> | P,
    ): RegExpPatternBuilder<Or<Pattern, P>, Push<T, { or: P }>, NToNumber<Add<Depth, 1>>>;
    or<P extends string>(value: P): RegExpPatternBuilder<Or<Pattern, P>, Push<T, { or: P }>, NToNumber<Add<Depth, 1>>>;
    or<P extends string>(
        value:
            | P
            | ((qb: RegExpPatternBuilder<'', [], 0>) => RegExpPatternBuilder<P, Record<string, string>[], number> | P),
    ) {
        const operand = typeof value === 'string' ? value : this.getValue(value);
        const status = this.option('or', operand);
        const expression: `${Pattern}|${P}` = `${this.expression}|${operand}`;
        return new RegExpPatternBuilder(expression, status);
    }

    and<P extends string>(
        value: (qb: RegExpPatternBuilder<'', [], 0>) => RegExpPatternBuilder<P, Record<string, string>[], number> | P,
    ): RegExpPatternBuilder<And<Pattern, P>, Push<T, { and: P }>, NToNumber<Add<Depth, 1>>>;
    and<P extends string>(
        value: P,
    ): RegExpPatternBuilder<And<Pattern, P>, Push<T, { and: P }>, NToNumber<Add<Depth, 1>>>;
    and<P extends string>(
        value:
            | P
            | ((qb: RegExpPatternBuilder<'', [], 0>) => RegExpPatternBuilder<P, Record<string, string>[], number> | P),
    ) {
        const operand = typeof value === 'string' ? value : this.getValue(value);
        const status = this.option('and', operand);
        const expression: `${Pattern}${P}` = `${this.expression}${operand}`;
        return new RegExpPatternBuilder(expression, status);
    }

    private getValue<P extends string>(
        value: (qb: RegExpPatternBuilder<'', [], 0>) => RegExpPatternBuilder<P, Record<string, string>[], number> | P,
    ): P {
        const result = value(new RegExpPatternBuilder());
        return typeof result === 'string' ? result : result.currentExpression;
    }

    private option<K extends RegExpTypeName, P>(key: K, value: P): [...T, Record<K, P>] {
        const process: Record<string, P> = { [key]: value };
        return [...this.status, process];
    }
}
