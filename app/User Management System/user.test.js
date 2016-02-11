var expect = require('chai').expect;
var users = require('./user');

describe('users', function() {

    describe('create a user', function() {

        it('should create a user', function() {
            return users.createUser('Braden2', 'passy')
                .then(function(result) {
                    expect(result).to.be.equal("User Created.");
                    return true;
                })
                .catch(function(err) {
                    throw err;
                });
        });

    });

    describe('create a user', function() {

        it('should try to create a user with a username already in use', function() {
            return users.createUser('Braden', 'passy')
                .then(function(result) {
                    expect(result).to.be.equal("Username taken.");
                    return true;
                })
                .catch(function(err) {
                    throw err;
                });
        });

    });

    describe('change a password', function() {

        it('should change the password', function() {
            return users.changePassword("Braden", "pasty")
                .then(function(result) {
                    expect(result).to.be.equal("Password changed successfully!");
                    return true;
                })
                .catch(function(err) {
                    throw err;
                });
        });

    });

    describe('unsuccessfully change a password', function() {

        it('should try to change the password with invalid username', function() {
            return users.changePassword("Braaden", "pasty")
                .then(function(result) {
                    expect(result).to.be.equal("Password not changed.");
                    return true;
                })
                .catch(function(err) {
                    throw err;
                });
        });

    });

    describe('authenticate user', function() {

        it('should successfully authenticate the user', function() {
            return users.authenticateUser("Braden", "pasty")
                .then(function(result) {
                    expect(result).to.be.equal("Successfully authenticated!");
                    return true;
                })
                .catch(function(err) {
                    throw err;
                });
        });

    });

    describe('authenticate user', function() {

        it('should try to authenticate with wrong password', function() {
            return users.authenticateUser("Braden", "pastry")
                .then(function(result) {
                    expect(result).to.be.equal("Not authenticated.");
                    return true;
                })
                .catch(function(err) {
                    throw err;
                });
        });

    });

});