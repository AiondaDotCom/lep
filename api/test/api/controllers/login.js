var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {

  describe('login', function() {

    var loginToken = '';

    describe('GET /user/login', function() {

      it('should return a token with correct credentials', function(done) {

        request(server)
          .get('/user/login')
          .query({
            name: 'foobar@xitroo.com',
            password: 'foobar'
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.should.have.property('accountType')
            res.body.should.have.property('expireTimestamp').which.is.a.Number()
            res.body.should.have.property('lastLogin')
            res.body.should.have.property('userName')
            res.body.should.have.property('jwt')


            loginToken = res.body.jwt;

            done();
          });
      });

      it('should return a error with wrong credentials', function(done) {

        request(server)
          .get('/user/login')
          .query({
            name: 'wrong.user@domain.tld',
            password: 'wrongPassword'
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.should.have.property('message')
            res.body.message.should.be.eql('Wrong username or password. Access denied!')
            done();
          });
      });

      it('should return a error without credentials', function(done) {

        request(server)
          .get('/user/login')
          .set('Accept', 'application/json')
          //.expect('Content-Type', /json/)
          .expect(400)
          .end(function(err, res) {
            should.not.exist(err);

            done();
          });
      });

    });


    describe('GET /restricted', function() {

      it('should return a error without a token', function(done) {

        request(server)
          .get('/restricted')
          .set('Accept', 'application/json')
          //.expect('Content-Type', /json/)
          .expect(400)
          .end(function(err, res) {
            should.not.exist(err);

            //res.body.should.have.property('message')
            //res.body.message.should.be.eql('Wrong username or password. Access denied!')
            done();
          });
      });

      it('should return a error with a  wrong token', function(done) {

        request(server)
          .get('/restricted')
          .query({
            jwt: 'wrongToken'
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.should.have.property('message')
            res.body.message.should.be.eql('Token invalid')
            done();
          });
      });


      it('should grant access with correct token', function(done) {

        request(server)
          .get('/restricted')
          .query({
            // Use token from former successful login
            jwt: loginToken
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.should.be.eql('Access granted!')

            done();
          });
      });


    });



  });

});
