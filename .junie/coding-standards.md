# Coding Standards and Best Practices

## 1. Project Structure and Naming

- **API Tests**: Located in `tests/api/`. Use the `.test.ts` suffix for all test files.
- **UI Tests**: Located in `tests/ui/` (if any) and use Page Object Model in `ui/`.
- **Naming Conventions**:
    - Test files: `kebab-case.test.ts` (e.g., `petstore.test.ts`).
  - Test names: Descriptive and include unique IDs if available (e.g., `pst-001 - should add a new pet to the store`).
    - Test name unique Ids: Unique IDs for each test should have corresponding scenarios in the scenarios folder.
    - Test scenarios: Test scenarios should be in `scenarios/` and follow the naming convention `scenario-name.ts`.
    - Test scenario names: Descriptive and include the test name and have unique IDs.
    - Use clear and concise step names within `test.step()`.
    - Do not use nested test.step()

## 2. Playwright Usage

- **Fixtures**: Use custom fixtures from `@api-fixtures` for API tests. Avoid raw `request` context if a specialized
  service or fixture is available.
- **Assertions**:
    - Use `expect.soft()` for non-breaking validations to allow the test to continue and report multiple failures.
    - Provide descriptive messages in assertions (e.g.,
      `expect.soft(result, "General points should match").toBe(expected)`).
- **Test Organization**:
    - Group related tests in `test.describe`.
    - Use `test.describe.parallel` for independent tests to speed up execution.
    - Leverage `test.step` for better reporting and debugging.

## 3. TypeScript and Path Aliases

- Use path aliases defined in `tsconfig.json` to keep imports clean:
    - `@api-fixtures` for test fixtures.
    - `@builders` for data builders/factories.
    - `@services` for API service wrappers.
    - `@dtos` for Data Transfer Objects.
- Avoid relative paths like `../../../` where a path alias is available.

## 4. Data Management

- **Builders**: Use builders from `data/builders/` to generate complex request payloads.
- **Faker**: Use `@faker-js/faker` for generating random but realistic test data.
- **Static Data**: Use predefined data from `data/data/` (e.g., `Data`) for environment-specific
  constants.

## 5. API Testing Patterns

- **Services**: Wrap API calls in service classes (e.g., `PetService`) to encapsulate logic and promote reuse.

## 6. Code Style

- Follow the existing ESLint and Prettier configurations.
- Use `async/await` for all asynchronous operations.
- Prefer `const` over `let` and `var`.
