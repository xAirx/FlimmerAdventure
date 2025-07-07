# Testing Strategy

A robust testing strategy is crucial for ensuring platform reliability, maintaining user trust, and enabling rapid, confident development. This document outlines our multi-layered approach to quality assurance.

---

## The Testing Mindset: Building with Confidence

Testing is not a chore or an afterthought; it is an integral part of the development process. We view our test suite as a **safety net that enables speed and fearless refactoring.**

-   **Tests as a Tool**: Well-written tests allow us to make significant changes to the codebase with confidence, knowing that if we break something, the test suite will tell us immediately.
-   **TDD as a Goal**: While not strictly enforced, developers are encouraged to practice Test-Driven Development (TDD) where it makes sense, writing tests *before* the implementation to guide the design.
-   **Confidence, Not Coverage**: Our goal is not just to hit a coverage percentage, but to build a suite of tests that gives us genuine confidence in the reliability of our system. A test that passes but doesn't prevent a real-world bug is useless.

---

## The Testing Pyramid & Code Examples

We follow the principle of the testing pyramid. The majority of our tests are fast, cheap unit tests at the base, with fewer, more comprehensive end-to-end tests at the top.

```
      /\\
     /  \\
    / E2E \\
   /-------\\
  / Integration \\
 /---------------\\
/   Unit Tests    \\
-------------------
```

### **1. Unit Tests**
-   **Purpose**: Verify a single component or function in complete isolation.
-   **Location**: Live alongside the code they test. For our MVP, this means primarily inside `apps/flimmer-mobile/src/components`.
-   **Example**: Testing our `<Button />` component in the mobile app.

```tsx
// apps/flimmer-mobile/src/components/Button/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders the title correctly', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeDefined();
  });

  it('calls the onPress handler when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Click Me" onPress={onPressMock} />);
    
    fireEvent.press(getByText('Click Me'));
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
```

### **2. Integration Tests**
-   **Purpose**: Verify that several components or a component and a service layer hook work together correctly.
-   **Location**: Live inside the applications (`apps/nextjs-poc`, `apps/flimmer-mobile`).
-   **Example**: Testing that a UI component correctly calls our `useOperationsData` hook.

```tsx
// apps/nextjs-poc/src/components/OperationsTab.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { OperationsTab } from '../app/dashboard/page'; // Assuming component is accessible
import { useOperationsData } from '../lib/hooks';

// Mock the hook
jest.mock('../lib/hooks');

const mockUseOperationsData = useOperationsData as jest.Mock;

describe('OperationsTab', () => {
  it('displays a loading spinner while data is fetching', () => {
    mockUseOperationsData.mockReturnValue({ isLoading: true, error: null, data: null });
    render(<OperationsTab />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays an error message if the fetch fails', () => {
    mockUseOperationsData.mockReturnValue({ isLoading: false, error: new Error('Failed to fetch'), data: null });
    render(<OperationsTab />);
    expect(screen.getByText(/Failed to fetch/)).toBeInTheDocument();
  });

  it('renders the user data when the fetch is successful', () => {
    const mockData = {
        users: [{ id: '1', name: 'John Doe', email: 'john@doe.com' }],
        moderationQueue: [],
    };
    mockUseOperationsData.mockReturnValue({ isLoading: false, error: null, data: mockData });
    render(<OperationsTab />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### **3. End-to-End (E2E) Tests**
-   **Purpose**: Simulate a full user journey in a real-like environment.
-   **Location**: The test runners and configurations (`cypress.config.ts`, `detox.config.js`) live inside the applications they test.
-   **Shared Logic**: All shared test setup logic, such as API clients for creating test users or generating mock data, lives in the dedicated `packages/e2e-helpers` package. This keeps our tests DRY (Don't Repeat Yourself).
-   **Technology**: Detox (for Mobile), Cypress (for Web).
-   **Example Scenario**: "A user can log in, navigate to the parent dashboard, and successfully approve a pending video."

---

## CI/CD Quality Gates

Our CI pipeline (GitHub Actions) enforces these standards automatically. **A pull request cannot be merged unless:**
1.  All unit and integration tests pass.
2.  Code coverage meets or exceeds our 80% threshold.
3.  The Snyk security scan detects no new high-severity vulnerabilities.

---

## How Testing Delivers Business Value

Our commitment to this testing strategy is not just a technical detail; it directly supports our business goals:

-   **Reduces Risk**: By catching bugs before they reach production, we protect our users from data issues and our brand from reputational damage. A bug in a safety app is a critical failure of trust.
-   **Increases Development Velocity**: A comprehensive test suite acts as a safety net, allowing developers to refactor code and add new features with confidence, knowing that they won't accidentally break existing functionality. This leads to faster, more predictable release cycles.
-   **Improves User Trust**: A stable, reliable platform is fundamental to building trust with parents. Fewer crashes and a seamless user experience demonstrate our commitment to quality and professionalism.
-   **Lowers Long-Term Costs**: Fixing a bug in production is exponentially more expensive than catching it in development. Thorough testing reduces the time and resources spent on emergency fixes and customer support.

---

## Continuous Integration (CI)

Our CI pipeline, powered by GitHub Actions, automatically runs our entire test suite on every code change. A pull request cannot be merged unless all tests pass and the code coverage threshold is met, ensuring that no broken code ever reaches our main development branch.

## Beneficial Ideas for Future Testing

As the platform matures, we can enhance our strategy with more advanced techniques:

-   **Visual Regression Testing**: Automatically capture and compare screenshots of UI components to catch unintended visual changes. This is excellent for maintaining a consistent design system.
-   **Performance Testing**: Integrate tools like Lighthouse or WebPageTest into our CI pipeline to automatically test the performance of our web dashboard, ensuring it remains fast and responsive as we add new features.
-   **Chaos Engineering**: Intentionally inject failures into our pre-production environment (e.g., simulate a database outage) to test our system's resilience and ensure it can gracefully handle unexpected problems.

## Testing Types

- **Unit Testing:** Focus on individual components and functions to ensure correctness.  
- **Integration Testing:** Verify interactions between components and services.  
- **End-to-End (E2E) Testing:** Simulate real user scenarios to validate system workflows.  
- **Manual Testing:** Exploratory testing for UX and edge cases not covered by automation.

## Tools & Frameworks

- **Jest** for unit and integration tests.  
- **React Testing Library** for component testing.  
- **Cypress** (web) or **Detox** (mobile) for end-to-end tests.  
- **Firebase Test Lab** for device & compatibility testing.

## Test Coverage

- Target ≥80 % code-coverage, prioritising critical modules (auth, uploads, moderation).  
- Coverage thresholds enforced in CI to block regressions.

## Continuous Integration & Delivery

- All tests run automatically on PRs and pushes to `develop` / `main`.  
- CI fails builds on any test failure.  
- Canary releases & staged rollouts minimise production risk.

## Monitoring in Production

- **Firebase Crashlytics** & **Sentry** capture runtime errors.  
- Analytics & user-feedback dashboards identify gaps in testing.

## Test Data Management

- Use synthetic / anonymised datasets.  
- Regularly clean test artifacts to avoid storage bloat. 