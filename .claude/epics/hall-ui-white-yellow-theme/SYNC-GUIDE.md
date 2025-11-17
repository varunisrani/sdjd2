# Epic Sync Guide: hall-ui-white-yellow-theme

**Status:** PENDING - Requires GitHub CLI installation
**Repository:** varunisrani/sdjd2
**Epic Name:** hall-ui-white-yellow-theme
**Task Count:** 7 tasks
**Sync Date:** 2025-11-17T22:36:09Z

## Issue: GitHub CLI Not Available

The automated epic sync workflow requires the GitHub CLI (`gh`) to create issues and sub-issues on GitHub. This tool is not currently installed in the environment.

## Prerequisites

Before you can complete the epic sync, you need to:

1. **Install GitHub CLI:**
   ```bash
   # macOS
   brew install gh

   # Debian/Ubuntu
   sudo apt install gh

   # Or download from: https://cli.github.com/
   ```

2. **Authenticate with GitHub:**
   ```bash
   gh auth login
   ```

3. **Verify authentication:**
   ```bash
   gh auth status
   ```

## Prepared Files

The following files have been prepared and are ready for sync:

### Epic Body
- **File:** `/tmp/epic-body.md`
- **Content:** Epic description with frontmatter removed and Stats section added
- **Epic Title:** "Epic: hall-ui-white-yellow-theme"
- **Labels:** epic, epic:hall-ui-white-yellow-theme, feature

### Task Files
All 7 task files are ready in: `.claude/epics/hall-ui-white-yellow-theme/`
- `001.md` - Update CSS Design Tokens (sequential, foundation task)
- `002.md` - Validate MusicPlayer Component (parallel)
- `003.md` - Validate TrackList Component (parallel)
- `004.md` - Update Remaining Components (parallel)
- `005.md` - Update App Layout and Pages (parallel)
- `006.md` - Accessibility Audit (sequential, depends on 001-005)
- `007.md` - Cross-Browser and Performance Testing (sequential, depends on all)

## Manual Sync Steps

Once GitHub CLI is installed and authenticated, run these commands:

### Step 1: Create Epic Issue

```bash
cd /home/user/sdjd2

# Create epic issue
epic_number=$(gh issue create \
  --repo varunisrani/sdjd2 \
  --title "Epic: hall-ui-white-yellow-theme" \
  --body-file /tmp/epic-body.md \
  --label "epic,epic:hall-ui-white-yellow-theme,feature" \
  --json number -q .number)

echo "Epic created: #${epic_number}"
```

### Step 2: Create Task Sub-Issues

```bash
# Check if gh-sub-issue extension is available
if gh extension list | grep -q "yahsan2/gh-sub-issue"; then
  use_subissues=true
  echo "✓ Using gh-sub-issue extension"
else
  use_subissues=false
  echo "⚠ Using standard gh issue create"
fi

# Initialize task mapping file
> /tmp/task-mapping.txt

# Create sub-issues for each task
for task_file in .claude/epics/hall-ui-white-yellow-theme/[0-9][0-9][0-9].md; do
  [ -f "$task_file" ] || continue

  # Extract task name from frontmatter
  task_name=$(grep '^name:' "$task_file" | sed 's/^name: *//')

  # Strip frontmatter
  tail -n +11 "$task_file" > /tmp/task-body.md

  # Create sub-issue
  if [ "$use_subissues" = true ]; then
    task_number=$(gh sub-issue create \
      --parent "$epic_number" \
      --title "$task_name" \
      --body-file /tmp/task-body.md \
      --label "task,epic:hall-ui-white-yellow-theme" \
      --json number -q .number)
  else
    task_number=$(gh issue create \
      --repo varunisrani/sdjd2 \
      --title "$task_name" \
      --body-file /tmp/task-body.md \
      --label "task,epic:hall-ui-white-yellow-theme" \
      --json number -q .number)
  fi

  echo "$task_file:$task_number" >> /tmp/task-mapping.txt
  echo "Created task #${task_number}: ${task_name}"
done
```

### Step 3: Build ID Mapping and Rename Files

```bash
# Create mapping from old numbers to new issue IDs
> /tmp/id-mapping.txt
while IFS=: read -r task_file task_number; do
  old_num=$(basename "$task_file" .md)
  echo "$old_num:$task_number" >> /tmp/id-mapping.txt
done < /tmp/task-mapping.txt

# Get repository info
repo=$(gh repo view --json nameWithOwner -q .nameWithOwner)
current_date=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Process each task file
while IFS=: read -r task_file task_number; do
  new_name="$(dirname "$task_file")/${task_number}.md"

  # Read and update content
  content=$(cat "$task_file")

  # Update depends_on and conflicts_with references
  while IFS=: read -r old_num new_num; do
    content=$(echo "$content" | sed "s/\b$old_num\b/$new_num/g")
  done < /tmp/id-mapping.txt

  # Write to new file
  echo "$content" > "$new_name"

  # Remove old file if different
  [ "$task_file" != "$new_name" ] && rm "$task_file"

  # Update github and updated fields in frontmatter
  github_url="https://github.com/$repo/issues/$task_number"
  sed -i.bak "s|^github:.*|github: $github_url|" "$new_name"
  sed -i.bak "s|^updated:.*|updated: $current_date|" "$new_name"
  rm "${new_name}.bak" 2>/dev/null || true

  echo "Renamed and updated: $(basename $task_file) → ${task_number}.md"
done < /tmp/task-mapping.txt
```

### Step 4: Update Epic File

```bash
# Update epic frontmatter
epic_url="https://github.com/$repo/issues/$epic_number"

sed -i.bak "s|^github:.*|github: $epic_url|" .claude/epics/hall-ui-white-yellow-theme/epic.md
sed -i.bak "s|^updated:.*|updated: $current_date|" .claude/epics/hall-ui-white-yellow-theme/epic.md
rm .claude/epics/hall-ui-white-yellow-theme/epic.md.bak

# Create updated Tasks Created section
cat > /tmp/tasks-section.md << 'EOF'
## Tasks Created
EOF

for task_file in .claude/epics/hall-ui-white-yellow-theme/[0-9]*.md; do
  [ -f "$task_file" ] || continue
  issue_num=$(basename "$task_file" .md)
  task_name=$(grep '^name:' "$task_file" | sed 's/^name: *//')
  parallel=$(grep '^parallel:' "$task_file" | sed 's/^parallel: *//')
  echo "- [ ] #${issue_num} - ${task_name} (parallel: ${parallel})" >> /tmp/tasks-section.md
done

# Add summary statistics
total_count=$(ls .claude/epics/hall-ui-white-yellow-theme/[0-9]*.md 2>/dev/null | wc -l)
parallel_count=$(grep -l '^parallel: true' .claude/epics/hall-ui-white-yellow-theme/[0-9]*.md 2>/dev/null | wc -l)
sequential_count=$((total_count - parallel_count))

cat >> /tmp/tasks-section.md << EOF

Total tasks: ${total_count}
Parallel tasks: ${parallel_count}
Sequential tasks: ${sequential_count}
Estimated total effort: 13.5-14.5 hours (approximately 2 working days)
EOF

# Replace Tasks Created section in epic.md
cp .claude/epics/hall-ui-white-yellow-theme/epic.md .claude/epics/hall-ui-white-yellow-theme/epic.md.backup

awk '
  /^## Tasks Created/ {
    skip=1
    while ((getline line < "/tmp/tasks-section.md") > 0) print line
    close("/tmp/tasks-section.md")
  }
  /^## / && !/^## Tasks Created/ { skip=0 }
  !skip && !/^## Tasks Created/ { print }
' .claude/epics/hall-ui-white-yellow-theme/epic.md.backup > .claude/epics/hall-ui-white-yellow-theme/epic.md

rm .claude/epics/hall-ui-white-yellow-theme/epic.md.backup
```

### Step 5: Create GitHub Mapping File

```bash
cat > .claude/epics/hall-ui-white-yellow-theme/github-mapping.md << EOF
# GitHub Issue Mapping

Epic: #${epic_number} - https://github.com/${repo}/issues/${epic_number}

Tasks:
EOF

for task_file in .claude/epics/hall-ui-white-yellow-theme/[0-9]*.md; do
  [ -f "$task_file" ] || continue
  issue_num=$(basename "$task_file" .md)
  task_name=$(grep '^name:' "$task_file" | sed 's/^name: *//')
  echo "- #${issue_num}: ${task_name} - https://github.com/${repo}/issues/${issue_num}" >> .claude/epics/hall-ui-white-yellow-theme/github-mapping.md
done

echo "" >> .claude/epics/hall-ui-white-yellow-theme/github-mapping.md
echo "Synced: $current_date" >> .claude/epics/hall-ui-white-yellow-theme/github-mapping.md
```

### Step 6: Create Worktree

```bash
# Ensure main is current
git checkout main
git pull origin main

# Create worktree for epic
git worktree add ../epic-hall-ui-white-yellow-theme -b epic/hall-ui-white-yellow-theme

echo "✅ Created worktree: ../epic-hall-ui-white-yellow-theme"
```

### Step 7: Summary

```bash
echo ""
echo "✅ Epic sync completed successfully!"
echo ""
echo "Epic Issue: #${epic_number}"
echo "Epic URL: https://github.com/${repo}/issues/${epic_number}"
echo ""
echo "Task Issues Created: $total_count"
echo "  - Parallel tasks: $parallel_count"
echo "  - Sequential tasks: $sequential_count"
echo ""
echo "Worktree: ../epic-hall-ui-white-yellow-theme"
echo ""
echo "Next steps:"
echo "  - View epic: https://github.com/${repo}/issues/${epic_number}"
echo "  - Start parallel execution: /pm:epic-start hall-ui-white-yellow-theme"
echo "  - Or work on single issue: /pm:issue-start {issue_number}"
```

## Automated Script

All the above commands have been combined into a single script:

```bash
#!/bin/bash
set -e

cd /home/user/sdjd2

# Run the complete epic sync workflow
source /home/user/sdjd2/.claude/epics/hall-ui-white-yellow-theme/sync-script.sh
```

## Task Breakdown Summary

**Foundation Task (Must complete first):**
- Task 001: Update CSS Design Tokens (2 hours)

**Parallel Tasks (Can execute simultaneously after Task 001):**
- Task 002: Validate MusicPlayer Component (2.5 hours)
- Task 003: Validate TrackList Component (2 hours)
- Task 004: Update Remaining Components (2.5 hours)
- Task 005: Update App Layout and Pages (2 hours)

**Validation Tasks (Sequential, must complete after implementation):**
- Task 006: Accessibility Audit (2.5-3 hours)
- Task 007: Cross-Browser and Performance Testing (2-2.5 hours)

**Total Effort:** 13.5-14.5 hours (~2 working days)
**With Parallelization:** ~9-10 hours calendar time
