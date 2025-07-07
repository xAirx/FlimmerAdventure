#!/bin/bash

# 🛠️ Flimmer Mobile - Script Manager
# Central hub for all development, testing, and deployment scripts

set -e

echo "🛠️ Flimmer Mobile Script Manager"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${CYAN}$1${NC}"
}

print_option() {
    echo -e "${GREEN}$1${NC} - $2"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}[ERROR]${NC} Please run this script from the flimmer-mobile directory"
    exit 1
fi

# Show help menu
show_help() {
    echo ""
    print_header "📋 Available Scripts:"
    echo ""
    
    print_header "🧹 Cleaning & Setup:"
    print_option "clean" "Clean repository (caches, node_modules, builds)"
    print_option "setup" "Setup development environment"
    print_option "install" "Install dependencies (npm/yarn/pnpm)"
    echo ""
    
    print_header "🧪 Testing & Quality:"
    print_option "test" "Run comprehensive test suite"
    print_option "test-unit" "Run unit tests only"
    print_option "test-e2e" "Run E2E tests only"
    print_option "test-coverage" "Run tests with coverage report"
    print_option "test-watch" "Run tests in watch mode"
    echo ""
    
    print_header "🚀 CI/CD & Deployment:"
    print_option "ci" "Run full CI pipeline"
    print_option "build-demo" "Build demo apps for presentation"
    print_option "build-dev" "Build development versions"
    print_option "build-staging" "Build staging versions"
    print_option "build-production" "Build production versions"
    echo ""
    
    print_header "🎬 Demo & Presentation:"
    print_option "demo" "Start complete demo (web + mobile)"
    print_option "demo-mobile" "Start mobile app only"
    print_option "demo-web" "Start web dashboard only"
    echo ""
    
    print_header "⚙️ Configuration:"
    print_option "env-dev" "Setup development environment"
    print_option "env-staging" "Setup staging environment"
    print_option "env-production" "Setup production environment"
    print_option "reset-config" "Reset all configuration files"
    echo ""
    
    print_header "📊 Analysis & Reports:"
    print_option "analyze" "Analyze bundle size and performance"
    print_option "security" "Run security audit"
    print_option "lint" "Run code linting"
    print_option "type-check" "Run TypeScript type checking"
    echo ""
    
    print_header "🔧 Utilities:"
    print_option "logs" "View development logs"
    print_option "cache-clear" "Clear all caches"
    print_option "deps-update" "Update dependencies"
    print_option "health-check" "Check system health"
    echo ""
    
    echo "Usage: $0 <script-name> [options]"
    echo "Example: $0 test --coverage"
    echo "Example: $0 demo"
    echo "Example: $0 env-dev --reset"
    echo ""
}

# Execute script based on command
execute_script() {
    local cmd="$1"
    shift # Remove first argument, pass rest as options
    
    case $cmd in
        "clean")
            echo "🧹 Cleaning repository..."
            ./scripts/clean-repo.sh "$@"
            ;;
        "setup")
            echo "⚙️ Setting up environment..."
            ./scripts/setup-env.sh "$@"
            ;;
        "install")
            echo "📦 Installing dependencies..."
            ./scripts/install-deps.sh "$@"
            ;;
        "test")
            echo "🧪 Running comprehensive tests..."
            ./scripts/test.sh "$@"
            ;;
        "test-unit")
            echo "🧪 Running unit tests..."
            ./scripts/test.sh --unit "$@"
            ;;
        "test-e2e")
            echo "🧪 Running E2E tests..."
            ./scripts/test.sh --e2e "$@"
            ;;
        "test-coverage")
            echo "🧪 Running tests with coverage..."
            ./scripts/test.sh --coverage "$@"
            ;;
        "test-watch")
            echo "🧪 Running tests in watch mode..."
            ./scripts/test.sh --watch "$@"
            ;;
        "ci")
            echo "🚀 Running CI pipeline..."
            ./scripts/ci.sh "$@"
            ;;
        "build-demo")
            echo "📱 Building demo apps..."
            npm run fastlane:demo
            ;;
        "build-dev")
            echo "🔨 Building development versions..."
            npm run build:all
            ;;
        "build-staging")
            echo "🔨 Building staging versions..."
            npm run fastlane:ios:staging &
            npm run fastlane:android:staging &
            wait
            ;;
        "build-production")
            echo "🔨 Building production versions..."
            npm run fastlane:ios:production &
            npm run fastlane:android:production &
            wait
            ;;
        "demo")
            echo "🎬 Starting complete demo..."
            ./demo-quick-start.sh "$@"
            ;;
        "demo-mobile")
            echo "📱 Starting mobile app..."
            npm start
            ;;
        "demo-web")
            echo "💻 Starting web dashboard..."
            cd ../nextjs-poc && npm run dev
            ;;
        "env-dev")
            echo "⚙️ Setting up development environment..."
            ./scripts/setup-env.sh --env development "$@"
            ;;
        "env-staging")
            echo "⚙️ Setting up staging environment..."
            ./scripts/setup-env.sh --env staging "$@"
            ;;
        "env-production")
            echo "⚙️ Setting up production environment..."
            ./scripts/setup-env.sh --env production "$@"
            ;;
        "reset-config")
            echo "🔄 Resetting configuration..."
            ./scripts/setup-env.sh --reset "$@"
            ;;
        "analyze")
            echo "📊 Analyzing bundle..."
            npm run analyze-bundle 2>/dev/null || echo "Bundle analysis not configured"
            ;;
        "security")
            echo "🔒 Running security audit..."
            npm audit --audit-level high
            ;;
        "lint")
            echo "📝 Running linter..."
            npm run lint
            ;;
        "type-check")
            echo "📝 Running type check..."
            npm run type-check
            ;;
        "logs")
            echo "📋 Viewing logs..."
            if [ -f "metro.log" ]; then
                tail -f metro.log
            else
                echo "No log files found. Start development server first."
            fi
            ;;
        "cache-clear")
            echo "🧹 Clearing caches..."
            npm cache clean --force
            expo r -c 2>/dev/null || true
            ;;
        "deps-update")
            echo "📦 Updating dependencies..."
            npm update
            ;;
        "health-check")
            echo "🏥 Checking system health..."
            echo "Node.js: $(node --version)"
            echo "npm: $(npm --version)"
            echo "Expo CLI: $(expo --version 2>/dev/null || echo 'Not installed')"
            echo "Git: $(git --version)"
            echo "Platform: $(uname -s)"
            echo "Working Directory: $(pwd)"
            if [ -f ".env" ]; then
                echo "Environment: $(grep EXPO_PUBLIC_APP_VARIANT .env | cut -d'=' -f2)"
            else
                echo "Environment: Not configured"
            fi
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            echo -e "${RED}[ERROR]${NC} Unknown script: $cmd"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Interactive mode if no arguments provided
interactive_mode() {
    while true; do
        echo ""
        print_header "🛠️ Interactive Script Manager"
        echo ""
        echo "Select a category:"
        echo "1) 🧹 Cleaning & Setup"
        echo "2) 🧪 Testing & Quality"
        echo "3) 🚀 CI/CD & Deployment"
        echo "4) 🎬 Demo & Presentation"
        echo "5) ⚙️ Configuration"
        echo "6) 📊 Analysis & Reports"
        echo "7) 🔧 Utilities"
        echo "8) ❓ Help"
        echo "9) 🚪 Exit"
        echo ""
        read -p "Enter your choice (1-9): " choice
        
        case $choice in
            1)
                echo ""
                echo "🧹 Cleaning & Setup:"
                echo "1) Clean repository"
                echo "2) Setup environment"
                echo "3) Install dependencies"
                echo ""
                read -p "Enter choice (1-3): " subchoice
                case $subchoice in
                    1) execute_script "clean" ;;
                    2) execute_script "setup" ;;
                    3) execute_script "install" ;;
                    *) echo "Invalid choice" ;;
                esac
                ;;
            2)
                echo ""
                echo "🧪 Testing & Quality:"
                echo "1) Run all tests"
                echo "2) Run unit tests"
                echo "3) Run E2E tests"
                echo "4) Run with coverage"
                echo "5) Run in watch mode"
                echo ""
                read -p "Enter choice (1-5): " subchoice
                case $subchoice in
                    1) execute_script "test" ;;
                    2) execute_script "test-unit" ;;
                    3) execute_script "test-e2e" ;;
                    4) execute_script "test-coverage" ;;
                    5) execute_script "test-watch" ;;
                    *) echo "Invalid choice" ;;
                esac
                ;;
            3)
                echo ""
                echo "🚀 CI/CD & Deployment:"
                echo "1) Run CI pipeline"
                echo "2) Build demo apps"
                echo "3) Build development"
                echo "4) Build staging"
                echo "5) Build production"
                echo ""
                read -p "Enter choice (1-5): " subchoice
                case $subchoice in
                    1) execute_script "ci" ;;
                    2) execute_script "build-demo" ;;
                    3) execute_script "build-dev" ;;
                    4) execute_script "build-staging" ;;
                    5) execute_script "build-production" ;;
                    *) echo "Invalid choice" ;;
                esac
                ;;
            4)
                echo ""
                echo "🎬 Demo & Presentation:"
                echo "1) Complete demo (web + mobile)"
                echo "2) Mobile app only"
                echo "3) Web dashboard only"
                echo ""
                read -p "Enter choice (1-3): " subchoice
                case $subchoice in
                    1) execute_script "demo" ;;
                    2) execute_script "demo-mobile" ;;
                    3) execute_script "demo-web" ;;
                    *) echo "Invalid choice" ;;
                esac
                ;;
            5)
                echo ""
                echo "⚙️ Configuration:"
                echo "1) Development environment"
                echo "2) Staging environment"
                echo "3) Production environment"
                echo "4) Reset configuration"
                echo ""
                read -p "Enter choice (1-4): " subchoice
                case $subchoice in
                    1) execute_script "env-dev" ;;
                    2) execute_script "env-staging" ;;
                    3) execute_script "env-production" ;;
                    4) execute_script "reset-config" ;;
                    *) echo "Invalid choice" ;;
                esac
                ;;
            6)
                echo ""
                echo "📊 Analysis & Reports:"
                echo "1) Bundle analysis"
                echo "2) Security audit"
                echo "3) Code linting"
                echo "4) Type checking"
                echo ""
                read -p "Enter choice (1-4): " subchoice
                case $subchoice in
                    1) execute_script "analyze" ;;
                    2) execute_script "security" ;;
                    3) execute_script "lint" ;;
                    4) execute_script "type-check" ;;
                    *) echo "Invalid choice" ;;
                esac
                ;;
            7)
                echo ""
                echo "🔧 Utilities:"
                echo "1) View logs"
                echo "2) Clear caches"
                echo "3) Update dependencies"
                echo "4) Health check"
                echo ""
                read -p "Enter choice (1-4): " subchoice
                case $subchoice in
                    1) execute_script "logs" ;;
                    2) execute_script "cache-clear" ;;
                    3) execute_script "deps-update" ;;
                    4) execute_script "health-check" ;;
                    *) echo "Invalid choice" ;;
                esac
                ;;
            8)
                show_help
                ;;
            9)
                echo "👋 Goodbye!"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid choice. Please enter 1-9.${NC}"
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Main execution
main() {
    if [ $# -eq 0 ]; then
        # No arguments provided, run interactive mode
        interactive_mode
    else
        # Arguments provided, execute specific script
        execute_script "$@"
    fi
}

# Run main function
main "$@" 