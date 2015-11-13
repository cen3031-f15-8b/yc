'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    express = require(path.resolve('./config/lib/express'));

var app, agent;


var parentCredentials, childCredentials1, childCredentials2, loneChildUser;


describe('signup() method -- signup new parent user', function(){

    before(function(done){
        app = express.init(mongoose);
        agent = request.agent(app);

        done();
    });

    beforeEach(function(done){
        parentCredentials = {
            firstName: 'Parent',
            lastName: 'User',
            displayName: 'Parent User',
            email: 'nobody@example.com',
            username: 'parentusername',
            password: 'parentpassword',
            provider: 'local'
        };

        done();
    });

    it('should not be able to login if not signed up', function(done){
        parentCredentials = {
            username: parentCredentials.username,
            password: parentCredentials.password
        };
        agent.post('/api/auth/signin').
            send(parentCredentials).
            expect(400).
            end(function(signinErr, signinRes){
                done(signinErr);
            });
    });

    it('should be able to login if signed up', function(done){
        agent.post('/api/auth/signup').
            send(parentCredentials).
            expect(200).
            end(function(err, res){
                if (err) {
                    return done(err);
                }

                (res.body.username).should.match(parentCredentials.username);

            });

        parentCredentials = {
            username: parentCredentials.username,
            password: parentCredentials.password
        };
        agent.post('/api/auth/signin').
            send(parentCredentials).
            expect(200).
            end(function(err, res){
                if (err) {
                    return done(err);
                }

                (res.body.username).should.match(parentCredentials.username);
            });

        done();
    });

    afterEach(function(done){
        User.remove({}).exec(done);
    });

    after(function(done){
        User.remove({}).exec(done);
    });

});


describe('signupChild() method -- signup new child user and link to parent', function(){

    before(function(done){
        app = express.init(mongoose);
        agent = request.agent(app);

        done();
    });

    beforeEach(function(done){
        parentCredentials = {
            firstName: 'Parent',
            lastName: 'User',
            displayName: 'Parent User',
            email: 'nobody@example.com',
            username: 'parentusername',
            password: 'parentpassword',
            provider: 'local'
        };

        childCredentials1 = {
            firstName: 'Child',
            lastName: 'User1',
            displayName: 'Child User1',
            email: 'nobody@example.com',
            username: 'child1username',
            password: 'child1password',
            provider: 'local'
        };

        childCredentials2 = {
            firstName: 'Child',
            lastName: 'User2',
            displayName: 'Child User2',
            email: 'nobody@example.com',
            username: 'child2username',
            password: 'child2password',
            provider: 'local'
        };


        done();
    });

    describe('should not be able to add child user if not signed in as parent', function(){
        it('should not be able to add child if not signed in at all', function(done){
            //done(); // XXX/TODO: add test content
        });

        it('should not be able to add child if signed in as child', function(done){
            // XXX/TODO: fix post to /api/auth/signin below
            loneChildUser = new User({
                firstName: 'Lone',
                lastName: 'Child',
                displayName: 'Lone Child',
                email: 'nobody@example.com',
                username: 'lonechild',
                password: 'lonechildpw',
                roles: ['child'],
                provider: 'local'
            });

            loneChildUser.save(function(err, user){
                if (err) {
                    return done(err);
                }

                console.log(User.findOne());

                var loneChildCredentials = {
                    username: loneChildUser.username,
                    password: loneChildUser.password
                };

                agent.post('/api/auth/signin').
                    send(loneChildCredentials).
                    expect(200).
                    end(function(err, res){
                        //console.log(res);
                        if (err) {
                            return done(err);
                        }

                        (res.body).should.have.property('username');
                        (res.body.username).should.match(loneChildUser.username);

                        agent.post('/api/auth/signupchild').
                            send(childCredentials1).
                            expect(400).
                            end(function(err, res){
                                if (err) {
                                    return done(err);
                                }

                                (res.body.message).should.exist();
                            });
                    });
            });

            done();
        });
    });


    it('should be able to add one child', function(done){
        agent.post('/api/auth/signup').
            send(parentCredentials).
            expect(200).
            end(function(err, res){
                if (err) {
                    return done(err);
                }

                (res.body.username).should.match(parentCredentials.username);


                parentCredentials = {
                    username: parentCredentials.username,
                    password: parentCredentials.password
                };
                agent.post('/api/auth/signin').
                    send(parentCredentials).
                    expect(200).
                    end(function(err, res){
                        if (err) {
                            return done(err);
                        }

                        (res.body.username).should.match(parentCredentials.username);


                        agent.post('/api/auth/signupchild').
                            send(childCredentials1).
                            expect(200).
                            end(function(err, res){
                                if (err) {
                                    return done(err);
                                }

                                (res.body).should.have.property('message');
                                (res.body.message).should.be.exactly('Added a child!');

                                agent.get('/api/users/me').
                                    expect(200).
                                    end(function(err, res){
                                        if (err) {
                                            return done(err);
                                        }

                                        (res.body).should.have.property('children');
                                        (res.body.children).should.have.length(1);
                                        (res.body.children[0]).should.have.property('username');
                                        (res.body.children[0].username).should.be.exactly(childCredentials1.username);

                                        done();
                                    });


                            });

                    });



            });


    });

    afterEach(function(done){
        agent.post('/api/auth/signout').
            expect(302).// signout method redirects user to /, so expect a 302 instead of 200
            end(function(err){
                if (err) {
                    return done(err);
                }
                User.remove({}).exec(done);
            });

    });

    after(function(done){
        User.remove({}).exec(done);
    });

});

