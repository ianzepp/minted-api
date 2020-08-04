#!/bin/bash

# Delete all the old module data
rm -rf ./node_modules

# Delete all the compiled data
rm -rf ./dst

# Install again
npm install

# Compile everything
npm run compile
