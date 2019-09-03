const TestXML = require('schematest').TestXML;

let testxml = new TestXML(
{
  testPaths: ['./xml'],
  schemaPaths: ['./xml/schema'],
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
  document1_xsd:
  {
    schemaFile: 'document_root.xsd',
    files:
    {
      'valid_document.xml': true,
      'document_with_content.xml': true,
      'document_without_name.xml': false,
      'document_with_invalid_id.xml': false,
      'document_with_extra_props.xml': false
    },
  },
  docref_xsd:
  {
    schemaFile: 'docref_root.xsd',
    files:
    {
      'valid_docref.xml': true,
      'valid_docref_with_id.xml': true,
      'docref_with_extra_props.xml': true,
      'docref_without_idref.xml': false,
      'docref_with_invalid_id.xml': false,
      'docref_with_invalid_idref.xml': false
    },
  },
  document2_xsd:
  {
    schemaFile: 'document_root.xsd',
    files:
    {
      'document_with_inline_children.xml': true,
      'document_with_docref_children.xml': true,
      'document_with_mixed_children.xml': true,
    },
  },
/* TODO: write RELAX NG schema files.
  document1_rng:
  {
    relax: true,
    schemaFile: 'document.rng',
    files:
    {
      'valid_document.xml': true,
      'document_with_content.xml': true,
      'document_without_name.xml': false,
      'document_with_invalid_id.xml': false,
      'document_with_extra_props.xml': false
    },
  },
  docref_rng:
  {
    relax: true,
    schemaFile: 'docref.rng',
    files:
    {
      'valid_docref.xml': true,
      'valid_docref_with_id.xml': true,
      'docref_with_extra_props.xml': true,
      'docref_without_idref.xml': false,
      'docref_with_invalid_id.xml': false,
      'docref_with_invalid_idref.xml': false
    },
  },
  document2_rng:
  {
    relax: true,
    schemaFile: 'document.rng',
    files:
    {
      'document_with_inline_children.xml': true,
      'document_with_docref_children.xml': true,
      'document_with_mixed_children.xml': true,
    },
  },
*/

};

testxml.runTests(tests);

