#!/bin/bash
set -e

# Epic Sync Script for hall-ui-white-yellow-theme
# This script automates the epic sync workflow
# Requires: GitHub CLI (gh) installed and authenticated

echo "=========================================="
echo "Epic Sync: hall-ui-white-yellow-theme"
echo "Repository: varunisrani/sdjd2"
echo "=========================================="
echo ""

# Check GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ ERROR: GitHub CLI (gh) is not installed"
    echo ""
    echo "Please install gh CLI:"
    echo "  macOS: brew install gh"
    echo "  Ubuntu/Debian: sudo apt install gh"
    echo "  Or visit: https://cli.github.com/"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo "❌ ERROR: Not authenticated with GitHub"
    echo ""
    echo "Please run: gh auth login"
    exit 1
fi

echo "✓ GitHub CLI available and authenticated"
echo ""

# Check remote origin (not CCPM template)
remote_url=$(git remote get-url origin 2>/dev/null || echo "")
if [[ "$remote_url" == *"automazeio/ccpm"* ]] || [[ "$remote_url" == *"automazeio/ccpm.git"* ]]; then
  echo "❌ ERROR: You're trying to sync with the CCPM template repository!"
  echo ""
  echo "This repository (automazeio/ccpm) is a template for others to use."
  echo "You should NOT create issues or PRs here."
  echo ""
  echo "Current remote: $remote_url"
  exit 1
fi

echo "✓ Remote repository verified"
echo ""

# Step 1: Create Epic Issue
echo "Step 1: Creating Epic Issue..."

epic_number=$(gh issue create \
  --repo varunisrani/sdjd2 \
  --title "Epic: hall-ui-white-yellow-theme" \
  --body-file /tmp/epic-body.md \
  --label "epic,epic:hall-ui-white-yellow-theme,feature" \
  --json number -q .number)

echo "✓ Epic created: #${epic_number}"
echo ""

# Step 2: Create Task Sub-Issues
echo "Step 2: Creating Task Sub-Issues..."

# Check for gh-sub-issue extension
if gh extension list | grep -q "yahsan2/gh-sub-issue"; then
  use_subissues=true
  echo "✓ Using gh-sub-issue extension for hierarchical issues"
else
  use_subissues=false
  echo "⚠ gh-sub-issue not found, using standard issue creation"
fi

# Initialize task mapping
> /tmp/task-mapping.txt
task_count=0

# Create sub-issues
for task_file in .claude/epics/hall-ui-white-yellow-theme/[0-9][0-9][0-9].md; do
  [ -f "$task_file" ] || continue

  # Extract task name
  task_name=$(grep '^name:' "$task_file" | sed 's/^name: *//')

  # Strip frontmatter (skip first 10 lines with ---)
  tail -n +11 "$task_file" > /tmp/task-body.md

  # Create issue
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
  task_count=$((task_count + 1))
  echo "  ✓ Created #${task_number}: ${task_name}"
done

echo ""
echo "✓ Created $task_count task sub-issues"
echo ""

# Step 3: Build ID Mapping and Rename Files
echo "Step 3: Renaming task files and updating references..."

# Create ID mapping
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

  # Read content
  content=$(cat "$task_file")

  # Update references
  while IFS=: read -r old_num new_num; do
    content=$(echo "$content" | sed "s/\b$old_num\b/$new_num/g")
  done < /tmp/id-mapping.txt

  # Write to new file
  echo "$content" > "$new_name"

  # Remove old file
  [ "$task_file" != "$new_name" ] && rm "$task_file"

  # Update frontmatter
  github_url="https://github.com/$repo/issues/$task_number"
  sed -i.bak "s|^github:.*|github: $github_url|" "$new_name"
  sed -i.bak "s|^updated:.*|updated: $current_date|" "$new_name"
  rm "${new_name}.bak" 2>/dev/null || true

  old_basename=$(basename "$task_file")
  echo "  ✓ $old_basename → ${task_number}.md"
done < /tmp/task-mapping.txt

echo ""
echo "✓ Task files renamed and references updated"
echo ""

# Step 4: Update Epic File
echo "Step 4: Updating epic file..."

# Update epic frontmatter
epic_url="https://github.com/$repo/issues/$epic_number"

sed -i.bak "s|^github:.*|github: $epic_url|" .claude/epics/hall-ui-white-yellow-theme/epic.md
sed -i.bak "s|^updated:.*|updated: $current_date|" .claude/epics/hall-ui-white-yellow-theme/epic.md
rm .claude/epics/hall-ui-white-yellow-theme/epic.md.bak 2>/dev/null || true

# Create Tasks Created section
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

# Add statistics
total_count=$(ls .claude/epics/hall-ui-white-yellow-theme/[0-9]*.md 2>/dev/null | wc -l)
parallel_count=$(grep -l '^parallel: true' .claude/epics/hall-ui-white-yellow-theme/[0-9]*.md 2>/dev/null | wc -l)
sequential_count=$((total_count - parallel_count))

cat >> /tmp/tasks-section.md << EOF

Total tasks: ${total_count}
Parallel tasks: ${parallel_count}
Sequential tasks: ${sequential_count}
Estimated total effort: 13.5-14.5 hours (approximately 2 working days)
EOF

# Replace section in epic.md
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

echo "✓ Epic file updated with GitHub URLs and task list"
echo ""

# Step 5: Create GitHub Mapping File
echo "Step 5: Creating github-mapping.md..."

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

echo "✓ GitHub mapping file created"
echo ""

# Step 6: Create Worktree
echo "Step 6: Creating git worktree..."

# Save current branch
current_branch=$(git branch --show-current)

# Ensure main is current
git checkout main 2>/dev/null || echo "Already on main"
git pull origin main 2>/dev/null || echo "Unable to pull from remote"

# Create worktree
if git worktree add ../epic-hall-ui-white-yellow-theme -b epic/hall-ui-white-yellow-theme 2>/dev/null; then
  echo "✓ Created worktree: ../epic-hall-ui-white-yellow-theme"
else
  echo "⚠ Worktree may already exist or couldn't be created"
fi

# Return to original branch
git checkout "$current_branch" 2>/dev/null || true

echo ""

# Final Summary
echo "=========================================="
echo "✅ Epic Sync Completed Successfully!"
echo "=========================================="
echo ""
echo "Epic Issue: #${epic_number}"
echo "Epic URL: https://github.com/${repo}/issues/${epic_number}"
echo ""
echo "Task Issues: ${task_count} created"
echo "  - Parallel tasks: ${parallel_count}"
echo "  - Sequential tasks: ${sequential_count}"
echo ""
echo "Worktree: ../epic-hall-ui-white-yellow-theme"
echo ""
echo "Files updated:"
echo "  - Task files renamed: 001-007.md → issue IDs"
echo "  - Epic file updated with GitHub URLs"
echo "  - GitHub mapping created"
echo ""
echo "Next steps:"
echo "  - View epic: https://github.com/${repo}/issues/${epic_number}"
echo "  - Start parallel execution: /pm:epic-start hall-ui-white-yellow-theme"
echo "  - Or work on single issue: /pm:issue-start {issue_number}"
echo ""

# Cleanup temp files
rm -f /tmp/epic-body.md /tmp/epic-body-raw.md /tmp/task-body.md /tmp/task-mapping.txt /tmp/id-mapping.txt /tmp/tasks-section.md

exit 0
