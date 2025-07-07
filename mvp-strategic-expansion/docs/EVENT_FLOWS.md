# Event Flows for Remote Configuration & Parental Dashboard

This document illustrates the core event-driven processes that power the remote-configuration dashboard, content moderation, and parental controls. Each flow is designed for safety, agility, and observability.

---

## 1. Feature-Flag Update Flow

```plaintext
[Admin User]
    │
    └──▶ Opens Dashboard UI
            │
            └──▶ Changes Feature-Flag Setting
                    │
                    └──▶ Sends Update Request → **Backend API**
                            │
                            ├─ Validates Request / AuthZ
                            ├─ Updates **Firebase Remote Config**
                            └─ Triggers Cloud Function → Notify Clients
                                        │
                                        └──▶ Mobile Apps fetch new config & apply changes
```

Key Points:
- Real-time or near-real-time toggling.
- Enables gradual rollout, A/B testing, and quick rollback.

---

## 2. Content-Moderation Workflow

```plaintext
[User Uploads Content]
    │
    └──▶ Content stored in **Firebase Storage**
            │
            └──▶ Trigger **AI Content-Scan** Cloud Function
                    │
                    ├─ If flags raised → Add to Moderation Queue
                    └─ Else → Auto-approve & publish

[Moderator or Parent]
    │
    └──▶ Views Moderation Queue in Dashboard
            │
            └──▶ Reviews content details & AI scan results
                    │
                    └──▶ Takes action (Approve / Reject) → Backend
                            │
                            ├─ Updates content status
                            └─ Notifies user of decision
```

Key Points:
- AI assists, humans decide.
- Parents have full oversight via dashboard.

---

## 3. Parental Account Monitoring & Notifications

```plaintext
[Child Account Activity]
    │
    └──▶ Events logged (uploads, comments, etc.)
            │
            └──▶ Cloud Function detects significant actions / flags
                    │
                    └──▶ Generates notification → Parent
                            │
                            └──▶ Parent views in dashboard **or** receives email / push
                                    │
                                    └──▶ Parent may take follow-up actions (contact support, restrict account)
```

Key Points:
- Ensures transparency and proactive safety.
- Supports legal & ethical compliance.

---

## 4. Remote-Configuration Rollback Flow

```plaintext
[Admin Detects Issue]
    │
    └──▶ Uses Dashboard → Roll back feature flag
            │
            └──▶ Backend updates **Firebase Remote Config**
                    │
                    └──▶ Cloud Function notifies clients
                            │
                            └──▶ Apps revert to last stable configuration
```

Key Points:
- Minimises downtime and negative user impact.
- Enables fast incident response and operational stability.

</rewritten_file> 