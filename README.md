# Sample Test Automation Framework

A robust test automation framework built with [Playwright](https://playwright.dev/) for testing UI and API layers.
This project is a sample portfolio demonstrating automation practices using Pet Store API and JetBrains website.

## 🚀 Features

- **Multi-layered Testing:** Supports UI and API-level testing within a single framework.
- **TypeScript Support:** Written entirely in TypeScript for type safety and better developer experience.
- **Reporting:** Integrated HTML and JUnit reporting for test visualization and CI/CD integration.
- **Parallel Execution:** Configured for parallel test execution to optimize CI/CD pipeline duration.
- **Page Object Model:** Implementation of POM for UI testing.
- **Service-based API Testing:** Clean abstraction for API interactions.

## 📂 Project Structure

- `api/`: API-related service classes, DTOs, and base clients.
- `ui/`: UI-related page objects and fixtures.
- `tests/`: Test specifications categorized by layer (API, UI).
- `utils/`: Common utility functions, loggers, and global helpers.
- `config/`: Configuration files and constants.
- `data/`: Test data builders.
- `enum/`: Enums for consistent value management.

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## ⚙️ Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers and system dependencies:
   ```bash
   npx playwright install --with-deps
   ```

## 🔐 Configuration

The project uses environment variables for configuration. The `.env` file contains general environment configuration.

### Key Environment Variables

- `TIMEOUT_MS`: Global test timeout (default: 30000).
- `HEADLESS`: Set to `true` to run UI tests in headless mode.

## 🧪 Running Tests

Available npm scripts for test execution:

- **Run all tests:**
  ```bash
  npm test
  ```
- **Run UI tests only:**
  ```bash
  npm run test:ui
  ```
- **Run API tests only:**
  ```bash
  npm run test:api
  ```

## 📊 Reporting

After running the tests, you can view the execution report:

```bash
npm run report
```

Reports are stored in the `report/playwright-report` directory.
