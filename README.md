# min-repro-pkgroll-2-10-0-regression

`pkgroll` `2.8.2` worked fine, but since `2.10.0`, and still on `2.11.0`; we're seeing the following error:

- https://github.com/jehna/humanify/pull/322#issuecomment-2661324667
- https://github.com/jehna/humanify/pull/343#issuecomment-2679947137

```
node:internal/modules/cjs/loader:1631
    throw new ERR_INVALID_ARG_VALUE('filename', filename, createRequireError);
          ^

TypeError [ERR_INVALID_ARG_VALUE]: The argument 'filename' must be a file URL object, file URL string, or absolute path string. Received undefined
    at createRequire (node:internal/modules/cjs/loader:1631:11)
    at file:///Users/runner/work/humanify/humanify/dist/index.mjs:137[4](https://github.com/jehna/humanify/actions/runs/13489863907/job/37686273739?pr=343#step:7:5):18 {
  code: 'ERR_INVALID_ARG_VALUE'
}

Node.js v20.18.1
```

```
node:internal/modules/cjs/loader:1762
    throw new ERR_INVALID_ARG_VALUE('filename', filename, createRequireError);
          ^

TypeError [ERR_INVALID_ARG_VALUE]: The argument 'filename' must be a file URL object, file URL string, or absolute path string. Received undefined
    at createRequire (node:internal/modules/cjs/loader:1762:11)
    at file:///Users/devalias/dev/tmp/humanify/dist/index.mjs:1374:18 {
  code: 'ERR_INVALID_ARG_VALUE'
}

Node.js v22.6.0
```

> Looking at the code in `/Users/devalias/dev/tmp/humanify/dist/index.mjs:1374:18`:
> 
> ```js
> // ..snip..
> /* 1373 */ const import_meta = {};
> /* 1374 */ const require2 = createRequire(import_meta.url);
> /* 1375 */ const __filename = fileURLToPath(import_meta.url);
> /* 1376 */ dirname(__filename);
> /* 1377 */ var __create = Object.create;
> /* 1378 */ var __defProp2 = Object.defineProperty;
> /* 1379 */ var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
> /* 1380 */ var __getOwnPropNames = Object.getOwnPropertyNames;
> /* 1381 */ var __getProtoOf = Object.getPrototypeOf;
> /* 1382 */ var __hasOwnProp2 = Object.prototype.hasOwnProperty;
> // ..snip..
> ```
> 
> So it seems the error is because `import_meta.url` is `undefined`.
> 
> _Originally posted by @0xdevalias in https://github.com/jehna/humanify/issues/343#issuecomment-2679947137_

> Looking at `/Users/devalias/dev/tmp/humanify/node_modules/prettier/index.mjs`, we can more or less match up those lines:
> 
> ```js
> import { createRequire as __prettierCreateRequire } from "module";
> import { fileURLToPath as __prettierFileUrlToPath } from "url";
> import { dirname as __prettierDirname } from "path";
> const require = __prettierCreateRequire(import.meta.url);
> const __filename = __prettierFileUrlToPath(import.meta.url);
> const __dirname = __prettierDirname(__filename);
> 
> var __create = Object.create;
> var __defProp = Object.defineProperty;
> var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
> var __getOwnPropNames = Object.getOwnPropertyNames;
> var __getProtoOf = Object.getPrototypeOf;
> var __hasOwnProp = Object.prototype.hasOwnProperty;
> ```
> 
> But we can see that `import.meta.url` is left as-is in the `prettier` `.mjs`; whereas it's being transpiled in our version for some reason.
> 
> _Originally posted by @0xdevalias in https://github.com/jehna/humanify/issues/343#issuecomment-2683599564_
