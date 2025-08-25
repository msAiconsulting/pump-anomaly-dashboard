# Contributing to Pump Anomaly Detection Dashboard 🤝

Thank you for your interest in contributing to our Pump Anomaly Detection Dashboard! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

We welcome contributions from the community! Here are several ways you can help:

### **🐛 Report Bugs**
- Use the [GitHub Issues](https://github.com/msAiconsulting/pump-anomaly-dashboard/issues) page
- Include detailed steps to reproduce the bug
- Provide system information and error logs
- Add screenshots or screen recordings if applicable

### **💡 Suggest Enhancements**
- Submit feature requests through [GitHub Issues](https://github.com/msAiconsulting/pump-anomaly-dashboard/issues)
- Describe the use case and expected behavior
- Include mockups or examples if possible

### **📝 Improve Documentation**
- Fix typos or unclear explanations
- Add missing examples or use cases
- Improve code comments and inline documentation
- Update README files with new features

### **🔧 Submit Code Changes**
- Fork the repository
- Create a feature branch
- Make your changes
- Test thoroughly
- Submit a pull request

## 🚀 Development Setup

### **Prerequisites**
- Node.js 18+ (LTS recommended)
- pnpm or npm package manager
- Git
- Modern web browser
- Code editor (VS Code recommended)

### **Local Development Setup**
```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/pump-anomaly-dashboard.git
cd pump-anomaly-dashboard

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Start development server
pnpm dev

# 5. Open http://localhost:3000 in your browser
```

### **Environment Variables**
Create a `.env.local` file with:
```bash
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key  # Optional
NODE_ENV=development
```

## 📋 Pull Request Guidelines

### **Before Submitting**
- [ ] Code follows the project's style guidelines
- [ ] All tests pass
- [ ] New features include tests
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] No sensitive information in commits

### **Pull Request Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring

## Testing
- [ ] Manual testing completed
- [ ] Unit tests added/updated
- [ ] Integration tests pass

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where needed
- [ ] I have made corresponding changes to documentation
- [ ] My changes generate no new warnings
```

## 🎨 Code Style Guidelines

### **TypeScript/JavaScript**
- Use TypeScript for all new code
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for consistency
- Use async/await over Promises
- Add proper type annotations

### **React Components**
- Use functional components with hooks
- Follow naming convention: PascalCase for components
- Use proper prop types and interfaces
- Keep components focused and single-purpose

### **CSS/Styling**
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use CSS variables for theming
- Maintain consistent spacing and typography

### **File Organization**
```
components/
├── ui/              # Reusable UI components
├── Dashboard.tsx    # Main dashboard component
└── Header.tsx       # Header component

lib/
├── utils.ts         # Utility functions
└── types.ts         # TypeScript type definitions

app/
├── api/             # API routes
├── globals.css      # Global styles
└── layout.tsx       # Root layout
```

## 🧪 Testing Guidelines

### **Unit Tests**
- Test individual functions and components
- Use Jest and React Testing Library
- Aim for >80% code coverage
- Mock external dependencies

### **Integration Tests**
- Test component interactions
- Test API endpoints
- Test user workflows

### **Manual Testing**
- Test on multiple browsers
- Test responsive design
- Test accessibility features
- Test with different data sets

## 📚 Documentation Standards

### **Code Comments**
- Use JSDoc format for functions
- Explain complex logic
- Document API endpoints
- Keep comments up-to-date

### **README Updates**
- Update installation steps
- Document new features
- Add usage examples
- Update screenshots

### **API Documentation**
- Document all endpoints
- Include request/response examples
- Document error codes
- Add authentication requirements

## 🔒 Security Considerations

### **Data Protection**
- Never commit API keys or secrets
- Use environment variables for configuration
- Validate all user inputs
- Sanitize data before display

### **Access Control**
- Implement proper authentication
- Use role-based access control
- Log security events
- Regular security audits

## 🚀 Deployment Guidelines

### **Pre-deployment Checklist**
- [ ] All tests pass
- [ ] Environment variables configured
- [ ] Build process successful
- [ ] Performance metrics acceptable
- [ ] Security scan completed

### **Rollback Plan**
- Keep previous deployment artifacts
- Monitor application health
- Have rollback procedures documented
- Test rollback process regularly

## 📞 Getting Help

### **Community Support**
- [GitHub Discussions](https://github.com/msAiconsulting/pump-anomaly-dashboard/discussions)
- [GitHub Issues](https://github.com/msAiconsulting/pump-anomaly-dashboard/issues)
- [Documentation Wiki](https://github.com/msAiconsulting/pump-anomaly-dashboard/wiki)

### **Direct Contact**
- **Email**: support@msaiconsulting.com
- **Discord**: [Join our community](https://discord.gg/msaiconsulting)
- **Slack**: [Workspace invitation](https://msaiconsulting.slack.com)

## 🏆 Recognition

### **Contributor Hall of Fame**
We recognize outstanding contributors:
- **Bug Hunters**: Find and fix critical bugs
- **Feature Creators**: Implement major new features
- **Documentation Heroes**: Improve project documentation
- **Community Champions**: Help other contributors

### **Contributor Badges**
- 🌟 **First Contribution**: First successful PR
- 🐛 **Bug Hunter**: Multiple bug fixes
- 🚀 **Feature Creator**: New feature implementation
- 📚 **Documentation Hero**: Documentation improvements
- 🏆 **Community Champion**: Helping other contributors

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

## 🙏 Thank You

Thank you for contributing to the Pump Anomaly Detection Dashboard! Your contributions help make this project better for everyone in the industrial monitoring community.

---

**Happy coding! 🎉**

*Last updated: August 25, 2025*
