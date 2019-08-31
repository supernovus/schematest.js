const SchemaTestBase = require('./base.js');
const fs = require('fs');
const exec = require('util').promisify(require('child_process').exec);

/**
 * A class to test XML files using the 'xmllint' command line tool.
 *
 * Can use XML Schema or RELAX NG for the schema files.
 *
 * @extends SchemaTestBase
 */
class TestXML extends SchemaTestBase
{
  /**
   * Build a new TestXML instance.
   *
   * Will set ```this.validateRejections = true;``` on construction.
   * This is due to our use of a promisified fs.exec() command which will
   * resolve() if the return code is 0, and reject() otherwise.
   *
   * @param {object} conf  The configuration.
   * @param {string[]} [conf.testPaths]  The path to the test files.
   * @param {string[]} [conf.schemaPaths]  The path to the schema files.
   * @param {function} [conf.onSuccess]  A function to handle successful tests.
   * @param {function} [conf.onFailure]  A function to handle failed tests.
   */
  constructor (conf={})
  {
    super({conf});
    this.validateRejections = true;
  }

  /**
   * Test an XML file using the ```xmllint``` command line tool.
   *
   * @param {object} test  The test object the file is a part of.
   * @param {string} test.schemaFile  The path to the schema we are testing.
   *   Will be passed through this.findFile(fname, this.schemaPaths);
   * @param {boolean} [test.relax=false] Use RELAX NG instead of XML Schema?
   * @param {string} filepath  The full path to the file we are testing.
   *
   * @return {Promise} The promise will resolve if the process exit code was 0,
   * and will be rejected otherwise.
   */
  testFile (test, filepath)
  {
    let schemaFile = test.schemaFile;
    if (schemaFile === undefined)
    {
      throw new Error("Test was missing 'schemaFile'");
    }
    schemaFile = this.findFile(schemaFile, this.schemaPaths);
    let relax = 'relax' in test ? test.relax : false;
    let flag = relax ? '--relaxng' : '--schema';
    return exec('xmllint '+flag+' '+schemaFile+' '+filepath);
  }
}

module.exports = TestXML;
