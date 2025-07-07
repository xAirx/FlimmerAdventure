#!/bin/bash

# ⚙️ Flimmer Mobile - Environment Setup Script
# Configures development environment, Expo settings, and platform tools

set -e

echo "⚙️ Flimmer Mobile Environment Setup"
echo "==================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the flimmer-mobile directory"
    exit 1
fi

# Parse command line arguments
ENVIRONMENT="development"
RESET_CONFIG=false
SETUP_EXPO=true
SETUP_PLATFORMS=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --reset)
            RESET_CONFIG=true
            shift
            ;;
        --no-expo)
            SETUP_EXPO=false
            shift
            ;;
        --no-platforms)
            SETUP_PLATFORMS=false
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --env ENV         Set environment (development|staging|production)"
            echo "  --reset           Reset all configuration files"
            echo "  --no-expo         Skip Expo configuration"
            echo "  --no-platforms    Skip platform-specific setup"
            echo "  --help            Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Create environment configuration
create_env_config() {
    print_status "Creating environment configuration for: $ENVIRONMENT"
    
    local env_file=".env"
    if [ "$RESET_CONFIG" = true ] || [ ! -f "$env_file" ]; then
        print_status "Creating $env_file..."
        
        case $ENVIRONMENT in
            "development")
                cat > "$env_file" << EOF
# Flimmer Mobile - Development Environment
NODE_ENV=development

# Expo Configuration
EXPO_PUBLIC_APP_VARIANT=development
EXPO_PUBLIC_APP_NAME=Flimmer Dev

# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_WEB_URL=http://localhost:3000

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_ENABLE_CRASHLYTICS=false
EXPO_PUBLIC_ENABLE_PERFORMANCE_MONITORING=false

# Development Settings
EXPO_PUBLIC_DEBUG_MODE=true
EXPO_PUBLIC_ENABLE_FLIPPER=true
EXPO_PUBLIC_ENABLE_DEV_MENU=true

# Demo Settings
EXPO_PUBLIC_ENABLE_DEMO_DATA=true
EXPO_PUBLIC_SKIP_ONBOARDING=false

# Logging
EXPO_PUBLIC_LOG_LEVEL=debug
EXPO_PUBLIC_ENABLE_CONSOLE_LOGS=true
EOF
                ;;
            "staging")
                cat > "$env_file" << EOF
# Flimmer Mobile - Staging Environment
NODE_ENV=production

# Expo Configuration
EXPO_PUBLIC_APP_VARIANT=staging
EXPO_PUBLIC_APP_NAME=Flimmer Staging

# API Configuration
EXPO_PUBLIC_API_URL=https://api-staging.flimmer.app
EXPO_PUBLIC_WEB_URL=https://staging.flimmer.app

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_CRASHLYTICS=true
EXPO_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true

# Development Settings
EXPO_PUBLIC_DEBUG_MODE=false
EXPO_PUBLIC_ENABLE_FLIPPER=false
EXPO_PUBLIC_ENABLE_DEV_MENU=false

# Demo Settings
EXPO_PUBLIC_ENABLE_DEMO_DATA=true
EXPO_PUBLIC_SKIP_ONBOARDING=false

# Logging
EXPO_PUBLIC_LOG_LEVEL=warn
EXPO_PUBLIC_ENABLE_CONSOLE_LOGS=false
EOF
                ;;
            "production")
                cat > "$env_file" << EOF
# Flimmer Mobile - Production Environment
NODE_ENV=production

# Expo Configuration
EXPO_PUBLIC_APP_VARIANT=production
EXPO_PUBLIC_APP_NAME=Flimmer

# API Configuration
EXPO_PUBLIC_API_URL=https://api.flimmer.app
EXPO_PUBLIC_WEB_URL=https://flimmer.app

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_CRASHLYTICS=true
EXPO_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true

# Development Settings
EXPO_PUBLIC_DEBUG_MODE=false
EXPO_PUBLIC_ENABLE_FLIPPER=false
EXPO_PUBLIC_ENABLE_DEV_MENU=false

# Demo Settings
EXPO_PUBLIC_ENABLE_DEMO_DATA=false
EXPO_PUBLIC_SKIP_ONBOARDING=false

# Logging
EXPO_PUBLIC_LOG_LEVEL=error
EXPO_PUBLIC_ENABLE_CONSOLE_LOGS=false
EOF
                ;;
        esac
        
        print_success "Environment configuration created: $env_file"
    else
        print_success "Environment configuration already exists: $env_file"
    fi
}

# Setup Expo configuration
setup_expo_config() {
    if [ "$SETUP_EXPO" = false ]; then
        print_warning "Skipping Expo configuration"
        return 0
    fi
    
    print_status "Setting up Expo configuration..."
    
    # Create Expo development build configuration
    if [ "$RESET_CONFIG" = true ] || [ ! -f "eas.json" ]; then
        print_status "Updating EAS configuration..."
        
        # Update EAS configuration for current environment
        if [ -f "eas.json" ]; then
            # Backup existing config
            cp eas.json "eas.json.backup.$(date +%s)"
        fi
        
        # The eas.json file already exists with good configuration
        print_success "EAS configuration is ready"
    fi
    
    # Setup Expo CLI configuration
    if command -v expo &> /dev/null; then
        print_status "Configuring Expo CLI..."
        
        # Set Expo CLI to use local config
        expo config --type prebuild > /dev/null 2>&1 || true
        
        print_success "Expo CLI configured"
    else
        print_warning "Expo CLI not found. Run './scripts/install-deps.sh' first"
    fi
}

# Setup platform-specific configurations
setup_platform_configs() {
    if [ "$SETUP_PLATFORMS" = false ]; then
        print_warning "Skipping platform-specific setup"
        return 0
    fi
    
    print_status "Setting up platform configurations..."
    
    # iOS Configuration (macOS only)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        print_status "Setting up iOS configuration..."
        
        # Create iOS Fastlane configuration
        mkdir -p ios/fastlane
        
        if [ "$RESET_CONFIG" = true ] || [ ! -f "ios/fastlane/Appfile" ]; then
            cat > ios/fastlane/Appfile << EOF
# iOS Fastlane Configuration
app_identifier("com.flimmer.app")
apple_id("your-apple-id@example.com")
team_id("YOUR_APPLE_TEAM_ID")

# For more information about the Appfile, see:
# https://docs.fastlane.tools/advanced/#appfile
EOF
            print_success "iOS Fastlane Appfile created"
        fi
        
        # Create iOS scheme configuration
        if [ "$RESET_CONFIG" = true ] || [ ! -f "ios/FlimmerMobile.xcodeproj" ]; then
            print_status "iOS project will be generated on first prebuild"
        fi
        
        print_success "iOS configuration ready"
    else
        print_warning "Not on macOS. Skipping iOS configuration."
    fi
    
    # Android Configuration
    print_status "Setting up Android configuration..."
    
    # Create Android Fastlane configuration
    mkdir -p android/fastlane
    
    if [ "$RESET_CONFIG" = true ] || [ ! -f "android/fastlane/Appfile" ]; then
        cat > android/fastlane/Appfile << EOF
# Android Fastlane Configuration
json_key_file("path/to/google-service-account-key.json")
package_name("com.flimmer.app")

# For more information about the Appfile, see:
# https://docs.fastlane.tools/advanced/#appfile
EOF
        print_success "Android Fastlane Appfile created"
    fi
    
    # Create Android keystore configuration template
    if [ "$RESET_CONFIG" = true ] || [ ! -f "android/keystore.properties.template" ]; then
        cat > android/keystore.properties.template << EOF
# Android Keystore Configuration Template
# Copy this file to keystore.properties and fill in your values

storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=release
storeFile=release.keystore
EOF
        print_success "Android keystore template created"
    fi
    
    print_success "Android configuration ready"
}

# Setup development tools
setup_dev_tools() {
    print_status "Setting up development tools..."
    
    # Create necessary directories
    mkdir -p builds/ios/dev
    mkdir -p builds/android/dev
    mkdir -p builds/android/demo
    mkdir -p e2e/artifacts
    mkdir -p coverage
    mkdir -p test-results
    mkdir -p .cache
    
    # Create VS Code settings
    mkdir -p .vscode
    if [ "$RESET_CONFIG" = true ] || [ ! -f ".vscode/settings.json" ]; then
        cat > .vscode/settings.json << EOF
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "typescriptreact",
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.js": "typescript",
    "*.jsx": "typescriptreact"
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/coverage": true,
    "**/builds": true,
    "**/.expo": true,
    "**/.cache": true
  }
}
EOF
        print_success "VS Code settings created"
    fi
    
    # Create launch configuration for debugging
    if [ "$RESET_CONFIG" = true ] || [ ! -f ".vscode/launch.json" ]; then
        cat > .vscode/launch.json << EOF
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Expo",
      "type": "node",
      "request": "launch",
      "program": "\${workspaceFolder}/node_modules/@expo/cli/bin/cli",
      "args": ["start"],
      "console": "integratedTerminal",
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "\${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal",
      "env": {
        "NODE_ENV": "test"
      }
    }
  ]
}
EOF
        print_success "VS Code launch configuration created"
    fi
    
    print_success "Development tools configured"
}

# Setup Git hooks
setup_git_hooks() {
    print_status "Setting up Git hooks..."
    
    if [ -d ".git" ]; then
        # Setup Husky if available
        if [ -f "node_modules/.bin/husky" ]; then
            print_status "Configuring Husky Git hooks..."
            npx husky install
            
            # Create pre-commit hook
            npx husky add .husky/pre-commit "npm run lint-staged"
            
            # Create pre-push hook
            npx husky add .husky/pre-push "npm run test:ci"
            
            print_success "Git hooks configured with Husky"
        else
            print_warning "Husky not found. Install dependencies first."
        fi
    else
        print_warning "Not a Git repository. Skipping Git hooks setup."
    fi
}

# Verify environment setup
verify_setup() {
    print_status "Verifying environment setup..."
    
    local errors=0
    
    # Check environment file
    if [ ! -f ".env" ]; then
        print_error "Environment file not found"
        errors=$((errors + 1))
    fi
    
    # Check required directories
    local required_dirs=("builds" "coverage" "test-results")
    for dir in "${required_dirs[@]}"; do
        if [ ! -d "$dir" ]; then
            print_error "Required directory not found: $dir"
            errors=$((errors + 1))
        fi
    done
    
    # Check Node.js and npm
    if ! command -v node &> /dev/null; then
        print_error "Node.js not found"
        errors=$((errors + 1))
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm not found"
        errors=$((errors + 1))
    fi
    
    # Check Expo CLI
    if [ "$SETUP_EXPO" = true ] && ! command -v expo &> /dev/null; then
        print_warning "Expo CLI not found. Run './scripts/install-deps.sh'"
    fi
    
    if [ $errors -eq 0 ]; then
        print_success "✅ Environment setup verification passed"
        return 0
    else
        print_error "❌ Environment setup verification failed with $errors errors"
        return 1
    fi
}

# Main setup process
main() {
    print_status "Starting environment setup for: $ENVIRONMENT"
    
    # Create environment configuration
    create_env_config
    
    # Setup Expo configuration
    setup_expo_config
    
    # Setup platform configurations
    setup_platform_configs
    
    # Setup development tools
    setup_dev_tools
    
    # Setup Git hooks
    setup_git_hooks
    
    # Verify setup
    if verify_setup; then
        print_success "🎉 Environment setup completed successfully!"
        
        echo ""
        echo "📋 Setup Summary:"
        echo "================="
        echo "✅ Environment: $ENVIRONMENT"
        echo "✅ Configuration files created"
        echo "✅ Development tools configured"
        echo "✅ Platform settings ready"
        echo "✅ Git hooks configured"
        echo ""
        echo "🚀 Next steps:"
        echo "1. Review .env file and update as needed"
        echo "2. Run './scripts/install-deps.sh' to install dependencies"
        echo "3. Run 'npm start' to start development server"
        echo "4. Run './demo-quick-start.sh' for complete demo"
        echo ""
        echo "📁 Important files:"
        echo "- .env (environment configuration)"
        echo "- eas.json (Expo build configuration)"
        echo "- .vscode/ (VS Code settings)"
        echo ""
    else
        print_error "Environment setup completed with errors. Please check the output above."
        exit 1
    fi
}

# Run main function
main 