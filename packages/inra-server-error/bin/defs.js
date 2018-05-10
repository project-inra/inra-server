// As from FAQ: https://github.com/flowtype/flow-typed/wiki/FAQs
// If you're not planing on versioning your definitions, the preferred way is to
// copy source files to `*.js.flow`` format, and include them with the release.

import { basename, resolve } from "path";
import { copy } from "fs-extra";
import glob from "glob";

async function copyFile(file) {
  const fileName = basename(file);
  const filePath = resolve(__dirname, "../dest/", `${fileName}.flow`);

  await copy(file, filePath);

  console.log(`Copied ${file} to ${filePath}`);
}


async function run() {
  glob(resolve(__dirname, "../src/**/*.js"), (err, files) => {
    if (err) {
      console.error(err);
    } else {
      files.forEach(file => copyFile(file));
    }
  });
}

run();
