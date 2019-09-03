# SchemaTest.js

## Summary

A quick Javscript library designed for Node.js that can test XML and JSON
files against formal Schema and based on the validation status run callbacks.

It uses the Ajv JSON Schema validator for JSON, and the xmllint command line
tool for XML (which supports XML Schema and RELAX NG.)

## Requirements

* Node.js, the Javascript runtime.
* npm, the Node.js package manager.
* xmllint, a command line tool used to perform XML Schema validation.

## Optional dependencies

* jsdoc, only needed if you want to build the API documentation.

## Usage for JSON Validation

```javascript
let TestJSON = require('schematest').TestJSON;
let testjson = new TestJSON(
{
  baseSchemaUri: 'http://my.test.com/schema',
  testPaths: ['./tests/json'],
  schemaPaths: ['./tests/json/schema'],
  preloadSchema: true,
  onSuccess: function (test, tname, tfile)
  {
    console.log("PASSED", tfile, tname);
  },
  onFailure: function (test, tname, tfile, err)
  {
    console.log("FAILED", tfile, tname, err);
  },
});

let tests =
{
  test1:
  {
    schemaUri: 'document.json',
    files:
    {
      'valid_document.json': true,
      'invalid_document.json': false,
      // More files here.
    },
  },
  // More tests here.
};

testjson.runTests(tests);
```

## Usage for XML Validation

```javascript
let TestXML = require('schematest').TestXML;
let testxml = new TestXML(
{
  testPaths: ['./tests/xml'],
  schemaPaths: ['./tests/xml/schema'],
  onSuccess: function (test, tname, tfile)
  {
    console.log("PASSED", tfile, tname);
  },
  onFailure: function (test, tname, tfile, err)
  {
    console.log("FAILED", tfile, tname, err);
  },
});

let tests =
{
  test1:
  { // Test using XML Schema (the default).
    schemaFile: 'document.xsd',
    files:
    {
      'valid_document.xml': true,
      'invalid_document.xml': false,
      // More files here.
    },
  },
  test2:
  { // Test using RELAX NG.
    relax: true,
    schemaFile: 'document.rng',
    files:
    {
      'valid_document.xml': true,
      'invalid_document.xml': false,
      // More files here.
    },
  },
  // More tests here.
};

testxml.runTests(tests);
```

## API Documentation

You can build the API documentation using jsdoc, which expects the
'markdown' plugin to be present.

A minimalistic version with default templates can be generated using:

```
npm run build-docs
```

Feel free to customize the .jsdoc.json file to your liking first.

## Official URLs

This library can be found in two places:

 * [Github](https://github.com/supernovus/schematest.js)
 * [NPM](https://www.npmjs.com/package/schematest)

## Author

Timothy Totten <2010@totten.ca>

## License

[MIT](https://spdx.org/licenses/MIT.html)

