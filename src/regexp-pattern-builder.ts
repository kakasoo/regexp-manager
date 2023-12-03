import type {
    Add,
    And,
    Between,
    CapturingGroup,
    LessThan,
    LessThanOrEqual,
    Lookahead,
    Lookbehind,
    MoreThan,
    MoreThanOrEqual,
    NegativeLookahead,
    NegativeLookbehind,
    NToNumber,
    Optional,
    Or,
    Push,
    RegExpTypeName,
    Replaced,
    Sub,
} from './type';

export class RegExpPatternBuilder<
    Pattern extends string = '',
    T extends Partial<Record<RegExpTypeName, string>>[] = [{ init: Pattern }],
    Depth extends number = 0,
    // Prediction = _Prediction<Pattern>, // predict a random string type that matches the `Pattern`
> {
    private currentExpression: Pattern;
    private readonly status: T;

    constructor(currentExpression: Pattern = '' as Pattern, status: T = [{ init: currentExpression }] as any) {
        this.currentExpression = currentExpression;
        this.status = status;
    }

    /**
     * Returns the string created by `RegExpPatternBuilder` so far.
     *
     * @returns `Pattern`
     */
    get expression(): Pattern {
        return this.currentExpression;
    }

    /**
     * Returns a tuple containing the methods called by `RegExpPatternBuilder` so far in order.
     * However, the first value contains an `init` object that unconditionally means an initial value.
     *
     * @example [{ init: "left" }, { or: "right" }]
     */
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

    /**
     * Returns the regular expression object using the string completed so far.
     *
     * @returns new RegExp<`Pattern`>()
     */
    getRegExp(): RegExp {
        return RegExp(this.expression, 'g');
    }

    /**
     * NOT IMPELEMENT
     * DON'T USE THIS METHOD.
     *
     * It is recommended not to use it because it is still incomplete `type infer`.
     *
     * @returns
     */
    beginning(): RegExpPatternBuilder<`^${Pattern}`, Push<T, { beginning: `^${Pattern}` }>, NToNumber<Add<Depth, 1>>> {
        const operand = `^${this.expression}` as const;
        const status = this.option('beginning', operand);
        const expression = `^${this.expression}` as const;
        return new RegExpPatternBuilder(expression, status);
    }

    /**
     * `Quantifier` method.
     * A letter or group that repeats less than that number.
     * @param value the standard value
     * @returns RegExpPatternBuilder
     */
    lessThan<P extends number>(
        value: P,
    ): RegExpPatternBuilder<LessThan<Pattern, P>, Push<T, { lessThan: `${P}` }>, NToNumber<Add<Depth, 1>>> {
        const operand: `${P}` = `${value}`;
        if (this.checkQuantifier('lessThan')) {
        }
        const status = this.option('lessThan', operand);
        const expression: LessThan<Pattern, P> = `${this.expression}{1,${(value - 1) as Sub<P, 1>}}`;
        return new RegExpPatternBuilder(expression, status);
    }

    /**
     * `Quantifier` method.
     * A letter or group that equals or repeats less than that number.
     * @param value the standard value
     * @returns RegExpPatternBuilder
     */
    lessThanOrEqual<P extends number>(
        value: P,
    ): RegExpPatternBuilder<
        LessThanOrEqual<Pattern, P>,
        Push<T, { lessThanOrEqual: `${P}` }>,
        NToNumber<Add<Depth, 1>>
    > {
        const operand: `${P}` = `${value}`;
        if (this.checkQuantifier('lessThanOrEqual')) {
        }
        const status = this.option('lessThanOrEqual', operand);
        const expression: LessThanOrEqual<Pattern, P> = `${this.expression}{1,${value}}`;
        return new RegExpPatternBuilder(expression, status);
    }

    /**
     * `Quantifier` method.
     * A letter or group that repeats more than that number.
     * @param value the standard value
     * @returns RegExpPatternBuilder
     */
    moreThan<P extends number>(
        value: P,
    ): RegExpPatternBuilder<MoreThan<Pattern, P>, Push<T, { moreThan: `${P}` }>, NToNumber<Add<Depth, 1>>> {
        const operand: `${P}` = `${value}`;
        if (this.checkQuantifier('moreThan')) {
        }
        const status = this.option('moreThan', operand);
        const addOne = (value + 1) as Add<P, 1>;
        const expression: MoreThan<Pattern, P> = `${this.expression}{${addOne},}`;
        return new RegExpPatternBuilder(expression, status);
    }

    /**
     * `Quantifier` method.
     * A letter or group that equals or repeats more than that number.
     * @param value the standard value
     * @returns RegExpPatternBuilder
     */
    moreThanOrEqual<P extends number>(
        value: P,
    ): RegExpPatternBuilder<
        MoreThanOrEqual<Pattern, P>,
        Push<T, { moreThanOrEqual: `${P}` }>,
        NToNumber<Add<Depth, 1>>
    > {
        const operand: `${P}` = `${value}`;
        if (this.checkQuantifier('moreThanOrEqual')) {
        }
        const status = this.option('moreThanOrEqual', operand);
        const expression: MoreThanOrEqual<Pattern, P> = `${this.expression}{${value},}`;
        return new RegExpPatternBuilder(expression, status);
    }

    /**
     * a letter or group that `moreThanOrEqual` value1 and `lessThanOrEqual` values
     * @param value1 the standard value which means 'from'
     * @param value2 the standard value which means 'to'
     * @returns RegExpPatternBuilder
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

    /**
     * This method is a simpler version of lookahead, lookbehind.
     * @param direction `LEFT` or `RIGHT`, where to add?
     * @param value
     * @returns RegExpPatternBuilder
     */
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

    /**
     * This method is a simpler version of negative-lookahead, lgegative-ookbehind.
     * @param direction `LEFT` or `RIGHT`, where to add?
     * @param value
     * @returns RegExpPatternBuilder
     */
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

    /**
     * This method add `?` character. This means `optional`.
     * @param value
     * @returns RegExpPatternBuilder
     */
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

    /**
     * This method add `()` characters. This means `capturing group`.
     * @param value
     * @returns RegExpPatternBuilder
     */
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

    /**
     * it means non-capturing group.
     */
    // nonCapturing() {}

    /**
     * It means 'or syntax' using pipe characters in regular expressions.
     * The 'or syntax' can also be checked in advance by type level.
     * @param value `string` that you want to add.
     */
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

    /**
     * The 'and syntax' simply connects strings. In a regular expression, sometimes it is more readable to divide and combine characters in semantic units.
     * @param value `string` that you want to add.
     */
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

    /**
     * incomplete method
     * @param pattern
     * @param substituteMap
     * @returns
     */
    private replace<P extends string, SubstituteMap extends Record<string, string>>(
        pattern: P,
        substituteMap: SubstituteMap,
    ): Replaced<P> {
        return '' as any;
    }

    /**
     * Method `checkQuantifier` tells the `between` case.
     * If the previous method and the following method are respectively about quantity and can be specified in range,
     * they are synthesized in a 'between' case.
     * @param currentMethod
     * @returns {boolean} If it is true, `between` case.
     */
    private checkQuantifier(currentMethod: 'lessThan' | 'lessThanOrEqual' | 'moreThan' | 'moreThanOrEqual'): boolean {
        const [previousCalledMethod] = Object.keys(this.path.at(-1) ?? {});
        if (
            (previousCalledMethod === this.lessThan.name || previousCalledMethod === this.lessThanOrEqual.name) &&
            (currentMethod === 'moreThan' || currentMethod === 'moreThanOrEqual')
        ) {
            return true;
        } else if (
            (previousCalledMethod === this.moreThan.name || previousCalledMethod === this.moreThanOrEqual.name) &&
            (currentMethod === 'lessThan' || currentMethod === 'lessThanOrEqual')
        ) {
            return true;
        }
        return false;
    }
}
