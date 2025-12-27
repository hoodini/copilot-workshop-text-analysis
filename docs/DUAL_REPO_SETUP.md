# 🔄 GitHub & GitLab Dual Repository Setup

> Instructions for hosting this project on both GitHub and GitLab

## Overview

Since some organizations use GitLab instead of GitHub, this project can be hosted on both platforms. Git supports multiple remotes, so you can push to both.

---

## Option 1: Mirror from GitHub to GitLab

### Initial Setup (on GitHub first)

```bash
# Create repo on GitHub
gh repo create your-org/text-analysis-service --public

# Push to GitHub
git remote add origin https://github.com/your-org/text-analysis-service.git
git push -u origin main
```

### Add GitLab as Mirror

```bash
# Add GitLab as second remote
git remote add gitlab https://gitlab.com/your-org/text-analysis-service.git

# Push to GitLab
git push gitlab main
```

### Push to Both

```bash
# Push to all remotes
git push origin main && git push gitlab main

# Or create an alias
git remote add all https://github.com/your-org/text-analysis-service.git
git remote set-url --add --push all https://github.com/your-org/text-analysis-service.git
git remote set-url --add --push all https://gitlab.com/your-org/text-analysis-service.git
git push all main
```

---

## Option 2: GitLab as Primary with GitHub Mirror

If your organization primarily uses GitLab:

```bash
# Create repo on GitLab
# Push to GitLab as origin
git remote add origin https://gitlab.com/your-org/text-analysis-service.git
git push -u origin main

# Add GitHub as mirror
git remote add github https://github.com/your-org/text-analysis-service.git
git push github main
```

---

## Option 3: Automated Mirroring

### GitLab → GitHub (GitLab CI)

Add to `.gitlab-ci.yml`:

```yaml
mirror-to-github:
  stage: deploy
  only:
    - main
  script:
    - git remote add github https://$GITHUB_TOKEN@github.com/your-org/text-analysis-service.git || true
    - git push github HEAD:main
  variables:
    GITHUB_TOKEN: $GITHUB_TOKEN  # Set in GitLab CI/CD variables
```

### GitHub → GitLab (GitHub Actions)

Add `.github/workflows/mirror.yml`:

```yaml
name: Mirror to GitLab

on:
  push:
    branches: [main]

jobs:
  mirror:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Push to GitLab
        run: |
          git remote add gitlab https://oauth2:${{ secrets.GITLAB_TOKEN }}@gitlab.com/your-org/text-analysis-service.git
          git push gitlab main
```

---

## Managing Both Remotes

### View all remotes
```bash
git remote -v
```

### Pull from specific remote
```bash
git pull origin main    # From GitHub
git pull gitlab main    # From GitLab
```

### Push to specific remote
```bash
git push origin main    # To GitHub
git push gitlab main    # To GitLab
```

### Push to all remotes
```bash
# Create a script: push-all.sh
#!/bin/bash
git push origin main
git push gitlab main
echo "Pushed to GitHub and GitLab!"
```

---

## Workshop Participant Instructions

### For GitLab Users (No GitHub Access)

Clone from GitLab:
```bash
git clone https://gitlab.com/your-org/text-analysis-service.git
cd text-analysis-service
npm install
npm start
```

### For GitHub Users

Clone from GitHub:
```bash
git clone https://github.com/your-org/text-analysis-service.git
cd text-analysis-service
npm install
npm start
```

---

## Repository URLs

| Platform | URL |
|----------|-----|
| GitHub | `https://github.com/YOUR_ORG/text-analysis-service` |
| GitLab | `https://gitlab.com/YOUR_ORG/text-analysis-service` |

**Note**: Replace `YOUR_ORG` with your actual organization name.

---

## CI/CD Differences

### GitHub Actions
- Files go in `.github/workflows/`
- Uses YAML syntax
- Secrets in Settings → Secrets

### GitLab CI
- File is `.gitlab-ci.yml` at root
- Uses YAML syntax  
- Variables in Settings → CI/CD → Variables

This project includes examples of both.
