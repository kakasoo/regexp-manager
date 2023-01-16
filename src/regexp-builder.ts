type IncludeOptions = { isForehead?: boolean };

type Status<T = keyof typeof RegExpBuilder.prototype> = {
    name: T;
    value: string;
    options: T extends 'include' ? IncludeOptions : null;
    beforeStatus: string;
    order: number;
};

export class RegExpBuilder {
    private flag: 'g' | 'i' | 'ig' | 'm';
    private expression: string;
    private minimum?: number;
    private maximum?: number;
    private step: Array<Status>;
    constructor(initialValue: string = '') {
        this.step = [];
        if (initialValue) {
            this.from(initialValue);
        }
    }

    /**
     * return current's expression
     */
    get currentExpression() {
        return this.execute();
    }

    /**
     * To prevent people from making mistakes,
     * return the current expression if someone return a non-string value.
     * @param qb function return RegExpBuilder
     */
    from(qb: (RegExpBuilder: RegExpBuilder) => RegExpBuilder): this;

    /**
     * @param qb function return string type which is sub-expression
     */
    from(qb: (RegExpBuilder: RegExpBuilder) => string): this;

    /**
     *
     * @param initialValue sub-expression
     */
    from(initialValue: string): this;
    from(initialValue: string | ((qb: RegExpBuilder) => string | RegExpBuilder)): this {
        const beforeStatus = this.currentExpression;
        let value: string;
        if (typeof initialValue === 'string') {
            value = initialValue;
        } else {
            const result = initialValue(new RegExpBuilder());
            if (typeof result === 'string') {
                value = result;
            } else {
                value = result.currentExpression;
            }
        }

        this.pushStatus({
            name: 'from',
            value: value,
            options: null,
            beforeStatus: beforeStatus,
            order: 0,
        } as const);
        return this;
    }

    /**
     * it make dot.
     * it means ".". It means that it doesn't matter what letter it is.
     * @returns `(${string})?`
     */
    whatever() {
        const beforeStatus = this.currentExpression;

        this.pushStatus({
            name: 'whatever',
            value: '.',
            options: null,
            beforeStatus: beforeStatus,
            order: 1,
        } as const);
        return this;
    }

    /**
     * it make quantifier.
     * it means "?". It means that it doesn't matter if this character is present or not.
     * @returns `(${string})?`
     */
    isOptional() {
        const beforeStatus = this.currentExpression;

        this.pushStatus({
            name: 'isOptional',
            value: '?',
            options: null,
            beforeStatus: beforeStatus,
            order: 1,
        } as const);
        return this;
    }

    /**
     *
     * @param partial sub-regular expression builder that returns a string
     * @param options isForehead's default is true. If it's false, first parameter(partial) will set after present expression
     */
    andInclude(partial: (qb: RegExpBuilder) => string, options?: { isForehead?: boolean }): this;

    /**
     * Specifies the string that must be included before and after the current expression.
     * @param partial string to be included but not captured.
     * @param options isForehead's default is true. If it's false, first parameter(partial) will set after present expression
     * @returns
     */
    andInclude(partial: string, options?: { isForehead?: boolean }): this;
    andInclude(
        partial: string | ((qb: RegExpBuilder) => string),
        options: { isForehead?: boolean } = { isForehead: true },
    ) {
        let value: string;
        const beforeStatus = this.currentExpression;

        if (typeof partial === 'string') {
            value = partial;
        } else if (typeof partial === 'function') {
            const subRegExp = partial(new RegExpBuilder());
            value = subRegExp;
        }

        const includeStatement = this.step.find((el) => el.name === 'include');
        if (includeStatement) {
            includeStatement.value = `${value}${includeStatement.value}`;
            return this;
        }

        return this.include(value, options);
    }

    /**
     *
     * @param partial sub-regular expression builder that returns a string
     * @param options isForehead's default is true. If it's false, first parameter(partial) will set after present expression
     */
    include(partial: (qb: RegExpBuilder) => string, options?: { isForehead?: boolean }): this;

    /**
     * Specifies the string that must be included before and after the current expression.
     * @param partial string to be included but not captured.
     * @param options isForehead's default is true. If it's false, first parameter(partial) will set after present expression
     * @returns
     */
    include(partial: string, options?: { isForehead?: boolean }): this;
    include(
        partial: string | ((qb: RegExpBuilder) => string),
        options: { isForehead?: boolean } = { isForehead: true },
    ) {
        let value: string;
        const beforeStatus = this.currentExpression;

        if (typeof partial === 'string') {
            value = partial;
        } else if (typeof partial === 'function') {
            const subRegExp = partial(new RegExpBuilder());
            value = subRegExp;
        }

        this.pushStatus({
            name: 'include',
            value: value,
            options: options,
            beforeStatus: beforeStatus,
            order: 2,
        } as const);
        return this;
    }

    lessThanEqual(maximum: number) {
        const beforeStatus = this.currentExpression;
        this.maximum = maximum;

        this.pushStatus({
            name: 'lessThanEqual',
            value: maximum.toString(),
            options: null,
            beforeStatus: beforeStatus,
            order: 3,
        } as const);
        return this;
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
    private pushStatus(status: Status) {
        this.step.push(status);
        return this;
    }

    /**
     * @param first string (to catch)
     * @param second lookaround(?=) string
     * @return `(${first})(${symbol}(${second}))`
     */
    private lookaround(first: string, second: string): `(${string})(?=(${string}))` {
        const symbol = '?=';
        return `(${first})(${symbol}(${second}))`;
    }

    /**
     * @param first lookbehind(?<=) string
     * @param second string (to catch)
     * @returns `(${symbol}(${first}))(${second})`
     */
    private lookbehind(first: string, second: string): `(?<=(${string}))(${string})` {
        const symbol = '?<=';
        return `(${symbol}(${first}))(${second})`;
    }

    /**
     * A function that returns a pattern by executing the methods written so far in order.
     * @returns RegExp's first parameter named "pattern"
     */
    execute() {
        const sorted = this.step
            .sort((a, b) => a.order - b.order)
            .reduce((acc, { name, value, options, beforeStatus, order }, index, arr) => {
                if (name === 'from') {
                    return value;
                } else if (name === 'include') {
                    if (options.isForehead) {
                        return this.lookbehind(value, acc);
                    } else {
                        return this.lookaround(acc, value);
                    }
                } else if (name === 'lessThanEqual') {
                    if (typeof this.minimum === 'number' && typeof this.maximum === 'number') {
                        // more than equal minimum, less thean equal maximum
                        return `${acc}{${this.minimum}, ${this.maximum}}`;
                    } else if (typeof this.minimum === 'number') {
                        // more than equal minimum
                        return `${acc}{${this.minimum},}`;
                    } else if (typeof this.maximum === 'number') {
                        // more than equal 1, less thean equal maximum
                        return `${acc}{1,${this.maximum}}`;
                    }
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
}
