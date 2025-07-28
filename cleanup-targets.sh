#!/bin/bash
echo "Cleaning all target directories..."
find . -name "target" -type d -exec rm -rf {} + 2>/dev/null || true
echo "Cleanup complete"
