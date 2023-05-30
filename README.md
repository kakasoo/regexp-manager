# regexp-manager

![regexp-manager](https://github.com/kakasoo/regexp-manager/assets/55487286/6af292a4-33c4-4935-ac90-ce81d67ef20e)

```bash
$ npm i regexp-manager
```

This library creates regular expressions in a form similar to query builders. The benefits of this library are three.

1. To intuitively use various methods of regular expressions that developers do not usually deal with
2. To increase the reuse of regular expressions
3. To infer regular expressions at the type level and allow problems to be found at the time of compilation

# How to use a builder

```typescript
import { RegExpPatternBuilder } from 'regexp-manager';

/**
 * result : '(010|011)[0-9]{3,4}[0-9]{4,4}'
 */
const koreanPhoneNumber = new RegExpPatternBuilder()
    .capturing((qb) => qb.and('010').or('011')) // '(010|011)'
    .and('-') // '-'
    .and((qb) => qb, and('[0-9]').between(3, 4)) // '[0-9]{3,4}'
    .and('-') // '-'
    .and((qb) => qb.and('[0-9]').between(4, 4)).expression; // '[0-9]{4,4}'
```

If you write a function that returns the string or additional builder according to the inferred type, you can check the result at the time of compilation. If you want to use a sub-builder inside, you can use the `qb` given as a parameter. It works even if you just write it as a string.

# Methods currently implemented

## or

It means 'or syntax' using pipe characters in regular expressions. The 'or syntax' can also be checked in advance by type level.

```typescript
// It's also inferred from the type.

const leftOrRight = new RegExpPatternBuilder('left').or('right').expression; // 'left|right'
const redOrBlue = new RegExpPatternBuilder('red').or('blue').expression; // 'red|blue'
const dogOrCat = new RegExpPatternBuilder('dog').or('cat').expression; // 'dog|cat'
```

## and

The 'and syntax' simply connects strings. In a regular expression, sometimes it is more readable to divide and combine characters in semantic units.

```typescript
// It's also inferred from the type.

const leftOrRight = new RegExpPatternBuilder('left').and('right').expression; // 'leftright'
const redOrBlue = new RegExpPatternBuilder('red').and('blue').expression; // 'redblue'
const dogOrCat = new RegExpPatternBuilder('dog').and('cat').expression; // 'dogcat'
```

## capturing

There is a syntax called 'capturing' in the regular expression. This syntax uses parentheses to lock the string, making the `test`, `match` method of the regular expression different in the future.

```typescript
// It's also inferred from the type.
const capturingA = new RegExpPatternBuilder().capturing('A').expression; // '(A)'
```

## quantifier methods

There are four methods in `quantifier`: `lessThan`, `lessThanOrEqual`, `moreThan`, and `moreThanOrEqual`. They define how many times a previously specified character or string will exist based on a given number.

```typescript
// `lessThan` method
// Below return 'a{1,9}'. And it's also inferred from the type.
const lessThanTen = new RegExpPatternBuilder('a').lessThan(10).expression;

// `lessThanOrEqual` method
// Below return 'a{1,10}'. And it's also inferred from the type.
const lessThanOrEqualTen = new RegExpPatternBuilder('a').lessThanOrEqual(10).expression;

// `moreThan` method
// Below return 'a{4,}'. And it's also inferred from the type.
const moreThanThree = new RegExpPatternBuilder('a').moreThan(3).expression;

// `moreThanOrEqual` method
// Below return 'a{3,}'. And it's also inferred from the type.
const moreThanOrEqualThree = new RegExpPatternBuilder('a').moreThanOrEqual(3).expression;
```

## includes

It means `lookahead`, `lookbehind` of the regular expression. These are strings that should be included in a string but should not be caught in a regular expression.

```typescript
// `include`("left", P) method means lookbehind
// Below return '(?<=a)b'. And it's also inferred from the type.
const lookhehind = new RegExpPatternBuilder('b').includes('LEFT', 'a').expression;

// `include`("right", P) method means lookahead
// Below return 'b(?=a)'. And it's also inferred from the type.
const lookahead = new RegExpPatternBuilder('b').includes('RIGHT', 'a').expression;
```

## excludes

It means `lookahead`, `lookbehind` of the regular expression. These are strings that should be excluded in a string.

```typescript
// `exclude`("left", P) method means negative lookbehind
// Below return '(?<!a)b'. And it's also inferred from the type.
const nagativeLookbhind = new RegExpPatternBuilder('b').excludes('LEFT', 'a').expression;

// `exclude`("right", P) method means negative lookbehind
// Below return 'b(?!a)'. And it's also inferred from the type.
const negativeLookahead = new RegExpPatternBuilder('b').excludes('RIGHT', 'a').expression;
```
