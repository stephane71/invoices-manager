---
description: Fetch a GitHub issue, create a branch, work on it, and prepare for PR
args:
  - name: issue_number
    description: The GitHub issue number to work on
    required: true
---

Work on GitHub issue #{{issue_number}} with full automation:

**Step 1: Fetch the issue**
Use `gh issue view {{issue_number}} --repo stephane71/invoices-manager --json title,body,labels,assignees,number` to get the issue details.

**Step 2: Create a feature branch**
- Check current git status
- Ensure working directory is clean (stash if needed)
- Determine branch prefix based on issue labels:
  - If labels contain "bug" or "fix": use "fix/"
  - If labels contain "feature" or "enhancement": use "feat/"
  - If labels contain "docs" or "documentation": use "docs/"
  - Otherwise: use "feature/"
- Create branch name from issue title (lowercase, spaces to hyphens, remove special chars)
- Format: `<prefix>/issue-{{issue_number}}-<sanitized-title>`
- Create and checkout the new branch

**Step 3: Create a todo list and implement**
1. Create a detailed todo list based on the issue requirements
2. Analyze the codebase to understand what needs to be changed
3. Implement the required changes following the project's coding standards
4. Run tests if available (npm test, yarn test, etc.)
5. Fix any issues that arise during testing

**Step 4: Commit changes**
- Stage all relevant changes
- Create a commit message following conventional commits format:
  - Format: `<type>(#{{issue_number}}): <description>`
  - Include reference: "Closes #{{issue_number}}" in commit body
  - Add Claude Code attribution

**Step 5: Push and create PR**
- Push the branch to origin
- Create a PR using `gh pr create` with:
  - Title: Same as commit message
  - Body including:
    - Summary of changes
    - Link to issue: "Closes #{{issue_number}}"
    - Test plan
    - Claude Code attribution
- Return the PR URL to the user

**Important notes:**
- If the issue references specific files, search for them first
- Ask for clarification if the issue requirements are unclear
- Do not push or create PR if tests fail
- Inform the user of any blockers or decisions needed