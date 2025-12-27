# 🦊 GitLab Complete Guide for Beginners

> Step-by-step instructions for hosting this project on GitLab

## Table of Contents
1. [Create a GitLab Account](#1-create-a-gitlab-account)
2. [Create a New Project](#2-create-a-new-project)
3. [Upload the Code](#3-upload-the-code)
4. [Verify CI/CD Pipeline](#4-verify-cicd-pipeline)
5. [Share with Workshop Participants](#5-share-with-workshop-participants)
6. [Troubleshooting](#troubleshooting)

---

## 1. Create a GitLab Account

If you don't have a GitLab account:

1. Go to [https://gitlab.com](https://gitlab.com)
2. Click **"Register"** or **"Sign up"**
3. Fill in your details and verify your email
4. Complete any verification steps (phone number may be required for free accounts)

---

## 2. Create a New Project

### Option A: Via GitLab Web Interface (Easiest)

1. Log into GitLab
2. Click the **"+"** button in the top navigation bar
3. Select **"New project/repository"**
4. Choose **"Create blank project"**
5. Fill in the details:
   - **Project name**: `text-analysis-service`
   - **Project slug**: `text-analysis-service` (auto-filled)
   - **Visibility Level**: Choose one:
     - 🔓 **Public** - Anyone can see (recommended for workshops)
     - 🔒 **Private** - Only you and invited members can see
   - **Initialize repository with a README**: ❌ **UNCHECK THIS** (we have our own)
6. Click **"Create project"**

### What You'll See

After creating, GitLab shows you the empty project page with instructions. **Don't panic!** We'll upload our code next.

---

## 3. Upload the Code

### Option A: Using Git Command Line (Recommended)

Open a terminal/PowerShell in the project folder:

```powershell
# Navigate to your project folder
cd c:\Users\User\Documents\workshops\demo-app

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Text Analysis Service workshop"

# Add GitLab as remote (replace YOUR_USERNAME with your GitLab username)
git remote add origin https://gitlab.com/YOUR_USERNAME/text-analysis-service.git

# Push to GitLab
git push -u origin main
```

**First time pushing?** GitLab will ask for credentials:
- **Username**: Your GitLab username
- **Password**: Your GitLab password OR a Personal Access Token (see below)

### Creating a Personal Access Token (if password doesn't work)

1. In GitLab, click your avatar (top right) → **"Edit profile"**
2. Left sidebar → **"Access Tokens"**
3. Click **"Add new token"**
4. Fill in:
   - **Token name**: `git-push`
   - **Expiration date**: Set a date (e.g., 1 year from now)
   - **Scopes**: Check `write_repository`
5. Click **"Create personal access token"**
6. **COPY THE TOKEN NOW** (you won't see it again!)
7. Use this token as your password when pushing

### Option B: Upload Files via Web Interface

If you're not comfortable with Git:

1. In your GitLab project, click **"+"** → **"Upload file"**
2. Drag and drop all project files
3. Add commit message: "Initial commit"
4. Click **"Upload file"**

⚠️ **Note**: This method doesn't preserve folder structure well. Use Git command line for best results.

---

## 4. Verify CI/CD Pipeline

After pushing, GitLab automatically detects `.gitlab-ci.yml` and runs the pipeline.

### Check Pipeline Status

1. In your project, click **"Build"** → **"Pipelines"** (left sidebar)
2. You should see a pipeline running or completed
3. Click on the pipeline to see details

### Pipeline Status Icons

| Icon | Meaning |
|------|---------|
| 🔵 (blue circle) | Running |
| ✅ (green checkmark) | Passed |
| ❌ (red X) | Failed |
| ⏸️ (gray) | Pending/Waiting |

### If Pipeline Fails

Don't worry! For the workshop, tests are expected to fail (intentional bugs). 

To see what failed:
1. Click on the failed pipeline
2. Click on the failed job (e.g., "test")
3. Read the log output

---

## 5. Share with Workshop Participants

### Get the Clone URL

1. Go to your project page
2. Click the **"Clone"** button (blue, top right)
3. Copy the **"Clone with HTTPS"** URL

It looks like: `https://gitlab.com/YOUR_USERNAME/text-analysis-service.git`

### Share Instructions for Participants

Send them this:

```
# Workshop Setup Instructions

1. Open a terminal/PowerShell

2. Clone the repository:
   git clone https://gitlab.com/YOUR_USERNAME/text-analysis-service.git

3. Navigate to the project:
   cd text-analysis-service

4. Install dependencies:
   npm install

5. Start the server:
   npm start

6. Open in VS Code:
   code .
```

### If Project is Private - Add Members

1. Go to project → **"Manage"** → **"Members"** (left sidebar)
2. Click **"Invite members"**
3. Enter their GitLab username or email
4. Set role: **"Developer"** (can push) or **"Reporter"** (read-only)
5. Click **"Invite"**

---

## Troubleshooting

### "remote: HTTP Basic: Access denied"

**Solution**: Use a Personal Access Token instead of password (see Section 3)

### "fatal: remote origin already exists"

**Solution**: 
```powershell
git remote remove origin
git remote add origin https://gitlab.com/YOUR_USERNAME/text-analysis-service.git
```

### "error: failed to push some refs"

**Solution**:
```powershell
git pull origin main --allow-unrelated-histories
git push origin main
```

### "The project you were looking for could not be found"

**Possible causes**:
- Wrong URL (check spelling)
- Project is private and you're not logged in
- Project doesn't exist yet

### Pipeline never runs

**Check**:
1. Is `.gitlab-ci.yml` in the root folder?
2. Go to **Settings** → **CI/CD** → **General pipelines** and ensure CI/CD is enabled

### npm install fails in pipeline

The pipeline uses Node.js Docker image. If it fails:
1. Check you have a valid `package.json`
2. Check `package-lock.json` exists (run `npm install` locally first)

---

## Quick Reference: Common Git Commands

```powershell
# Check current status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitLab
git push origin main

# Pull latest changes
git pull origin main

# See remote URLs
git remote -v
```

---

## GitLab vs GitHub: Quick Comparison

| Feature | GitLab | GitHub |
|---------|--------|--------|
| CI/CD Config | `.gitlab-ci.yml` | `.github/workflows/*.yml` |
| Navigation | Left sidebar | Top tabs |
| Merge Requests | "Merge Requests" | "Pull Requests" |
| Free Private Repos | ✅ Unlimited | ✅ Unlimited |
| Free CI Minutes | 400/month | 2000/month |

---

## Need More Help?

- [GitLab Docs](https://docs.gitlab.com/)
- [GitLab CI/CD Tutorial](https://docs.gitlab.com/ee/ci/quick_start/)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
