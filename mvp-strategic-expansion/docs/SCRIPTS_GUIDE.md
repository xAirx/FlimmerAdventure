# Flimmer Development Scripts Guide

## Overview

This guide provides comprehensive documentation for the automated development, testing, and deployment scripts available in the Flimmer project. These scripts streamline common development tasks and ensure consistent environments across the development lifecycle.

**Script Manager**: Interactive command-line tool for accessing all development scripts
**Direct Access**: Individual scripts can be run directly for specific tasks
**CI/CD Integration**: Scripts designed for both local development and automated pipelines

---

## Script Manager Interface

### Interactive Menu System

**Launch Script Manager**:
```bash
./scripts.sh
```

**Available Categories**:
- **Development**: Setup, installation, and environment management
- **Testing**: Unit, integration, and end-to-end testing
- **Building**: Demo, staging, and production builds
- **Analysis**: Code quality, security, and performance analysis
- **Deployment**: CI/CD pipeline and release management

### Direct Command Access

**Syntax**: `./scripts.sh <command> [options]`

**Examples**:
```bash
./scripts.sh clean           # Clean repository
./scripts.sh test            # Run all tests
./scripts.sh build-demo      # Build demo applications
./scripts.sh analyze         # Run code analysis
```

---

## Development Scripts

### Repository Management

**Clean Repository (`clean`)**:
```bash
./scripts.sh clean
```

**Features**:
- Removes all node_modules directories
- Clears npm/yarn/pnpm caches
- Deletes build artifacts and temporary files
- Cleans Expo cache and Metro bundler cache
- Removes generated files and logs

**Use Cases**:
- Resolving dependency conflicts
- Preparing for fresh installation
- Troubleshooting build issues
- Repository maintenance

**Environment Setup (`setup`)**:
```bash
./scripts.sh setup [environment]
```

**Environments**:
- `dev`: Development environment with debug tools
- `staging`: Staging environment for testing
- `production`: Production environment configuration

**Features**:
- Configures environment variables
- Sets up development tools
- Initializes database connections
- Configures external service integrations

**Dependency Installation (`install`)**:
```bash
./scripts.sh install
```

**Features**:
- Auto-detects package manager (npm/yarn/pnpm)
- Installs dependencies for all workspaces
- Verifies installation integrity
- Updates package locks

**Package Manager Detection**:
```bash
# Priority order: pnpm > yarn > npm
if command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
elif command -v yarn &> /dev/null; then
    PACKAGE_MANAGER="yarn"
else
    PACKAGE_MANAGER="npm"
fi
```

---

## Testing Scripts

### Comprehensive Testing Suite

**Run All Tests (`test`)**:
```bash
./scripts.sh test
```

**Test Types Included**:
- Unit tests with Jest
- Integration tests with React Native Testing Library
- End-to-end tests with Detox
- Component tests with Storybook
- API tests with automated mocking

**Coverage Requirements**:
- **Minimum**: 80% overall coverage
- **Statements**: 80% minimum
- **Branches**: 75% minimum
- **Functions**: 85% minimum
- **Lines**: 80% minimum

**Unit Testing (`test-unit`)**:
```bash
./scripts.sh test-unit
```

**Features**:
- Jest configuration with React Native preset
- Automated mocking for external dependencies
- Snapshot testing for UI components
- Performance testing for critical functions

**Integration Testing (`test-integration`)**:
```bash
./scripts.sh test-integration
```

**Features**:
- Cross-component interaction testing
- API integration testing
- State management testing
- Navigation flow testing

**End-to-End Testing (`test-e2e`)**:
```bash
./scripts.sh test-e2e
```

**Features**:
- Detox configuration for iOS and Android
- Automated user interaction testing
- Cross-platform compatibility testing
- Performance and memory testing

**Coverage Analysis (`test-coverage`)**:
```bash
./scripts.sh test-coverage
```

**Features**:
- Detailed coverage reports
- HTML coverage visualization
- Coverage trend analysis
- CI/CD integration for coverage gates

---

## Build Scripts

### Multi-Platform Build System

**Demo Build (`build-demo`)**:
```bash
./scripts.sh build-demo
```

**Outputs**:
- iOS development build for TestFlight
- Android APK for direct installation
- Web dashboard for browser testing
- QR codes for easy mobile access

**Features**:
- Optimized for demonstration purposes
- Includes sample data and demo accounts
- Fast build times for quick iterations
- Cross-platform compatibility testing

**Staging Build (`build-staging`)**:
```bash
./scripts.sh build-staging
```

**Features**:
- Production-like environment
- Staging API endpoints
- Performance optimization
- Security hardening
- Automated testing integration

**Production Build (`build-production`)**:
```bash
./scripts.sh build-production
```

**Features**:
- Full optimization and minification
- Security hardening and obfuscation
- Performance monitoring integration
- Crash reporting and analytics
- App store submission preparation

### Build Configuration

**EAS Build Integration**:
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "staging": {
      "distribution": "internal",
      "channel": "staging"
    },
    "production": {
      "distribution": "store",
      "channel": "production"
    }
  }
}
```

**Fastlane Integration**:
```ruby
# iOS Build Lane
lane :ios_build do
  match(type: "appstore")
  build_app(scheme: "Flimmer")
  upload_to_testflight
end

# Android Build Lane
lane :android_build do
  build_android_app(
    task: "bundle",
    build_type: "Release"
  )
  upload_to_play_store
end
```

---

## Analysis Scripts

### Code Quality Analysis

**Complete Analysis (`analyze`)**:
```bash
./scripts.sh analyze
```

**Analysis Types**:
- **Code Quality**: ESLint, Prettier, TypeScript compiler
- **Security**: npm audit, dependency vulnerability scanning
- **Performance**: Bundle analysis, memory profiling
- **Accessibility**: Automated accessibility testing
- **Best Practices**: Code complexity, maintainability metrics

**Security Analysis (`security`)**:
```bash
./scripts.sh security
```

**Security Checks**:
- **Dependency Vulnerabilities**: npm audit with severity filtering
- **Code Security**: Static analysis for security patterns
- **Configuration Security**: Environment variable validation
- **API Security**: Endpoint security testing

**Linting (`lint`)**:
```bash
./scripts.sh lint [--fix]
```

**Linting Rules**:
- **ESLint**: React Native, TypeScript, and accessibility rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking
- **Custom Rules**: Project-specific linting rules

**Type Checking (`type-check`)**:
```bash
./scripts.sh type-check
```

**Features**:
- Comprehensive TypeScript validation
- Cross-platform type compatibility
- Interface consistency checking
- Generic type validation

---

## Deployment Scripts

### CI/CD Pipeline Integration

**Continuous Integration (`ci`)**:
```bash
./scripts.sh ci
```

**CI Pipeline Steps**:
1. **Environment Setup**: Node.js, dependencies, tools
2. **Code Quality**: Linting, formatting, type checking
3. **Security**: Vulnerability scanning, audit checks
4. **Testing**: Unit, integration, and E2E tests
5. **Build**: Cross-platform build verification
6. **Deployment**: Staging deployment and testing

**GitHub Actions Integration**:
```yaml
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Run CI Pipeline
        run: ./scripts.sh ci
```

**Demo Deployment (`demo`)**:
```bash
./scripts.sh demo
```

**Features**:
- Automated demo environment setup
- QR code generation for mobile access
- Web dashboard deployment
- Demo data initialization

---

## Environment Management

### Multi-Environment Support

**Development Environment (`env-dev`)**:
```bash
./scripts.sh env-dev
```

**Configuration**:
- Debug mode enabled
- Hot reloading active
- Development API endpoints
- Verbose logging
- Mock data services

**Staging Environment (`env-staging`)**:
```bash
./scripts.sh env-staging
```

**Configuration**:
- Production-like settings
- Staging API endpoints
- Performance monitoring
- Limited logging
- Real data services

**Production Environment (`env-production`)**:
```bash
./scripts.sh env-production
```

**Configuration**:
- Optimized performance
- Production API endpoints
- Error reporting only
- Security hardening
- Live data services

### Environment Variables

**Required Variables**:
```bash
# API Configuration
API_BASE_URL=https://api.flimmer.com
API_KEY=your-api-key

# Authentication
AUTH_DOMAIN=flimmer.auth0.com
AUTH_CLIENT_ID=your-client-id

# Analytics
ANALYTICS_KEY=your-analytics-key
CRASHLYTICS_KEY=your-crashlytics-key

# Build Configuration
EXPO_PUBLIC_ENV=production
EAS_PROJECT_ID=your-eas-project-id
```

**Environment File Structure**:
```
.env                    # Default environment
.env.local             # Local overrides
.env.development       # Development settings
.env.staging           # Staging settings
.env.production        # Production settings
```

---

## Advanced Usage

### Custom Script Development

**Script Template**:
```bash
#!/bin/bash
set -e

# Script metadata
SCRIPT_NAME="custom-script"
SCRIPT_VERSION="1.0.0"
SCRIPT_DESCRIPTION="Custom development script"

# Helper functions
log_info() {
    echo "[INFO] $1"
}

log_error() {
    echo "[ERROR] $1" >&2
}

# Main script logic
main() {
    log_info "Starting $SCRIPT_NAME v$SCRIPT_VERSION"
    
    # Your custom logic here
    
    log_info "Script completed successfully"
}

# Execute main function
main "$@"
```

**Integration with Script Manager**:
```bash
# Add to scripts.sh
case $1 in
    "custom-script")
        ./scripts/custom-script.sh "${@:2}"
        ;;
esac
```

### Performance Optimization

**Script Performance Tips**:
- **Parallel Execution**: Use background processes for independent tasks
- **Caching**: Cache expensive operations (dependency installations, builds)
- **Incremental Operations**: Only process changed files
- **Resource Management**: Monitor and limit resource usage

**Example Parallel Execution**:
```bash
# Run tests in parallel
npm run test:unit &
npm run test:integration &
npm run test:e2e &

# Wait for all tests to complete
wait

echo "All tests completed"
```

### Error Handling

**Robust Error Handling**:
```bash
# Exit on any error
set -e

# Trap errors and cleanup
trap 'cleanup_on_error' ERR

cleanup_on_error() {
    echo "Error occurred, cleaning up..."
    # Cleanup logic here
    exit 1
}

# Validate prerequisites
check_prerequisites() {
    command -v node >/dev/null 2>&1 || {
        echo "Node.js is required but not installed."
        exit 1
    }
}
```

---

## Troubleshooting

### Common Issues

**Permission Errors**:
```bash
# Make scripts executable
chmod +x scripts.sh
chmod +x scripts/*.sh

# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

**Dependency Issues**:
```bash
# Clear all caches
./scripts.sh clean

# Reinstall dependencies
./scripts.sh install

# Verify installation
npm ls --depth=0
```

**Build Failures**:
```bash
# Clear build cache
rm -rf node_modules/.cache
rm -rf .expo

# Reset Metro bundler
npx expo start --clear
```

**Environment Issues**:
```bash
# Check environment variables
printenv | grep -E "(NODE|EXPO|API)"

# Validate configuration
./scripts.sh env-dev --validate
```

### Debug Mode

**Enable Debug Output**:
```bash
# Set debug flag
export DEBUG=1

# Run script with verbose output
./scripts.sh test --verbose
```

**Debug Information**:
- Command execution details
- Environment variable values
- Dependency version information
- Build configuration details

---

## Best Practices

### Script Development

**Guidelines**:
1. **Idempotency**: Scripts should be safe to run multiple times
2. **Error Handling**: Comprehensive error checking and cleanup
3. **Documentation**: Clear comments and usage instructions
4. **Testing**: Test scripts in different environments
5. **Versioning**: Track script versions and changes

### Performance Considerations

**Optimization Strategies**:
- **Caching**: Cache expensive operations
- **Parallelization**: Run independent tasks concurrently
- **Incremental Processing**: Only process changed files
- **Resource Monitoring**: Track CPU, memory, and disk usage

### Security Considerations

**Security Best Practices**:
- **Input Validation**: Validate all script parameters
- **Privilege Minimization**: Run with minimal required permissions
- **Secure Defaults**: Use secure default configurations
- **Audit Logging**: Log all script executions and changes

---

## Conclusion

The Flimmer development scripts provide a comprehensive automation framework for all aspects of the development lifecycle. From initial setup to production deployment, these scripts ensure consistency, reliability, and efficiency across all development tasks.

**Key Benefits**:
1. **Consistency**: Standardized processes across all environments
2. **Efficiency**: Automated common tasks and workflows
3. **Reliability**: Robust error handling and validation
4. **Scalability**: Support for multiple environments and platforms
5. **Maintainability**: Clear documentation and modular design

**Next Steps**:
1. **Familiarize**: Run through the interactive script manager
2. **Customize**: Adapt scripts for your specific needs
3. **Integrate**: Incorporate into your development workflow
4. **Contribute**: Add new scripts for common tasks
5. **Optimize**: Monitor and improve script performance 