# regexp-manager

![regexp-manager](https://github.com/kakasoo/regexp-manager/assets/55487286/6af292a4-33c4-4935-ac90-ce81d67ef20e)

```bash
$ npm i regexp-manager
```

This library creates regular expressions in a form similar to query builders. The benefits of this library are three.

1. To intuitively use various methods of regular expressions that developers do not usually deal with
2. To increase the reuse of regular expressions
3. To infer regular expressions at the type level and allow problems to be found at the time of compilation

# Methods currently implemented

```typescript
// `or` method
// Below return 'left|right'. And it's also inferred from the type.
const leftOrRight = new RegExpPatternBuilder('left').or('right').expression;

// `and` method
// Below return 'leftright'. And it's also inferred from the type.
const leftAndRight = new RegExpPatternBuilder('left').and('right').expression;

// `capturing` method
// Below return '(A)'. And it's also inferred from the type.
const capturingA = new RegExpPatternBuilder('').capturing('A').expression;

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

// `include`("left", P) method means lookbehind
// Below return '(?<=a)b'. And it's also inferred from the type.
const lookhehind = new RegExpPatternBuilder('b').includes('LEFT', 'a');

// `include`("right", P) method means lookahead
// Below return 'b(?=a)'. And it's also inferred from the type.
const lookahead = new RegExpPatternBuilder('b').includes('RIGHT', 'a');

// `exclude`("left", P) method means negative lookbehind
// Below return '(?<!a)b'. And it's also inferred from the type.
const nagativeLookbhind = new RegExpPatternBuilder('b').excludes('LEFT', 'a');

// `exclude`("left", P) method means negative lookbehind
// Below return 'b(?!a)'. And it's also inferred from the type.
const negativeLookahead = new RegExpPatternBuilder('b').excludes('RIGHT', 'a');
```

# How to use a builder

```typescript
import { RegExpPatternBuilder } from 'regexp-manager';

/**
 * result : '(010|011)[0-9]{3,4}[0-9]{4,4}'
 */
const koreanPhoneNumber = new RegExpPatternBuilder('')
    .capturing(() => new RegExpPatternBuilder('010').or('011'))
    .and(() => new RegExpPatternBuilder('[0-9]').between(3, 4))
    .and(() => new RegExpPatternBuilder('[0-9]').between(4, 4)).expression;
```

If you write a function that returns the string or additional builder according to the inferred type, you can check the result at the time of compilation.
