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
            agent.post('/api/auth/signupchild').
                send(childCredentials2).
                expect(400).
                end(function(err, res){
                    if (err) {
                        return done(err);
                    }


                    (res.body).should.have.property('message');
                    (res.body.message).should.be.exactly('Must be logged in to create child!');

                    done();
                });
        });

        xit('should not be able to add child if signed in as child -- FIXME!', function(done){

            agent.post('/api/auth/signup').
                send(childCredentials1).
                expect(200).
                end(function(err, res){
                    (res.body).should.have.property('username');
                    (res.body.username).should.be.exactly(childCredentials1.username);

                    User.findOne({'username': childCredentials1.username}, function(err, user){
                        if (err) {
                            return done(err);
                        }
                        user.roles[0] = 'child'; // signup function above creates a parent user; lets make them a child instead

                        user.save(function(err, user){
                            if (err) {
                                return done(err);
                            }

                            should(user).have.property('roles');
                            user.roles.should.have.lengthOf(1);
                            user.roles[0].should.be.exactly('child');

                            agent.get('/api/auth/signout').
                                expect(302).
                                end(function(err, res){
                                    if (err) {
                                        return done(err);
                                    }

                                    agent.post('/api/auth/signin').
                                        send({
                                            username: childCredentials1.username,
                                            password: childCredentials1.password
                                        }).
                                        expect(200).
                                        end(function(err, res){
                                            if (err) {
                                                return done(err);
                                            }

                                            (res.body).should.have.property('username');
                                            (res.body.username).should.be.exactly(childCredentials1.username);
                                            (res.body).should.have.property('roles');
                                            (res.body.roles).should.have.lengthOf(1);
                                            (res.body.roles[0]).should.be.exactly('child');

                                            agent.post('/api/auth/signupchild').
                                                send(childCredentials2).
                                                expect(400).
                                                end(function(err, res){
                                                    if (err) {
                                                        return done(err);
                                                    }


                                                    (res.body).should.have.property('message');
                                                    (res.body.message).should.be.exactly('Cannot create child account if you are not a parent!');

                                                    done();
                                                });
                                        });
                                });
                        });
                    })
                });
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

    it('should be able to add two children', function(done){
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


                        agent.post('/api/auth/signupchild'). // add child1
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

                                        agent.post('/api/auth/signupchild'). // add child2
                                            send(childCredentials2).
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
                                                        (res.body.children).should.have.length(2);
                                                        (res.body.children[0]).should.have.property('username');
                                                        (res.body.children[0].username).should.be.exactly(childCredentials1.username);
                                                        (res.body.children[1]).should.have.property('username');
                                                        (res.body.children[1].username).should.be.exactly(childCredentials2.username);

                                                        done();
                                                    });
                                            });
                                    });
                            });
                    });
            });
    });

    it('should be able to logout/login after adding a child -- Pivotal Tracker #107098296, commit f7ec543', function(done){
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

                                        agent.get('/api/auth/signout').
                                            expect(302).
                                            end(function(err, res) {
                                                if (err) {
                                                    return done(err);
                                                }

                                                agent.post('/api/auth/signin').
                                                    send({
                                                        username: parentCredentials.username,
                                                        password: parentCredentials.password
                                                    }).
                                                    expect(200).
                                                    end(function (err, res) {
                                                        if (err) {
                                                            return done(err);
                                                        }

                                                        (res.body.username).should.match(parentCredentials.username);

                                                        done();
                                                    });
                                            });
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

