# regexp-manager

This library creates regular expressions in a form similar to query builders. The benefits of this library are three.

1. To intuitively use various methods of regular expressions that developers do not usually deal with
2. To increase the reuse of regular expressions
3. To infer regular expressions at the type level and allow problems to be found at the time of compilation

# Methods currently implemented

```typescript
// or method
// below return 'left|right'
const leftOrRight = new RegExpPatternBuilder('left').or('right').expression;

// and method
// below return 'leftright'
const leftAndRight = new RegExpPatternBuilder('left').and('right').expression; // leftright

// capturing method
// below return '(A)'
const capturingA = new RegExpPatternBuilder().capturing('A').expression;

// lessThan method
// below return 'a{1,9}'
const lessThanTen = new RegExpPatternBuilder('a').lessThan(10).expression;

// lessThanOrEqual method
// below return 'a{1,10}'
const lessThanOrEqualTen = new RegExpPatternBuilder('a').lessThanOrEqual(10).expression;

// moreThan method
// below return 'a{4,}'
const moreThanThree = new RegExpPatternBuilder('a').moreThan(3).expression;

// moreThanOrEqual method
// below return 'a{3,}'
const moreThanOrEqualThree = new RegExpPatternBuilder('a').moreThanOrEqual(3).expression;

// include("left", P) method means lookbehind
// below return '(?<=a)b'
const lookhehind = new RegExpPatternBuilder('b').includes('LEFT', 'a');

// include("right", P) method means lookahead
// below return 'b(?=a)'
const lookahead = new RegExpPatternBuilder('b').includes('RIGHT', 'a');

// exclude("left", P) method means negative lookbehind
// below return '(?<!a)b'
const nagativeLookbhind = new RegExpPatternBuilder('b').excludes('LEFT', 'a');

// exclude("left", P) method means negative lookbehind
// below return 'b(?!a)'
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
