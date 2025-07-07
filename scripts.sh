#!/bin/bash

# Flimmer Monorepo Script Manager
# Universal development scripts for NextJS and React Native mobile app

set -e

# Script metadata
SCRIPT_NAME="Flimmer Monorepo Scripts"
SCRIPT_VERSION="1.0.0"
SCRIPT_DESCRIPTION="Universal development tools for the complete Flimmer ecosystem"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Project directories
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NEXTJS_DIR="$ROOT_DIR/nextjs-poc"
MOBILE_DIR="$ROOT_DIR/flimmer-mobile"
SCRIPTS_DIR="$ROOT_DIR/scripts"

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${WHITE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Check if directory exists
check_directory() {
    local dir=$1
    local name=$2
    
    if [ ! -d "$dir" ]; then
        log_error "$name directory not found: $dir"
        return 1
    fi
    return 0
}

# Validate monorepo structure
validate_monorepo() {
    log_info "Validating monorepo structure..."
    
    if ! check_directory "$NEXTJS_DIR" "NextJS"; then
        log_error "NextJS project not found. Please ensure nextjs-poc directory exists."
        exit 1
    fi
    
    if ! check_directory "$MOBILE_DIR" "Mobile"; then
        log_error "Mobile project not found. Please ensure flimmer-mobile directory exists."
        exit 1
    fi
    
    if ! check_directory "$SCRIPTS_DIR" "Scripts"; then
        log_error "Scripts directory not found. Please ensure scripts directory exists."
        exit 1
    fi
    
    log_success "Monorepo structure validated"
}

# Display help information
show_help() {
    log_header "$SCRIPT_NAME v$SCRIPT_VERSION"
    echo
    echo -e "${CYAN}DESCRIPTION:${NC}"
    echo "  $SCRIPT_DESCRIPTION"
    echo
    echo -e "${CYAN}USAGE:${NC}"
    echo "  ./scripts.sh [command] [options]"
    echo "  ./scripts.sh                    # Interactive menu"
    echo
    echo -e "${CYAN}MONOREPO COMMANDS:${NC}"
    echo -e "  ${WHITE}clean${NC}           Clean entire monorepo (both projects)"
    echo -e "  ${WHITE}install${NC}         Install dependencies for both projects"
    echo -e "  ${WHITE}setup${NC}           Setup development environment"
    echo -e "  ${WHITE}test${NC}            Run tests for both projects"
    echo -e "  ${WHITE}ci${NC}              Run CI pipeline for both projects"
    echo -e "  ${WHITE}demo${NC}            Start complete demo (web + mobile)"
    echo
    echo -e "${CYAN}PROJECT-SPECIFIC COMMANDS:${NC}"
    echo -e "  ${WHITE}web:dev${NC}         Start NextJS development server"
    echo -e "  ${WHITE}web:build${NC}       Build NextJS for production"
    echo -e "  ${WHITE}web:test${NC}        Run NextJS tests"
    echo -e "  ${WHITE}mobile:start${NC}    Start React Native development"
    echo -e "  ${WHITE}mobile:build${NC}    Build mobile app"
    echo -e "  ${WHITE}mobile:test${NC}     Run mobile tests"
    echo
    echo -e "${CYAN}UTILITY COMMANDS:${NC}"
    echo -e "  ${WHITE}lint${NC}            Lint both projects"
    echo -e "  ${WHITE}type-check${NC}      Type check both projects"
    echo -e "  ${WHITE}security${NC}        Security audit both projects"
    echo -e "  ${WHITE}analyze${NC}         Analyze both projects"
    echo
    echo -e "${CYAN}ENVIRONMENT COMMANDS:${NC}"
    echo -e "  ${WHITE}env:dev${NC}         Setup development environment"
    echo -e "  ${WHITE}env:staging${NC}     Setup staging environment"
    echo -e "  ${WHITE}env:production${NC}  Setup production environment"
    echo
    echo -e "${CYAN}EXAMPLES:${NC}"
    echo -e "  ./scripts.sh clean          # Clean entire monorepo"
    echo -e "  ./scripts.sh demo           # Start complete demo"
    echo -e "  ./scripts.sh web:dev        # Start NextJS only"
    echo -e "  ./scripts.sh mobile:start   # Start mobile only"
    echo -e "  ./scripts.sh test           # Test both projects"
    echo
}

# Interactive menu
show_menu() {
    clear
    log_header "$SCRIPT_NAME v$SCRIPT_VERSION"
    echo
    echo -e "${CYAN}Select an option:${NC}"
    echo
    echo -e "${WHITE}MONOREPO OPERATIONS:${NC}"
    echo -e "  ${GREEN}1)${NC} Clean entire monorepo"
    echo -e "  ${GREEN}2)${NC} Install all dependencies"
    echo -e "  ${GREEN}3)${NC} Setup development environment"
    echo -e "  ${GREEN}4)${NC} Run all tests"
    echo -e "  ${GREEN}5)${NC} Run CI pipeline"
    echo -e "  ${GREEN}6)${NC} Start complete demo"
    echo
    echo -e "${WHITE}PROJECT-SPECIFIC:${NC}"
    echo -e "  ${GREEN}7)${NC} NextJS development server"
    echo -e "  ${GREEN}8)${NC} Mobile development server"
    echo -e "  ${GREEN}9)${NC} Build NextJS for production"
    echo -e "  ${GREEN}10)${NC} Build mobile app"
    echo
    echo -e "${WHITE}ANALYSIS & QUALITY:${NC}"
    echo -e "  ${GREEN}11)${NC} Lint all code"
    echo -e "  ${GREEN}12)${NC} Type check all code"
    echo -e "  ${GREEN}13)${NC} Security audit"
    echo -e "  ${GREEN}14)${NC} Complete analysis"
    echo
    echo -e "${WHITE}ENVIRONMENT:${NC}"
    echo -e "  ${GREEN}15)${NC} Setup development environment"
    echo -e "  ${GREEN}16)${NC} Setup staging environment"
    echo -e "  ${GREEN}17)${NC} Setup production environment"
    echo
    echo -e "  ${RED}0)${NC} Exit"
    echo
    echo -n "Enter your choice: "
}

# Execute menu choice
execute_menu_choice() {
    local choice=$1
    
    case $choice in
        1) execute_command "clean" ;;
        2) execute_command "install" ;;
        3) execute_command "setup" ;;
        4) execute_command "test" ;;
        5) execute_command "ci" ;;
        6) execute_command "demo" ;;
        7) execute_command "web:dev" ;;
        8) execute_command "mobile:start" ;;
        9) execute_command "web:build" ;;
        10) execute_command "mobile:build" ;;
        11) execute_command "lint" ;;
        12) execute_command "type-check" ;;
        13) execute_command "security" ;;
        14) execute_command "analyze" ;;
        15) execute_command "env:dev" ;;
        16) execute_command "env:staging" ;;
        17) execute_command "env:production" ;;
        0) 
            log_info "Goodbye!"
            exit 0
            ;;
        *)
            log_error "Invalid choice. Please try again."
            sleep 2
            ;;
    esac
}

# Execute command
execute_command() {
    local cmd=$1
    shift
    local args="$@"
    
    case $cmd in
        # Monorepo commands
        "clean")
            log_header "Cleaning Monorepo"
            "$SCRIPTS_DIR/clean-repo.sh" "$args"
            ;;
        "install")
            log_header "Installing Dependencies"
            "$SCRIPTS_DIR/install-deps.sh" "$args"
            ;;
        "setup")
            log_header "Setting Up Environment"
            "$SCRIPTS_DIR/setup-env.sh" "$args"
            ;;
        "test")
            log_header "Running Tests"
            "$SCRIPTS_DIR/test.sh" "$args"
            ;;
        "ci")
            log_header "Running CI Pipeline"
            "$SCRIPTS_DIR/ci.sh" "$args"
            ;;
        "demo")
            log_header "Starting Complete Demo"
            "$SCRIPTS_DIR/demo-setup.sh" "$args"
            ;;
            
        # Web-specific commands
        "web:dev")
            log_header "Starting NextJS Development Server"
            cd "$NEXTJS_DIR" && npm run dev
            ;;
        "web:build")
            log_header "Building NextJS for Production"
            cd "$NEXTJS_DIR" && npm run build
            ;;
        "web:test")
            log_header "Running NextJS Tests"
            cd "$NEXTJS_DIR" && npm test
            ;;
        "web:lint")
            log_header "Linting NextJS Code"
            cd "$NEXTJS_DIR" && npm run lint
            ;;
            
        # Mobile-specific commands
        "mobile:start")
            log_header "Starting React Native Development"
            cd "$MOBILE_DIR" && npm start
            ;;
        "mobile:build")
            log_header "Building Mobile App"
            cd "$MOBILE_DIR" && npm run build
            ;;
        "mobile:test")
            log_header "Running Mobile Tests"
            cd "$MOBILE_DIR" && npm test
            ;;
        "mobile:lint")
            log_header "Linting Mobile Code"
            cd "$MOBILE_DIR" && npm run lint
            ;;
            
        # Combined utility commands
        "lint")
            log_header "Linting All Code"
            log_info "Linting NextJS..."
            cd "$NEXTJS_DIR" && npm run lint
            log_info "Linting Mobile..."
            cd "$MOBILE_DIR" && npm run lint
            log_success "All linting completed"
            ;;
        "type-check")
            log_header "Type Checking All Code"
            log_info "Type checking NextJS..."
            cd "$NEXTJS_DIR" && npm run type-check 2>/dev/null || npx tsc --noEmit
            log_info "Type checking Mobile..."
            cd "$MOBILE_DIR" && npm run type-check 2>/dev/null || npx tsc --noEmit
            log_success "All type checking completed"
            ;;
        "security")
            log_header "Security Audit"
            log_info "Auditing NextJS..."
            cd "$NEXTJS_DIR" && npm audit
            log_info "Auditing Mobile..."
            cd "$MOBILE_DIR" && npm audit
            log_success "Security audit completed"
            ;;
        "analyze")
            log_header "Complete Analysis"
            execute_command "lint"
            execute_command "type-check"
            execute_command "security"
            log_success "Complete analysis finished"
            ;;
            
        # Environment commands
        "env:dev")
            log_header "Setting Up Development Environment"
            "$SCRIPTS_DIR/setup-env.sh" dev
            ;;
        "env:staging")
            log_header "Setting Up Staging Environment"
            "$SCRIPTS_DIR/setup-env.sh" staging
            ;;
        "env:production")
            log_header "Setting Up Production Environment"
            "$SCRIPTS_DIR/setup-env.sh" production
            ;;
            
        # Help
        "help"|"-h"|"--help")
            show_help
            ;;
            
        *)
            log_error "Unknown command: $cmd"
            echo "Use './scripts.sh help' for available commands"
            exit 1
            ;;
    esac
}

# Main execution
main() {
    # Validate monorepo structure
    validate_monorepo
    
    # If no arguments, show interactive menu
    if [ $# -eq 0 ]; then
        while true; do
            show_menu
            read -r choice
            execute_menu_choice "$choice"
            
            if [ "$choice" != "0" ]; then
                echo
                echo "Press Enter to continue..."
                read -r
            fi
        done
    else
        # Execute command with arguments
        execute_command "$@"
    fi
}

# Handle script interruption
trap 'log_warning "Script interrupted by user"; exit 1' INT TERM

# Execute main function
main "$@" 