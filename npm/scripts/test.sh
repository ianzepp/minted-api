#!/bin/bash

# Ensure env vars are set
export PGHOST="localhost"
export PGPORT="5432"
export PGUSER=""
export PGPASSWORD=""
export PGDATABASE="minted-api"

# Remove any prior test database
dropdb "$PGDATABASE"

# Recreate as empty
createdb "$PGDATABASE"

# Recompile
npm run compile

# Execute tests
mocha -r ts-node/register tests/**/*.spec.ts --exit
