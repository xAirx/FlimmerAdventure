# Trust & Safety Architecture: A Two-Pronged Defense

The safety of the children on our platform is our single most important responsibility. This document outlines our comprehensive, two-pronged strategy for preventing and mitigating the risk of harmful content, including CSAM (Child Sexual Abuse Material).

Our approach is built on two foundational pillars: **Drastically Reducing Anonymity** and **Automated, Real-Time Content Analysis**.

---

## Pillar 1: Drastically Reducing Anonymity via Identity Verification

The primary vector for malicious activity online is anonymity. Our first and most powerful line of defense is to require all adults on our platform to verify their real-world identity.

**Implementation:**
-   We will leverage our **Firebase + Auth0** authentication stack to integrate with national digital identity systems like Denmark's **NemID/MitID**.
-   Parents will be required to complete this verification process to unlock full platform functionality.
-   Verified parents will be clearly marked with a "Verified" badge throughout the platform.

**The Strategic Impact:**
-   **Deterrence**: Bad actors are significantly less likely to engage in harmful activity when their real-world identity is tied to their account.
-   **Accountability**: In the event of a security incident, we have a clear, verifiable link to a real person, which can be provided to law enforcement upon a legal request.
-   **Trust**: This is the single most powerful feature for building trust with parents. It demonstrates a profound and expensive commitment to the safety of their children.

---

## Pillar 2: Automated, Real-Time Content Analysis

The second pillar of our defense is to technologically prevent harmful content from ever being stored or distributed on our platform.

**Implementation:**
-   We will leverage a world-class, "headless" AI service for content moderation: **Google Cloud Vision API** and its **Safe Search** feature.

**The Technical Workflow:**
1.  **Isolated Upload**: When any user (child or parent) uploads an image or video, it is initially saved to a temporary, isolated "pending" bucket in Cloud Storage. This content is not yet associated with any user account in our database and is not accessible to anyone.
2.  **Trigger Cloud Function**: This upload event automatically triggers a dedicated "Trust & Safety" Cloud Function.
3.  **Real-time AI Scan**: The function immediately sends the content to the **Google Cloud Vision API**. The API analyzes the content and returns a verdict, flagging it for explicit, violent, or other sensitive content categories with a high degree of accuracy.
4.  **Automated Action (The "Circuit Breaker")**:
    -   **If Flagged as Harmful**: The Cloud Function **immediately and permanently deletes** the content from the "pending" bucket. It never touches our main storage. A high-severity alert is logged for our internal Trust & Safety team, and the user's account can be automatically flagged or suspended pending a human review.
    -   **If Clean**: Only after being cleared by the AI scan is the content moved to our main "approved" storage bucket and entered into the normal parental moderation queue.

### Why This Architecture is Correct:

-   **Preemptive Deletion**: Harmful content is deleted *before* it is ever stored or distributed, minimizing risk and liability.
-   **No Human Exposure (for CSAM)**: By using an automated system, we protect our own human moderators from being exposed to potentially illegal and traumatic material, which is a critical ethical consideration.
--   **Scalability**: This serverless, event-driven architecture scales infinitely. It can handle one upload or one million uploads with the same level of security and performance.

By combining robust **Identity Verification** with automated, best-in-class **Content Analysis**, we have created a professional, scalable, and defensible Trust & Safety system that is foundational to our mission and our business. 