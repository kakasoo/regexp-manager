# regexp-manager

The library aims to make regular expressions easier for developers who have worked with ORM.
Inspired by [TypeORM's queryBuilder](https://orkhan.gitbook.io/typeorm/docs/select-query-builder#what-is-querybuilder), the library is designed to provide a builder pattern named RegExpBuilder.

# createRegExpBuilder

```typescript
/**
 * return : /(?<=(forehead))(test)/gi
 */
const includeRegExp = new RegExpBuilder().from('test').include('forehead', { isForehead: true }).getOne();
```

```typescript
/**
 * return : /((?<=(cat))(mouse))(?=(dog))/gi
 */
const includeRegExp = new RegExpBuilder().from('mouse').include('cat').include('dog', { isForehead: false }).getOne();
```

you just use `createRegExpBuilder()` method.  
so, you can create regExp and decorate by using RegExpBuilder methods.  
You can simply call a method called `createRegExpBuilder` to create a builder, and you can use various methods to create regular expressions without learning it.  
The code above makes you not have to memorize regular expression symbols such as lookaround and lookbehind.

## from method

```typescript
const regExp = new RegExpBuilder('initialValue').getOne(); // RegExp
```

```typescript
const regExp = new RegExpBuilder().from('initialValue').getOne(); // RegExp, same meaning.
```

`from` method receives the first string of regular expressions as a parameter to be created in the builder pattern.  
If you want to create a more complex pattern, you can also write the `sub-expression` below.  
All methods to be implemented in the future will be made all sub-expression possible.

## getOne

Returns regexp instances based on methods written so far.

## getRawOne

Returns string based on methods written so far.  
You can use this as the first parameter of the regular expression constructor.

## include & andInclude

```typescript
/**
 * return : /(?<=(forehead))(test)/gi
 */
const includeRegExp = new RegExpBuilder().from('test').include('forehead', { isForehead: true }).getOne();
```

```typescript
const includeRegExp = new RegExpBuilder()
    .from('test')
    .include('[0-9]+', { isForehead: true })
    .andInclude('[a-z]+', { isForehead: true })
    .getOne();

const res = 'cat123test'.match(includeRegExp)?.at(0);
expect(res).toBe('test');
```

```typescript
/**
 * return : `(cat is behind of )(?=(dog))`
 */
const includeRegExp = new RegExpBuilder().from('cat is behind of ').include('dog', { isForehead: false }).getOne();

const res = 'cat is behind of dog'.match(includeRegExp)?.at(0);
expect(res).toBe('cat is behind of ');
```

The include method is a method that contains a string that is not included in a capture group.  
The first parameter of the include method is the sub-expression function that generates the character or its string to be included, and the second parameter is options.  
The options means where the string of this inclusion relationship should be located before or after the initial value.

The include method should only be used once per builder. If you want to use a second inclusion, sconsider and include.

## isOptinonal (to be created)

## whatever (to be created)

## and

```typescript
const leftHand = new RegExpBuilder('Hand').and('left', { isForehead: true }).getRawOne();
expect(leftHand).toBe('leftHand');
```

```typescript
const regexp = new RegExpBuilder('one')
    .and((qb) => {
        return qb.from('two').and('three').getRawOne();
    })
    .getRawOne();
expect(regexp).toBe('threetwoone');
```

The `and` method is responsible for modifying the initial value.  
When writing a initial value, it would be more readable to write it separately using the and method rather than writing it in a single line.

## or

```typescript
const leftOrRight = new RegExpBuilder('left').or('right').getRawOne();
expect(leftOrRight).toBe('left|right');
```

```typescript
const leftOrRight = new RegExpBuilder('left')
    .or((qb) => {
        return qb
            .from('r')
            .and('i', { isForehead: false })
            .and('g', { isForehead: false })
            .and('h', { isForehead: false })
            .and('t', { isForehead: false })
            .getRawOne();
    })
    .getRawOne();

expect(leftOrRight).toBe('left|right');
```

The `or` method is responsible for modifying the initial value.  
When writing a initial value, it would be more readable to write it separately using the and method rather than writing it in a single line.

## join

```typescript
const regexp = new RegExpBuilder()
    .from((qb) => {
        return qb.join([(qb) => qb.from('one'), qb.from('two').getRawOne(), 'three'], '|');
    })
    .getRawOne();

expect(regexp).toBe('one|two|three');
```

the `join` method make from method easy.

## lessThanEqual

```typescript
it('1. string "cat" but lessThanEqual 3', () => {
    // If you don't set maximum value, it will be empty string.
    // regExp: /(cat){3,}/gi
    const regExp = new RegExpBuilder().from('(cat)').lessThanEqual(3).getOne();

    expect('cat'.match(regExp)?.at(0) === 'cat').toBe(true);
    expect('catcat'.match(regExp)?.at(0) === 'catcat').toBe(true);
    expect('catcatcat'.match(regExp)?.at(0) === 'catcatcat').toBe(true);

    expect('catcatcatcat'.match(regExp)?.at(0) === 'catcatcat').toBe(true);
    expect('catcatcatcat'.match(regExp)?.at(0) === 'catcatcatcat').toBe(false);
});
```

## moreThanEqual

```typescript
it('1. string "cat" but moreThanEqual 3', () => {
    // If you don't set minimum value, it will be 1.
    // regExp: /(cat){1,3}/gi
    const regExp = new RegExpBuilder().from('(cat)').moreThanEqual(3).getOne();

    expect('cat'.match(regExp)?.at(0) === 'cat').toBe(false);
    expect('catcat'.match(regExp)?.at(0) === 'catcat').toBe(false);
    expect('catcatcat'.match(regExp)?.at(0) === 'catcatcat').toBe(true);

    expect('catcatcatcat'.match(regExp)?.at(0) === 'catcatcatcat').toBe(true);
    expect('catcatcatcat'.match(regExp)?.at(0) === 'catcatcatcat').toBe(true);
});
```

## between

```typescript
it('1. string "cat" but lessThanEqual 3', () => {
    const pattern1 = new RegExpBuilder().from('(cat)').lessThanEqual(3).moreThanEqual(3).getRawOne();
    const pattern2 = new RegExpBuilder().from('(cat)').between(3, 3).getRawOne();

    // (cat){3, 3}
    expect(pattern1).toBe(pattern2);
});
```

# order by execution

1. from ( or constructor )
2. whatever, isoptional
3. include
4. lessThanEqual, moreThanEqual, between

No matter how you write RegExpBuilder's method, the order of the methods is enforced.  
This is to ensure action.

# sub-expression

```typescript
const current = new RegExpBuilder()
    .from((qb) => {
        return qb.from('cat').include('dog').getRawOne(); // string is ok
    })
    .getOne();
```

```typescript
const current = new RegExpBuilder()
    .from((qb) => {
        return qb.from('cat').include('dog'); // RegExpBuilder instance is ok
    })
    .getOne();
```

Sub-expression should return the completed string from the builder. ( Maybe `getRawOne method` will help. )  
However, simply returning a RegExpBuilder instance allows it to work without difficulty.  
This is an exception to prevent human error.
