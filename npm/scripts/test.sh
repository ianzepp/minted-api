#!/bin/bash

# Ensure env vars are set
if [ "$CI" = "" ]
then
    export PGHOST="localhost"
    export PGPORT="5432"
    export PGUSER=""
    export PGPASSWORD=""
    export PGDATABASE="minted-api"

    dropdb "$PGDATABASE"
    createdb "$PGDATABASE"
else
    export PGHOST="locahost"
    export PGPORT="5432"
    export PGUSER="postgres"
    export PGPASSWORD=""
    export PGDATABASE="minted-api"
fi

# Logging
echo "Using postgres environment variables:"
echo "- PGHOST $PGHOST"
echo "- PGPORT $PGPORT"
echo "- PGUSER $PGUSER"
echo "- PGPASSWORD $PGPASSWORD"
echo "- PGDATABASE $PGDATABASE"

# Recompile
npm run compile

# Execute tests
mocha -r ts-node/register tests/**/*.spec.ts --exit
