# DemoBlaze End-to-End Automation Testing Framework

An enterprise-grade, scalable End-to-End (E2E) test automation framework designed for [DemoBlaze](https://www.demoblaze.com/), engineered with **Playwright**, **TypeScript**, and the **Page Object Model (POM)** pattern.

---

## 🏗️ Framework Structure & Rationale

### Project Directory Layout

```text
demoblaze-playwright-ts/
├── .github/
│   └── workflows/
│       └── regression.yml          # GitHub Actions CI/CD matrix pipeline
├── src/
│   ├── api/                        # Direct REST API clients for state setup/teardown
│   │   ├── auth.api.ts
│   │   └── cart.api.ts
│   ├── config/                     # Environment configs & runtime environment variables
│   │   └── env.config.ts
│   ├── constants/                  # System endpoints, static text, & alert messages
│   │   └── endpoints.ts
│   ├── core/                       # Base abstraction classes
│   │   ├── api.client.ts
│   │   └── base.page.ts
│   ├── page-objects/               # Page Object Models (UI Locators & Actions)
│   │   ├── cart.page.ts
│   │   ├── home.page.ts
│   │   ├── login.modal.ts
│   │   └── product.page.ts
│   └── utils/                      # Common utilities, data generators, & alert helpers
│       ├── dialog.handler.ts
│       └── test-data.generator.ts
├── tests/
│   ├── api/                        # API integration & contract specs
│   │   └── backend-auth.spec.ts
│   ├── e2e/                        # End-to-End UI user journeys
│   │   ├── auth.spec.ts
│   │   └── checkout.spec.ts
│   └── performance/                # Web Vitals & CDPSession metric specs
│       └── load-metrics.spec.ts
├── .env.example
├── .gitignore
├── package.json
├── playwright.config.ts            # Core Playwright configuration
├── tsconfig.json
└── README.md
```

### Key Architectural Decisions & Rationale

1. **Playwright + TypeScript**:
   * **Speed & Reliability**: Built-in auto-waiting eliminates arbitrary timeouts (`sleep`), mitigating test flakiness.
   * **Type Safety**: TypeScript provides strict static typing, catching payload and selector errors at compile-time rather than runtime.
   * **Isolated Contexts**: Fast browser context creation enables true parallel execution without shared session state pollution.

2. **Page Object Model (POM)**:
   * **Separation of Concerns**: UI locators and page interactions reside strictly within `src/page-objects/`. Test specs (`tests/e2e/`) only describe business user behavior.
   * **Maintenance Efficiency**: If DemoBlaze updates an element ID or modal structure, updates are required in only one page object file.

3. **Robust Dialog & Network Synchronization**:
   * DemoBlaze heavily relies on native JavaScript `alert()` dialogs (e.g., *"Product added"*, *"Wrong password."*). The `BasePage` registers non-blocking, event-driven `dialog` promises **prior** to triggering actions to eliminate race conditions.

4. **Hybrid Testing Capability (UI + API)**:
   * Includes API helpers (`src/api/`) to prep session data or inject products directly via backend calls (`/addtocart`), reducing test setup time for complex downstream scenarios.

5. **CI/CD Matrix Ready**:
   * Fully configured with GitHub Actions sharding, automated retry logic for CI environments, and multi-browser execution across Chromium, Firefox, and Mobile Safari (WebKit).

---

## 🚀 Steps to Execute the Demo Scripts

### Prerequisites

Ensure you have the following installed on your machine:
* **Node.js**: `v18.x` or `v20.x` LTS
* **npm**: `v9.x` or higher
* **Git**

---

### Step 1: Clone the Repository & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/gykudo/demoblaze.git
cd demoblaze

# Install project node modules
npm ci

# Install Playwright browser engines and system dependencies
npx playwright install --with-deps
```

---

### Step 2: Configure Environment (Optional)

Copy the example environment file if custom endpoints or variables are needed:

```bash
cp .env.example .env
```

---

### Step 3: Run the Automation Scripts

#### Option A: Run Full E2E Test Suite (Headless)
Runs all test specs in headless mode across Chromium, Firefox, and WebKit:

```bash
npx playwright test
```

#### Option B: Interactive Playwright UI Mode (Recommended for Demo Review)
Launches Playwright's visual UI mode to step through the execution visually, inspect snapshots, and time-travel debug:

```bash
npx playwright test --ui
```

#### Option C: Execute Specific Test Specs
Run only the core Login & Checkout demo flows:

```bash
# Run Login Suite (Happy Path, Negative, Edge cases)
npx playwright test tests/e2e/auth.spec.ts --project="Chromium - Desktop"

# Run Cart & Checkout E2E Demo Flow
npx playwright test tests/e2e/checkout.spec.ts --project="Chromium - Desktop"
```

#### Option D: Run Tests in Headed Mode (Watch Browser Action)
```bash
npx playwright test tests/e2e/checkout.spec.ts --headed
```

---

### Step 4: View Test Reports & Artifacts

After execution completes, launch the HTML report to review test results, trace files, network logs, and screenshots on failure:

```bash
npx playwright show-report
```

---

## ⚙️ CI/CD Execution (GitHub Actions)

The repository includes a ready-to-use GitHub Actions pipeline (`.github/workflows/regression.yml`) that automatically runs parallel matrix builds on every `push` or `pull_request` to `main`:

```yaml
name: Playwright E2E Regression Suite

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    name: Run Playwright Tests
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1/2, 2/2]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --shard=${{ matrix.shard }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-${{ strategy.job-index }}
          path: playwright-report/
          retention-days: 14
```
