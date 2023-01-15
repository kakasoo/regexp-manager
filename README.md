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

# sub-expression

```typescript
const current = new RegExpBuilder().from((qb) => {
    return qb.from('cat').include('dog').currentExpression;
}).currentExpression;
```
