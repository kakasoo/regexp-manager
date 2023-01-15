export class RegExpBuilder {
    private flag: 'g' | 'i' | 'ig' | 'm';
    private expression: string;
    private minimum?: number;
    private maximum?: number;
    constructor(initialValue: string = '') {
        this.expression = initialValue;
    }

    from(qb: (RegExpBuilder: RegExpBuilder) => string): this;
    from(initialValue: string): this;
    from(initialValue: string | ((qb: RegExpBuilder) => string)): this {
        if (typeof initialValue === 'string') {
            this.expression = initialValue;
        } else {
            this.expression = initialValue(new RegExpBuilder());
        }
        return this;
    }

    /**
     * it make dot.
     * it means ".". It means that it doesn't matter what letter it is.
     * @returns `(${string})?`
     */
    whatever() {
        this.expression = `(${this.expression}).`;
        return this;
    }

    /**
     * it make quantifier.
     * it means "?". It means that it doesn't matter if this character is present or not.
     * @returns `(${string})?`
     */
    isOptional() {
        this.expression = `(${this.expression})?`;
        return this;
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
        if (typeof partial === 'string') {
            if (options.isForehead) {
                this.expression = this.lookbehind(partial, this.expression);
            } else {
                this.expression = this.lookaround(this.expression, partial);
            }
            return this;
        } else if (typeof partial === 'function') {
            const subRegExp = partial(new RegExpBuilder());

            if (options.isForehead) {
                this.expression = this.lookbehind(subRegExp, this.expression);
            } else {
                this.expression = this.lookaround(this.expression, subRegExp);
            }
            return this;
        }
    }

    lessThanEqual(maximum: number) {
        this.maximum = maximum;
        return this;
    }

    /**
     * return current's expression
     */
    get currentExpression() {
        return this.expression;
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
        let expression = this.expression;
        if (typeof this.minimum === 'number' && typeof this.maximum === 'number') {
            // more than equal minimum, less thean equal maximum
            expression = `${expression}{${this.minimum}, ${this.maximum}}`;
        } else if (typeof this.minimum === 'number') {
            // more than equal minimum
            expression = `${expression}{${this.minimum},}`;
        } else if (typeof this.maximum === 'number') {
            // more than equal 1, less thean equal maximum
            expression = `${expression}{1,${this.maximum}}`;
        }

        return expression;
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
}
