# Production-Grade CI/CD Pipeline for Vercel Deployment

This repository implements a production-grade CI/CD pipeline for automatic testing, linting, and building of our Next.js application, with continuous deployment to Vercel.

---

## Table of Contents
1. [Overview](#1-overview)
2. [Required GitHub Secrets](#2-required-github-secrets)
3. [GitHub Actions Workflows](#3-github-actions-workflows)
4. [Vercel Hobby Plan Limitations](#4-vercel-hobby-plan-limitations)
5. [Branch Protection Recommendations](#5-branch-protection-recommendations)
6. [Local Deployment Scripts](#6-local-deployment-scripts)
7. [Rollback Procedure](#7-rollback-procedure)

---

## 1. Overview

Our CI/CD architecture splits verification and deployment into two workflows using GitHub Actions and Vercel CLI:
- **Preview Deployments:** Triggered by opening or synchronizing a Pull Request to `main`. It lints, runs tests, builds the app, deploys a temporary Vercel preview environment, and posts the preview link as a comment in the PR.
- **Production Deployments:** Triggered by pushes directly to the `main` branch (usually via PR merges). It performs the same validation checks, builds in production mode, and deploys the prebuilt app directly to production.

Both workflows use Node.js `20.20.2`, enforce least-privilege permissions, and utilize dependency caching to optimize execution time.

---

## 2. Required GitHub Secrets

To connect GitHub Actions to your Vercel account, you must configure the following Secrets in your GitHub repository (**Settings > Secrets and variables > Actions > Repository secrets**):

| Secret Name | Description | How to Obtain |
| :--- | :--- | :--- |
| `VERCEL_TOKEN` | Vercel Personal Access Token | Go to [Vercel Account Tokens](https://vercel.com/account/tokens) and click **Create**. Ensure it has the correct permissions to modify your project. |
| `VERCEL_ORG_ID` | Vercel Organization / User ID | Open your Vercel project in a terminal. Execute `vercel link`. If the project is already linked, run `vercel project info` or look inside the local `.vercel/project.json` file under `orgId`. |
| `VERCEL_PROJECT_ID` | Vercel Project ID | Open your local `.vercel/project.json` file after running `vercel link`. Locate the `projectId` value. |

---

## 3. GitHub Actions Workflows

We use the official GitHub Actions and Vercel CLI directly. No third-party, non-official actions are used.

### `.github/workflows/deploy.yml` (Production)
- **Trigger:** On `push` to `main` branch.
- **Permissions:** `contents: read` (least-privilege).
- **Execution Steps:**
  1. **Checkout:** Clones the codebase.
  2. **Setup Node.js:** Sets up Node.js `20.20.2` and configures npm package caching.
  3. **Install Dependencies:** Executes `npm ci` for clean, deterministic installations.
  4. **Linting:** Runs `npm run lint`. Fails workflow if linting fails.
  5. **Unit Tests:** Runs `npm run test` using `vitest`. Fails workflow if any test fails.
  6. **Install Vercel CLI:** Installs the Vercel command line interface.
  7. **Pull Configuration:** Runs `vercel pull --environment=production` using the credentials.
  8. **Build:** Runs `vercel build --prod` to compile Next.js code and assets locally on the GitHub Actions runner.
  9. **Deploy:** Deploys prebuilt files using `vercel deploy --prebuilt --prod`.

### `.github/workflows/preview.yml` (Preview)
- **Trigger:** On `pull_request` to `main` branch.
- **Permissions:** `contents: read` and `pull-requests: write` (required to post comment with preview URL).
- **Execution Steps:** Same verification checks as production, except:
  - Pulls config using `--environment=preview`.
  - Builds without the `--prod` flag.
  - Deploys preview environments with `vercel deploy --prebuilt`.
  - Extracts the URL from the Vercel output and uses `actions/github-script` to comment the URL on the PR.

---

## 4. Vercel Hobby Plan Limitations

> [!WARNING]
> Vercel Hobby accounts are designed for personal use and do not support multi-seat teams. This introduces the following limitations when multiple developers collaborate:
> 
> 1. **Native Git Integration Restrictions:** Vercel's native GitHub integration will block or flag preview deployments triggered by collaborator-authored commits on personal projects. It requires the project owner to log in and manually authorize the deployment for each commit.
> 2. **Team Member Restriction:** Collaborators cannot be added to the project on Vercel without upgrading the account to a Vercel Pro/Enterprise Team plan.
> 
> **Recommended Workflow Solution:**
> Instead of using Vercel's native Git integration (which we recommend disabling or leaving disconnected for collaborator pushes), our Custom CI/CD pipeline executes all deployments on behalf of the project owner's VERCEL_TOKEN. Because the CLI execution runs under the owner's token, Vercel treats all builds as initiated by the owner, bypassing the collaborator restrictions.
> 
> *Security Note:* To prevent unauthorized developers from exposing secrets, GitHub Actions prevents secrets from being shared with workflows triggered by external repository forks. Collaborators must push branches to the main repository to trigger the preview deployment.

---

## 5. Branch Protection Recommendations

To prevent bad code from reaching production, you should configure branch protection rules for the `main` branch in GitHub (**Settings > Branches > Add branch protection rule**):

1. **Branch name pattern:** `main`
2. **Require a pull request before merging:** Checked.
   - *Require approvals:* Checked (recommend at least 1 approval).
3. **Require status checks to pass before merging:** Checked.
   - *Status checks list:* Search and add:
     - `Lint, Test, Build, and Preview Deploy` (the status check from `preview.yml`).
   - *Require branches to be up to date before merging:* Checked.
4. **Require conversation resolution before merging:** Checked (highly recommended).
5. **Restrict who can push to matching branches:** Checked (ensures only the CI/CD pipeline or admin can push directly, though all merges should go through PRs).

---

## 6. Local Deployment Scripts

We have provided scripts to run identical verification steps and deploy directly from your local machine, mimicking the CI/CD environment.

### Shell Script (macOS / Linux)
```bash
# Preview deployment (default)
./scripts/deploy-local.sh

# Production deployment
./scripts/deploy-local.sh --prod
```

### PowerShell Script (Windows)
```powershell
# Preview deployment (default)
.\scripts\deploy-local.ps1

# Production deployment
.\scripts\deploy-local.ps1 --prod
```

*Note:* If you don't have the Vercel environment variables set in your shell, the script will automatically check if you are logged in using `vercel login` and run under your active developer session.

---

## 7. Rollback Procedure

If a bad release reaches production, follow these steps to perform a rollback:

### Method A: Vercel Dashboard (Instant Rollback)
1. Go to the [Vercel Dashboard](https://vercel.com).
2. Select your project.
3. Click on the **Deployments** tab.
4. Locate the last stable deployment (the one before the broken release).
5. Click the three dots `...` next to the stable deployment.
6. Click **Promote to Production**.
7. Confirm the choice. Vercel instantly routes traffic back to this build (under 2 seconds) without triggering a rebuild.

### Method B: Git Revert (Recommended for Branch Consistency)
1. On your local machine, checkout the `main` branch and pull the latest code:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Revert the commit(s) that introduced the bug:
   ```bash
   # Revert the merge commit or the specific commit
   git revert -m 1 <merge-commit-hash>
   ```
3. Commit and push the revert to `main`:
   ```bash
   git push origin main
   ```
4. The CI/CD pipeline (`deploy.yml`) will automatically trigger, build the reverted code, and deploy a stable build to production. This ensures your Git history matches the code deployed on Vercel.
