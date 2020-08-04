#!/bin/bash

# Execute tests
mocha -r ts-node/register mocha/**/*.spec.ts
