# Developer Onboarding

Welcome to the Flimmer team! This document is your guide to getting set up, understanding our culture, and making your first contribution.

---

## 1. Your First Day: Setup & Installation

Our goal is to get you from a fresh clone to a running application in under 30 minutes.

**Step 1: Clone the Repository**
```bash
git clone <repository-url>
cd flimmer-challenge
```

**Step 2: Install Dependencies**
This is a `pnpm` workspace. All commands should be run from the root of the project unless otherwise specified.
```bash
pnpm install
```
This single command will install all dependencies for all packages in the monorepo.

**Step 3: Run the Applications**
You can run each application independently.

*   **To run the Web Dashboard:**
    ```bash
    pnpm --filter nextjs-poc dev
    ```
    This will be available at `http://localhost:3000`.

*   **To run the Mobile App:**
    ```bash
    pnpm --filter flimmer-mobile start
    ```
    Scan the QR code with the Expo Go app on your device.

---

## 2. Core Technologies & Architecture

Before diving into the code, it's important to understand our technical foundation. Please review these key documents to get up to speed:

1.  **[Overall Strategy](./README.md)**: Understand the "why" behind our product.
2.  **[System Architecture](./docs/architecture.md)**: See how our services fit together.
3.  **[Real-Time Sync Model](./docs/real-time-sync.md)**: Learn how we keep our clients synchronized.
4.  **[Testing Strategy](./docs/testing-strategy.md)**: Understand our approach to quality.

---

## 3. Your First Contribution: The Workflow

We have a well-defined process for contributing code. This ensures stability and maintainability.

**Please read the [CONTRIBUTING.md](../CONTRIBUTING.md) document thoroughly.** It contains our branching strategy, PR process, and release workflow with Changesets.

**Your first task will be to pick up a "good first issue" from the backlog, create a `feature/*` branch, and submit a pull request against the `develop` branch.**

---

## 4. Our Engineering Culture: How We Work

Technology is only half the story. Our culture is what makes our team effective and our work enjoyable.

-   **Curiosity and Continuous Learning**: We are a team of learners. We are not afraid to say "I don't know," and we are always encouraged to explore new ideas. We have a dedicated Slack channel (`#continuous-learning`) for sharing articles, videos, and interesting projects.
-   **Pragmatism Over Dogma**: We choose the right tool for the job. While we have established patterns, we are always open to new approaches if they can solve a problem more effectively.
-   **Psychological Safety**: This is a safe space to experiment, fail, and learn. We conduct blameless post-mortems for any incidents to focus on improving the system, not on blaming individuals.
-   **Ownership and Autonomy**: We trust our engineers to take ownership of their work from idea to deployment. You are responsible for the quality, testing, and documentation of your features.
-   **Respect and Collaboration**: We treat each other with respect, communicate openly, and value collaboration. Code reviews are a dialogue aimed at making the code better, not a judgment of the author.

---

We are thrilled to have you on the team and look forward to seeing what you build! 