# Dynamic Content And Engagement Architecture

This document explains the architecture that allows the Flimmer team to dynamically update the content and interactive elements within the mobile app without requiring a new app store release. This is a critical system for keeping our users engaged and our content fresh.

---

## The Core Technology: Firebase Remote Config

The heart of this system is **Firebase Remote Config**. It is a cloud service that lets us store and manage key-value pairs (in our case, a large JSON object) that can be fetched and used by our mobile app on launch.

By changing the values in Remote Config, we can change the app's behavior and content on the fly.

---

## End-to-End Flow: Adding a Curated Video with a Quiz

This workflow allows a non-technical content manager to add a new video and an interactive quiz directly from our web admin dashboard.

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────┐    ┌─────────────────┐    ┌───────────────┐
│  Admin User │    │ Web Admin        │    │ Next.js API │    │ Firebase Remote │    │ Child's       │
│             │    │ Dashboard        │    │ (BFF)       │    │ Config          │    │ Mobile App    │
└─────────────┘    └──────────────────┘    └─────────────┘    └─────────────────┘    └───────────────┘
       │                      │                      │                      │                      │
       │                      │                      │                      │                      │
       │ 1. Fill "Add Video"  │                      │                      │                      │
       │    form (YouTube     │                      │                      │                      │
       │    URL + quiz)       │                      │                      │                      │
       ├─────────────────────▶│                      │                      │                      │
       │                      │                      │                      │                      │
       │                      │ 2. POST /api/admin/  │                      │                      │
       │                      │    content (new      │                      │                      │
       │                      │    video data)       │                      │                      │
       │                      ├─────────────────────▶│                      │                      │
       │                      │                      │                      │                      │
       │                      │                      │ 3. Fetch current     │                      │
       │                      │                      │    content JSON      │                      │
       │                      │                      ├─────────────────────▶│                      │
       │                      │                      │                      │                      │
       │                      │                      │                      │ 4. Return current    │
       │                      │                      │◀─────────────────────┤                      │
       │                      │                      │                      │                      │
       │                      │                      │ 5. Add new video to  │                      │
       │                      │                      │    JSON array &      │                      │
       │                      │                      │    push updated      │                      │
       │                      │                      │    config back       │                      │
       │                      │                      ├─────────────────────▶│                      │
       │                      │                      │                      │                      │
       │                      │                      │                      │ 6. Confirm update   │
       │                      │                      │◀─────────────────────┤                      │
       │                      │                      │                      │                      │
       │                      │ 7. "Content          │                      │                      │
       │                      │    Published!"       │                      │                      │
       │                      │◀─────────────────────┤                      │                      │
       │                      │                      │                      │                      │
       │ 8. Success message   │                      │                      │                      │
       │    displayed         │                      │                      │                      │
       │◀─────────────────────┤                      │                      │                      │
       │                      │                      │                      │                      │
       │                      │                      │                      │                      │
       │                      │                      │        ┌─────────────────────────────────┐  │
       │                      │                      │        │      On Next App Launch        │  │
       │                      │                      │        └─────────────────────────────────┘  │
       │                      │                      │                      │                      │
       │                      │                      │                      │ 9. Fetch latest    │
       │                      │                      │                      │    config           │
       │                      │                      │                      │◀─────────────────────┤
       │                      │                      │                      │                      │
       │                      │                      │                      │ 10. Return updated  │
       │                      │                      │                      │     content JSON    │
       │                      │                      │                      ├─────────────────────▶│
       │                      │                      │                      │                      │
       │                      │                      │                      │ 11. App dynamically │
       │                      │                      │                      │     renders new     │
       │                      │                      │                      │     video & quiz    │
       │                      │                      │                      │                      │
```

### Step-by-Step Explanation:

1.  **Admin Action**: A content manager uses the "Content Management" tab in our web dashboard to add a new video and a quiz.
2.  **API Call to BFF**: The dashboard sends this data to our Next.js BFF.
3.  **Fetch Current Config**: The BFF authenticates the request and then fetches the current JSON configuration file from Firebase Remote Config.
4.  **Update and Push Config**: The BFF adds the new video object to the JSON array and pushes the entire updated configuration back to Remote Config, overwriting the old one.
5.  **Mobile App Fetches on Launch**: The next time any user launches the Flimmer mobile app, it makes a call to Firebase Remote Config to fetch the latest configuration.
6.  **Dynamic Rendering**: The mobile app parses the JSON it receives and dynamically builds the UI based on its contents, showing the new video and making the quiz available.

### Why This Architecture is Powerful:

-   **No App Store Review Needed**: We can add, remove, or change content and quizzes daily without needing to submit a new version of our app to Apple or Google, which is a slow and unpredictable process.
-   **Empowers Non-Technical Teams**: Our content team can manage the app's core engagement loop without any developer intervention.
-   **A/B Testing**: Remote Config has built-in support for A/B testing, allowing us to test different videos or quizzes with different segments of our user base to see what is most effective.
-   **Instant Kill-Switch**: If a piece of content is found to be problematic, we can remove it from Remote Config, and it will disappear from all mobile apps on their next launch. This is a powerful safety feature. 