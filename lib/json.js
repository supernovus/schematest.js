const SchemaTestBase = require('./base.js');
const path = require('path');
const fs = require('fs');

/**
 * A class to test JSON Schema using the Ajv library.
 *
 * @extends SchemaTestBase
 */
class TestJSON extends SchemaTestBase
{
  /**
   * Build a new TestJSON instance.
   *
   * @param {object} conf  The configuration.
   * @param {string[]} [conf.testPaths='.']  The path to the test files.
   * @param {string[]} [conf.schemaPaths='.']  The path to the schema files.
   * @param {string} [conf.baseSchemaUri]  The base URI for JSON Schema.
   * @param {boolean} [conf.preloadSchema=false]  Preload all schema files?
   * @param {function} [conf.onSuccess]  A function to handle successful tests.
   * @param {function} [conf.onFailure]  A function to handle failed tests.
   */
  constructor (conf={})
  {
    let defaults =
    {
      baseSchemaUri: null,
      preloadSchema: false,
    };
    super({conf, defaults});

    let Ajv = require('ajv');
    this.ajv = new Ajv(conf.ajv);

    if (this.preloadSchema)
    {
      this.loadAllSchemata();
    }
  }

  /**
   * Load all schema files synchronously.
   *
   * @param {string[]} [schemaPaths=this.schemaPaths] Load files from here.
   */
  loadAllSchemata (schemaPaths=this.schemaPaths)
  {
    for (var s = 0; s < schemaPaths.length; s++)
    {
      let schemaPath = schemaPaths[s];
      let files = fs.readdirSync(schemaPath);
      for (let f in files)
      {
        let file = files[f];
        if (file.indexOf('.json') != -1 && file.indexOf('.swp') == -1)
        { // Looks like a schema file.
          let fname = path.join(schemaPath, file);
          let content = fs.readFileSync(fname, 'utf8');
          let schema = JSON.parse(content);
          this.ajv.addSchema(schema);
        }
      }
    }
  }

  /**
   * Load a single schema file asynchronously.
   *
   * @param {string} filename  The filename we want to load.
   * @param {string[]} [schemaPaths=this.schemaPaths] Paths to look in.
   */
  loadSchemaFile (filename, schemaPaths=this.schemaPaths)
  {
    let filepath = this.findFile(filename, schemaPaths);
    let fsp = fs.promises;
    return fsp.readFile(filepath, 'utf8').then(content =>
    {
      return JSON.parse(content);
    }).then(schema =>
    {
      return this.ajv.addSchema(schema);
    });
  }

  /**
   * Test a JSON file against a schema.
   *
   * This is called by the runTests() method. You probably shouldn't even
   * have to call it manually.
   *
   * @param {object} test  The test object the file is a part of.
   * @param {string} test.schemaUri  The URI of the Schema to validate against.
   *   If this.baseSchemaUri is set, it will be prepended to this value.
   * @param {string} filepath  The full path to the file we are testing.
   *
   * @return {Promise} The promise will resolve to the validation value
   * unless an error occurs, in which case it will be rejected.
   */
  testFile (test, filepath)
  {
    // TODO: support passing a schemaFile as an alternative to schemaUri
    let schema = test.schemaUri;
    let fsp = fs.promises;
    if (schema === undefined)
    {
      throw new Error("Test was missing 'schemaUri'");
    }
    if (this.baseSchemaUri)
    {
      schema = this.baseSchemaUri + '/' + schema;
    }
    return fsp.readFile(filepath, 'utf8').then(content =>
    {
      return JSON.parse(content);
    }).then(data =>
    {
      return this.ajv.validate(schema, data);
    });
  }

}

module.exports = TestJSON;
