#!/bin/bash

echo "🧱 Building Move contracts..."
sui move build
if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

echo "🚀 Publishing to localnet..."
sui client publish --gas-budget 10000