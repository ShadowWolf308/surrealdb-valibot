<p align="center">
    <img width="300" src="./img/surreal-valibot.svg" />
</p>

<h1 align="center">surrealdb-valibot</h1>
<p align="center">
<a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/ShadowWolf308/surrealdb-valibot" alt="License"></a>
<a href="https://github.com/ShadowWolf308"><img src="https://img.shields.io/badge/created%20by-@ShadowWolf308 -45c724.svg" alt="Created by Levy van der Valk"></a>
<a href="https://www.npmjs.com/package/surrealdb-valibot" rel="nofollow"><img src="https://img.shields.io/npm/dw/surrealdb-valibot
" alt="npm"></a>
<a href="https://github.com/ShadowWolf308/surrealdb-valibot" rel="nofollow"><img src="https://img.shields.io/github/stars/ShadowWolf308/surrealdb-valibot" alt="stars"></a>
</p>
<p align="center">Re-useable <a href="https://www.npmjs.com/package/valibot">valibot</a> schema's for use with <a href="https://www.npmjs.com/package/surrealdb">SurrealDB sdk</a>.</p>

## How to use
Install it with:

```sh
# using npm
npm i surrealdb-valibot
# or using pnpm
pnpm i surrealdb-valibot
# or using yarn
yarn add surrealdb-valibot
```

Next, import the schema's, e.g.:

```ts
import { RecordIdSchema } from "surreal-valibot";
```

Use it as you would a normal valibot schema

e.g.:

```ts
import { RecordIdSchema, RecordIdSchemaOf } from "surreal-valibot";
import * as v from "valibot";

// `id` must be an instance of class `RecordId`
const PersonSchema = v.object({
	id: RecordIdSchema,
});
// or
// `id` must be an instance of class `RecordId` and table must be "person"
const PersonSchema = v.object({
	id: RecordIdSchemaOf("person"),
});
```

## Important notes
* All schema names consist of `{ClassName}Schema`, e.g. for `RecordId` it is `RecordIdSchema`
* If the class has optional generic types e.g. `RecordId` can be `RecordId<"person">` naming will be `{ClassName}SchemaOf` and will be a function  
e.g. usage: `const schema = RecordIdSchemaOf("person")`
* Some types like `Range` have required generic types, these schema's are function and follow the following naming scheme: `{ClassName}Schema`  
e.g.: `RangeSchema(v.string(), v.string())`
* Some schema function have props that are a `string` (e.g. `RecordIdSchemaOf`) and some are any valibot schema (e.g. `RangeSchema`)

## References
* [valibot docs](https://valibot.dev/)
* [valibot npm package ](https://www.npmjs.com/package/valibot)
* [SurrealDB docs](https://surrealdb.com/)
* [SurrealDB npm package](https://www.npmjs.com/package/surrealdb)