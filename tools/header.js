#!/usr/bin/env node

/**
 * File Header Tool
 *
 * Adds or updates license/copyright headers to source files.
 *
 * Usage:
 *   node tools/header.js [options] [files...]
 *
 * Options:
 *   --check    Check if headers are present (don't modify files)
 *   --remove   Remove headers from files
 *   --help     Show help message
 *
 * Examples:
 *   node tools/header.js src/**\/*.ts
 *   node tools/header.js --check src/**\/*.ts
 *   node tools/header.js --remove src/index.ts
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// Configuration
const config = {
  author: "Lexi Rose Rogers",
  license: "MIT",
  year: new Date().getFullYear(),
  projectName: "typescript-project-template",
};

// Header templates for different file types
const templates = {
  js: (cfg) => `/**
 * @file {filename}
 * @description {description}
 * @license ${cfg.license}
 * @copyright ${cfg.year} ${cfg.author}
 */

`,
  ts: (cfg) => `/**
 * @file {filename}
 * @description {description}
 * @license ${cfg.license}
 * @copyright ${cfg.year} ${cfg.author}
 */

`,
  css: (cfg) => `/**
 * @file {filename}
 * @license ${cfg.license}
 * @copyright ${cfg.year} ${cfg.author}
 */

`,
  html: (cfg) => `<!--
  @file {filename}
  @license ${cfg.license}
  @copyright ${cfg.year} ${cfg.author}
-->

`,
  sh: (cfg) => `#!/bin/bash
# @file {filename}
# @license ${cfg.license}
# @copyright ${cfg.year} ${cfg.author}

`,
};

// File extension mapping
const extMap = {
  ".js": "js",
  ".mjs": "js",
  ".cjs": "js",
  ".jsx": "js",
  ".ts": "ts",
  ".tsx": "ts",
  ".mts": "ts",
  ".cts": "ts",
  ".css": "css",
  ".scss": "css",
  ".less": "css",
  ".html": "html",
  ".htm": "html",
  ".sh": "sh",
  ".bash": "sh",
};

// Patterns to detect existing headers
const headerPatterns = [
  /^\/\*\*[\s\S]*?@(license|copyright|file)[\s\S]*?\*\/\s*/,
  /^\/\*[\s\S]*?@(license|copyright|file)[\s\S]*?\*\/\s*/,
  /^<!--[\s\S]*?@(license|copyright|file)[\s\S]*?-->\s*/,
  /^(#[^\n]*\n)*#[^\n]*@(license|copyright|file)[^\n]*\n(\s*#[^\n]*\n)*/,
];

function getTemplate(filePath) {
  const ext = extname(filePath).toLowerCase();
  const type = extMap[ext];
  return type ? templates[type] : null;
}

function hasHeader(content) {
  return headerPatterns.some((pattern) => pattern.test(content));
}

function removeHeader(content) {
  let result = content;
  for (const pattern of headerPatterns) {
    result = result.replace(pattern, "");
  }
  return result;
}

function addHeader(filePath, content, description = "") {
  const templateFn = getTemplate(filePath);
  if (!templateFn) {
    return content;
  }

  const filename = relative(rootDir, filePath).replace(/\\/g, "/");
  let header = templateFn(config);
  header = header.replace("{filename}", filename);
  header = header.replace("{description}", description || "");

  // Remove existing header if present
  const cleanContent = removeHeader(content);

  return header + cleanContent;
}

function processFile(filePath, options = {}) {
  const { check = false, remove = false } = options;

  try {
    const content = readFileSync(filePath, "utf-8");
    const relativePath = relative(rootDir, filePath);

    if (check) {
      const has = hasHeader(content);
      console.log(`${has ? "✓" : "✗"} ${relativePath}`);
      return has;
    }

    if (remove) {
      if (hasHeader(content)) {
        const newContent = removeHeader(content);
        writeFileSync(filePath, newContent, "utf-8");
        console.log(`✓ Removed header: ${relativePath}`);
        return true;
      }
      console.log(`- No header found: ${relativePath}`);
      return false;
    }

    // Add header
    if (!getTemplate(filePath)) {
      console.log(`- Skipped (unsupported): ${relativePath}`);
      return false;
    }

    if (hasHeader(content)) {
      console.log(`- Already has header: ${relativePath}`);
      return false;
    }

    const newContent = addHeader(filePath, content);
    writeFileSync(filePath, newContent, "utf-8");
    console.log(`✓ Added header: ${relativePath}`);
    return true;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

function findFiles(dir, extensions = Object.keys(extMap)) {
  const files = [];

  function walk(currentDir) {
    const entries = readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);

      // Skip common directories
      if (
        entry.isDirectory() &&
        !["node_modules", "dist", "coverage", ".git", ".turbo"].includes(entry.name)
      ) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  walk(dir);
  return files;
}

function showHelp() {
  console.log(`
File Header Tool

Adds or updates license/copyright headers to source files.

Usage:
  node tools/header.js [options] [files...]

Options:
  --check    Check if headers are present (don't modify files)
  --remove   Remove headers from files
  --help     Show this help message

Examples:
  node tools/header.js                      # Process all files in src/
  node tools/header.js src/index.ts         # Process specific file
  node tools/header.js --check              # Check all files in src/
  node tools/header.js --remove src/*.ts    # Remove headers from files

Supported file types:
  ${Object.keys(extMap).join(", ")}
`);
}

// Main
function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    showHelp();
    process.exit(0);
  }

  const check = args.includes("--check");
  const remove = args.includes("--remove");
  const fileArgs = args.filter((arg) => !arg.startsWith("--"));

  let files;
  if (fileArgs.length > 0) {
    // Process specific files
    files = fileArgs.map((f) => (f.startsWith("/") ? f : join(rootDir, f)));
  } else {
    // Process all files in src/
    const srcDir = join(rootDir, "src");
    files = findFiles(srcDir);
  }

  if (files.length === 0) {
    console.log("No files found to process.");
    process.exit(0);
  }

  console.log(
    `\n${check ? "Checking" : remove ? "Removing headers from" : "Adding headers to"} ${files.length} file(s)...\n`
  );

  let processed = 0;
  for (const file of files) {
    if (processFile(file, { check, remove })) {
      processed++;
    }
  }

  console.log(`\nDone! ${processed}/${files.length} files processed.\n`);

  if (check && processed !== files.length) {
    process.exit(1);
  }
}

main();
