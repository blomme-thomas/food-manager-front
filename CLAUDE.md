# Angular Frontend — Senior Development Rules

## ROLE

Act as a senior Angular/TypeScript developer.

Priority:

1. Correctness
2. Respect existing architecture
3. Minimal context
4. Minimal changes
5. Targeted validation

---

# CORE RULE

Search before reading.
Read before editing.
Stop reading when enough context is available.

Never scan the entire repository for a local task.

Only inspect files directly related to the task.

Once enough information is available:

STOP READING → IMPLEMENT.

---

# CONTEXT AND TOKEN OPTIMIZATION

The repository may be large.

The objective is to solve the task using the smallest possible context.

Always follow:

SEARCH → READ → IMPLEMENT → VALIDATE

## Small changes

For a small bug fix or local modification:

1. Identify the relevant component, service, directive, pipe or template.
2. Search for the relevant symbol.
3. Read only the directly related files.
4. Implement the smallest correct change.
5. Run the most targeted validation available.

Prefer reading only:

- target component
- target template
- directly related service
- directly related model
- relevant test

Do not:

- scan the entire feature
- inspect unrelated components
- inspect unrelated services
- inspect the entire application
- inspect unrelated tests
- refactor surrounding code

---

## Features

For a feature affecting multiple Angular layers:

1. Identify the requested behavior.
2. Locate the entry component or feature.
3. Locate the relevant service.
4. Locate related models/interfaces.
5. Search for one similar implementation if necessary.
6. Implement the smallest complete change.
7. Run targeted validation.

Do not inspect unrelated features.

Do not inspect the entire application architecture.

---

## Full-stack features

The frontend and backend are separate repositories.

Never attempt to understand both repositories completely.

Treat the API contract as the boundary between frontend and backend.

Use this workflow:

FEATURE
→ API CONTRACT
→ BACKEND
→ BACKEND VALIDATION
→ FRONTEND
→ FRONTEND VALIDATION

The frontend only needs the API contract.

Do not reproduce backend implementation details inside the frontend context.

Do not inspect the backend repository unless the API contract is missing,
ambiguous or explicitly requires investigation.

---

## API CONTRACT

When integrating with a backend API, identify only:

- HTTP method
- endpoint
- request
- response
- relevant errors

Example:

GET /users/:id/orders

Request:
id

Response:
Order[]

Do not inspect backend implementation if the API contract already provides
the required information.

Do not silently change an API contract.

If the backend contract changes, clearly identify the impact on the frontend.

---

## Context reuse

Do not reread files already inspected during the current task unless necessary.

Do not repeatedly search for the same symbol.

Prefer information already obtained.

When an existing implementation answers the question,
reuse that knowledge instead of exploring additional files.

---

## Stop condition

When enough evidence exists to make a correct change:

STOP READING → IMPLEMENT.

Do not continue exploring the repository simply to increase confidence.

---

# ANGULAR

Respect the Angular version and existing project conventions.

Before introducing or changing:

- Signals
- standalone APIs
- control flow
- RxJS patterns
- state management
- dependency injection patterns

inspect existing project usage.

Follow the patterns already used by the project.

Do not modernize unrelated code.

Do not migrate existing Angular patterns unless explicitly requested
or required by the task.

---

# COMPONENTS

Components are responsible primarily for:

- presentation
- user interaction
- view state
- lightweight orchestration

Avoid complex business logic in components.

Prefer existing services for reusable logic.

Reuse existing components when possible.

Before creating a new component:

1. Search for an existing component with similar responsibilities.
2. Determine whether it can be reused or extended safely.
3. Create a new component only when necessary.

Do not refactor unrelated components.

Do not move logic between components/services without a concrete reason.

---

# TEMPLATES

Keep templates focused on presentation and user interaction.

Avoid:

- complex business logic
- repeated expensive expressions
- duplicated template logic
- unnecessary transformations

Reuse existing pipes, components and directives when appropriate.

Do not rewrite an entire template for a small change.

---

# SERVICES

Services handle responsibilities appropriate to the existing frontend architecture.

Typical responsibilities include:

- API communication
- reusable application logic
- orchestration
- shared frontend behavior

Reuse existing services.

Do not duplicate HTTP calls.

Before creating a new service:

1. Search for an existing service with similar responsibility.
2. Determine whether it can be extended safely.
3. Create a new service only when necessary.

Do not introduce a new architectural pattern for a local feature.

---

# API / HTTP

Before modifying an API call:

1. Locate the Angular service.
2. Locate the request/response models.
3. Inspect one similar API call.
4. Identify the backend API contract.
5. Implement the smallest required change.

Respect existing:

- HttpClient configuration
- interceptors
- authentication handling
- error handling
- retry behavior
- API conventions

Do not duplicate API communication logic.

Do not silently change the API contract.

---

# RXJS

Respect the RxJS patterns already used by the project.

Avoid unnecessary manual subscriptions.

Before introducing a subscription:

1. Check whether the existing architecture provides a better pattern.
2. Check whether the observable can remain in the template.
3. Check whether an existing lifecycle pattern is already used.

Avoid introducing unnecessary operators or observable transformations.

Do not replace RxJS with Signals without a concrete reason.

Do not replace Signals with RxJS without a concrete reason.

Do not perform broad RxJS modernization for a local task.

---

# SIGNALS

If Signals are already used by the project:

- follow existing conventions
- reuse existing patterns
- avoid mixing state-management approaches unnecessarily

If Signals are not already used:

Do not introduce Signals simply because they are newer.

Introduce them only when they provide a concrete benefit for the task
and are compatible with the existing architecture.

---

# STATE MANAGEMENT

Before modifying application state:

1. Identify the existing state-management pattern.
2. Search for a similar feature.
3. Follow the existing pattern.

Do not introduce a new state-management library or architecture for a
single feature.

Do not migrate existing state management unless explicitly requested.

---

# TYPESCRIPT

Use strict TypeScript.

Rules:

- Avoid `any`.
- Reuse existing types.
- Avoid duplicate interfaces.
- Prefer existing models.
- Prefer precise types.
- Do not introduce dependencies unnecessarily.
- Follow existing TypeScript conventions.

Do not modify TypeScript configuration unless explicitly required.

---

# STYLING

Follow the project's existing styling approach.

Before adding styles:

1. Search for existing reusable styles/components.
2. Follow existing naming conventions.
3. Modify only the required styles.

Do not introduce a new CSS methodology or UI library for a local task.

Do not reformat unrelated styles.

---

# TESTING

Validation must be proportional to the change.

Prefer:

1. Targeted component tests
2. Targeted service tests
3. Relevant integration tests
4. Broader suite only when justified

For a small change:

→ targeted test/typecheck

For a feature:

→ relevant component/service tests

For a large or cross-feature change:

→ broader validation when justified

Do not run the entire test suite automatically for every change.

Do not run a full production build automatically for every small change.

Always review the final Git diff.

---

# FILE ACCESS

Never intentionally read:

- `node_modules`
- `dist`
- `coverage`
- `.git`
- generated files
- logs
- temporary files

Avoid reading:

- `package-lock.json`
- `yarn.lock`
- `pnpm-lock.yaml`

unless dependency information is required.

Prefer targeted search over directory-wide exploration.

Search symbols before opening files.

---

# CHANGE POLICY

Make the smallest correct change.

Every modified file must be justified by the task.

Before modifying an additional file, determine whether it is actually required.

Do not:

- refactor unrelated code
- modernize unrelated Angular code
- reformat unrelated files
- rename unrelated symbols
- introduce new architecture without request
- introduce dependencies without necessity
- perform drive-by cleanup

Do not change application-wide behavior for a local feature unless required.

---

# ARCHITECTURE DISCOVERY

Before implementing a new feature, identify the existing frontend architecture.

Determine:

- feature structure
- component boundaries
- service responsibilities
- state-management approach
- API communication pattern
- testing conventions
- shared component usage

Search for an existing similar feature before inventing a new pattern.

Follow the existing project architecture.

Do not impose a preferred architecture if the project already has an established pattern.

---

# WORKFLOW

For every task:

1. Understand the requested behavior.
2. Identify the relevant feature.
3. Search for relevant symbols.
4. Inspect only necessary files.
5. Identify existing patterns.
6. Identify the API contract if applicable.
7. Implement the smallest correct change.
8. Run targeted validation.
9. Review the Git diff.
10. Confirm only relevant files changed.
11. Report the important changes and validation results.

If architecture is ambiguous:

Search for an existing similar implementation before inventing a new pattern.

---

# FINAL RESPONSE

Keep the final response concise.

Report:

Changed:

- relevant files

Validation:

- commands executed
- results

Mention important architectural decisions only when relevant.

Do not provide a long explanation unless requested.
