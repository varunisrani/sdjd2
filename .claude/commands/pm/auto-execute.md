---
description: Fully automated task execution - provide task description, AI handles everything
allowed_tools:
  - Task
  - Bash
  - Read
  - Grep
  - Glob
  - TodoWrite
  - AskUserQuestion
---

# Auto-Execute: Fully Automated Task Handler

Execute complete development workflows automatically using dedicated sub-agents for each step.

## Usage

```bash
/pm:auto-execute <task_description>
```

## What This Command Does

Orchestrates the complete CCPM workflow by spawning **13 specialized sub-agents** - one for each step:

1. **Planning Phase** (4 sub-agents)
   - Sub-agent 1: Generate PRD
   - Sub-agent 2: Parse PRD to Epic
   - Sub-agent 3: Decompose into tasks
   - Sub-agent 4: Sync to GitHub

2. **Execution Phase** (3 sub-agents)
   - Sub-agent 5: Analyze parallel streams
   - Sub-agent 6: Launch task agents
   - Sub-agent 7: Monitor progress

3. **Validation Phase** (3 sub-agents)
   - Sub-agent 8: Run tests
   - Sub-agent 9: Verify linting
   - Sub-agent 10: Check build

4. **Completion Phase** (3 sub-agents)
   - Sub-agent 11: Close GitHub issues
   - Sub-agent 12: Merge epic to main
   - Sub-agent 13: Generate completion report

**Total: 13 specialized sub-agents orchestrating your entire workflow!**

## Your Task - The Master Orchestrator

You are the **Master Orchestrator**. Your job:
1. Parse the task description
2. Create the 13-step todo list
3. Spawn a sub-agent for each step
4. Update todos as each agent completes
5. Coordinate between agents
6. Handle errors and provide final report

### STEP 1: Initialize & Parse Input

Extract the task description from the user's command.

Example:
- User types: `/pm:auto-execute Add dark mode support`
- Task description: `Add dark mode support`

Create a sanitized epic name:
- Lowercase the description
- Replace spaces with hyphens
- Remove special characters
- Max 50 characters

Example: `Add dark mode support` → `add-dark-mode-support`

Store this as: `EPIC_NAME`

### STEP 2: Create Master Todo List

Use TodoWrite to create the complete todo list with all 13 steps:

```json
[
  {
    "content": "Generate PRD from task description",
    "activeForm": "Generating PRD from task description",
    "status": "pending"
  },
  {
    "content": "Parse PRD to Epic",
    "activeForm": "Parsing PRD to Epic",
    "status": "pending"
  },
  {
    "content": "Decompose Epic into tasks",
    "activeForm": "Decomposing Epic into tasks",
    "status": "pending"
  },
  {
    "content": "Sync Epic and tasks to GitHub",
    "activeForm": "Syncing Epic and tasks to GitHub",
    "status": "pending"
  },
  {
    "content": "Analyze tasks for parallel execution",
    "activeForm": "Analyzing tasks for parallel execution",
    "status": "pending"
  },
  {
    "content": "Launch agents for all tasks",
    "activeForm": "Launching agents for all tasks",
    "status": "pending"
  },
  {
    "content": "Monitor agent progress",
    "activeForm": "Monitoring agent progress",
    "status": "pending"
  },
  {
    "content": "Run automated tests",
    "activeForm": "Running automated tests",
    "status": "pending"
  },
  {
    "content": "Verify linting",
    "activeForm": "Verifying linting",
    "status": "pending"
  },
  {
    "content": "Check build",
    "activeForm": "Checking build",
    "status": "pending"
  },
  {
    "content": "Close all GitHub issues",
    "activeForm": "Closing all GitHub issues",
    "status": "pending"
  },
  {
    "content": "Merge epic to main branch",
    "activeForm": "Merging epic to main branch",
    "status": "pending"
  },
  {
    "content": "Generate completion report",
    "activeForm": "Generating completion report",
    "status": "pending"
  }
]
```

### STEP 3: Execute All Steps Using Sub-Agents

Now execute each step by spawning a dedicated sub-agent using the Task tool.

---

## 📋 TODO 1: Generate PRD from task description

**Update todo:** Mark as `in_progress`

**Spawn Sub-Agent:**

Use Task tool:
```
subagent_type: "general-purpose"
description: "Generate PRD"
prompt: "Execute the /pm:prd-new command to generate a Product Requirements Document.

Epic name: {EPIC_NAME}
Task description: {TASK_DESCRIPTION}

Your job:
1. Use SlashCommand tool to run: /pm:prd-new {EPIC_NAME}
2. Collaborate with the user to brainstorm and create a comprehensive PRD
3. Ensure the PRD file is created at: .claude/prds/{EPIC_NAME}.md
4. The PRD should include:
   - Goals and objectives
   - User stories
   - Requirements
   - Technical approach

Return a concise summary:
- PRD file path
- Number of user stories created
- Key goals identified
- Status: SUCCESS/FAILED"
```

**After agent completes:**
- Update todo: Mark as `completed`
- Display: "✓ PRD created: .claude/prds/{EPIC_NAME}.md"

---

## 📋 TODO 2: Parse PRD to Epic

**Update todo:** Mark as `in_progress`

**Spawn Sub-Agent:**

Use Task tool:
```
subagent_type: "general-purpose"
description: "Parse PRD to Epic"
prompt: "Execute the /pm:prd-parse command to convert PRD into a technical epic.

Epic name: {EPIC_NAME}

Your job:
1. Use SlashCommand tool to run: /pm:prd-parse {EPIC_NAME}
2. Convert the PRD into a technical epic specification
3. Ensure the epic file is created at: .claude/epics/{EPIC_NAME}/epic.md
4. The epic should include:
   - Architecture decisions
   - Milestones
   - Technical implementation strategy
   - Success criteria

Return a concise summary:
- Epic file path
- Architecture chosen
- Number of milestones
- Status: SUCCESS/FAILED"
```

**After agent completes:**
- Update todo: Mark as `completed`
- Display: "✓ Epic created: .claude/epics/{EPIC_NAME}/epic.md"

---

## 📋 TODO 3: Decompose Epic into tasks

**Update todo:** Mark as `in_progress`

**Spawn Sub-Agent:**

Use Task tool:
```
subagent_type: "general-purpose"
description: "Decompose Epic"
prompt: "Execute the /pm:epic-decompose command to break the epic into tasks.

Epic name: {EPIC_NAME}

Your job:
1. Use SlashCommand tool to run: /pm:epic-decompose {EPIC_NAME}
2. Break the epic into < 10 manageable tasks
3. Create task files: .claude/epics/{EPIC_NAME}/001.md, 002.md, etc.
4. Each task should have:
   - Name and description
   - Acceptance criteria
   - Dependencies (depends_on field)
   - Parallel execution flag (parallel: true/false)
5. Count how many task files were created

Return a concise summary:
- Number of tasks created
- List of task names
- How many can run in parallel
- Status: SUCCESS/FAILED"
```

**After agent completes:**
- Update todo: Mark as `completed`
- Extract task count
- Display: "✓ Epic decomposed into {COUNT} tasks"

---

## 📋 TODO 4: Sync Epic and tasks to GitHub

**Update todo:** Mark as `in_progress`

**Spawn Sub-Agent:**

Use Task tool:
```
subagent_type: "general-purpose"
description: "Sync to GitHub"
prompt: "Execute the /pm:epic-sync command to sync epic and tasks to GitHub Issues.

Epic name: {EPIC_NAME}

Your job:
1. Use SlashCommand tool to run: /pm:epic-sync {EPIC_NAME}
2. This will:
   - Create Epic issue on GitHub (labeled 'epic')
   - Create sub-issues for each task (labeled 'task')
   - Rename task files: 001.md → {issue_number}.md
   - Create github-mapping.md with all issue numbers
   - Create git worktree at: ../ epic-{EPIC_NAME}/
3. Read the github-mapping.md file to extract issue numbers

Return a concise summary:
- Epic issue number
- Task issue numbers (first and last)
- Total task issues created
- Worktree location
- Status: SUCCESS/FAILED"
```

**After agent completes:**
- Update todo: Mark as `completed`
- Extract EPIC_ISSUE and TASK_ISSUES from agent response
- Store these for later phases
- Display: "✓ GitHub synced: Epic #{EPIC_ISSUE}, Tasks #{START}-#{END}"

**Phase 1 Summary:**
```
✓ Planning Complete
- PRD: .claude/prds/{EPIC_NAME}.md
- Epic: .claude/epics/{EPIC_NAME}/epic.md
- Tasks: {COUNT} tasks created
- GitHub: Epic #{EPIC_ISSUE}, Tasks #{START}-#{END}
```

---

## 📋 TODO 5: Analyze tasks for parallel execution

**Update todo:** Mark as `in_progress`

**Spawn Sub-Agent:**

Use Task tool:
```
subagent_type: "general-purpose"
description: "Analyze parallel streams"
prompt: "Analyze all task issues to identify parallel execution potential.

Epic name: {EPIC_NAME}
Task issues: {TASK_ISSUES}

Your job:
1. For EACH task issue number in {TASK_ISSUES}:
   - Use SlashCommand tool to run: /pm:issue-analyze {issue_number}
2. This creates {issue}-analysis.md files with work stream definitions
3. Count total number of parallel streams across all tasks
4. Identify which tasks can run simultaneously

Return a concise summary:
- Total task issues analyzed
- Number of parallel streams per task (list each)
- Total agent count that will be spawned
- Any sequential dependencies noted
- Status: SUCCESS/FAILED"
```

**After agent completes:**
- Update todo: Mark as `completed`
- Extract total agent count
- Display: "✓ Analysis complete: {AGENT_COUNT} parallel agents will execute"

---

## 📋 TODO 6: Launch agents for all tasks

**Update todo:** Mark as `in_progress`

**Spawn Multiple Sub-Agents (One Per Task Issue):**

For EACH task issue in {TASK_ISSUES}, spawn a dedicated sub-agent:

### Implementation:

```javascript
// For each task issue number (e.g., #11, #12, #13, etc.)
for (const issue_number of TASK_ISSUES) {

  // Check dependencies first
  const task_file = `.claude/epics/${EPIC_NAME}/${issue_number}.md`;
  const depends_on = read_depends_on_from_file(task_file);
  const can_start = check_if_dependencies_completed(depends_on);

  if (can_start) {
    // Spawn sub-agent for this specific task issue
    Use Task tool:
    {
      subagent_type: "general-purpose",
      description: `Launch agent for task #${issue_number}`,
      prompt: `Execute /pm:issue-start for a specific task issue.

Epic name: {EPIC_NAME}
Task issue: ${issue_number}

Your job:
1. Use SlashCommand tool to run: /pm:issue-start ${issue_number}
2. This spawns Task agents in the epic worktree for this specific task
3. The agents will:
   - Work on assigned files for this task
   - Coordinate via git commits
   - Update task status to 'in_progress' then 'completed'
4. Wait for the task agents to complete
5. Verify task status changed to 'completed'

Return a concise summary:
- Task issue: ${issue_number}
- Task name: <extract from task file>
- Number of agents spawned for this task
- Execution time
- Final status: 'completed'/'failed'
- Any errors encountered
- Status: SUCCESS/FAILED`
    }
  } else {
    // Task has unmet dependencies, wait
    log(`Task #${issue_number} waiting for dependencies: ${depends_on}`);
  }
}
```

### Execution Strategy:

**Sequential Execution (if dependencies exist):**
1. Read all task files to extract `depends_on` relationships
2. Spawn sub-agents in dependency order:
   - Tasks with no dependencies → Start immediately
   - Tasks with dependencies → Wait for prerequisite tasks to complete
3. Monitor each sub-agent as it completes

**Parallel Execution (if no dependencies):**
1. Identify all tasks with `parallel: true` and no dependencies
2. Spawn all their sub-agents simultaneously (one per task)
3. Each sub-agent calls `/pm:issue-start` for its specific task
4. Wait for all parallel sub-agents to complete

### Example Flow:

If you have 5 task issues: #11, #12, #13, #14, #15

**Dependency analysis:**
- Task #11: No dependencies → Spawn sub-agent immediately
- Task #12: No dependencies → Spawn sub-agent immediately
- Task #13: depends_on: [#11] → Wait for #11 to complete
- Task #14: No dependencies → Spawn sub-agent immediately
- Task #15: depends_on: [#13] → Wait for #13 to complete

**Execution:**
```
[Spawn sub-agent for #11] → Working...
[Spawn sub-agent for #12] → Working...
[Spawn sub-agent for #14] → Working...

✓ #11 completed
  [Spawn sub-agent for #13] → Working...
✓ #12 completed
✓ #14 completed

  ✓ #13 completed
    [Spawn sub-agent for #15] → Working...

    ✓ #15 completed
```

**After all sub-agents complete:**
- Count total sub-agents spawned (one per task issue)
- Update todo: Mark as `completed`
- Display: "✓ All {COUNT} tasks executed by {COUNT} dedicated sub-agents"

---

## 📋 TODO 7: Monitor agent progress

**Update todo:** Mark as `in_progress`

**Spawn Sub-Agent:**

Use Task tool:
```
subagent_type: "general-purpose"
description: "Monitor task completion"
prompt: "Monitor and verify all task agents have completed successfully.

Epic name: {EPIC_NAME}
Task issues: {TASK_ISSUES}

Your job:
1. Check status of all task files in: .claude/epics/{EPIC_NAME}/
2. Use Bash tool: grep '^status:' .claude/epics/{EPIC_NAME}/*.md
3. Verify all tasks show 'status: completed'
4. If any tasks are still in_progress or failed:
   - Report which tasks
   - Check for errors in worktree
5. Verify worktree has no uncommitted changes or errors

Return a concise summary:
- Total tasks: {COUNT}
- Completed: {COUNT}
- In progress: {COUNT}
- Failed: {COUNT}
- List of any incomplete/failed tasks
- Overall status: SUCCESS/PARTIAL/FAILED"
```

**After agent completes:**
- Update todo: Mark as `completed`
- If not all completed: Ask user to continue or abort
- Display: "✓ All {COUNT} tasks completed successfully"

**Phase 2 Summary:**
```
✓ Execution Complete
- {COUNT}/{COUNT} tasks completed
- {AGENT_COUNT} agents executed in parallel
- All changes in worktree: ../epic-{EPIC_NAME}/
```

---

## 📋 TODO 8: Run automated tests

**Update todo:** Mark as `in_progress`

**Spawn Sub-Agent:**

Use Task tool:
```
subagent_type: "test-runner"
description: "Run automated tests"
prompt: "Run the project's test suite to validate changes.

Epic name: {EPIC_NAME}
Epic worktree: ../epic-{EPIC_NAME}/

Your job:
1. Check if tests exist in the project (tests/, *.test.*, *.spec.*)
2. If tests exist:
   - Change to worktree directory
   - Run: bash .claude/scripts/test-and-log.sh
   - Capture all test output
3. If no tests exist: Report and skip

Return a concise summary:
- Tests found: YES/NO
- If YES:
  - Total tests run
  - Passed: {COUNT}
  - Failed: {COUNT}
  - Failed test output (if any failures)
  - Overall: PASS/FAIL
- If NO:
  - Message: 'No tests found, skipping validation'
- Status: SUCCESS/FAILED/SKIPPED"
```

**After agent completes:**
- Update todo: Mark as `completed`
- If tests failed: Ask user "Tests failed. Continue anyway? (y/n)"
- Display: "✓ Tests: {PASSED}/{TOTAL} passed" or "⚠ No tests found"

---

## 📋 TODO 9: Verify linting

**Update todo:** Mark as `in_progress`

**Spawn Sub-Agent:**

Use Task tool:
```
subagent_type: "general-purpose"
description: "Verify linting"
prompt: "Run linting to check code quality.

Epic name: {EPIC_NAME}
Epic worktree: ../epic-{EPIC_NAME}/

Your job:
1. Check if linting is configured (package.json has 'lint' script)
2. If configured:
   - Change to worktree directory
   - Run: npm run lint (or equivalent linter)
   - Capture output
3. If not configured: Report and skip

Return a concise summary:
- Linting configured: YES/NO
- If YES:
  - Errors: {COUNT}
  - Warnings: {COUNT}
  - Error/warning details (if any)
  - Overall: CLEAN/WARNINGS/ERRORS
- If NO:
  - Message: 'Linting not configured, skipping'
- Status: SUCCESS/WARNINGS/FAILED/SKIPPED"
```

**After agent completes:**
- Update todo: Mark as `completed`
- Display warnings/errors if any
- Display: "✓ Linting: Clean" or "⚠ Linting: {WARNINGS} warnings"

---

## 📋 TODO 10: Check build

**Update todo:** Mark as `in_progress`

**Spawn Sub-Agent:**

Use Task tool:
```
subagent_type: "general-purpose"
description: "Check build"
prompt: "Build the project to ensure no build errors.

Epic name: {EPIC_NAME}
Epic worktree: ../epic-{EPIC_NAME}/

Your job:
1. Detect project type (Next.js, Vite, etc.) from package.json
2. Change to worktree directory
3. Run appropriate build command:
   - Next.js: npm run build
   - Vite: npm run build
   - Other: check package.json for 'build' script
4. Capture build output
5. Check for TypeScript errors, bundle size, warnings

Return a concise summary:
- Project type detected
- Build command used
- Build status: SUCCESS/FAILED
- If FAILED:
  - Error messages
  - Files with errors
- If SUCCESS:
  - Bundle size (if applicable)
  - Any warnings
  - Build time
- Status: SUCCESS/FAILED"
```

**After agent completes:**
- Update todo: Mark as `completed`
- **If build failed: STOP execution** - Do not proceed to merge!
- Display: "✓ Build: Success" or "✗ Build: Failed - halting execution"

**Phase 3 Summary:**
```
✓ Validation Complete
- Tests: {PASSED}/{TOTAL} passed
- Linting: {STATUS}
- Build: Success
```

---

## 📋 TODO 11: Close all GitHub issues

**Update todo:** Mark as `in_progress`

**Spawn Sub-Agent:**

Use Task tool:
```
subagent_type: "general-purpose"
description: "Close GitHub issues"
prompt: "Close all completed task issues on GitHub.

Epic name: {EPIC_NAME}
Task issues to close: {TASK_ISSUES}

Your job:
1. For EACH task issue in {TASK_ISSUES}:
   - Use SlashCommand tool to run: /pm:issue-close {issue_number}
2. Verify each issue is closed on GitHub
3. Each issue should have a completion comment

Return a concise summary:
- Total issues to close: {COUNT}
- Successfully closed: {COUNT}
- Failed to close: {COUNT}
- List of closed issue numbers
- Any issues that failed (with errors)
- Status: SUCCESS/PARTIAL/FAILED"
```

**After agent completes:**
- Update todo: Mark as `completed`
- Display: "✓ Closed {COUNT} GitHub issues"

---

## 📋 TODO 12: Merge epic to main branch

**Update todo:** Mark as `in_progress`

**Spawn Sub-Agent:**

Use Task tool:
```
subagent_type: "general-purpose"
description: "Merge epic to main"
prompt: "Merge the epic branch to main and cleanup.

Epic name: {EPIC_NAME}
Epic issue: {EPIC_ISSUE}

Your job:
1. Use SlashCommand tool to run: /pm:epic-merge {EPIC_NAME}
2. This will:
   - Merge epic worktree branch to main
   - Create pull request (or direct merge if configured)
   - Close epic issue on GitHub
   - Cleanup worktree directory
3. Capture merge information and PR details (if applicable)

Return a concise summary:
- Merge method: PR/Direct
- PR number (if PR was created)
- Epic issue closed: YES/NO
- Worktree cleaned: YES/NO
- Commits merged: {COUNT}
- Files changed: {COUNT}
- Status: SUCCESS/FAILED"
```

**After agent completes:**
- Update todo: Mark as `completed`
- Display: "✓ Epic merged to main"

---

## 📋 TODO 13: Generate completion report

**Update todo:** Mark as `in_progress`

**Spawn Sub-Agent:**

Use Task tool:
```
subagent_type: "general-purpose"
description: "Generate completion report"
prompt: "Generate a comprehensive completion report for the user.

Collect all information from previous phases:
- Task description: {TASK_DESCRIPTION}
- Epic name: {EPIC_NAME}
- Epic issue: {EPIC_ISSUE}
- Task issues: {TASK_ISSUES}
- Test results: {TEST_RESULTS}
- Build results: {BUILD_RESULTS}
- Linting results: {LINT_RESULTS}

Your job:
1. Read relevant files to gather statistics:
   - Total commits merged
   - Files changed
   - Lines of code modified
2. Calculate total execution time from start to finish
3. Get GitHub repository URL from git remote
4. Format a beautiful completion report

Return a formatted report with:
- Header banner
- Task description and epic name
- Phase summaries (Planning, Execution, Validation, Completion)
- GitHub links (epic issue, task issues, PR if any)
- Statistics (agents used, commits, files, lines changed)
- Total execution time
- Next steps for the user

Format the report nicely with boxes, checkmarks, and clear sections."
```

**After agent completes:**
- Update todo: Mark as `completed`
- Display the agent's completion report exactly as returned

---

### STEP 4: Display Final Report

The agent from TODO 13 will return a beautifully formatted report. Display it to the user.

Example format:
```
================================
🚀 AUTO-EXECUTE COMPLETE
================================

Task: {TASK_DESCRIPTION}
Epic: {EPIC_NAME}
Status: ✅ Success

Phase Results:
✓ Planning: Complete
  - PRD created
  - Epic decomposed into {TASK_COUNT} tasks
  - Synced to GitHub (Epic #{EPIC_ISSUE})

✓ Execution: Complete
  - {TASK_COUNT} tasks executed
  - {AGENT_COUNT} agents ran in parallel
  - All changes applied

✓ Validation: Complete
  - Tests: {PASSED}/{TOTAL} passed
  - Build: Success
  - Linting: {STATUS}

✓ Completion: Complete
  - All issues closed
  - Merged to main
  - Worktree cleaned up

GitHub:
- Epic Issue: #{EPIC_ISSUE} (closed)
- Task Issues: #{START} through #{END} (all closed)
- Pull Request: #{PR_NUMBER} (if applicable)

Repository:
{GITHUB_REPO_URL}

Next Steps:
1. Pull latest changes: git pull origin main
2. Review changes: git log --oneline -n {COMMIT_COUNT}
3. Test locally: npm run dev
4. Deploy if ready!

Total Execution Time: {TIME}
Total Sub-Agents Used: 13
================================
```

---

## Error Handling

For any sub-agent that fails:

1. **Capture error** from agent response
2. **Update todo** - Keep as `in_progress` or mark as `failed`
3. **Display error** to user with details
4. **Ask user:** "Sub-agent failed: {ERROR}. Retry? (y/n)"
   - If yes: Retry same agent (max 2 retries)
   - If no: Halt execution, provide recovery steps

### Critical Failures

If these sub-agents fail, **STOP execution**:
- TODO 10 (Check Build) - Never merge broken builds
- TODO 4 (Sync to GitHub) - Can't proceed without GitHub issues

### Recoverable Failures

If these sub-agents fail, **Ask user to continue**:
- TODO 8 (Run Tests) - Tests might be flaky
- TODO 9 (Verify Linting) - Can be fixed later

---

## Important Notes

**Sub-Agent Benefits:**
- Each todo step has dedicated agent = Better isolation
- Easier debugging (agent-specific logs)
- Granular error handling
- Can resume from any point if interrupted

**Resource Usage:**
- 13 sub-agents spawned sequentially
- Each agent has own context
- Total token usage: ~300K-500K for complex tasks
- Time: 5-30 minutes depending on task complexity

**Prerequisites:**
- Clean git working directory
- GitHub CLI authenticated
- All dependencies installed

---

## Success Criteria

All 13 todos completed ✅

**Remember:** You are the Master Orchestrator! Spawn each sub-agent using the Task tool, update todos in real-time, coordinate between agents, handle errors gracefully, and guide the user through the complete automated workflow!
