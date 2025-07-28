#!/bin/bash

echo "=== Permission Fix Script ==="

# Check current user
echo "Current user: $(whoami)"
echo "Current directory: $(pwd)"

# Method 1: Try to fix ownership (requires sudo)
echo "1. Attempting to fix ownership..."
if sudo -n chown -R pridesys:pridesys . 2>/dev/null; then
    echo "✓ Successfully changed ownership to pridesys"
else
    echo "✗ Cannot change ownership (need sudo password)"
fi

# Method 2: Remove problematic target directories
echo "2. Removing target directories..."
for service in auth assessment-service discussion-service; do
    if [ -d "$service/target" ]; then
        echo "Removing $service/target..."
        rm -rf "$service/target" 2>/dev/null || echo "Cannot remove $service/target (permission denied)"
    fi
done

# Method 3: Set umask for current session
echo "3. Setting umask to 022 for future file creation..."
umask 022

# Method 4: Create .mavenrc file to set build directory permissions
echo "4. Creating .mavenrc files..."
for service in auth assessment-service discussion-service; do
    if [ -d "$service" ]; then
        cat > "$service/.mavenrc" << 'EOF'
# Set Maven options for proper file permissions
export MAVEN_OPTS="-Dmaven.repo.local=$HOME/.m2/repository -Djava.awt.headless=true"
EOF
        echo "Created .mavenrc in $service"
    fi
done

# Method 5: Create cleanup script
cat > cleanup-targets.sh << 'EOF'
#!/bin/bash
echo "Cleaning all target directories..."
find . -name "target" -type d -exec rm -rf {} + 2>/dev/null || true
echo "Cleanup complete"
EOF
chmod +x cleanup-targets.sh
echo "Created cleanup-targets.sh script"

echo ""
echo "=== Solutions to prevent future permission issues ==="
echo "1. Always run mvnw as the same user (pridesys)"
echo "2. Use 'su moyen' to switch to moyen user when needed"
echo "3. Use './cleanup-targets.sh' before switching users"
echo "4. Add target/ to .gitignore (already done)"
echo "5. Consider using Docker for consistent environments"
echo ""
echo "=== Immediate Fix ==="
echo "Run one of these commands:"
echo "sudo chown -R pridesys:pridesys ."
echo "or"
echo "su moyen -c 'cd $(pwd) && ./mvnw clean && ./mvnw spring-boot:run'"
EOF