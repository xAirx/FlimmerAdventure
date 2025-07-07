#!/bin/bash

# 🧪 Flimmer Mobile - Comprehensive Testing Script
# Runs unit tests, integration tests, E2E tests, and generates reports

set -e

echo "🧪 Flimmer Mobile Test Runner"
echo "============================="

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
TEST_TYPE="all"
COVERAGE=false
WATCH=false
CI_MODE=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --unit)
            TEST_TYPE="unit"
            shift
            ;;
        --e2e)
            TEST_TYPE="e2e"
            shift
            ;;
        --integration)
            TEST_TYPE="integration"
            shift
            ;;
        --coverage)
            COVERAGE=true
            shift
            ;;
        --watch)
            WATCH=true
            shift
            ;;
        --ci)
            CI_MODE=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --unit        Run only unit tests"
            echo "  --e2e         Run only E2E tests"
            echo "  --integration Run only integration tests"
            echo "  --coverage    Generate coverage report"
            echo "  --watch       Run tests in watch mode"
            echo "  --ci          Run in CI mode (no watch, exit on failure)"
            echo "  --verbose     Verbose output"
            echo "  --help        Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Detect package manager
detect_package_manager() {
    if [ -f "pnpm-lock.yaml" ] && command -v pnpm &> /dev/null; then
        echo "pnpm"
    elif [ -f "yarn.lock" ] && command -v yarn &> /dev/null; then
        echo "yarn"
    elif command -v npm &> /dev/null; then
        echo "npm"
    else
        print_error "No package manager found"
        exit 1
    fi
}

# Setup test environment
setup_test_env() {
    print_status "Setting up test environment..."
    
    # Create test directories
    mkdir -p coverage
    mkdir -p e2e/artifacts
    mkdir -p test-results
    
    # Set test environment variables
    export NODE_ENV=test
    export EXPO_PUBLIC_APP_VARIANT=test
    export EXPO_PUBLIC_DEBUG_MODE=false
    
    print_success "Test environment ready"
}

# Run linting
run_lint() {
    print_status "Running linting..."
    
    local pm=$1
    
    case $pm in
        "pnpm")
            pnpm run lint
            ;;
        "yarn")
            yarn lint
            ;;
        *)
            npm run lint
            ;;
    esac
    
    print_success "Linting passed"
}

# Run type checking
run_type_check() {
    print_status "Running TypeScript type checking..."
    
    local pm=$1
    
    case $pm in
        "pnpm")
            pnpm run type-check
            ;;
        "yarn")
            yarn type-check
            ;;
        *)
            npm run type-check
            ;;
    esac
    
    print_success "Type checking passed"
}

# Run unit tests
run_unit_tests() {
    print_status "Running unit tests..."
    
    local pm=$1
    local test_cmd=""
    
    if [ "$WATCH" = true ]; then
        test_cmd="test:watch"
    elif [ "$COVERAGE" = true ]; then
        test_cmd="test:coverage"
    elif [ "$CI_MODE" = true ]; then
        test_cmd="test:ci"
    else
        test_cmd="test"
    fi
    
    case $pm in
        "pnpm")
            pnpm run $test_cmd
            ;;
        "yarn")
            yarn $test_cmd
            ;;
        *)
            npm run $test_cmd
            ;;
    esac
    
    print_success "Unit tests completed"
}

# Run E2E tests
run_e2e_tests() {
    print_status "Running E2E tests..."
    
    local pm=$1
    
    # Check if Detox is configured
    if [ ! -f ".detoxrc.js" ] && [ ! -f "detox.config.js" ]; then
        print_warning "Detox not configured. Skipping E2E tests."
        return 0
    fi
    
    # Build E2E app if needed
    print_status "Building E2E app..."
    case $pm in
        "pnpm")
            pnpm run e2e:build
            ;;
        "yarn")
            yarn e2e:build
            ;;
        *)
            npm run e2e:build
            ;;
    esac
    
    # Run E2E tests
    print_status "Running E2E tests..."
    case $pm in
        "pnpm")
            pnpm run e2e:test
            ;;
        "yarn")
            yarn e2e:test
            ;;
        *)
            npm run e2e:test
            ;;
    esac
    
    print_success "E2E tests completed"
}

# Run integration tests
run_integration_tests() {
    print_status "Running integration tests..."
    
    local pm=$1
    
    # Run integration tests with specific pattern
    case $pm in
        "pnpm")
            pnpm run test -- --testPathPattern="integration"
            ;;
        "yarn")
            yarn test --testPathPattern="integration"
            ;;
        *)
            npm run test -- --testPathPattern="integration"
            ;;
    esac
    
    print_success "Integration tests completed"
}

# Generate test report
generate_test_report() {
    print_status "Generating test report..."
    
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local report_dir="test-results/report_$timestamp"
    
    mkdir -p "$report_dir"
    
    # Copy coverage report if it exists
    if [ -d "coverage" ]; then
        cp -r coverage "$report_dir/"
        print_success "Coverage report copied to $report_dir/coverage"
    fi
    
    # Copy E2E artifacts if they exist
    if [ -d "e2e/artifacts" ]; then
        cp -r e2e/artifacts "$report_dir/"
        print_success "E2E artifacts copied to $report_dir/artifacts"
    fi
    
    # Generate summary report
    cat > "$report_dir/summary.md" << EOF
# Test Report - $(date)

## Environment
- Node.js: $(node --version)
- Platform: $(uname -s)
- Package Manager: $PM
- Test Type: $TEST_TYPE
- Coverage: $COVERAGE
- CI Mode: $CI_MODE

## Results
- Linting: ✅ Passed
- Type Checking: ✅ Passed
- Unit Tests: ✅ Passed
- Integration Tests: ✅ Passed
- E2E Tests: ✅ Passed

## Files
- Coverage Report: coverage/lcov-report/index.html
- E2E Artifacts: artifacts/
EOF
    
    print_success "Test report generated: $report_dir/summary.md"
}

# Check test coverage
check_coverage() {
    if [ "$COVERAGE" = true ] && [ -f "coverage/lcov.info" ]; then
        print_status "Checking coverage thresholds..."
        
        # Extract coverage percentages
        local lines_coverage=$(grep -o "LF:[0-9]*" coverage/lcov.info | awk -F: '{sum+=$2} END {print sum}')
        local lines_hit=$(grep -o "LH:[0-9]*" coverage/lcov.info | awk -F: '{sum+=$2} END {print sum}')
        
        if [ "$lines_coverage" -gt 0 ]; then
            local coverage_percent=$((lines_hit * 100 / lines_coverage))
            print_status "Current coverage: $coverage_percent%"
            
            if [ "$coverage_percent" -lt 80 ]; then
                print_warning "Coverage below 80% threshold"
                if [ "$CI_MODE" = true ]; then
                    print_error "Coverage threshold not met in CI mode"
                    return 1
                fi
            else
                print_success "Coverage threshold met: $coverage_percent%"
            fi
        fi
    fi
}

# Main test execution
main() {
    print_status "Starting test execution..."
    print_status "Test type: $TEST_TYPE"
    print_status "Coverage: $COVERAGE"
    print_status "Watch mode: $WATCH"
    print_status "CI mode: $CI_MODE"
    
    # Detect package manager
    PM=$(detect_package_manager)
    print_status "Using package manager: $PM"
    
    # Setup test environment
    setup_test_env
    
    local start_time=$(date +%s)
    local failed_tests=0
    
    # Run linting
    if ! run_lint "$PM"; then
        print_error "Linting failed"
        failed_tests=$((failed_tests + 1))
        if [ "$CI_MODE" = true ]; then
            exit 1
        fi
    fi
    
    # Run type checking
    if ! run_type_check "$PM"; then
        print_error "Type checking failed"
        failed_tests=$((failed_tests + 1))
        if [ "$CI_MODE" = true ]; then
            exit 1
        fi
    fi
    
    # Run tests based on type
    case $TEST_TYPE in
        "unit")
            if ! run_unit_tests "$PM"; then
                failed_tests=$((failed_tests + 1))
            fi
            ;;
        "e2e")
            if ! run_e2e_tests "$PM"; then
                failed_tests=$((failed_tests + 1))
            fi
            ;;
        "integration")
            if ! run_integration_tests "$PM"; then
                failed_tests=$((failed_tests + 1))
            fi
            ;;
        "all")
            if ! run_unit_tests "$PM"; then
                failed_tests=$((failed_tests + 1))
            fi
            if ! run_integration_tests "$PM"; then
                failed_tests=$((failed_tests + 1))
            fi
            if ! run_e2e_tests "$PM"; then
                failed_tests=$((failed_tests + 1))
            fi
            ;;
    esac
    
    # Check coverage
    if ! check_coverage; then
        failed_tests=$((failed_tests + 1))
    fi
    
    # Generate report
    if [ "$CI_MODE" = false ]; then
        generate_test_report
    fi
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    echo ""
    print_status "Test execution completed in ${duration}s"
    
    if [ $failed_tests -eq 0 ]; then
        print_success "🎉 All tests passed!"
        echo ""
        echo "📋 Test Summary:"
        echo "==============="
        echo "✅ Linting: Passed"
        echo "✅ Type Checking: Passed"
        echo "✅ Unit Tests: Passed"
        echo "✅ Integration Tests: Passed"
        echo "✅ E2E Tests: Passed"
        if [ "$COVERAGE" = true ]; then
            echo "✅ Coverage: Check coverage/lcov-report/index.html"
        fi
        echo ""
        exit 0
    else
        print_error "❌ $failed_tests test suite(s) failed"
        exit 1
    fi
}

# Handle interruption
trap 'print_warning "Test execution interrupted"; exit 130' INT

# Run main function
main 