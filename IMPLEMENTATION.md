# Locked MVP Scope

## Core MVP principle

The application must provide a useful, working education-resource solution even when the AI service, backend, or MongoDB is unavailable.

AI chatbot/recommendations are an optional enhancement only.

## Mandatory MVP requirements

| Requirement | MVP implementation |
|---|---|
| 1. Landing page | EduLanka Hub home page with hero section, value statement, and calls to action |
| 2. Sri Lankan problem explanation | In-app section explaining scattered and difficult-to-access learning resources for Sri Lankan students |
| 3. Two functional features | Resource search/filtering and saved resources |
| 4. User-input form | “Find learning resources” recommendation form |
| 5. Validation | Required fields, valid hour range, and friendly error messages |
| 6. Information processing | Search, filter, sort, and recommendation matching |
| 7. Responsive interface | Mobile-first responsive React interface |
| 8. Navigation | Home, Resources, Recommendations, and About/Impact sections |
| 9. Sample data | Sri Lankan-relevant resources for A/L, O/L, university, English, Sinhala, and Tamil learners |
| 10. Demonstrated value | User can find and save suitable resources in less than one minute |

## MUST HAVE features

1. Responsive landing page.
2. Problem and solution explanation inside the application.
3. Resource catalogue with at least eight sample resources.
4. Search by title, description, or subject.
5. Filters for:
   - Subject
   - Education level
   - Language
   - Resource type
6. Resource detail display.
7. Save and remove resources using `localStorage`.
8. Recommendation form.
9. Client-side form validation.
10. Friendly validation and empty-state messages.
11. Basic navigation.
12. Mobile and desktop layouts.
13. Local recommendation matching based on the form values.
14. No authentication required.
15. No backend required for the core MVP.

## OPTIONAL AI enhancement

If time remains, add:

- AI chatbot for study questions.
- AI-generated study recommendations.
- Backend proxy using Express and Render.

The application must still work if:

- The AI API key is missing.
- Render is unavailable.
- MongoDB is unavailable.
- The user is offline after the initial page load.

The local recommendation engine is the required implementation. AI must enhance it, not replace it.

## Explicitly excluded

- Authentication.
- User accounts.
- Admin dashboard.
- Payments.
- Native mobile application.
- Real-time messaging.
- Mandatory MongoDB persistence.
- Complex machine-learning recommendation models.
- External API dependency for sample resources.

# Four independent implementation parts

## Part 1 — Resource Catalogue and Filtering

### Owner

Developer 1

### Goal

Allow users to browse, search, filter, and view relevant education resources.

### Responsibilities

- Create at least eight realistic sample resources.
- Build resource cards.
- Implement search.
- Implement subject, level, language, and type filters.
- Build resource details.
- Add empty results state.

### Files

```text
frontend/src/data/resources.js
frontend/src/pages/Resources.jsx
frontend/src/components/ResourceCard.jsx
frontend/src/components/ResourceFilters.jsx
```

### Interface

```js
{
  id,
  title,
  description,
  subject,
  level,
  language,
  type,
  provider,
  url,
  tags
}
```

### Dependencies

None, except shared CSS conventions.

### Acceptance criteria

- Eight or more resources are visible.
- Search works.
- All filters work.
- Resource details can be viewed.
- Empty results are handled clearly.

---

## Part 2 — Saved Resources

### Owner

Developer 2

### Goal

Allow students to save useful resources for later access.

### Responsibilities

- Build save/remove controls.
- Store saved resources in `localStorage`.
- Create saved-resources view or filter.
- Handle empty saved state.
- Preserve saved resources after refresh.

### Files

```text
frontend/src/hooks/useSavedResources.js
frontend/src/utils/storage.js
frontend/src/components/SaveButton.jsx
frontend/src/pages/SavedResources.jsx
```

### Interface

```js
saveResource(resource)
removeResource(resourceId)
isSaved(resourceId)
getSavedResources()
```

### Dependencies

Part 1 resource object contract.

### Acceptance criteria

- Users can save a resource.
- Users can remove a resource.
- Saved resources remain after refresh.
- Empty saved state is friendly and understandable.

---

## Part 3 — Recommendation Form and Local Matching

### Owner

Developer 3

### Goal

Collect student preferences and recommend suitable resources without requiring AI or a backend.

### Responsibilities

- Build recommendation form.
- Validate all fields.
- Display friendly errors.
- Match form values against local resource data.
- Display recommended resources.
- Add loading or processing state.
- Optionally connect to AI later.

### Files

```text
frontend/src/pages/Recommendations.jsx
frontend/src/components/RecommendationForm.jsx
frontend/src/components/RecommendationResults.jsx
frontend/src/utils/validation.js
frontend/src/utils/recommendationEngine.js
```

### Form contract

```js
{
  subject,
  level,
  language,
  goal,
  availableHours
}
```

### Required validation

- Subject is required.
- Level is required.
- Language is required.
- Goal must contain at least 10 characters.
- Available hours must be between 1 and 24.

### Dependencies

Part 1 resource data contract.

### Acceptance criteria

- Form accepts valid input.
- Invalid input shows friendly messages.
- Recommendations are generated locally.
- Results are relevant to selected subject, level, or language.
- The feature works without an API call.

---

## Part 4 — Application Shell, Landing Page, Navigation, and Quality

### Owner

Developer 4

### Goal

Create the complete user-facing application shell and verify the mandatory requirements.

### Responsibilities

- Create React/Vite project structure.
- Build landing page.
- Explain the Sri Lankan problem.
- Explain the solution’s value.
- Build navigation.
- Configure routes or section navigation.
- Create shared responsive styles.
- Perform integration testing.
- Prepare README and demonstration flow.
- Add optional chatbot only after all mandatory requirements work.

### Files

```text
frontend/src/App.jsx
frontend/src/main.jsx
frontend/src/pages/Home.jsx
frontend/src/components/Navbar.jsx
frontend/src/components/ImpactSection.jsx
frontend/src/styles/index.css
README.md
```

### Required navigation

```text
/                 Home
/resources        Resources
/saved            Saved Resources
/recommendations  Recommendations
```

### Acceptance criteria

- Landing page clearly explains the local problem.
- Navigation works.
- All pages are responsive.
- The application visibly demonstrates value to Sri Lankan students.
- All ten mandatory requirements can be demonstrated.
- README documents team contributions and AI usage.

# Optional AI implementation

Only begin this after the mandatory MVP is complete.

## Optional files

```text
backend/server.js
backend/src/routes/aiRoutes.js
backend/src/services/aiService.js
frontend/src/pages/Chatbot.jsx
frontend/src/components/ChatWindow.jsx
```

## Optional rule

If the AI feature is incomplete, remove it from the final navigation rather than allowing it to break the core application.

# Revised acceptance criteria

The MVP is complete when a user can:

1. Open the landing page.
2. Understand the Sri Lankan education-access problem.
3. Navigate to the resource catalogue.
4. Search for a resource.
5. Filter resources.
6. Open resource details.
7. Save a resource.
8. Refresh and confirm the resource remains saved.
9. Submit the recommendation form.
10. Receive locally generated recommendations.
11. See friendly validation errors for invalid input.
12. Use the application on desktop and mobile.
13. Understand how the application benefits Sri Lankan students.

AI, MongoDB, and the backend are enhancements and are not required for MVP acceptance.