# System Requirements for coreX AI MindLayer

This document outlines all requirements needed to work with and develop the coreX AI MindLayer project.

## Core Requirements

### IDE / Editor

- Visual Studio Code (latest version recommended)
- Required VS Code Extensions:
  - GitHub Copilot
  - GitHub Copilot Chat
  - PHP Intelephense or PHP IntelliSense

### Development Environment

- PHP 8.2 or higher
  - Required PHP Extensions:
    - json
    - mbstring
    - xml
    - curl
- Composer (latest version)
- Node.js 18.x or higher
- npm 9.x or higher
- Git 2.x or higher

### AI Services

- Active GitHub Copilot subscription
- Access to GitHub Copilot Chat

## Optional but Recommended

### Development Tools

- XAMPP/WAMP/MAMP (for local PHP development)
- Postman or similar API testing tool
- Git GUI client (e.g., GitHub Desktop, GitKraken)

### VS Code Extensions

- PHP Debug
- GitLens
- PHP DocBlocker
- EditorConfig for VS Code
- markdownlint

## Project-Specific Setup

### PHP Configuration

```ini
memory_limit = 256M
max_execution_time = 120
error_reporting = E_ALL
display_errors = On
```

### Node.js Dependencies

The following global npm packages are recommended:

```bash
npm install -g typescript
npm install -g @vscode/vsce
```

### Environment

- Ensure your system has at least 4GB of available RAM
- At least 1GB of free disk space
- Internet connection for package installation and AI services

## Development Environment Validation

You can validate your setup by running:

```bash
php --version        # Should show 8.2 or higher
composer --version   # Should show 2.x
node --version      # Should show 18.x or higher
npm --version       # Should show 9.x or higher
git --version       # Should show 2.x or higher
```

## Common Issues and Solutions

### PHP Version Issues

If you have multiple PHP versions installed:

- Windows: Update your PATH environment variable
- Linux/Mac: Use update-alternatives or modify your ~/.bash_profile

### Node.js/npm Issues

- Clear npm cache: `npm cache clean --force`
- Rebuild node_modules: `rm -rf node_modules && npm install`

### VS Code Extension Issues

- Restart VS Code after installing extensions
- Ensure GitHub Copilot is properly authenticated
- Check VS Code's extension settings for proper configuration

## Additional Resources

- [PHP Installation Guide](https://www.php.net/manual/en/install.php)
- [Composer Installation](https://getcomposer.org/download/)
- [Node.js Downloads](https://nodejs.org/)
- [VS Code Download](https://code.visualstudio.com/)
- [GitHub Copilot Setup](https://github.com/features/copilot)

## Support

If you encounter any issues with the setup:

1. Check our [GitHub Issues](https://github.com/AIQIA/corex-ai-mindlayer/issues)
2. Consult the AI-INTEGRATION.md guide
3. Contact the development team at info@aiqia.de
