#!/bin/bash

# Ensure env vars are set
export DEBUG="minted-api:*"

# Run tests
npm run test
