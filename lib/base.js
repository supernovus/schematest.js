const path = require('path');
const fs = require('fs');

// A few simple defaults for properties used everywhere.
const DEFAULT_DEFAULTS =
{
  testPaths: ['.'],
  schemaPaths: ['.'],
  onSuccess: null,
  onFailure: null,
}

/**
 * An abstract class used as the base for the other classes.
 *
 * @abstract
 */
class SchemaTestBase
{
  /**
   * Only called by the sub-classes using super().
   *
   * We add the following default class properties if they aren't overridden
   * in either the conf or defaults:
   *
   * ```
   * {
   *   testPaths: ['.'],
   *   schemaPaths: ['.'],
   *   onSuccess: null,
   *   onFailure: null,
   * }
   * ```
   *
   * We also set ```this.validateRejections = false``` so if you want it
   * to be a different value, you'll need to set it in your sub-class
   * constructor after the call to ```super({conf});```
   *
   * @param {object} params  An object that will be destructured.
   * @param {object} params.conf  Config passed to the sub-class constructor.
   * @param {object} [params.defaults]  Default values for class properties.
   * 
   */
  constructor ({conf, defaults={}})
  {
    if (this.constructor === SchemaTestBase)
    {
      throw new Error("Cannot create instance of SchemaTestBase");
    }

    if (typeof this.testFile !== 'function')
    {
      throw new Error("Missing testFile function");
    }

    if (typeof conf !== 'object' || conf === null)
    {
      throw new Error("Invalid 'conf' passed to SchemaTestBase constructor");
    }

    for (let def in DEFAULT_DEFAULTS)
    {
      if (!(def in defaults))
      {
        defaults[def] = DEFAULT_DEFAULTS[def];
      }
    } // for DEFAULT_DEFAULTS

    for (let prop in defaults)
    {
      if (conf[prop] !== undefined)
      {
        this[prop] = conf[prop];
      }
      else
      {
        this[prop] = defaults[prop];
      }
    } // for defaults

    // A default value, override this in your sub-classes if needed.
    this.validateRejections = false;
  }

  /**
   * Run a set of tests.
   *
   * @param {object} tests  The tests we want to run.
   *
   * The exact syntax of this depends on the sub-class, but the basic
   * idea is that each named property in the object represents a test set,
   * and will have a sub-property called 'files', which is also an object.
   * Within 'files' each key is the filename inside one of  the testPaths that
   * we want to test, and the value is true if the file should validate, and
   * false if it should not validate. See the individual testFile methods
   * for any other supported properties.
   *
   * We look up the filename for the individual test files using the
   * {@link SchemaTestBase#findFile} method, and then call the testFile() method
   * for our sub-class to actually test the file.
   *
   * @param {object} [opts] Options for this call.
   * @param {function} [opts.onSuccess=this.onSuccess] An onSuccess callback.
   *
   *  ```function (test, tname, tfile, retval) { }```
   *
   * @param {function} [opts.onFailure=this.onFailure] An onFailure callback.
   *
   * ```function (test, tname, tfile, retval) { }```
   * 
   */
  runTests (tests, opts={})
  {
    let onSuccess = 'onSuccess' in opts ? opts.onSuccess : this.onSuccess;
    let onFailure = 'onFailure' in opts ? opts.onFailure : this.onFailure;
    let validateRejections = this.validateRejections;
    if (typeof onSuccess !== 'function' || typeof onFailure !== 'function')
    {
      throw new Error("Must have onSuccess and onFailure handlers");
    }
    for (let tname in tests)
    {
      let test = tests[tname];
      for (let tfile in test.files)
      {
        let shouldBeValid = test.files[tfile];
        let filename = this.findFile(tfile, this.testPaths);
        this.testFile(test, filename).then(val => 
        {
          if ((shouldBeValid && val) || (!shouldBeValid && !val))
          {
            onSuccess.call(this, test, tname, tfile, val);
          }
          else
          {
            onFailure.call(this, test, tname, tfile, val);
          }
        },
        err =>
        {
          if (validateRejections && !shouldBeValid)
          {
            onSuccess.call(this, test, tname, tfile, err);
          }
          else
          {
            onFailure.call(this, test, tname, tfile, err);
          }
        });
      }
    }
  }

  /**
   * Find a file.
   *
   * Searches for a file in each of the paths and returns the
   * first existing file.
   *
   * @param {string} filename  The file we're looking for.
   * @param {string[]} searchPaths  The paths to look in.
   *
   * @return {string} The full filename. Throws an error if none were found.
   */
  findFile (filename, searchPaths)
  {
    for (var p = 0; p < searchPaths.length; p++)
    {
      let searchPath = searchPaths[p];
      let searchFile = path.join(searchPath, filename);
      if (fs.existsSync(searchFile))
      {
        return searchFile;
      }
    }

    // If we reached here, no file was found.
    throw new Error(`Could not find '${filename}' in any search paths`);
  }

}

module.exports = SchemaTestBase;

