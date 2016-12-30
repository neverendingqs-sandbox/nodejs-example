const assert = require('chai').assert;

const add = require('../src/index').add;

describe('add', function() {
  it('returns sum', function(done) {
    assert.equal(add(2, 3), 5);
    done();
  });
});
