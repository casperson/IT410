var expect = require('chai').expect;
var promises = require('./promises');

describe('promises', function() {

    describe('get a path type', function() {

        it('throws an error if path is not a string', function() {
           try {
               promises.getPathType(1);
               expect(true).to.be.false;
           } catch (e) {
               expect(e).to.be.equal("Path not passed as a string");
           }
        });

    })

});