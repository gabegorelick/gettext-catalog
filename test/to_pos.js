'use strict';

var Catalog = require('..');
require('should');

describe('.toPOs', function () {
  it('should work', function () {
    var catalog = new Catalog();
    catalog.addMessages({
      messages: {
        msgid1: {
          msgid: 'msgid1',
          msgid_plural: 'plural',
          msgstr: ['a', 'b'],
          extractedComments: ['Comment'],
          references: [
            {
              filename: 'foo.hbs',
              firstLine: 1,
              firstColumn: 1
            }
          ]
        }
      }
    });

    var pos = catalog.toPOs();
    pos.length.should.equal(1);

    var po = pos[0];
    po.domain.should.equal('messages');
    po.items.length.should.equal(1);

    var item = po.items[0];
    item.msgid.should.equal('msgid1');
    item.msgid_plural.should.equal('plural');
    item.msgstr.should.eql(['a', 'b']);
    item.extractedComments.should.eql(['Comment']);
    item.references.should.eql(['foo.hbs:1']);
  });

  it('should add msgstr if none present', function () {
    var catalog = new Catalog();
    catalog.addMessages({
      messages: {
        boat: {
          msgid: 'boat'
        }
      }
    });

    var po = catalog.toPOs()[0];
    var item = po.items[0];

    item.msgid.should.equal('boat');
    item.msgstr.should.eql(['']);
  });

  it('should convert msgstr to array', function () {
    var catalog = new Catalog();
    catalog.addMessages({
      messages: {
        boat: {
          msgid: 'boat',
          msgstr: 'boats'
        }
      }
    });

    var po = catalog.toPOs()[0];
    var item = po.items[0];

    item.msgid.should.equal('boat');
    item.msgstr.should.eql(['boats']);
  });

  it('should add plural msgstr if there is a msgid_plural', function () {
    var catalog = new Catalog();
    catalog.addMessages({
      messages: {
        boat: {
          msgid: 'boat',
          msgid_plural: 'boats'
        }
      }
    });

    var po = catalog.toPOs()[0];
    var item = po.items[0];

    item.msgid.should.equal('boat');
    item.msgid_plural.should.equal('boats');
    item.msgstr.should.eql(['', '']);
  });

  it('should output msgstr of length 2 for plural even if msgstr length is 1', function () {
    var catalog = new Catalog();
    catalog.addMessages({
      messages: {
        boat: {
          msgid: 'boat',
          msgid_plural: 'boats',
          msgstr: ['boaten']
        }
      }
    });

    var po = catalog.toPOs()[0];
    var item = po.items[0];

    item.msgid.should.equal('boat');
    item.msgid_plural.should.equal('boats');
    item.msgstr.should.eql(['boaten', '']);
  });

  it("should output msgstr of ['', ''] for plural even if msgstr set to []", function () {
    var catalog = new Catalog();
    catalog.addMessages({
      messages: {
        boat: {
          msgid: 'boat',
          msgid_plural: 'boats',
          msgstr: []
        }
      }
    });

    var po = catalog.toPOs()[0];
    var item = po.items[0];

    item.msgid.should.equal('boat');
    item.msgid_plural.should.equal('boats');
    item.msgstr.should.eql(['', '']);
  });

  // TODO more tests (domain sorting, entry sorting, empty references, etc.)
});
