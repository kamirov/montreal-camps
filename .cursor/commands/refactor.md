# Code Refactoring Guide

Refactor this file without changing the UI or functionality—everything must behave and look exactly the same. Focus on improving code structure and maintainability only. Document the current functionality, ensure testing is in place, and proceed incrementally with no risks or regressions.

## Pre-Refactoring Checklist

1. **Understand Current Behavior**

   - Read through the entire file to understand its purpose and functionality
   - Identify all inputs, outputs, and side effects
   - Note any edge cases or special handling
   - Document the current behavior before making changes

2. **Verify Tests Exist**

   - Check if a `.spec.ts(x)` test file exists alongside the file
   - If no tests exist, write tests first to capture current behavior
   - Ensure tests pass before refactoring: `pnpm test`
   - Run with coverage to identify untested paths: `pnpm test:coverage`

3. **Check Dependencies**
   - Identify all files that import this file
   - Search for usage patterns across the codebase
   - Note any breaking changes that would affect consumers

## Refactoring Targets

### 1. Component Structure & Organization

- **Extract Components**: Break down large components (>200 lines) into smaller, focused components

  - Look for logical sections that can become separate components
  - Extract repeated JSX patterns into reusable components
  - Move sub-components to separate files if they're complex (>50 lines)

- **Server vs Client Components**:

  - Remove `'use client'` directive if component doesn't need:
    - React hooks (useState, useEffect, etc.)
    - Browser APIs (localStorage, window, etc.)
    - Event handlers (onClick, onChange, etc.)
  - Keep client components minimal—pass server-fetched data as props
  - Consider splitting: server component wrapper + small client component for interactivity

- **Component Props**:
  - Define explicit TypeScript types for all props (use `type`, not `interface`)
  - Destructure props at the function signature level
  - Group related props into objects if there are many (>5)
  - Use discriminated unions for variant props

### 2. Code Duplication & Reusability

- **Extract Repeated Logic**:

  - Move duplicated code blocks into utility functions
  - Create custom hooks for repeated stateful logic
  - Move shared constants to the top of the file or separate constants file
  - Extract repeated API calls into dedicated functions

- **Consolidate Similar Functions**:
  - Look for functions with similar patterns but different values
  - Parameterize differences instead of duplicating
  - Use function composition for related operations

### 3. Type Safety & Validation

- **Strengthen Types**:

  - Replace `any` types with specific types
  - Add missing return type annotations on functions
  - Use Drizzle's type inference: `typeof table.$inferSelect`
  - Define discriminated unions for complex state

- **Runtime Validation**:

  - Add Zod schemas for all external inputs (API requests, user input)
  - Validate at boundaries (API routes, form submissions)
  - Use type guards for runtime type checking
  - Leverage Zod's `.parse()` for throwing errors or `.safeParse()` for error handling

- **Null Safety**:
  - Use optional chaining (`?.`) and nullish coalescing (`??`)
  - Avoid non-null assertions (`!`) unless absolutely necessary
  - Add explicit null/undefined checks with proper error handling

### 4. State Management

- **Simplify State**:

  - Combine related state variables into single objects
  - Derive values instead of storing them in state
  - Move state down to the lowest common ancestor
  - Consider context for deeply nested prop drilling (>2 levels)

- **Optimize Re-renders**:
  - Use `useMemo` for expensive computations
  - Use `useCallback` for functions passed to child components
  - Split components to isolate frequently changing state
  - Avoid unnecessary object/array creation in render

### 5. Data Fetching & API Routes

- **Server Components**:

  - Prefer async Server Components over client-side fetching
  - Fetch data directly in the component, not in useEffect
  - Use Suspense boundaries for loading states
  - Transform data close to the source (database → API → component)

- **API Routes**:

  - Validate inputs at the start of route handlers
  - Use consistent error response format: `{ error: "message" }`
  - Return proper HTTP status codes (200, 400, 500)
  - Always wrap in try-catch blocks
  - Extract business logic into separate functions

- **Database Queries**:
  - Use transactions for related operations
  - Add proper indexes if queries are slow
  - Use soft deletes with `notDeleted()` helper where appropriate
  - Minimize round trips—fetch related data in one query when possible

### 6. Error Handling & Resilience

- **Comprehensive Error Handling**:

  - Wrap all async operations in try-catch
  - Log errors with context: `console.error('Failed to...', error)`
  - Provide user-friendly error messages
  - Handle specific error cases (network, validation, server)

- **Fail Fast**:

  - Validate inputs before processing
  - Throw early for invalid states
  - Avoid silent failures or default values masking errors
  - Return explicit error responses from APIs

- **Graceful Degradation**:
  - Provide fallback UI for error states
  - Use error boundaries for component errors
  - Consider retry logic for transient failures
  - Show loading states during async operations

### 7. Performance Optimization

- **Reduce Bundle Size**:

  - Use dynamic imports for large components: `const Comp = dynamic(() => import('./Comp'))`
  - Remove unused imports and dependencies
  - Avoid importing entire libraries when you only need specific functions

- **Optimize Rendering**:

  - Avoid inline object/function creation in JSX
  - Use keys properly in lists (stable, unique identifiers)
  - Debounce expensive operations (search, validation)
  - Virtualize long lists if needed

- **Image & Asset Optimization**:
  - Use Next.js `<Image />` component for images
  - Use Lucide icons instead of custom SVGs
  - Lazy load images below the fold

### 8. Code Readability & Maintainability

- **Naming Conventions**:

  - Use descriptive, intention-revealing names
  - Follow project conventions: PascalCase (components), camelCase (functions/variables)
  - Avoid abbreviations unless widely understood
  - Use consistent terminology across related files

- **Function Length & Complexity**:

  - Keep functions under 50 lines when possible
  - Extract complex conditional logic into named functions
  - Reduce nesting depth (max 3 levels)
  - Use early returns to avoid deep nesting

- **Comments & Documentation**:

  - Remove obvious comments that just restate the code
  - Add comments for non-obvious business logic
  - Document complex algorithms or workarounds
  - Use JSDoc for public API functions

- **File Organization**:
  - Group imports: React → third-party → local → types → styles
  - Order functions: public → private → helpers
  - Place types near where they're used
  - Keep related code close together

### 9. Testing Improvements

- **Test Coverage**:

  - Aim for 60%+ coverage on new/refactored code
  - Test happy paths and error cases
  - Test edge cases (empty arrays, null values, boundary conditions)
  - Use descriptive test names: `it('should...')`

- **Test Quality**:
  - Test behavior, not implementation details
  - Avoid testing internal state or private methods
  - Mock external dependencies (APIs, database)
  - Use test utilities for common setup

### 10. Styling & UI Consistency

- **TailwindCSS Best Practices**:

  - Use themed colors (primary, secondary, etc.) not direct colors
  - Extract repeated class combinations into components
  - Use responsive utilities consistently
  - Avoid plain CSS—stay in Tailwind

- **Component Consistency**:
  - Use existing ShadCN components before creating custom ones
  - Match patterns from similar components
  - Follow the editable input pattern (looks like plain text in edit/view modes)
  - Ensure dark mode compatibility

### 11. AI Integration Patterns

- **Structured Outputs**:

  - Always use Zod schemas with `generateObject()`
  - Use `AI_MODELS` constants instead of hardcoding model names
  - Use shared `openai` provider from `ai-config.ts`
  - Handle AI errors gracefully with fallbacks

- **Prompt Engineering**:
  - Be specific and explicit in prompts
  - Provide examples when possible
  - Request structured formats
  - Validate AI responses against schemas

## Refactoring Process

1. **Write/Update Tests First**

   - Capture current behavior in tests
   - Run tests to establish baseline: `pnpm test`
   - Verify all tests pass

2. **Make Small, Incremental Changes**

   - Refactor one concern at a time
   - Run tests after each change
   - Commit working changes frequently
   - If tests fail, revert and try smaller changes

3. **Verify No Regressions**

   - Run full test suite: `pnpm test`
   - Check test coverage: `pnpm test:coverage`
   - Run linter: `pnpm lint`
   - Build the project: `pnpm run build`
   - Manually test in UI if component is visual

4. **Review & Iterate**
   - Check if the refactoring achieved the goal
   - Look for additional improvement opportunities
   - Ensure code is more maintainable than before
   - Update documentation if needed

## Red Flags to Address

- Files over 300 lines (consider splitting)
- Functions over 50 lines (extract helpers)
- More than 3 levels of nesting (refactor logic)
- Commented-out code (delete it)
- TODO comments (address or create issues)
- Magic numbers/strings (extract as constants)
- Duplicate code blocks (DRY principle)
- Missing error handling
- Missing input validation
- Unused imports or code
- Any `any` types
- Non-null assertions (`!`)

## Final Checklist

- [ ] All tests pass: `pnpm test`
- [ ] Coverage remains ≥60%: `pnpm test:coverage`
- [ ] Linting passes: `pnpm lint`
- [ ] Build succeeds: `pnpm run build`
- [ ] UI looks and behaves identically
- [ ] No console errors or warnings
- [ ] Code is more readable than before
- [ ] No new technical debt introduced
