#!/usr/bin/env node
/**
 * SolOS HTML Modular Builder
 * Zero-dependency native Node.js script that compiles src/index.html and its partials into root index.html
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const SRC_INDEX = path.join(SRC_DIR, 'index.html');
const DEST_INDEX = path.join(ROOT_DIR, 'index.html');

function resolveIncludes(filePath, baseDir) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Match <!-- @include path/to/file.html -->
  const includeRegex = /<!--\s*@include\s+([^\s]+)\s*-->/g;
  return content.replace(includeRegex, (match, relPath) => {
    const targetPath = path.resolve(baseDir, relPath);
    if (!fs.existsSync(targetPath)) {
      console.error(`[build-html] Error: Include file not found: ${targetPath}`);
      process.exit(1);
    }
    return resolveIncludes(targetPath, path.dirname(targetPath));
  });
}

function build() {
  if (!fs.existsSync(SRC_INDEX)) {
    console.error(`[build-html] Error: src/index.html not found!`);
    process.exit(1);
  }
  const start = Date.now();
  const compiled = resolveIncludes(SRC_INDEX, SRC_DIR);
  fs.writeFileSync(DEST_INDEX, compiled, 'utf8');
  const elapsed = Date.now() - start;
  console.log(`[build-html] Successfully compiled index.html (${compiled.length} bytes, ${compiled.split('\n').length} lines) in ${elapsed}ms`);
}

if (require.main === module) {
  build();
}

module.exports = { build };
