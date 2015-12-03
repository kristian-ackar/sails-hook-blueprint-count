# sails-hook-blueprint-count

Adds blueprint api method to count records in database.
This is useful for example in pagination when you need to calculate number of pages. 

## Installation

In Sails.js v0.11+ installed hooks are run automatically. Therefore, simply install the hook via `npm`:

    npm install sails-hook-blueprint-count

## Usage

    GET /:model/count?where={:CRITERIA}

"where" parameter is optional. If it's used it's used in the same way like you use it in default blueprint api find method
[Sails.js blueprint api find method documentation](http://sailsjs.org/documentation/reference/blueprint-api/find-where).