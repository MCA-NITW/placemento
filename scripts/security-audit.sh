#!/bin/bash
# Security Audit Report Generator
# This script generates a detailed report of current vulnerabilities
# for documentation and monitoring purposes

echo "🔍 Placemento Security Audit Report"
echo "Generated on: $(date)"
echo "========================================"
echo ""

echo "📊 Production Dependencies Audit:"
echo "-----------------------------------"
cd client
npm audit --omit=dev --audit-level=moderate || {
    echo "❌ Found vulnerabilities in production dependencies - immediate attention required!"
    exit 1
}

echo ""
echo "📊 Development Dependencies Audit:"
echo "------------------------------------"
npm audit --audit-level=moderate 2>/dev/null | head -20

echo ""
echo "📋 Vulnerability Summary:"
echo "--------------------------"
AUDIT_JSON=$(npm audit --json 2>/dev/null)
TOTAL_VULNS=$(echo "$AUDIT_JSON" | grep -o '"total":[0-9]*' | cut -d':' -f2 || echo "0")
DEV_VULNS=$(echo "$AUDIT_JSON" | grep -c "react-scripts\|@svgr\|webpack-dev-server\|postcss\|nth-check" || echo "0")

echo "Total vulnerabilities: $TOTAL_VULNS"
echo "Development-only vulnerabilities: $DEV_VULNS"
echo "Production vulnerabilities: $((TOTAL_VULNS - DEV_VULNS))"

echo ""
echo "🔒 Security Status:"
echo "-------------------"
if [ "$TOTAL_VULNS" -eq 0 ]; then
    echo "✅ No vulnerabilities found"
elif [ "$((TOTAL_VULNS - DEV_VULNS))" -eq 0 ]; then
    echo "✅ Production is secure - all vulnerabilities are in development dependencies"
    echo "📄 See SECURITY_VULNERABILITIES.md for details on development dependency risks"
else
    echo "⚠️ Production vulnerabilities found - review required"
fi

echo ""
echo "📄 For detailed vulnerability analysis, see SECURITY_VULNERABILITIES.md"
