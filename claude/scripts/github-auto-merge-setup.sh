#!/bin/bash
# GitHub Auto-Merge & Auto-Delete Branch Setup
# For solo vibe-coding with AI agents - no PR review needed
# Applies to all repos for user: willsigmon

set -e

OWNER="willsigmon"

echo "🔧 Setting up auto-merge + auto-delete for all repos..."

# Get all repos
REPOS=$(gh repo list "$OWNER" --limit 100 --json name --jq '.[].name')

for REPO in $REPOS; do
    echo ""
    echo "📦 Configuring: $OWNER/$REPO"

    # 1. Enable auto-delete head branches (after PR merge)
    echo "  ↳ Enabling auto-delete branches..."
    gh api -X PATCH "repos/$OWNER/$REPO" \
        -f delete_branch_on_merge=true \
        --silent 2>/dev/null || echo "  ⚠️ Could not set delete_branch_on_merge"

    # 2. Enable auto-merge on the repo
    echo "  ↳ Enabling allow_auto_merge..."
    gh api -X PATCH "repos/$OWNER/$REPO" \
        -f allow_auto_merge=true \
        --silent 2>/dev/null || echo "  ⚠️ Could not set allow_auto_merge"

    # 3. Disable required reviews (if branch protection exists)
    # First check if main branch protection exists
    if gh api "repos/$OWNER/$REPO/branches/main/protection" --silent 2>/dev/null; then
        echo "  ↳ Updating branch protection to allow auto-merge..."
        gh api -X PUT "repos/$OWNER/$REPO/branches/main/protection" \
            -f required_status_checks=null \
            -f enforce_admins=false \
            -f required_pull_request_reviews=null \
            -f restrictions=null \
            -f allow_force_pushes=true \
            -f allow_deletions=true \
            --silent 2>/dev/null || echo "  ⚠️ Could not update branch protection"
    else
        echo "  ↳ No branch protection on main (good for auto-merge)"
    fi

    echo "  ✅ Done"
done

echo ""
echo "🎉 All repos configured!"
echo ""
echo "To auto-merge a PR after creation:"
echo "  gh pr merge --auto --squash"
echo ""
echo "Or add to your git workflow:"
echo "  gh pr create --fill && gh pr merge --auto --squash"
