# `/pm:auto-execute` - Fully Automated Task Handler

## Overview

The `/pm:auto-execute` command is your **one-command solution** for complete automated development workflows. Just provide a task description, and AI handles everything from planning to implementation to deployment.

## Quick Start

### Basic Usage

```bash
/pm:auto-execute <task_description>
```

### Example

```bash
/pm:auto-execute Add dark mode support to the music player
```

That's it! Claude will:
1. Create a PRD (Product Requirements Document)
2. Convert it to a technical Epic
3. Break it into tasks
4. Sync to GitHub Issues
5. Launch parallel AI agents to implement
6. Run tests and validate
7. Merge to main branch
8. Close all issues
9. Give you a completion report

## What Happens Behind the Scenes

### Phase 1: Planning (Automated)
- Generates comprehensive PRD from your description
- Parses PRD into technical epic with architecture
- Decomposes epic into optimal task breakdown (< 10 tasks)
- Syncs everything to GitHub Issues

**Commands called:**
- `/pm:prd-new`
- `/pm:prd-parse`
- `/pm:epic-decompose`
- `/pm:epic-sync`

### Phase 2: Execution (Parallel Agents)
- Analyzes tasks for parallel execution potential
- Launches AI agents for independent work streams
- Agents work simultaneously on different files
- Coordinates through git commits in worktree

**Commands called:**
- `/pm:issue-analyze` (for each task)
- `/pm:issue-start` (for all tasks)

### Phase 3: Validation (Quality Gates)
- Runs automated tests
- Verifies build succeeds
- Checks linting (if configured)

**Commands called:**
- `bash .claude/scripts/test-and-log.sh`
- `npm run build`
- `npm run lint`

### Phase 4: Completion (Automated)
- Closes all GitHub task issues
- Merges epic to main branch
- Cleans up worktrees
- Generates completion report

**Commands called:**
- `/pm:issue-close` (for each task)
- `/pm:epic-merge`

## Real-World Examples

### Example 1: Simple UI Feature
```bash
/pm:auto-execute Add a theme toggle button to the navigation bar
```

**Result:**
- Creates 2-3 tasks
- Implements toggle component
- Adds state management
- Updates UI
- Tests pass
- **Time:** ~5 minutes

### Example 2: Full Feature
```bash
/pm:auto-execute Implement user authentication with OAuth2
```

**Result:**
- Creates 8-10 tasks
- Sets up auth routes
- Builds login UI
- Adds database models
- Implements session management
- Writes tests
- **Time:** ~20-30 minutes

### Example 3: Refactoring
```bash
/pm:auto-execute Refactor all components to use TypeScript strict mode
```

**Result:**
- Creates 5-7 tasks
- Updates tsconfig
- Refactors components sequentially
- Adds type definitions
- Validates no errors
- **Time:** ~15-20 minutes

## Prerequisites

Before using `/pm:auto-execute`:

1. **Clean Git Status**
   ```bash
   git status  # Should show "working tree clean"
   ```

2. **GitHub CLI Authenticated**
   ```bash
   gh auth status  # Should show "Logged in to github.com"
   ```

3. **CCPM Initialized**
   ```bash
   /pm:init  # If not already done
   ```

4. **Dependencies Installed**
   ```bash
   npm install  # Or equivalent for your project
   ```

## Progress Tracking

While auto-execute runs, you'll see real-time updates:

```
Phase 1: Planning
✓ Generate PRD from task description
✓ Parse PRD to Epic
✓ Decompose Epic into tasks
✓ Sync Epic and tasks to GitHub

Phase 2: Execution
⏳ Analyze tasks for parallel execution
⏳ Launch agents for all tasks
  ✓ Task #11: Component implementation (complete)
  ⏳ Task #12: State management (in progress)
  ○ Task #13: Tests (pending)

Phase 3: Validation
⏳ Run automated tests
...
```

## What Gets Created

After running `/pm:auto-execute`, you'll have:

### Files Created
```
.claude/
├── prds/
│   └── <epic-name>.md               # Product Requirements Document
├── epics/
│   └── <epic-name>/
│       ├── epic.md                  # Technical epic specification
│       ├── <issue_num>.md           # Task files (one per GitHub issue)
│       ├── <issue_num>-analysis.md  # Parallel stream analysis
│       └── github-mapping.md        # GitHub issue mapping
```

### GitHub Created
- 1 Epic issue (labeled "epic")
- N Task issues (labeled "task", sub-issues of epic)
- All linked and tracked

### Code Changes
- All changes applied to your codebase
- Merged to main branch
- Tests passing
- Build succeeding

## Error Handling

### If Something Fails

Auto-execute handles errors gracefully:

**Planning Fails:**
- Shows error message
- Asks if you want to retry
- Provides manual recovery command

**Tests Fail:**
- Displays test output
- Asks: "Tests failed. Continue anyway?"
- You decide whether to proceed or fix

**Build Fails:**
- Shows build errors
- **Stops execution** (won't merge broken code)
- Provides recovery instructions

### Recovery

If execution stops mid-workflow:
1. Check your todo list to see current phase
2. Review what's been created
3. Manually run remaining commands or fix issues
4. Use individual PM commands to complete

## Time Estimates

| Task Complexity | Tasks Created | Agents | Time     |
|----------------|---------------|--------|----------|
| Simple         | 2-3           | 2-3    | 3-5 min  |
| Medium         | 4-6           | 4-5    | 5-15 min |
| Complex        | 7-10          | 6-8    | 15-30 min|

## Cost Awareness

**Important:** Auto-execute spawns multiple AI agents running in parallel.

- Simple task: ~50K-100K tokens
- Medium task: ~150K-300K tokens
- Complex task: ~300K-500K tokens

Monitor your API usage in the Claude dashboard.

## Comparison: Manual vs Auto-Execute

### Manual Workflow (Old Way)
```bash
/pm:prd-new dark-mode
# Wait for PRD creation...

/pm:prd-parse dark-mode
# Wait for epic parsing...

/pm:epic-decompose dark-mode
# Wait for task decomposition...

/pm:epic-sync dark-mode
# Wait for GitHub sync...

/pm:issue-analyze 11
/pm:issue-start 11
# Wait for task 11...

/pm:issue-analyze 12
/pm:issue-start 12
# Wait for task 12...

# ... repeat for all tasks ...

npm run test
npm run build

/pm:issue-close 11
/pm:issue-close 12
# ... close all issues ...

/pm:epic-merge dark-mode
```

**Time:** 30-45 minutes of your attention

### Auto-Execute (New Way)
```bash
/pm:auto-execute Add dark mode support
```

**Time:** 5-10 minutes, zero attention required

## Tips for Best Results

### 1. Be Specific
❌ Bad: `/pm:auto-execute improve the app`
✅ Good: `/pm:auto-execute Add responsive mobile navigation with hamburger menu`

### 2. Single Feature at a Time
❌ Bad: `/pm:auto-execute Add dark mode, user auth, and payment system`
✅ Good: `/pm:auto-execute Add dark mode support`
          (Then run separately for auth and payments)

### 3. Include Key Technologies
❌ Bad: `/pm:auto-execute Add database`
✅ Good: `/pm:auto-execute Implement Prisma ORM with PostgreSQL database`

### 4. Specify Constraints
✅ Good: `/pm:auto-execute Add image upload with max 5MB file size limit`

## Monitoring Active Agents

While agents work, you can monitor them:

### Check Task Status
```bash
# View all task statuses
grep "^status:" .claude/epics/<epic-name>/*.md
```

### View Agent Logs
```bash
# Check progress updates
cat .claude/epics/<epic-name>/updates/<issue>/stream-1.md
```

### Check Worktree
```bash
# See actual code changes
cd ../epic-<epic-name>/
git log
git diff main
```

## Troubleshooting

### "Working directory not clean"
**Problem:** You have uncommitted changes

**Solution:**
```bash
git add .
git commit -m "Save current work"
# Then run auto-execute
```

### "GitHub authentication failed"
**Problem:** GitHub CLI not logged in

**Solution:**
```bash
gh auth login
# Follow prompts
```

### "Command not found: /pm:auto-execute"
**Problem:** CCPM not initialized or wrong directory

**Solution:**
```bash
cd /path/to/your/project
/pm:init
```

### Agents Taking Too Long
**Problem:** Tasks are complex or dependencies are sequential

**What to do:**
- Check progress: `grep "^status:" .claude/epics/<epic>/*.md`
- View logs: `.claude/epics/<epic>/updates/`
- Be patient - complex tasks take time
- If stuck (rare): Cancel and debug manually

### Tests Keep Failing
**Problem:** Code has bugs or tests need updates

**What to do:**
- Review test output carefully
- Fix issues in the worktree: `cd ../epic-<name>/`
- Commit fixes
- Run tests again
- When ready: `/pm:epic-merge <epic-name>`

## Advanced: What if I Want More Control?

Auto-execute is fully automatic. If you prefer more control:

### Use Individual Commands
```bash
# Planning only
/pm:prd-new feature-name
/pm:prd-parse feature-name
/pm:epic-decompose feature-name

# Review tasks before syncing
cat .claude/epics/feature-name/*.md

# Sync to GitHub
/pm:epic-sync feature-name

# Execute tasks one by one
/pm:issue-start 11
# Wait and verify
/pm:issue-start 12
# etc...
```

### Hybrid Approach
```bash
# Let auto-execute do planning
/pm:auto-execute "Add feature X"

# Cancel after planning phase (Ctrl+C)
# Review the generated tasks
# Manually execute what you want
```

## Success Checklist

When auto-execute completes successfully, you'll have:

✅ PRD documenting the feature
✅ Epic with technical specifications
✅ Task breakdown with dependencies
✅ GitHub issues created and linked
✅ All code implemented by AI agents
✅ Tests passing
✅ Build succeeding
✅ Changes merged to main
✅ GitHub issues closed
✅ Completion report generated

## Next Steps After Auto-Execute

1. **Pull Changes**
   ```bash
   git pull origin main
   ```

2. **Review Changes**
   ```bash
   git log --oneline -n 10
   git show HEAD
   ```

3. **Test Locally**
   ```bash
   npm run dev
   # Test the new feature
   ```

4. **Deploy**
   ```bash
   # Deploy to your hosting platform
   vercel deploy  # or your deployment command
   ```

5. **Close the Loop**
   ```bash
   # View the epic on GitHub
   gh issue view <epic_number>

   # Share with team
   # Document in changelog
   ```

## FAQ

**Q: Can I cancel auto-execute mid-execution?**
A: Yes, press Ctrl+C. Your progress is saved. You can manually complete remaining steps.

**Q: What if I want to modify tasks before execution?**
A: Use individual commands instead of auto-execute, or cancel after planning phase.

**Q: Does auto-execute work offline?**
A: No, it requires internet for GitHub sync and AI agents.

**Q: Can multiple auto-executes run simultaneously?**
A: Not recommended. They may conflict. Complete one before starting another.

**Q: What if my task is too large?**
A: Break it into smaller features and run auto-execute for each separately.

**Q: Does it work with any programming language?**
A: Yes! The test-and-log.sh supports 10+ languages automatically.

**Q: What about code review?**
A: Auto-execute creates a PR/merge. You can review before deploying.

## Summary

`/pm:auto-execute` is your AI-powered development teammate:
- **You provide:** The vision (task description)
- **AI handles:** Planning, implementation, testing, merging
- **You get:** Production-ready code in minutes

It's perfect for:
- Rapid prototyping
- Implementing well-defined features
- Refactoring tasks
- Bug fixes that span multiple files
- Learning how to structure complex tasks

Start using it today:
```bash
/pm:auto-execute <your task here>
```

Happy automated coding! 🚀
