// Ref: https://github.com/jehna/humanify/blob/7b85f9de6c61afed42f5eebb3a1fefc104af8f2c/src/plugins/prettier.ts

import prettier from "prettier";

export default async (code) =>
  prettier.format(code, { parser: "babel" });

console.log("It worked!")
