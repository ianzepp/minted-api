# API-9: Rework how routers are structured/started

This feature adds support for the three main REST endpoints:

- Schema Search API
- Schema REST API
- Record REST API

All endpoints use the standard HTTP verbs (`GET`, `POST`, etc..).

## Schema Search API

API endpoints that allow searches will accept a complex search filter in JSON. Search filters can be arbitrary large (as POST data), which avoids the "URL is too long" problem that often shows up when passing search queries via GET parameters. This also avoids the complexities of URL encoding deep/nested JSON data.

All search API requests are sent as `POST /api/data/<schema>/search`, where `<schema>` is the name of the schema being queried (eg `system__user`), and where the URL has an explicit `*/search` suffix, and the HTTP request body data is either empty (for "select everything") or a standard JSON filter:

```
{
    "where": [
        {
            "name": {
                "$like": "%foo%"
            }
        }
    ],

    "order": {
        "created_at": "desc"
    },

    "limit": 5
}
```

The simple example above finds all records where the `name` column matches `%foo%`, sorted the results by `created_at` in `desc` order, and returns a maximum of 5 results.

## Schema REST API

This API is designed around interacting with multiple records under a single schema:

`GET /api/data/<schema>`:

This returns all visible records under the schema, up to the default query limit. Since the HTTP spec does not allow for body data to be sent with a `GET` request, and because complex JSON filters are not allowed in the URL query parameters, this endpoint has limited usefulness. Use the Search API above for most use cases.

`POST /api/data/<schema>`:

This endpoint creates new records of the `<schema>` type. It expects the request body to be an `array` of record data to be inserted.

`PATCH /api/data/<schema>`:

This endpoint updates existing records of the `<schema>` type. It expects the request body to be an `array` of record data to be updated, and each record object must already have an `id` value included.

`DELETE /api/data/<schema>`:

This endpoint deletes existing records of the `<schema>` type. It expects the request body to be an `array` of record data to be updated, and each record object must already have an `id` value included.

## Record REST API

This API is designed around interacting with a single record under a single schema:

`POST /api/data/<schema>/new`:

This is a special endpoint, that allows a new record to be created by passing the record data as a JSON `object`, instead of the regular `array` format of the Schema REST API.

`GET /api/data/<schema>/<record-id>`:

Returns the complete record data for that record id. Throws a `404` error if the record can't be found (or isn't visible to the current user).

`PATCH /api/data/<schema>/<record-id>`:

Accepts the updated record data in the HTTP request body, and then updates that record (using the ID from the URL).

`DELETE /api/data/<schema>/<record-id>`:

Ignores all HTTP request data, and soft deletes the record (using the ID from the URL).
