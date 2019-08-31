const TestJSON = require('schematest').TestJSON;

let testjson = new TestJSON(
{
  baseSchemaUri: 'http://huri.net/schema',
  testPaths: ['./json'],
  schemaPaths: ['./json/schema'],
  preloadSchema: true,
  onSuccess: function (test, tname, tfile)
  {
    console.log(`PASSED [${tname}] ${tfile}`);
  },
  onFailure: function (test, tname, tfile, err)
  {
    console.log(`FAILED [${tname}] ${tfile}`);
  },
});

let tests =
{
  document1:
  {
    schemaUri: 'document.json',
    files:
    {
      'valid_document.json': true,
      'document_with_content.json': true,
      'document_without_name.json': false,
      'document_with_invalid_id.json': false,
      'document_with_extra_props.json': false
    },
  },
  docref:
  {
    schemaUri: 'docref.json',
    files:
    {
      'valid_docref.json': true,
      'valid_docref_with_id.json': true,
      'docref_with_extra_props.json': true,
      'docref_without_idref.json': false,
      'docref_with_invalid_id.json': false,
      'docref_with_invalid_idref.json': false
    },
  },
  document2:
  {
    schemaUri: 'document.json',
    files:
    {
      'document_with_inline_children.json': true,
      'document_with_docref_children.json': true,
      'document_with_mixed_children.json': true,
    },
  },
};

testjson.runTests(tests);

