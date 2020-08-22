#!/bin/bash

# Delete all the old module data
rm -rf ./node_modules

# Install again
npm install

# Compile everything
npm run compile
