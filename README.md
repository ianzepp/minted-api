# minted-api

This is an initial brain dump of what I remember from the original Minted API implementation in 2017, and what I learned from 2017-2020 during my time at Motivis. This is highly incomplete because I stopped brain dumping after only a week or two or work. 

As of 2023, I decided to pick this up again and start rework in the `minted-api` project in my github repo/account. 

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

The knex subsystem code in `src/classes/knex-system` will pick it up.

# Interfaces / Typedefs

Typedefs for all API types can be found in the various `src/typedefs/*.ts` files. All typedefs have interface-level comments to describe how the different interfaces can be used, and what type of data is returned. These comments should also show up in your IDE during "mouseover" or "hover", as long as your IDE can understand the typescript definitions/interfaces.

There are also method-level and line-level comments in the implementation classes (found in `src/classes/*.ts`), but these are more focused on how the code works internally, instead of describing the inputs and responses.


# Searching/Filtering

Search for records is done using a JSON-based "filter". The filter syntax is complex and highly flexible, but a basic filter often looks something like this:

```json
{
    "where": {
        "name": "june%",
        "created_at": {
            "$gt": "yesterday"
        }
    },
    "limit": 10,
    "order": {
        "name": "asc"
    }
}
```

To run this filter, simply `POST` to the API endpoint `/api/data/system__user/search`, and send the JSON data in the request body.

The API will then search through the database:
- Search the `system__user` table
- For rows where the `name` property starts with `june`
- For rows that were created more recently than "yesterday"
- Sorting the results by the `name` property in ascending order
- Limiting the results to 10 rows maximum

That list of (up to) 10 results is then converted into a JSON format (as defined by the `RecordJson` interface in `src/typedefs/record.ts`), and returned in an array. The
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
