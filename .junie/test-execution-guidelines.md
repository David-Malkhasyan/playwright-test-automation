# Test Execution and Verification Guidelines

## 1. Local Execution

- **Run all tests**: `npm test`
- **Run API tests only**: `npm run test:api`
- **Run UI tests only**: `npm run test:ui`
- **Run a specific test file**: `npx playwright test path/to/test.test.ts`
- **Run in headed mode**: `npm run test:headed`
- **Run in debug mode**: `npm run test:debug`

## 2. Linting and Formatting

- Before committing or submitting code, ensure linting and formatting pass:
    - `npm run lint`: Check for code style issues and errors.
    - `npm run format`: Automatically fix formatting with Prettier.

## 3. Reports

- View the local Playwright report: `npm run report`.
- Allure reports are supported (as per `README.md` requirements).

## 4. Pre-Submission Checklist

1. All newly added or modified tests must pass locally.
2. `npm run lint` must return no errors.
3. No hardcoded credentials or environment-specific URLs should be in the test code (use `config` or `data` instead).
4. Assertions should have descriptive error messages.
