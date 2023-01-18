type IncludeOptions = { isForehead?: boolean };
type AndOptions = { isForehead?: boolean };
type subExpressionBilder = (subBuilder: RegExpBuilder) => string | RegExpBuilder;

type Status<T = keyof typeof RegExpBuilder.prototype> = {
    name: T;
    value: string;
    options: T extends 'include' ? IncludeOptions : T extends 'and' ? AndOptions : null;
    beforeStatus: string;
    order: number;
};

export class RegExpBuilder {
    private flag: 'g' | 'i' | 'ig' | 'm';
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
     * The `join` method create and returns a new string ( = pattern ) by concatenating all of the elements,
     * like as array.prototype.join
     * @param partial string (=pattern) or sub-expression
     * @param separator
     */
    join(partials: (string | subExpressionBilder)[], separator: string = '') {
        return partials.map((partial) => this.slove(partial)).join(separator);
    }

    or(subBuilder: (regExpBuilder: RegExpBuilder) => RegExpBuilder): this;
    or(subBuilder: (regExpBuilder: RegExpBuilder) => string): this;
    or(partial: string): this;

    /**
     * or method set initial value to `${from.value}|${partial}`;
     * @param partial string (=pattern) or sub-expression
     * @returns
     */
    or(partial: string | subExpressionBilder): this {
        const from = this.step.find((el) => el.name === 'from');
        const value: string = this.slove(partial);

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
    and(partial: string | subExpressionBilder, options: AndOptions = { isForehead: true }): this {
        const from = this.step.find((el) => el.name === 'from');
        const value: string = this.slove(partial);

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
    from<T extends string>(initialValue: T | ((subBuilder: RegExpBuilder) => T | RegExpBuilder)): this {
        const beforeStatus = this.getRawOne();
        const value: T = this.slove(initialValue) as T;

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
        const beforeStatus = this.getRawOne();

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
        const beforeStatus = this.getRawOne();

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
        const value: string = this.slove(partial);
        const includeStatement = this.step.find(
            (el) => el.name === 'include' && el.options.isForehead === options.isForehead,
        );
        if (includeStatement) {
            includeStatement.value = `${value}${includeStatement.value}`;
            return this;
        }
        return this.include(value, options);
    }

    /**
     * @param partial A function returns RegExpBuilder instance to prevent making human error
     * @param options
     */
    include(partial: (subBuilder: RegExpBuilder) => RegExpBuilder, options?: IncludeOptions): this;

    /**
     * @param partial sub-regular expression builder that returns a string
     * @param options isForehead's default is true. If it's false, first parameter(partial) will set after present expression
     */
    include(partial: (subBuilder: RegExpBuilder) => string, options?: IncludeOptions): this;

    /**
     * Specifies the string that must be included before and after the current expression.
     * @param partial  string (=pattern) or sub-expression / string to be included but not captured.
     * @param options isForehead's default is true. If it's false, first parameter(partial) will set after present expression
     * @returns
     */
    include(partial: string, options?: IncludeOptions): this;
    include(partial: string | subExpressionBilder, options: IncludeOptions = { isForehead: true }) {
        const beforeStatus = this.getRawOne();
        const value: string = this.slove(partial);

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
        const beforeStatus = this.getRawOne();
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
     * A function that unravels a subBuilder and converts it all intro a string.
     */
    private slove(target: string | ((subBulder: RegExpBuilder) => string | RegExpBuilder)) {
        if (typeof target === 'string') {
            return target;
        } else {
            const result = target(new RegExpBuilder());
            if (typeof result === 'string') {
                return result;
            } else {
                return result.getRawOne();
            }
        }
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
    private lookbehind<T extends string, P extends string>(first: T, second: P): `(?<=(${T}))(${P})` {
        const symbol = '?<=';
        return `(${symbol}(${first}))(${second})`;
    }

    /**
     * A function that returns a pattern by executing the methods written so far in order.
     * @returns RegExp's first parameter named "pattern"
     */
    private execute() {
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
