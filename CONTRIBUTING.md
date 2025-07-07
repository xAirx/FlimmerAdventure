# Contributing to Flimmer

This document outlines the development workflow, architectural principles, and release process for the Flimmer monorepo. Following these guidelines is essential for maintaining a clean, scalable, and stable codebase.

---

## 1. Branching Strategy: A Protected Main Branch

Our branching strategy is designed to ensure that `main` is always a stable, production-ready reflection of our deployed code. **Direct pushes to `main` are disabled.**

-   `main`: This branch is a direct mirror of what is in production. It is protected, and code only gets here after a formal release process.
-   `staging`: This branch is for pre-release validation. It should be a 1:1 match with the production environment. We deploy from `staging` to production after final QA.
-   `develop`: This is the primary integration branch. All feature branches are merged into `develop` after a successful code review. Nightly builds are deployed from here to a development environment.
-   `feature/*`: All new work (features, bug fixes) must be done on a branch off of `develop`.
    -   Good: `feature/add-login-button`, `fix/user-auth-bug`
    -   Bad: `my-branch`, `test`

---

## 2. The Development Lifecycle: From Idea to Production

1.  **Create a Branch**: Start all new work by branching off of `develop`.
    ```bash
    git checkout develop
    git pull
    git checkout -b feature/my-cool-feature
    ```

2.  **Implement & Add a Changeset**: Make your code changes. Before you commit, create a changeset to document the version bump and changelog entry.
    ```bash
    pnpm changeset
    ```

3.  **Open a Pull Request**: Push your branch and open a PR against the `develop` branch. The PR must be reviewed and approved by at least one other team member.

4.  **Merge to `develop`**: Once approved and all CI checks have passed (linting, testing, security scans), the PR is merged into `develop`.

5.  **Promote to `staging`**: On a regular cadence (e.g., at the end of a sprint), a release manager will create a PR from `develop` into `staging`. This kicks off the pre-release process.

6.  **Release from `staging`**:
    -   After the `staging` PR is merged, the **"Version Packages"** PR (created automatically by our Changesets GitHub Action) is reviewed and merged.
    -   This final merge to `main` triggers a GitHub Action that **publishes the new package versions to npm** and deploys the new code to production.

---

## 3. The Engineering Culture: Curiosity & Continuous Learning

-   **Psychological Safety**: We foster an environment where it is safe to ask questions, challenge ideas (respectfully), and admit mistakes. Errors are learning opportunities, not reasons for blame.
-   **Knowledge Sharing**: Developers are encouraged to document their work, share interesting findings in team channels, and participate in peer code reviews.
-   **Dedicated Learning Time**: We encourage engineers to spend a portion of their time exploring new technologies, reading technical blogs, or working on passion projects that could benefit the platform. A "Continuous Learning" Slack channel is available for sharing these explorations.
-   **No "Brilliant Jerks"**: We value collaboration and humility over individual genius. The success of the team and the stability of the platform are our primary goals.

---

## 4. Monorepo Philosophy

This project is a `pnpm` workspace-based monorepo. It contains several independent packages that work together to form the complete Flimmer ecosystem.

-   `/apps`: Contains our deployable applications (`nextjs-poc`, `flimmer-mobile`).
-   `/packages`: Contains shared code intended to be used by one or more applications (`shared-types`, `shared-ui`).

The primary benefit of this structure is **code reuse** and **consistency**.

## 5. Independent Versioning & Release Process

Every package in this monorepo is versioned and published independently. This allows us to update a shared library without forcing a new release of every application that uses it.

We use **Changesets** to manage this process.

### The Release Workflow:

1.  **Make Your Code Changes**: Implement your feature or bug fix in the relevant package(s).

2.  **Create a Changeset**: Before committing your code, run the following command:
    ```bash
    pnpm changeset
    ```
    This will ask you a series of questions to determine which packages need a version bump (`major`, `minor`, or `patch`) and to generate a changelog entry. This creates a new `.md` file in the `.changeset` directory.

3.  **Commit Everything**: Add your code changes *and* the new changeset file to your commit.
    ```bash
    git add .
    git commit -m "feat: add new login button"
    ```

4.  **Open a Pull Request**: When your PR is merged into `main`, a GitHub Action will automatically run.

5.  **The "Version Packages" PR**: The action will detect the new changeset files, update the `package.json` versions of the affected packages, update the changelogs, and then open a *new* pull request titled "Version Packages".

6.  **Publishing to npm**: Once the "Version Packages" PR is reviewed and merged, another GitHub Action will automatically publish the newly versioned packages to the npm registry.

---

## 6. UI Component Development

For the MVP, all UI components are developed directly within the `flimmer-mobile` application. We use **Storybook** as a development environment to build and test components in isolation.

-   **Running Storybook**: To view and develop components, run the following command:
    ```bash
    pnpm --filter flimmer-mobile storybook
    ```
-   **Creating Components**: New components should be created in the `flimmer-mobile/src/components` directory, with their corresponding test and story files.

---

## 7. Testing Strategy

We follow the "testing pyramid" to ensure confidence without sacrificing speed.

-   **Unit Tests**:
    -   **Location**: Live alongside the components they test (e.g., inside `packages/shared-ui`).
    -   **Purpose**: Test a single component in complete isolation.
    -   **Technology**: Jest, React Testing Library.

-   **Integration Tests**:
    -   **Location**: Live inside the applications that consume the code (`apps/nextjs-poc`, `apps/flimmer-mobile`).
    -   **Purpose**: Test how components and services interact. (e.g., "Does clicking the button call the correct API hook?").
    -   **Technology**: Jest, Mock Service Worker.

-   **End-to-End (E2E) Tests**:
    -   **Location**: Live inside the applications.
    -   **Purpose**: Simulate a full user journey in a real-like environment.
    -   **Technology**: Detox (for Mobile), Cypress (for Web).

---

## 8. Getting Started

1.  **Clone the repo.**
2.  **Install dependencies from the root**: `pnpm install`
3.  **Run an application**: `pnpm --filter nextjs-poc dev`
4.  **Run a shared package's Storybook**: `pnpm --filter @flimmer/shared-ui storybook` 