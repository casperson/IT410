var expect = require('chai').expect;
var promises = require('./promises');

describe('promises', function() {

    describe('get a path type', function() {

        it('returns directory when passed a directory path', function() {
            return promises.getPathType('./testDir/instructions.txt')
                .then(function(result) {
                    expect(result).to.be.equal("file");
                    return true;
                })
                .catch(function(err) {
                    throw err;
                });
        });

    });

    describe('get the directory types', function() {

        it('returns types of directories', function() {
            return promises.getDirectoryTypes("./testDir", 0)
                .then(function(result) {
                    expect(result).to.exist;
                    return true;
                })
                .catch(function(err) {
                    throw err;
                });
        });

    });

    describe('see if path exists', function() {

        it('returns nothing as a string', function() {
            return promises.exists("./testDir")
                .then(function(result) {
                    expect(result).to.be.true;
                    return true;
                })
                .catch(function(err) {
                    throw err;
                });
        });

    });

    //describe('get all the file paths', function() {
    //
    //    it('returns paths as array of strings', function() {
    //        return promises.getFilePaths("./testDir")
    //            .then(function(result) {
    //                expect(result).to.be.true;
    //                return true;
    //            })
    //            .catch(function(err) {
    //                throw err;
    //            });
    //    });
    //
    //});

    describe('read one file', function() {

        it('returns results of file', function() {
            return promises.readFile("./testDir/instructions.txt")
                .then(function(result) {
                    expect(result).to.exist;
                    return true;
                })
                .catch(function(err) {
                    throw err;
                });
        });

    });

    describe('read multiple files', function() {

        it('returns results multiple files', function() {
            var pathsArray = [
                "./testDir/instructions.txt",
                "./testDir/testDir2/instructions.txt"
            ];
            return promises.readFiles(pathsArray)
                .then(function(result) {
                    expect(result).to.exist;
                    return true;
                })
                .catch(function(err) {
                    throw err;
                });
        });

    })

});