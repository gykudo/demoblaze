# DemoBlaze Production-Grade Playwright TypeScript Automation Framework

An enterprise-grade, scalable End-to-End (E2E) automation testing framework architected for [DemoBlaze](https://www.demoblaze.com/) using **Playwright**, **TypeScript**, and **Page Object Model (POM)** pattern.

---

## 🏛 Framework Design Principles

- **Maintainability & Modularity**: Encapsulates UI selectors and actions within object-oriented Page Objects (`src/page-objects/`).
- **Parallelization & Speed**: Implements fully parallel test execution with state isolation via Playwright Browser Contexts.
- **API Acceleration Layer**: Includes direct API clients (`src/api/`) for instant state setup/teardown bypassing UI delays.
- **Robust Synchronization**: Replaces hardcoded sleeps/waits with auto-waiting, explicit web assertions, and asynchronous dialog event hooks.
- **Flakiness Mitigation**: Auto-retries enabled on CI environments, supplemented by automatic trace, video, and screenshot captures on failures.

---

## 🚀 Environment Setup & Execution

### Prerequisites

- **Node.js**: `v18.x` or `v20.x` LTS
- **npm**: `v9.x` or higher

<Sequence>
  <Step title="Repository Initialization">
    Clone the codebase and navigate into the root directory:
    ```bash
    git clone [https://github.com/](https://github.com/)gykudo/demoblaze_playwright.git
    cd demoblaze_playwright
    ```
  </Step>

  <Step title="Dependency Installation">
    Install project npm modules and Playwright multi-browser engines:
    ```bash
    npm ci
    npx playwright install --with-deps
    ```
  </Step>

  <Step title="Execute E2E Automation Suites">
    Run full regression test suite across all configured browsers (Headless mode):
    ```bash
    # Execute full headless suite
    npx playwright test

    # Execute in UI Interactive Runner
    npx playwright test --ui

    # Target specific test file and browser engine
    npx playwright test tests/e2e/checkout.spec.ts --project="Chromium - Desktop"
    ```
  </Step>

  <Step title="Report Inspection">
    Launch the interactive HTML test report viewer:
    ```bash
    npx playwright show-report
    ```
  </Step>
</Sequence>

---

## 🔄 CI/CD Pipeline Setup

The project includes a production-ready **GitHub Actions Workflow** located at `.github/workflows/regression.yml`.

```yaml
name: Playwright E2E Regression Suite

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  schedule:
    - cron: '0 0 * * *' # Daily midnight run

jobs:
  test:
    name: Run Playwright Tests
    timeout-minutes: 30
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        shard: [1/2, 2/2]

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Sharded Playwright Tests
        run: npx playwright test --shard=${{ matrix.shard }}
        env:
          BASE_URL: [https://www.demoblaze.com](https://www.demoblaze.com)

      - name: Upload Test Artifacts on Failure
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-artifacts-${{ strategy.job-index }}
          path: |
            test-results/
            playwright-report/
          retention-days: 14
