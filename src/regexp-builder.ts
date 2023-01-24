import { slove } from './regexp-function';

export type IncludeOptions<T extends boolean = true> = { isForehead?: T };

export type AndOptions = { isForehead?: boolean };

export type SubExpressionBilder<T extends string> = (subBuilder: RegExpBuilder) => T | string | RegExpBuilder;

export type Push<T extends any[], val> = [...T, val];

export type IncludeType<T extends string, U extends boolean = true> = {
    partial: T;
    options?: IncludeOptions<U>;
};

export type ExecutionInclude<
    originalType extends string,
    partialType extends string,
    T extends boolean,
    U extends IncludeType<partialType, T>,
> = U extends null
    ? `${originalType}`
    : T extends true
    ? `(?<=(${partialType}))(${originalType})`
    : `(${originalType})(?=(${partialType}))`;

export type ExcutionIncludeForehead<originType extends string, partialType extends string> = ExecutionInclude<
    originType,
    partialType,
    true,
    { partial: partialType; options: IncludeOptions<true> }
>;

export type ExcutionIncludeBehind<originType extends string, partialType extends string> = ExecutionInclude<
    originType,
    partialType,
    false,
    { partial: partialType; options: IncludeOptions<false> }
>;

export type ExecutionComparison<T extends string, minLimit extends number, maxLimit extends number> = minLimit extends
    | null
    | undefined
    ? maxLimit extends null
        ? `${T}`
        : `${T}{1,${maxLimit}}`
    : maxLimit extends null
    ? `${T}{${minLimit},}`
    : `${T}{${minLimit},${maxLimit}}`;

export type RegExpMethodNames = keyof typeof RegExpBuilder.prototype;
export type Status<T extends RegExpMethodNames> = {
    name: T;
    value: T extends 'from'
        ? string
        : T extends 'whatever'
        ? string
        : T extends 'isOptional'
        ? string
        : T extends 'between'
        ? number[]
        : T extends 'moreThanEqual'
        ? number
        : T extends 'lessThanEqual'
        ? number
        : string;
    options: T extends 'include' ? IncludeOptions<boolean> : T extends 'and' ? AndOptions : null;
    beforeStatus: string;
    order: number;
};

export class RegExpBuilder {
    private flag: 'g' | 'i' | 'ig' | 'm';
    private minimum?: number;
    private maximum?: number;
    private step: Array<Status<RegExpMethodNames>>;

    /**
     * It is designed to infer types. maybe.
     */
    // private expression: string = '';

    constructor(initialValue: string = '') {
        this.step = [];
        if (initialValue) {
            this.from(initialValue);
        }
    }

    findOne<T extends string, U extends string, V extends number, W extends number>({
        from,
        include,
        lessThanEqual,
        moreThanEqual,
    }: {
        from: T;
        include: IncludeType<U, true>;
        lessThanEqual: V;
        moreThanEqual: W;
    }): ExecutionComparison<ExcutionIncludeForehead<T, U>, W, V>;

    findOne<T extends string, U extends string, V extends number, W extends number>({
        from,
        include,
        lessThanEqual,
        moreThanEqual,
    }: {
        from: T;
        include: IncludeType<U, false>;
        lessThanEqual: V;
        moreThanEqual: W;
    }): ExecutionComparison<ExcutionIncludeBehind<T, U>, W, V>;

    findOne<T extends string, V extends number, W extends number>({
        from,
        lessThanEqual,
        moreThanEqual,
    }: {
        from: T;
        lessThanEqual: V;
        moreThanEqual: W;
    }): ExecutionComparison<T, W, V>;

    findOne<T extends string, U extends string>({
        from,
        include,
    }: {
        from: T;
        include: IncludeType<U, true>;
    }): ExcutionIncludeForehead<T, U>;

    findOne<T extends string, U extends string>({
        from,
        include,
    }: {
        from: T;
        include: IncludeType<U, false>;
    }): ExcutionIncludeBehind<T, U>;
    findOne<T extends string>({ from }: { from: T }): `${T}`;

    /**
     *
     * @param {findOneParameterType} param0
     * @returns pattern is type-safe
     */
    findOne<T extends string, foreheadOrBehind extends boolean, U extends string, V extends number, W extends number>({
        from,
        include,
        lessThanEqual,
        moreThanEqual,
    }: {
        from: T;
        include?: IncludeType<U, foreheadOrBehind>;
        lessThanEqual?: V;
        moreThanEqual?: W;
    }) {
        let expression: string = from;
        if (include) {
            if (!include.options) {
                include.options = { isForehead: true } as any;
            }

            if (typeof include.options?.isForehead === 'undefined') {
                include.options.isForehead = true as any;
            }

            if (include.options.isForehead) {
                expression = this.excuteIncludeStatement(expression, include.partial, { isForehead: true });
            } else {
                expression = this.excuteIncludeStatement(expression, include.partial, { isForehead: false });
            }
        }

        if (lessThanEqual || moreThanEqual) {
            expression = this.executeMoreOrLessThanEqual(expression, lessThanEqual, moreThanEqual);
        }

        return expression;
    }

    /**
     * The `join` method create and returns a new string ( = pattern ) by concatenating all of the elements,
     * like as array.prototype.join
     * @param partial string (=pattern) or sub-expression
     * @param separator
     */
    join<T extends string>(partials: (string | SubExpressionBilder<T>)[], separator: string = '') {
        return partials.map((partial) => slove(partial)).join(separator);
    }

    or(subBuilder: (regExpBuilder: RegExpBuilder) => RegExpBuilder): this;
    or(subBuilder: (regExpBuilder: RegExpBuilder) => string): this;
    or(partial: string): this;

    /**
     * or method set initial value to `${from.value}|${partial}`;
     * @param partial string (=pattern) or sub-expression
     * @returns
     */
    or<T extends string>(partial: string | SubExpressionBilder<T>): this {
        const from = this.step.find((el) => el.name === 'from');
        const value: string = slove(partial);

        from.value = `${from.value}|${value}`;
        return this;
    }

    and(subBuilder: (regExpBuilder: RegExpBuilder) => RegExpBuilder, options?: AndOptions): this;
    and(subBuilder: (regExpBuilder: RegExpBuilder) => string, options?: AndOptions): this;
    and(partial: string, options?: AndOptions): this;

    /**
     * and method set initial value to `${partial}${from.value}` OR `${from.value}${partial}`
     * @param partial  string (=pattern) or sub-expression / words or phrases you want to add
     * @returns
     */
    and<T extends string>(partial: string | SubExpressionBilder<T>, options: AndOptions = { isForehead: true }): this {
        const from = this.step.find((el) => el.name === 'from');
        const value: string = slove(partial);

        if (options?.isForehead === true) {
            from.value = `${value}${from.value}`;
        } else {
            from.value = `${from.value}${value}`;
        }

        return this;
    }

    /**
     * To prevent people from making mistakes,
     * return the current expression if someone return a non-string value.
     * @param qb function return RegExpBuilder
     */
    from(subBuilder: (regExpBuilder: RegExpBuilder) => RegExpBuilder): this;

    /**
     * @param qb function return string type which is sub-expression
     */
    from<T>(subBuilder: (regExpBuilder: RegExpBuilder) => T): this;

    /**
     *
     * @param initialValue sub-expression
     */
    from<T>(initialValue: T): this;
    from<T extends string>(initialValue: T | SubExpressionBilder<T>): this {
        const beforeStatus = this.getRawOne();
        if (beforeStatus) {
            throw new Error(
                `already used \`from\` method\n` +
                    `If you have already specified an initial value for the constructor or from method, it is no longer available.\n` +
                    `The builder has only one initial value.\n`,
            );
        }
        const value: T | string = slove(initialValue);

        const fromStatus: Status<'from'> = {
            name: 'from',
            value: value,
            options: null,
            beforeStatus: beforeStatus,
            order: 0,
        };
        this.pushStatus('from', fromStatus);
        return this;
    }

    /**
     * it make dot.
     * it means ".". It means that it doesn't matter what letter it is.
     * @returns `(${string})?`
     */
    whatever() {
        const beforeStatus = this.getRawOne();

        const whateverStatus: Status<'whatever'> = {
            name: 'whatever',
            value: '.',
            options: null,
            beforeStatus: beforeStatus,
            order: 1,
        };
        this.pushStatus('whatever', whateverStatus);
        return this;
    }

    /**
     * it make quantifier.
     * it means "?". It means that it doesn't matter if this character is present or not.
     * @returns `(${string})?`
     */
    isOptional() {
        const beforeStatus = this.getRawOne();

        const isOptionalStatus: Status<'isOptional'> = {
            name: 'isOptional',
            value: '?',
            options: null,
            beforeStatus: beforeStatus,
            order: 1,
        };
        this.pushStatus('isOptional', isOptionalStatus);
        return this;
    }

    /**
     *
     * @param partial sub-regular expression builder that returns a string
     * @param options isForehead's default is true. If it's false, first parameter(partial) will set after present expression
     */
    andInclude(partial: (subBuilder: RegExpBuilder) => string, options?: { isForehead?: boolean }): this;

    /**
     * Specifies the string that must be included before and after the current expression.
     * @param partial string to be included but not captured.
     * @param options isForehead's default is true. If it's false, first parameter(partial) will set after present expression
     * @returns
     */
    andInclude(partial: string, options?: { isForehead?: boolean }): this;
    andInclude(
        partial: string | ((subBuilder: RegExpBuilder) => string),
        options: { isForehead?: boolean } = { isForehead: true },
    ) {
        const value: string = slove(partial);
        const includeStatement = this.step.find(
            (el) => el.name === 'include' && el.options.isForehead === options.isForehead,
        );
        if (includeStatement) {
            includeStatement.value = `${value}${includeStatement.value}`;
            return this;
        }

        if (options.isForehead) {
            return this.include(value, { isForehead: true });
        }
        return this.include(value, { isForehead: false });
    }

    /**
     * @param partial A function returns RegExpBuilder instance to prevent making human error
     * @param options
     */
    include(partial: (subBuilder: RegExpBuilder) => RegExpBuilder, options?: IncludeOptions<true>): this;
    include(partial: (subBuilder: RegExpBuilder) => RegExpBuilder, options?: IncludeOptions<false>): this;
    /**
     * @param partial sub-regular expression builder that returns a string
     * @param options isForehead's default is true. If it's false, first parameter(partial) will set after present expression
     */
    include(partial: (subBuilder: RegExpBuilder) => string, options?: IncludeOptions<true>): this;
    include(partial: (subBuilder: RegExpBuilder) => string, options?: IncludeOptions<false>): this;

    /**
     * Specifies the string that must be included before and after the current expression.
     * @param partial  string (=pattern) or sub-expression / string to be included but not captured.
     * @param options isForehead's default is true. If it's false, first parameter(partial) will set after present expression
     * @returns
     */
    include(partial: string, options?: IncludeOptions<true>): this;
    include(partial: string, options?: IncludeOptions<false>): this;
    include<T extends string>(
        partial: string | SubExpressionBilder<T>,
        options: IncludeOptions<boolean> = { isForehead: true },
    ) {
        const beforeStatus = this.getRawOne();
        const value: string = slove(partial);

        const includeStatus: Status<'include'> = {
            name: 'include',
            value: value,
            options: options,
            beforeStatus: beforeStatus,
            order: 2,
        };
        this.pushStatus('include', includeStatus);
        return this;
    }

    /**
     * set minimum, maximum value to repeat regexp pattern
     * If between methods are present, `lessThanEqual`, `moreThanEqual` methods in the builder are ignored,
     * and if between is already present, throw errors.
     */
    between(minimum: number, maximum: number): this {
        const beforeStatus = this.getRawOne();

        const lessThanEquaStatement = this.step.some((el) => el.name === 'lessThanEqual');
        if (lessThanEquaStatement) {
            const lessThanEqualStatementIndex = this.step.findIndex((el) => el.name === 'lessThanEqual');
            this.step.splice(lessThanEqualStatementIndex, 1);
        }

        const moreThanEqualStatement = this.step.some((el) => el.name === 'moreThanEqual');
        if (moreThanEqualStatement) {
            const moreThanEqualStatementIndex = this.step.findIndex((el) => el.name === 'moreThanEqual');
            this.step.splice(moreThanEqualStatementIndex, 1);
        }

        const betweenStatement = this.step.some((el) => el.name === 'between');
        if (betweenStatement) {
            throw new Error(
                `You used \`between\` methods, or you used \`lessThanEqual\`, \`moreThanEqual\` once.\n` +
                    `These methods cannot be used simultaneously.\n`,
            );
        }

        this.minimum = minimum;
        this.maximum = maximum;
        const betweenStatus: Status<'between'> = {
            name: 'between',
            value: [minimum, maximum],
            options: null,
            beforeStatus: beforeStatus,
            order: 3,
        };
        this.pushStatus('between', betweenStatus);
        return this;
    }

    /**
     * set maximum value to repeat regexp pattern
     * If lessThanEqual methods are present, throw errors.
     */
    lessThanEqual(maximum: number): this {
        const beforeStatus = this.getRawOne();
        if (this.step.some((el) => el.name === 'lessThanEqual')) {
            throw new Error(
                `already used \`lessThanEqual\` method\n` +
                    `the \`lessThanEqual\` method is available once for each builder pattern.\n`,
            );
        } else if (this.step.some((el) => el.name === 'moreThanEqual')) {
            const moreThanEqualStatementIndex = this.step.findIndex((el) => el.name === 'moreThanEqual');
            const moreThanEqualValue = this.step.at(moreThanEqualStatementIndex).value as number;
            this.step.splice(moreThanEqualStatementIndex, 1);

            this.maximum = maximum;
            const betweenStatus: Status<'between'> = {
                name: 'between',
                value: [moreThanEqualValue, maximum],
                options: null,
                beforeStatus: beforeStatus,
                order: 3,
            };
            this.pushStatus('between', betweenStatus);
            return this;
        } else if (this.step.some((el) => el.name === 'between')) {
            throw new Error(
                `You used \`between\` methods, or you used \`lessThanEqual\`, \`moreThanEqual\` once.\n` +
                    `These methods cannot be used simultaneously.\n`,
            );
        } else {
            this.maximum = maximum;
            const lessThanEqualStatus: Status<'lessThanEqual'> = {
                name: 'lessThanEqual',
                value: maximum,
                options: null,
                beforeStatus: beforeStatus,
                order: 3,
            };
            this.pushStatus('lessThanEqual', lessThanEqualStatus);
            return this;
        }
    }

    /**
     * set minimum value to repeat regexp pattern
     */
    moreThanEqual(minimum: number): this {
        const beforeStatus = this.getRawOne();
        if (this.step.some((el) => el.name === 'lessThanEqual')) {
            const lessThanEqualStatementIndex = this.step.findIndex((el) => el.name === 'lessThanEqual');
            const lessThanEqualValue = this.step.at(lessThanEqualStatementIndex).value as number;
            this.step.splice(lessThanEqualStatementIndex, 1);

            this.minimum = minimum;
            const betweenStatus: Status<'between'> = {
                name: 'between',
                value: [minimum, lessThanEqualValue],
                options: null,
                beforeStatus: beforeStatus,
                order: 3,
            };
            this.pushStatus('between', betweenStatus);
            return this;
        } else if (this.step.some((el) => el.name === 'moreThanEqual')) {
            throw new Error(
                `already used \`moreThanEqual\` method\n` +
                    `the \`moreThanEqual\` method is available once for each builder pattern.\n`,
            );
        } else if (this.step.some((el) => el.name === 'between')) {
        } else {
            this.minimum = minimum;
            const moreThanEqaulStatus: Status<'moreThanEqual'> = {
                name: 'moreThanEqual',
                value: minimum,
                options: null,
                beforeStatus: beforeStatus,
                order: 3,
            };
            this.pushStatus('moreThanEqual', moreThanEqaulStatus);
            return this;
        }
    }

    /**
     * Generates a regular expression instance based on what has been set up so far.
     * @returns RegExp (default flag is 'ig')
     */
    getOne(): RegExp {
        const flag = this.flag ?? 'ig';
        return new RegExp(this.getRawOne(), 'ig');
    }

    getRawOne(): string {
        let expression = this.execute();

        return expression;
    }

    /**
     * TODO : classify elements by execution order
     * @param status
     * @returns
     */
    private pushStatus<T extends RegExpMethodNames>(name: T, status: Status<T>) {
        this.step.push(status);
        return this;
    }

    /**
     * @param first string (to catch)
     * @param second lookaround(?=) string
     * @return `(${first})(${symbol}(${second}))`
     */
    private lookaround<T extends string, U extends string>(first: T, second: U): `(${T})(?=(${U}))` {
        const symbol = '?=';
        return `(${first})(${symbol}(${second}))`;
    }

    /**
     * @param first lookbehind(?<=) string
     * @param second string (to catch)
     * @returns `(${symbol}(${first}))(${second})`
     */
    private lookbehind<T extends string, U extends string>(first: T, second: U): `(?<=(${T}))(${U})` {
        const symbol = '?<=';
        return `(${symbol}(${first}))(${second})`;
    }

    /**
     * A function that returns a pattern by executing the methods written so far in order.
     * @returns RegExp's first parameter named "pattern"
     */
    private execute(): string {
        const sorted = this.step
            .sort((a, b) => a.order - b.order)
            .reduce((acc, { name, value, options, beforeStatus, order }, index, arr) => {
                if (name === 'from') {
                    return value as string;
                } else if (name === 'include') {
                    // TODO : add type infer
                    if (typeof value !== 'string') {
                        throw new Error(
                            "RegExpBuilder private method error : lookbehind first parameter's type is string.\n",
                        );
                    }

                    if (options.isForehead) {
                        return this.excuteIncludeStatement(acc, value, { isForehead: true });
                    } else {
                        return this.excuteIncludeStatement(acc, value, { isForehead: false });
                    }
                } else if (name === 'lessThanEqual') {
                    return this.executeMoreOrLessThanEqual(acc);
                } else if (name === 'moreThanEqual') {
                    return this.executeMoreOrLessThanEqual(acc);
                } else if (name === 'between') {
                    // if (typeof this.minimum === 'number' && typeof this.maximum === 'number') {
                    //     // more than equal minimum, less thean equal maximum
                    //     return `${acc}{${this.minimum}, ${this.maximum}}`;
                    // }
                    return this.executeMoreOrLessThanEqual(acc);
                } else if (name === 'whatever') {
                    if (acc === '') {
                        return '.';
                    }
                    return `(${acc}).`;
                } else if (name === 'isOptional') {
                    return `(${acc})?`;
                }
            }, '');

        return sorted;
    }

    private excuteIncludeStatement<T extends string, U extends string>(
        lastExpression: T,
        value: U,
        options: IncludeOptions<true>,
    ): `(?<=(${U}))(${T})`;
    private excuteIncludeStatement<T extends string, U extends string>(
        lastExpression: T,
        value: U,
        options: IncludeOptions<false>,
    ): `(${T})(?=(${U}))`;
    private excuteIncludeStatement<T extends string, U extends string>(
        lastExpression: T,
        value: U,
        options: IncludeOptions<boolean>,
    ): `(?<=(${U}))(${T})` | `(${T})(?=(${U}))` {
        if (options.isForehead) {
            return this.lookbehind(value, lastExpression);
        } else {
            return this.lookaround(lastExpression, value);
        }
    }

    private executeMoreOrLessThanEqual<T extends string>(
        lastExpression: T,
        lessThanEqual?: number,
        moreThanEqual?: number,
    ): `${T}{${number},${number}}` | `${T}{${number},}` | `${T}{1,${number}}` {
        if (lessThanEqual || moreThanEqual) {
            if (typeof moreThanEqual === 'number' && typeof lessThanEqual === 'number') {
                // more than equal minimum, less thean equal maximum
                return `${lastExpression}{${moreThanEqual},${lessThanEqual}}`;
            } else if (typeof moreThanEqual === 'number') {
                // more than equal minimum
                return `${lastExpression}{${moreThanEqual},}`;
            } else if (typeof lessThanEqual === 'number') {
                // more than equal 1, less thean equal maximum
                return `${lastExpression}{1,${lessThanEqual}}`;
            }
        }

        if (typeof this.minimum === 'number' && typeof this.maximum === 'number') {
            // more than equal minimum, less thean equal maximum
            return `${lastExpression}{${this.minimum},${this.maximum}}`;
        } else if (typeof this.minimum === 'number') {
            // more than equal minimum
            return `${lastExpression}{${this.minimum},}`;
        } else if (typeof this.maximum === 'number') {
            // more than equal 1, less thean equal maximum
            return `${lastExpression}{1,${this.maximum}}`;
        }
    }
}
