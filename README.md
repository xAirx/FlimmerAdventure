# Flimmer Family Safety Platform

**A proactive family safety platform to prevent digital risks before they happen.**

---

## The Core User Journey: A Virtuous Cycle

This diagram illustrates the complete, end-to-end user journey that defines our platform. It is a virtuous cycle of **Curation, Engagement, Creation, and Moderation**.

```
+--------------------------------+
|   Admin Experience (Web)       |
|--------------------------------|
| 1. Curate Content & Add Quiz   |
|      |                         |
|      v                         |
| [Publish to Remote Config]     |
+--------------------------------+
             |
             | (Content is updated in the app)
             v
+--------------------------------+
|   Child Experience (Mobile)    |
|--------------------------------|
| 2. Watch Video & Take Quiz     |
|      |                         |
|      v                         |
| 3. Accept Challenge & Upload   |
+--------------------------------+
             |
             | (Upload triggers a notification)
             v
+--------------------------------+
|   Parent Experience (Web/Mobile)|
|--------------------------------|
| 4. Review & Approve Content    |
+--------------------------------+
```

**The Flow:**
1.  **Curation**: An admin curates safe, engaging content via the web dashboard.
2.  **Engagement**: The child discovers and engages with this new content in the mobile app.
3.  **Creation**: Inspired by the content, the child uploads their own related photo.
4.  **Moderation**: The parent is notified in real-time and sees the child's creation appear in their approval queue.

This single flow demonstrates our entire technical architecture: a dynamic content system, a real-time data layer, and a seamless cross-platform experience.

---

## Philosophy for Building Exceptional Software

-   **Deliver Frequently**: Launch features in smaller increments to stay agile and adapt quickly.
-   **User-Centered**: Focus on delivering tangible value for end users at every release.
-   **Preemptive Error Detection**: Identify and address potential issues before they become critical.
-   **Maintain Code Integrity**: Fix small issues early to prevent big problems later.
-   **Efficient Testing**: Implement automated, fast, and reliable tests that catch errors early.
-   **Keep It Simple**: Strive for straightforward, maintainable solutions that stand the test of time.
-   **Continuous Learning**: Believe in ongoing reading, experimentation, and exploring new ideas for growth.

> "The journey in programming never ends—growth comes from pushing boundaries and exploring unfamiliar territory."

---

## Feature Matrix

This table provides a high-level overview of the features implemented across the Flimmer ecosystem.

| Feature | Web Admin Dashboard | Parent Web View | Mobile App (Parent) | Mobile App (Child) | Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **User Authentication** | - | Login | Login / Role Selection | Login / Role Selection | **Done** |
| **Admin Dashboard** | ✅ | - | - | - | **Done** |
|  - Tabbed Interface | ✅ | - | - | - | **Done** |
|  - Operations (Users & Moderation) | ✅ | - | - | - | **Done** |
|  - Product (A/B Tests & Flags) | ✅ | - | - | - | **Done** |
|  - Platform (Versions & Settings) | ✅ | - | - | - | **Done** |
|  - Security (Snyk & Health) | ✅ | - | - | - | **Done** |
|  - Business (SaaS & Contracts) | ✅ | - | - | - | **Done** |
|  - API Documentation | ✅ | - | - | - | **Done** |
| **Parental Controls** | - | ✅ | ✅ | - | **Done** |
|  - Child Management | - | ✅ | ✅ | - | **Done** |
|  - Content Approval Queue | - | ✅ | ✅ | - | **Done** |
|  - Subscription Management | - | ✅ | ✅ | - | **Done** |
| **Child Interface** | - | - | - | ✅ | **Done** |
|  - Content Upload Workflow | - | - | - | ✅ | **Done** |
|  - Safety Notices | - | - | - | ✅ | **Done** |
| **Real-time Sync** | ✅ | ✅ | ✅ | ✅ | **Done** |
| **GDPR Privacy Modal** | - | - | ✅ | ✅ | **Done** |
| **Analytics Dashboard** | ✅ | - | - | - | **Done** |
|  - Revenue & Financials | ✅ | - | - | - | **Done** |

---

## Core Components

The platform is divided into three main components:

| Component | Description | Key Technologies |
| :--- | :--- | :--- |
| 📱 **Mobile App** | The primary interface for parents and children. Features real-time monitoring, content creation, and safety alerts. | React Native, Expo, TypeScript |
| 💻 **Web Dashboard** | An advanced web app for platform administrators and detailed parental management. | Next.js, Tailwind CSS, Tremor |
| 📚 **Strategy Docs** | The complete business and technical framework, including architecture, roadmap, and compliance strategy. | Markdown, Mermaid |

---

## 🚀 One-Command Demo

Get the entire ecosystem running with a single command.

```bash
# Ensure you are in the project root directory
./demo-quick-start.sh for easy start or try ./scripts.sh for more fine grained control of the monorepo
```

**What this script does:**
1.  Checks for all required dependencies (Node, pnpm, Expo CLI).
2.  Installs all project packages.
3.  Builds the Next.js web dashboard for production.
4.  Launches both the web server (`http://localhost:3000`) and the Expo mobile server.

**After running the script:**
-   **Web:** Open `http://localhost:3000/dashboard` in your browser.
-   **Mobile:** Scan the QR code in your terminal with the Expo Go app on your phone.

---

## Why This Architecture?

Our architecture is designed to provide the best experience for each user on the most appropriate platform.

-   **Mobile-First for Families**: Daily interactions, real-time alerts, and on-the-go safety features are best suited for a mobile app.
-   **Web for Administration**: Complex data analysis, user management, and detailed configuration are more efficiently handled on a desktop interface.
-   **Seamless Sync**: A unified backend ensures data is always synchronized in real-time across both platforms, providing a consistent and reliable experience.

---

## Key Differentiators

| Traditional Apps | Flimmer Platform |
| :--- | :--- |
| Reactive (blocks bad content) | **Proactive** (prevents exposure to risk) |
| Basic, one-size-fits-all filters | **AI-powered behavioral analysis** |
| Single-platform solutions | **Cross-platform, real-time ecosystem** |
| Privacy as an afterthought | **GDPR-compliant, privacy-first design** |

---

## Documentation

-   **[Strategic Framework](./mvp-strategic-expansion/README.md)**: Our business plan, market positioning, and growth strategy.
-   **[System Architecture](./mvp-strategic-expansion/docs/ARCHITECTURE.md)**: A deep dive into our technical architecture, including real-time sync and dynamic content.
-   **[Testing Strategy](./mvp-strategic-expansion/docs/TESTING_STRATEGY.md)**: Our comprehensive approach to quality assurance.
-   **[Contribution & Release Guide](./CONTRIBUTING.md)**: How to contribute to the project, including our branching and release strategy.
-   **[Developer Onboarding](./mvp-strategic-expansion/docs/DEVELOPER_ONBOARDING.md)**: The starting guide for new engineers.
-   **[Authentication Strategy](./mvp-strategic-expansion/docs/AUTHENTICATION_STRATEGY.md)**: Our plan for user identity and verification.
-   **[Trust & Safety Framework](./mvp-strategic-expansion/docs/TRUST_AND_SAFETY.md)**: How we protect our users from harmful content.
-   **[Monetization Strategy](./mvp-strategic-expansion/docs/MONETIZATION_STRATEGY.md)**: Our plan for building a sustainable business.
-   **[Gamification Strategy](./mvp-strategic-expansion/docs/GAMIFICATION_STRATEGY.md)**: How we drive engagement by rewarding positive behavior.
-   **[Founding Engineer Proposal](./mvp-strategic-expansion/FOUNDING_ENGINEER_PROPOSAL.md)**: A template for discussing a founding engineer role.
-   **[Pre-Seed Strategy](./mvp-strategic-expansion/PRE_SEED_STRATEGY.md)**: A framework for pre-seed discussions.
