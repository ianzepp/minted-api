# minted-api

Minted API

# Installation

`npm run install`

# Issues / Bugs / Support

...

# Feature requests

...

# Database setup

The Minted API uses the `knexjs` package for database connectivity, but is designed around to the Postgresql database, and uses a number of PG features internally (`uuid`, `jsonb`, window functions, etc..). Support for other databases should be possible without too much trouble, but none other than PG are currently implemented.

To tell the API how to connect to the database, use the standard PG environment variables:

```
export PGHOST="<hostname>"
export PGUSER="<user>"
export PGPASSWORD=...
export PGDATABASE=...
```

The system service code in `src/classes/knex-system` will pick it up.

# Default configuration

...

# Searching/Filtering

...

# Using the REST endpoints

...

# Using the data collection endpoints

...

# Using the bulk operations endpoints

...

# Namespaces

...

# Access control lists

...

# Metadata import/export

...

# Flows / Automation

...

# Reporting

...

# Data transformations

...

# Typeahead / Quicksearch

...

# Security Classification

...
