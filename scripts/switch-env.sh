#!/bin/bash

# =====================================================
# Environment Switcher Script
# =====================================================
# Safely switch between local and remote Supabase environments
# Usage: npm run env:local OR npm run env:remote

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the target environment from argument
TARGET_ENV=$1

if [ -z "$TARGET_ENV" ]; then
  echo -e "${RED}Error: Environment not specified${NC}"
  echo "Usage: $0 [local|remote]"
  exit 1
fi

# File paths
ENV_LOCAL=".env.local"
ENV_REMOTE=".env.remote"
ENV_LOCAL_DEV=".env.local.development"

# Function to show current environment
show_current_env() {
  if [ -f "$ENV_LOCAL" ]; then
    CURRENT_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" "$ENV_LOCAL" | cut -d '=' -f2)
    if [[ "$CURRENT_URL" == *"127.0.0.1"* ]]; then
      echo -e "${BLUE}📍 Current environment: LOCAL${NC}"
    else
      echo -e "${BLUE}📍 Current environment: REMOTE${NC}"
    fi
  else
    echo -e "${YELLOW}⚠️  No .env.local file found${NC}"
  fi
}

# Function to backup current environment
backup_current_env() {
  if [ -f "$ENV_LOCAL" ]; then
    cp "$ENV_LOCAL" "${ENV_LOCAL}.backup"
    echo -e "${GREEN}✓${NC} Backed up current .env.local"
  fi
}

# Function to switch to local environment
switch_to_local() {
  echo -e "${BLUE}🔄 Switching to LOCAL environment...${NC}\n"

  if [ ! -f "$ENV_LOCAL_DEV" ]; then
    echo -e "${RED}Error: .env.local.development file not found${NC}"
    exit 1
  fi

  # Backup current environment
  backup_current_env

  # Copy local development environment
  cp "$ENV_LOCAL_DEV" "$ENV_LOCAL"

  echo -e "${GREEN}✓${NC} Switched to local environment"
  echo -e "${BLUE}→${NC} API URL: http://127.0.0.1:54321"
  echo -e "${BLUE}→${NC} Studio: http://127.0.0.1:54323"
  echo -e "${BLUE}→${NC} Mailpit: http://127.0.0.1:54324"
  echo ""
  echo -e "${YELLOW}ℹ️  Make sure Supabase is running:${NC}"
  echo -e "   ${GREEN}npm run supabase:start${NC}"
}

# Function to switch to remote environment
switch_to_remote() {
  echo -e "${BLUE}🔄 Switching to REMOTE environment...${NC}\n"

  if [ ! -f "$ENV_REMOTE" ]; then
    echo -e "${RED}Error: .env.remote file not found${NC}"
    echo ""
    echo "Please create .env.remote with your production credentials:"
    echo "  cp .env.local .env.remote"
    echo ""
    echo "Or restore from backup:"
    echo "  cp .env.local.backup .env.remote"
    exit 1
  fi

  # Backup current environment
  backup_current_env

  # Copy remote environment
  cp "$ENV_REMOTE" "$ENV_LOCAL"

  echo -e "${GREEN}✓${NC} Switched to remote environment"

  # Extract and display project info
  REMOTE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" "$ENV_LOCAL" | cut -d '=' -f2)
  echo -e "${BLUE}→${NC} API URL: $REMOTE_URL"
  echo ""
  echo -e "${YELLOW}ℹ️  Using production Supabase instance${NC}"
}

# Main logic
echo ""
show_current_env
echo ""

case "$TARGET_ENV" in
  local)
    switch_to_local
    ;;
  remote)
    switch_to_remote
    ;;
  *)
    echo -e "${RED}Error: Invalid environment '$TARGET_ENV'${NC}"
    echo "Valid options: local, remote"
    exit 1
    ;;
esac

echo ""
echo -e "${GREEN}🎉 Environment switch complete!${NC}"
echo -e "${YELLOW}⚠️  Restart your dev server for changes to take effect${NC}"
echo ""
