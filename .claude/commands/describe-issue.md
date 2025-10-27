---
description: Help create a well-structured GitHub issue description
args:
  - name: topic
    description: Brief description of what the issue is about
    required: true
---

Help me create a comprehensive GitHub issue description for: {{topic}}

**Step 1: Understand the Problem**
Ask me clarifying questions to gather essential information:
- What is the expected behavior?
- What is the actual (incorrect) behavior?
- When does this happen? (specific user actions, conditions, or scenarios)
- Is there an error message? If so, what is it?
- Which part of the application is affected? (specific pages, components, API endpoints)

**Step 2: Investigate the Codebase**
Based on the problem description:
1. Search for relevant files, components, or functions related to {{topic}}
2. Identify the code sections that might be involved
3. Look for similar patterns or related functionality
4. Check for recent changes that might have introduced the issue (git log)

**Step 3: Reproduce the Issue**
If possible:
- Outline the exact steps to reproduce the problem
- Note any specific conditions required (data state, user permissions, etc.)
- Identify if it's consistent or intermittent

**Step 4: Analyze Impact**
Determine:
- Severity: Is this blocking users? Is it a minor inconvenience?
- Scope: Does it affect all users or specific scenarios?
- Workarounds: Are there any temporary solutions?

**Step 5: Format the Issue**
Create a well-structured issue description with these sections:

```markdown
## Problem Description
[Clear, concise description of what's wrong]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Steps to Reproduce
1. [First step]
2. [Second step]
3. [...]

## Environment
- Page/Feature: [e.g., /clients/new]
- Related Components: [e.g., ClientForm, src/app/api/clients]

## Error Messages
[Any error messages or console output]

## Possible Cause
[Based on code investigation, suggest where the issue might be]

## Additional Context
[Screenshots, code snippets, or related issues]
```

**Step 6: Suggest Labels and Priority**
Recommend appropriate labels based on the issue type:
- Type: bug, enhancement, feature, documentation
- Priority: critical, high, medium, low
- Area: frontend, backend, api, database, ui/ux

**Output:**
Provide the complete formatted issue description ready to be posted on GitHub, along with:
- Recommended title (clear and concise)
- Suggested labels
- Any relevant code file references with line numbers

**Important:**
- Use actual code references from the codebase (file paths and line numbers)
- Include specific, actionable information
- Keep the description focused and clear
- If investigating reveals this isn't actually a bug, explain what's happening
