# Real Time Synchronization Architecture

This document explains how the Flimmer platform achieves a seamless, real-time experience across the mobile app and the web dashboard. Our architecture ensures that actions taken on one device are instantly reflected on all other relevant devices without requiring manual refreshes.

---

## The Core Principle: Stale-While-Revalidate

We use a powerful data-fetching strategy called **Stale-While-Revalidate**, enabled by our service layer (React Query). In simple terms, this means:

1.  **Show Cached Data First**: The app immediately shows the data it already has stored locally (the "stale" data) to make the UI feel instant.
2.  **Refetch in the Background**: It then sends a request to the server to get the latest version of the data (the "revalidate" step).
3.  **Update if Necessary**: If the data has changed, the UI is automatically updated with the new information.

This provides the best of both worlds: a fast, responsive UI and data that is always up-to-date.

---

## Real-World Scenario: Child Uploads a Video

Let's walk through the end-to-end flow of our most critical real-time interaction.

```
┌───────────────┐    ┌─────────────┐    ┌─────────────────┐
│ Child's       │    │ Backend     │    │ Parent's App    │
│ Mobile App    │    │ (Next.js    │    │ (Web/Mobile)    │
│               │    │ API)        │    │                 │
└───────────────┘    └─────────────┘    └─────────────────┘
        │                     │                     │
        │                     │                     │
        │ 1. POST /api/       │                     │
        │    content/upload   │                     │
        │    (Video Details)  │                     │
        ├────────────────────▶│                     │
        │                     │                     │
        │ [Shows "Uploading   │                     │
        │  ..." state]        │                     │
        │                     │                     │
        │                     │ 2. Process upload   │
        │ 3. 200 OK           │    & validate       │
        │    (Upload          │                     │
        │    Accepted)        │                     │
        │◀────────────────────┤                     │
        │                     │                     │
        │ [Shows "Sent for    │                     │
        │  Approval!" msg]    │                     │
        │                     │                     │
        │                     │ 4. Invalidate       │
        │                     │    'contentQueue'   │
        │                     │    cache key        │
        │                     │                     │
        │                ┌────┴────┐                │
        │                │ CRITICAL│                │
        │                │  STEP:  │                │
        │                │ Backend │                │
        │                │ signals │                │
        │                │ data is │                │
        │                │  stale  │                │
        │                └─────────┘                │
        │                     │                     │
        │                     │                     │
        │          ┌──────────────────────────────┐ │
        │          │    IF Parent App is Active   │ │
        │          └──────────────────────────────┘ │
        │                     │                     │
        │                     │ 5. Auto-refetch     │
        │                     │    'contentQueue'   │
        │                     │    data             │
        │                     │◀────────────────────┤
        │                     │                     │
        │                     │ 6. Return updated   │
        │                     │    list with new    │
        │                     │    video            │
        │                     ├────────────────────▶│
        │                     │                     │
        │                     │                     │ [UI automatically
        │                     │                     │  updates to show
        │                     │                     │  new video in
        │                     │                     │  approval queue]
        │                     │                     │
        │          ┌──────────────────────────────┐ │
        │          │ IF Parent App in Background  │ │
        │          │                              │ │
        │          │ Next time parent opens app   │ │
        │          │ or navigates to dashboard,   │ │
        │          │ data will auto-refetch       │ │
        │          └──────────────────────────────┘ │
        │                     │                     │
```

### Step-by-Step Explanation:

1.  **Child Uploads Video**:
    *   The child, using the mobile app, provides a title for their video and taps "Send for Approval."
    *   The `ChildInterface` component calls the `useUploadContent()` hook.

2.  **API Call is Made**:
    *   React Query's `useMutation` hook sends a `POST` request to our Next.js backend at the `/api/content/upload` endpoint.
    *   The app's UI immediately updates to show a loading state.

3.  **Backend Invalidates Data Cache**:
    *   This is the most important part of the process. When the backend successfully processes the upload, it knows that the list of pending content has changed.
    *   It then invalidates the `contentQueue` data cache key across our system. This is a signal to all connected clients that their local version of this data is now out-of-date.

4.  **Parent's Dashboard Automatically Updates**:
    *   Any instance of the Flimmer app (web or mobile) that is currently subscribed to the `contentQueue` data (i.e., the Parent Dashboard) will detect the invalidation.
    *   React Query automatically triggers a background refetch for that data.
    *   When the fresh data arrives from the API, the parent's screen **automatically updates** to show the new video in the approval queue.

### Why This Architecture is Superior:

-   **No Manual Refreshing**: The parent never has to pull-to-refresh or click a "reload" button. The experience feels magical and instantaneous.
-   **Efficient**: We are not constantly streaming data. The data is only refetched when it is explicitly invalidated by a relevant event (like a new upload).
-   **Resilient**: If the parent's app is in the background or offline when the invalidation happens, React Query will automatically refetch the data the next time the app becomes active.
-   **Scalable**: This pattern scales beautifully. Whether there is one parent or one million, the invalidation mechanism remains the same, ensuring a consistent real-time experience for everyone. 