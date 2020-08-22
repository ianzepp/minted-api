#!/bin/bash

# Ensure env vars are set
if [ "$CI" = "" ]
then
    export PGHOST="localhost"
    export PGPORT="5432"
    export PGUSER=""
    export PGPASSWORD=""
    export PGDATABASE="minted-api"
else
    export PGHOST="locahost"
    export PGPORT="5432"
    export PGUSER="$POSTGRES_USER"
    export PGPASSWORD="$POSTGRES_PASSWORD"
    export PGDATABASE="$POSTGRES_DB"
fi

# Remove any prior test database
dropdb "$PGDATABASE"

# Recreate as empty
createdb "$PGDATABASE"

# Recompile
npm run compile

# Execute tests
mocha -r ts-node/register tests/**/*.spec.ts --exit
