# Tasks Directory

This directory contains all task-related files for the simplified PM workflow.

## Directory Structure

```
.claude/tasks/
├── README.md                    # This file
├── <task-id>/                   # Before GitHub issue creation
│   ├── exploration.md           # Code exploration results
│   ├── plan.md                  # Execution plan
│   └── task.md                  # Task metadata
│
└── <issue-number>/              # After GitHub issue creation (renamed from task-id)
    ├── exploration.md           # Code exploration results
    ├── plan.md                  # Execution plan
    ├── task.md                  # Task metadata + GitHub info
    ├── progress.md              # Execution progress tracking
    └── updates/                 # Per-stream progress updates
        ├── stream-A.md
        ├── stream-B.md
        └── ...
```

## File Descriptions

### exploration.md
- **Created by:** `/pm:task-explore`
- **Contains:** Deep code exploration results
- **Frontmatter:** task_id, description, confidence, complexity, etc.
- **Purpose:** Understand codebase before planning

### plan.md
- **Created by:** `/pm:task-plan`
- **Contains:** Detailed execution plan with steps, parallel streams, testing strategy
- **Frontmatter:** task_id, estimated_hours, parallel_streams, status
- **Purpose:** Guide task execution

### task.md
- **Created by:** `/pm:task-explore` (initial), updated by other commands
- **Contains:** Task metadata, status checklist, timeline
- **Frontmatter:** task_id/issue, status, github URL, estimates
- **Purpose:** Central tracking file

### progress.md
- **Created by:** `/pm:task-execute`
- **Contains:** Real-time execution progress
- **Frontmatter:** issue, started, completion percentage
- **Purpose:** Monitor ongoing execution

### updates/stream-*.md
- **Created by:** Parallel work stream agents during execution
- **Contains:** Per-stream progress updates
- **Frontmatter:** stream id, status, completion
- **Purpose:** Coordinate parallel agent work

## Workflow

1. **Exploration**
   ```bash
   /pm:task-explore "Add feature X"
   ```
   Creates: `.claude/tasks/20250118-abc123/`
   - exploration.md
   - task.md

2. **Planning**
   ```bash
   /pm:task-plan 20250118-abc123
   ```
   Adds to: `.claude/tasks/20250118-abc123/`
   - plan.md

3. **Issue Creation**
   ```bash
   /pm:task-create 20250118-abc123
   ```
   Renames: `.claude/tasks/20250118-abc123/` → `.claude/tasks/145/`
   Updates: task.md with GitHub info

4. **Execution**
   ```bash
   /pm:task-execute 145
   ```
   Adds to: `.claude/tasks/145/`
   - progress.md
   - updates/stream-A.md (if parallel)
   - updates/stream-B.md (if parallel)

## Directory Naming

- **Before GitHub sync:** Directory named `<task-id>` (e.g., `20250118-abc123`)
- **After GitHub sync:** Directory renamed to `<issue-number>` (e.g., `145`)
- This makes it easy to correlate local files with GitHub issues

## Cleanup

Completed tasks can be moved to `.claude/tasks/.archived/` to keep the directory clean:

```bash
mv .claude/tasks/145 .claude/tasks/.archived/145
```

Or use the automated cleanup:
```bash
/pm:clean
```

## Important Notes

- Each task gets its own isolated directory
- Directory name changes from task-id to issue-number after GitHub sync
- All task state is tracked in frontmatter (YAML)
- Progress files updated in real-time during execution
- Safe to commit task directories to git for team collaboration

## Comparison to Old Structure

**Old CCPM:**
```
.claude/epics/
└── epic-name/
    ├── epic.md
    ├── 001.md, 002.md, ...      # Subtasks
    ├── github-mapping.md
    └── updates/
```

**New Simplified:**
```
.claude/tasks/
└── issue-number/
    ├── exploration.md
    ├── plan.md
    ├── task.md                  # Single task, not epic
    ├── progress.md
    └── updates/
```

**Key Differences:**
- No epic/subtask hierarchy
- Direct task-to-issue mapping
- Faster, simpler structure
- One task = one directory = one GitHub issue
