#!/bin/bash

# Flimmer Monorepo - Repository Cleaning Script
# Cleans all caches, dependencies, and generated files for both NextJS and mobile projects

set -e

echo "Flimmer Monorepo Repository Cleaner"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

print_header() {
    echo -e "${PURPLE}=== $1 ===${NC}"
}

# Get script directory and project paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
NEXTJS_DIR="$ROOT_DIR/nextjs-poc"
MOBILE_DIR="$ROOT_DIR/flimmer-mobile"

# Check if we're in the right directory
if [ ! -f "$ROOT_DIR/package.json" ] && [ ! -f "$ROOT_DIR/pnpm-workspace.yaml" ]; then
    print_error "Please run this script from the flimmer-challenge root directory"
    exit 1
fi

print_status "Starting monorepo cleanup..."
print_status "Root: $ROOT_DIR"
print_status "NextJS: $NEXTJS_DIR"
print_status "Mobile: $MOBILE_DIR"

# Function to safely remove directories/files
safe_remove() {
    local path="$1"
    local description="${2:-$1}"
    
    if [ -e "$path" ]; then
        print_status "Removing $description"
        rm -rf "$path"
        print_success "Removed $description"
    else
        print_warning "$description not found, skipping"
    fi
}

# Function to clean a project directory
clean_project() {
    local project_dir="$1"
    local project_name="$2"
    
    if [ ! -d "$project_dir" ]; then
        print_warning "$project_name directory not found: $project_dir"
        return
    fi
    
    print_header "Cleaning $project_name Project"
    
    cd "$project_dir"
    
    # Remove node_modules
    safe_remove "node_modules" "$project_name node_modules"
    
    # Remove package-lock files
    safe_remove "package-lock.json" "$project_name package-lock.json"
    safe_remove "yarn.lock" "$project_name yarn.lock"
    safe_remove "pnpm-lock.yaml" "$project_name pnpm-lock.yaml"
    
    # Project-specific cleaning
    if [ "$project_name" = "NextJS" ]; then
        # NextJS specific cleanup
        safe_remove ".next" "NextJS build cache"
        safe_remove "out" "NextJS export output"
        safe_remove ".vercel" "Vercel cache"
        safe_remove ".turbo" "Turbo cache"
        safe_remove "dist" "Distribution files"
        safe_remove "build" "Build output"
        
    elif [ "$project_name" = "Mobile" ]; then
        # Mobile specific cleanup
        safe_remove ".expo" "Expo cache"
        safe_remove ".expo-shared" "Expo shared cache"
        safe_remove "metro-cache" "Metro cache"
        safe_remove ".metro-cache" "Metro cache directory"
        safe_remove "android/app/build" "Android build"
        safe_remove "android/build" "Android build root"
        safe_remove "android/.gradle" "Android Gradle cache"
        safe_remove "ios/build" "iOS build"
        safe_remove "ios/Pods" "iOS Pods"
        safe_remove "ios/Podfile.lock" "iOS Podfile lock"
        safe_remove "builds" "EAS builds"
        safe_remove ".eas" "EAS cache"
        safe_remove "storybook-static" "Storybook build"
        safe_remove "fastlane/report.xml" "Fastlane report"
        safe_remove "fastlane/Preview.html" "Fastlane preview"
        safe_remove "fastlane/screenshots" "Fastlane screenshots"
        safe_remove "fastlane/test_output" "Fastlane test output"
    fi
    
    # Common cleanup for both projects
    safe_remove "coverage" "$project_name coverage reports"
    safe_remove ".nyc_output" "$project_name NYC output"
    safe_remove "test-results" "$project_name test results"
    safe_remove "e2e/artifacts" "$project_name E2E artifacts"
    safe_remove "screenshots" "$project_name screenshots"
    safe_remove "videos" "$project_name videos"
    safe_remove ".tmp" "$project_name temporary files"
    safe_remove "tmp" "$project_name tmp directory"
    safe_remove ".cache" "$project_name cache"
    safe_remove ".parcel-cache" "$project_name Parcel cache"
    
    # Clean log files
    safe_remove "*.log" "$project_name log files"
    safe_remove "npm-debug.log*" "$project_name npm debug logs"
    safe_remove "yarn-debug.log*" "$project_name yarn debug logs"
    safe_remove "yarn-error.log*" "$project_name yarn error logs"
    safe_remove "lerna-debug.log*" "$project_name lerna debug logs"
    
    # Clean OS files
    safe_remove ".DS_Store" "$project_name .DS_Store files"
    safe_remove "Thumbs.db" "$project_name Thumbs.db files"
    safe_remove "desktop.ini" "$project_name desktop.ini files"
    
    cd "$ROOT_DIR"
}

# Stop any running processes
print_header "Stopping Running Processes"
print_status "Stopping any running development servers..."
pkill -f "expo" || true
pkill -f "react-native" || true
pkill -f "metro" || true
pkill -f "next" || true
pkill -f "webpack" || true
pkill -f "vite" || true

# Clean global caches
print_header "Cleaning Global Caches"
print_status "Cleaning package manager caches..."
npm cache clean --force 2>/dev/null || true
yarn cache clean 2>/dev/null || true
pnpm store prune 2>/dev/null || true

# Clean global temporary directories
print_status "Cleaning global temporary directories..."
safe_remove "/tmp/react-native-*" "React Native temp files"
safe_remove "/tmp/metro-*" "Metro temp files"
safe_remove "/tmp/haste-map-*" "Haste map temp files"
safe_remove "/tmp/next-*" "NextJS temp files"

# Clean user-specific caches
print_status "Cleaning user-specific caches..."
safe_remove "$HOME/.expo" "Expo user cache"
safe_remove "$HOME/.metro" "Metro user cache"
safe_remove "$HOME/.rncache" "React Native user cache"
safe_remove "$HOME/.next" "NextJS user cache"

# Clean root-level files
print_header "Cleaning Root Level"
cd "$ROOT_DIR"
safe_remove "node_modules" "Root node_modules"
safe_remove "pnpm-lock.yaml" "Root pnpm-lock.yaml"
safe_remove "package-lock.json" "Root package-lock.json"
safe_remove "yarn.lock" "Root yarn.lock"
safe_remove ".turbo" "Root Turbo cache"
safe_remove "dist" "Root distribution files"
safe_remove "build" "Root build files"
safe_remove "coverage" "Root coverage reports"
safe_remove ".nyc_output" "Root NYC output"

# Clean individual projects
clean_project "$NEXTJS_DIR" "NextJS"
clean_project "$MOBILE_DIR" "Mobile"

# Clean IDE and editor files
print_header "Cleaning IDE and Editor Files"
safe_remove ".vscode/settings.json" "VSCode settings"
safe_remove ".idea" "IntelliJ IDEA files"
safe_remove "*.swp" "Vim swap files"
safe_remove "*.swo" "Vim swap files"
safe_remove "*~" "Editor backup files"

print_success "Monorepo cleanup completed!"

echo ""
echo "Cleanup Summary:"
echo "================"
echo "✅ Package manager caches cleared"
echo "✅ Node modules removed (root + projects)"
echo "✅ Lock files removed"
echo "✅ NextJS build artifacts cleared"
echo "✅ Expo and React Native caches cleared"
echo "✅ Build directories cleaned"
echo "✅ Test artifacts removed"
echo "✅ Log files cleaned"
echo "✅ Temporary files removed"
echo "✅ IDE files cleaned"
echo ""
echo "Next steps:"
echo "1. Run ./scripts.sh install to reinstall dependencies"
echo "2. Run ./scripts.sh setup to reconfigure environment"
echo "3. Run ./scripts.sh demo to start development"
echo "" 