# GitHub Actions Permissions Configuration

## Current Workflow Permissions Needed:

### 1. Repository Settings → Actions → General

- ✅ **Allow all actions and reusable workflows**
- ✅ **Allow actions created by GitHub**

### 2. Repository Settings → Actions → Workflow permissions

- ✅ **Read and write permissions**
- ✅ **Allow GitHub Actions to create and approve pull requests**

### 3. Branch Protection Rules (Recommended)

Navigate to: Settings → Branches → Add rule

**Rule configuration:**

```
Branch name pattern: main
☑️ Require a pull request before merging
☑️ Require status checks to pass before merging
    - Select: CI/CD Pipeline
    - Select: Security and Dependency Checks
    - Select: Code Quality & Linting
☑️ Require branches to be up to date before merging
☑️ Include administrators
```

### 4. Required Status Checks

The following checks should pass before merging:

- ✅ Frontend CI (Node 18.x, 20.x)
- ✅ Backend CI (Node 18.x, 20.x)
- ✅ Security Scan
- ✅ Code Quality
- ✅ Lint Frontend
- ✅ Lint Backend
- ✅ CodeQL Analysis

### 5. Secrets Configuration Status

```
Required Secrets:
✅ GITHUB_TOKEN (automatically provided)

Optional Secrets (for enhanced functionality):
⚪ SLACK_WEBHOOK_URL (for notifications)
⚪ DISCORD_WEBHOOK_URL (for notifications)
⚪ PERSONAL_ACCESS_TOKEN (if custom permissions needed)
```

## Quick Setup Commands:

### Enable Workflow Permissions via GitHub CLI:

```bash
# Install GitHub CLI if not installed
gh auth login

# Enable Actions for repository
gh api repos/MCA-NITW/placemento/actions/permissions \
  --method PUT \
  --field enabled=true \
  --field allowed_actions=all

# Set workflow permissions
gh api repos/MCA-NITW/placemento/actions/permissions/workflow \
  --method PUT \
  --field default_workflow_permissions=write \
  --field can_approve_pull_request_reviews=true
```

## Verification Steps:

1. **Check Repository Settings**:

   ```
   https://github.com/MCA-NITW/placemento/settings/actions
   ```

2. **Test Workflow Trigger**:
   - Create a test branch
   - Make a small change
   - Create a PR
   - Watch workflows run

3. **Verify Token Access**:
   - Check workflow logs for authentication errors
   - Ensure PRs can be created/merged
   - Verify releases can be published

## Troubleshooting:

### Common Issues:

1. **"Resource not accessible by integration"** → Enable "Read and write permissions" in Actions settings

2. **"Bad credentials"** → Check if GITHUB_TOKEN is properly referenced

3. **"API rate limit exceeded"** → Use fine-grained token or wait for reset

4. **Workflow not triggering** → Check branch protection rules and filters

### Debug Commands:

```bash
# Check current permissions
gh api repos/MCA-NITW/placemento/actions/permissions

# List repository secrets (names only)
gh secret list

# Check workflow runs
gh run list
```
