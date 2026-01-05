# TypeScript Project Template

A comprehensive TypeScript project template with modern tooling for building, testing, and
publishing TypeScript packages.

## Features

- **TypeScript 5.3+** - Latest TypeScript with strict type checking
- **tsup** - Fast, zero-config bundler powered by esbuild
- **Vitest** - Blazing fast unit testing with coverage
- **ESLint** - Linting with TypeScript support
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality checks
- **Commitlint** - Conventional commit messages
- **Semantic Release** - Automated versioning and publishing
- **TypeDoc** - API documentation generation

## Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0 (or pnpm)

## Installation

```bash
# Clone the repository
git clone https://github.com/lrrsh/typescript-project-template.git
cd typescript-project-template

# Install dependencies
pnpm install
```

## Scripts

| Script               | Description                             |
| -------------------- | --------------------------------------- |
| `pnpm build`         | Build the project for production        |
| `pnpm build:watch`   | Build in watch mode                     |
| `pnpm dev`           | Run in development mode with hot reload |
| `pnpm start`         | Run the built project                   |
| `pnpm test`          | Run tests in watch mode                 |
| `pnpm test:run`      | Run tests once                          |
| `pnpm test:coverage` | Run tests with coverage report          |
| `pnpm test:ui`       | Run tests with Vitest UI                |
| `pnpm lint`          | Lint the codebase                       |
| `pnpm lint:fix`      | Lint and auto-fix issues                |
| `pnpm format`        | Format code with Prettier               |
| `pnpm format:check`  | Check code formatting                   |
| `pnpm typecheck`     | Run TypeScript type checking            |
| `pnpm validate`      | Run all checks (typecheck, lint, test)  |
| `pnpm docs`          | Generate API documentation              |
| `pnpm clean`         | Clean build artifacts                   |

## Project Structure

```
├── src/
│   └── index.ts          # Main entry point
├── dist/                  # Build output (generated)
├── docs/                  # Generated documentation
├── eslint.config.js       # ESLint configuration
├── tsconfig.json          # TypeScript configuration
├── tsconfig.build.json    # TypeScript build configuration
├── tsup.config.ts         # tsup bundler configuration
├── vitest.config.ts       # Vitest test configuration
├── commitlint.config.js   # Commitlint configuration
└── package.json
```

## Building

```bash
# Production build
pnpm build

# Watch mode for development
pnpm build:watch
```

The build outputs:

- `dist/index.js` - CommonJS bundle
- `dist/index.mjs` - ES Module bundle
- `dist/index.d.ts` - TypeScript declarations

## Testing

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run with coverage
pnpm test:coverage

# Run with UI
pnpm test:ui
```

## Linting & Formatting

```bash
# Check for linting issues
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check
```

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commit messages
should follow the format:

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

## License

MIT © [Lexi Rose Rogers](https://github.com/lrrsh)
