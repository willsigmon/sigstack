---
name: Security Scanning Expert
description: DevSecOps security scanning - SAST, DAST, SCA, container scanning, AI remediation
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Security Scanning Expert

Integrate security scanning into your development workflow.

## Scan Types

### SAST (Static Analysis)
- Scans source code
- Finds bugs before runtime
- Tools: Semgrep, CodeQL, SonarQube

### DAST (Dynamic Analysis)
- Tests running applications
- Finds runtime vulnerabilities
- Tools: OWASP ZAP, Nuclei

### SCA (Software Composition)
- Scans dependencies
- Finds known CVEs
- Tools: Snyk, Dependabot, Trivy

### IaC Security
- Scans Terraform/K8s configs
- Prevents misconfigurations
- Tools: Checkov, tfsec

## Top Tools (2026)

### GitLab Ultimate
- All-in-one DevSecOps
- Built-in SAST, DAST, SCA
- Secret detection
- Enterprise pricing

### Trivy (Free)
```bash
# Scan container
trivy image myapp:latest

# Scan filesystem
trivy fs .

# Scan Terraform
trivy config ./terraform
```

### OWASP ZAP (Free)
```bash
# Quick scan
zap-cli quick-scan http://localhost:3000

# Full scan in CI
docker run -t ghcr.io/zaproxy/zaproxy:stable \
  zap-full-scan.py -t http://app:3000
```

### Semgrep
```bash
# Install
pip install semgrep

# Run with auto rules
semgrep --config=auto .

# Custom rule
semgrep --config=p/security-audit .
```

## GitHub Integration

### Dependabot
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

### CodeQL
```yaml
# .github/workflows/codeql.yml
- uses: github/codeql-action/init@v3
  with:
    languages: javascript, typescript
- uses: github/codeql-action/analyze@v3
```

## AI-Powered Remediation (2026)
- Plexicus: AI writes fixes for scanner findings
- GitHub Copilot: Suggests secure alternatives
- SonarQube AI: Explains vulnerabilities

## Priority Order
1. Secrets detection (immediate)
2. Critical CVEs (1 day)
3. High-severity SAST (1 week)
4. Medium-severity (sprint)

Use when: CI/CD security, vulnerability scanning, compliance requirements
