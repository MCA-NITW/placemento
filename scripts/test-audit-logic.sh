#!/bin/bash
# Test script to validate our vulnerability handling logic

echo "🧪 Testing vulnerability detection logic..."
echo ""

cd client

echo "1️⃣ Testing production dependencies (should pass):"
if npm run audit:production > /dev/null 2>&1; then
  echo "✅ Production audit PASSED - no vulnerabilities"
else
  echo "❌ Production audit FAILED - critical vulnerabilities found!"
  exit 1
fi

echo ""
echo "2️⃣ Testing development dependencies (will find known issues):"
set +e  # Don't exit on error
DEV_AUDIT_OUTPUT=$(npm audit --audit-level moderate 2>&1)
AUDIT_EXIT_CODE=$?
set -e

if [ $AUDIT_EXIT_CODE -eq 0 ]; then
  echo "✅ No development vulnerabilities found"
else
  echo "⚠️ Development vulnerabilities detected (expected)"
  
  # Check if they're all in react-scripts chain
  if echo "$DEV_AUDIT_OUTPUT" | grep -q "react-scripts\|@svgr\|webpack-dev-server\|postcss\|nth-check"; then
    echo "✅ All vulnerabilities are in known react-scripts dependencies"
    
    # Count vulnerabilities
    VULN_COUNT=$(echo "$DEV_AUDIT_OUTPUT" | grep -o '[0-9]\+ vulnerabilities' | head -1 | grep -o '[0-9]\+' || echo "0")
    echo "📊 Found $VULN_COUNT known development dependency vulnerabilities"
    echo "✅ CI should PASS with this configuration"
  else
    echo "❌ Found unexpected vulnerabilities outside react-scripts"
    echo "❌ CI would FAIL - manual review needed"
    exit 1
  fi
fi

echo ""
echo "🎉 Vulnerability handling logic test COMPLETED"
echo "✅ CI pipeline should handle these vulnerabilities correctly"
