const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/server');
const expect = chai.expect;
const assert = chai.assert;

const should = chai.should();

chai.use(chaiHttp);

//GET BRANDS
describe('GET/ brands', () => {
  it('should GET all the sunglasses brands', (done) => {
    // act
    chai
      .request(server)
      .get('/api/brands')
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(6);
        done();
      });
  });

  it('should ERROR if there are no brands', (done) => {
    // act
    chai
      .request(server)
      .get('/api/brands_empty')
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(204);
        done();
      });
  });
});

//GET PRODUCTS BY BRAND ID
describe('GET/ products by brand Id', () => {
  it('should GET all the products from one brand of sunglasses', (done) => {
    // act
    chai
      .request(server)
      .get('/api/brands/1/products')
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(3);
        done();
      });
  });

  it('should ERROR if brand does not exist', (done) => {
    // act
    chai
      .request(server)
      .get('/api/brands/100/products')
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(204);
        done();
      });
  });

  it('should ERROR if no products are found for the brand', (done) => {
    // act
    chai
      .request(server)
      .get('/api/brands/6/products')
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(204);
        done();
      });
  });

  it('should ERROR if no brandId is included', (done) => {
    // act
    chai
      .request(server)
      .get('/api/brands//products')
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(400);
        done();
      });
  });
});

//GET PRODUCTS
describe('GET/ products by a search term', () => {
  it('should return unique results that match unique query string (a 1:1 match)', (done) => {
    // act
    chai
      .request(server)
      .get('/api/products?searchTerm=Peanut%20Butter')
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(1);
        done();
      });
  });

  it('should return multiple results that match unique query string (a 1:many match)', (done) => {
    // act
    chai
      .request(server)
      .get('/api/products?searchTerm=Glasses')
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(6);
        done();
      });
  });

  it('should ERROR if no product matches query string', (done) => {
    // act
    chai
      .request(server)
      .get('/api/products?searchTerm=Cats')
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(204);
        done();
      });
  });

  it('should ERROR if query string is blank', (done) => {
    // act
    chai
      .request(server)
      .get('/api/products?searchTerm=')
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(400);
        done();
      });
  });
});

//POST LOGIN REQUEST
//TODO: ERROR when access token times out
//TODO: ERROR when >=3 login attempts
describe('POST/ user login', () => {
  it('should allow existing users to login', (done) => {
    //arrange: a valid query string
    // act
    chai
      .request(server)
      .post('/api/login?username=yellowleopard753&password=jonjon')
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(200);
        //returning an access token string
        res.body.should.be.a('string');
        done();
      });
  });

  it('should ERROR when invalid username/pswd combination entered', (done) => {
    //arrange: invalid username/pswd in query string
    // act
    chai
      .request(server)
      .post('/api/login/?username=MissMaddie&password=jonjon')
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(401);
        done();
      });
  });

  it('should ERROR when username is excluded', (done) => {
    //arrange: no username in query string
    // act
    chai
      .request(server)
      .post('/api/login/?username=&password=jonjon')
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(400);
        done();
      });
  });

  it('should ERROR when password is excluded', (done) => {
    //arrange: no password in query string
    // act
    chai
      .request(server)
      .post('/api/login/?username=yellowleopard753&password=')
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(400);
        done();
      });
  });
});

//GET cart
describe('GET/ user cart', () => {
  it('should GET cart for user with valid access token', (done) => {
    //arrange: a valid, current token with valid user
    let accessToken = {
      username: 'yellowleopard753',
      lastUpdated: 'Sun Sep 27 2020 08:44:00 GMT-0400 (Eastern Daylight Time)',
      token: '12345678abcdefgh',
    };
    // act
    chai
      .request(server)
      .get('/api/me/cart')
      .send(accessToken)
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(200);
        res.body.should.be.an('array');
        done();
      });
  });

  it('should ERROR if access token is out of date', (done) => {
    //arrange: valid username and accessToken.token, but out of date
    let accessToken = {
      username: 'yellowleopard753',
      lastUpdated: 'Wed Sep 23 2020 08:44:00 GMT-0400 (Eastern Daylight Time)',
      token: '12345678abcdefgh',
    };
    // act
    chai
      .request(server)
      .get('/api/me/cart')
      .send(accessToken)
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(401);
        done();
      });
  });

  it('should ERROR if access token (accessToken.token) is not valid', (done) => {
    //arrange: valid username and date but token does not match hardcoded value for user
    let accessToken = {
      username: 'yellowleopard753',
      lastUpdated: 'Sun Sep 27 2020 08:44:00 GMT-0400 (Eastern Daylight Time)',
      token: '1234567891234567',
    };
    // act
    chai
      .request(server)
      .get('/api/me/cart')
      .send(accessToken)
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(401);
        done();
      });
  });

  it('should ERROR if no access token is provided', (done) => {
    //arrange: no access token provided.
    // act
    chai
      .request(server)
      .get('/api/me/cart')
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(401);
        done();
      });
  });

  it('should ERROR if access token does not contain username', (done) => {
    //arrange: current, valid access token w/out username
    let accessToken = {
      lastUpdated: 'Sun Sep 27 2020 08:44:00 GMT-0400 (Eastern Daylight Time)',
      token: '12345678abcdefgh',
    };
    // act
    chai
      .request(server)
      .get('/api/me/cart')
      .send(accessToken)
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(401);
        done();
      });
  });

  it('should ERROR if access token contains invalid username', (done) => {
    //arrange: current, valie token with invalid username
    let accessToken = {
      username: 'MissMaddieWiggums',
      lastUpdated: 'Sun Sep 27 2020 08:44:00 GMT-0400 (Eastern Daylight Time)',
      token: '12345678abcdefgh',
    };
    // act
    chai
      .request(server)
      .get('/api/me/cart')
      .send(accessToken)
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(401);
        done();
      });
  });
});

describe('POST/ a new item to currentUser cart', () => {
  it('should POST a new product to the currentUser cart', (done) => {
    //arrange: a valid, current token with valid user
    let accessToken = {
      username: 'yellowleopard753',
      lastUpdated: 'Sun Sep 27 2020 08:44:00 GMT-0400 (Eastern Daylight Time)',
      token: '12345678abcdefgh',
    };
    // act
    chai
      .request(server)
      .post('/api/me/cart?productId=2')
      .send(accessToken)
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(2);
        done();
      });
  });

  it('should ERROR if no product matches query string', (done) => {
    //arrange: a valid, current token with valid user. Invalid productId
    let accessToken = {
      username: 'yellowleopard753',
      lastUpdated: 'Sun Sep 27 2020 08:44:00 GMT-0400 (Eastern Daylight Time)',
      token: '12345678abcdefgh',
    };
    // act
    chai
      .request(server)
      .post('/api/me/cart?productId=18')
      .send(accessToken)
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(204);
        done();
      });
  });

  it('should ERROR if productId query string is blank', (done) => {
    //arrange: a valid, current token with valid user. No
    let accessToken = {
      username: 'yellowleopard753',
      lastUpdated: 'Sun Sep 27 2020 08:44:00 GMT-0400 (Eastern Daylight Time)',
      token: '12345678abcdefgh',
    };
    // act
    chai
      .request(server)
      .post('/api/me/cart')
      .send(accessToken)
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(400);
        done();
      });
  });

  it('should ERROR if access token is out of date', (done) => {
    //arrange: valid username and accessToken.token, but out of date. Valid productId.
    let accessToken = {
      username: 'yellowleopard753',
      lastUpdated: 'Wed Sep 23 2020 08:44:00 GMT-0400 (Eastern Daylight Time)',
      token: '12345678abcdefgh',
    };
    // act
    chai
      .request(server)
      .post('/api/me/cart?productId=2')
      .send(accessToken)
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(401);
        done();
      });
  });

  it('should ERROR if access token (accessToken.token) is not valid', (done) => {
    //arrange: valid username and date; invalid accessToken.token. Valid productId.
    let accessToken = {
      username: 'yellowleopard753',
      lastUpdated: 'Sun Sep 27 2020 08:44:00 GMT-0400 (Eastern Daylight Time)',
      token: 'mumbojumbo',
    };
    // act
    chai
      .request(server)
      .post('/api/me/cart?productId=2')
      .send(accessToken)
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(401);
        done();
      });
  });

  it('should ERROR no access token is provided', (done) => {
    //arrange: no access token. Valid productId.
    // act
    chai
      .request(server)
      .post('/api/me/cart?productId=2')
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(401);
        done();
      });
  });

  it('should ERROR if access token does not contain username', (done) => {
    //arrange: current, valid token w/out username. Valid productId
    let accessToken = {
      lastUpdated: 'Sun Sep 27 2020 08:44:00 GMT-0400 (Eastern Daylight Time)',
      token: '12345678abcdefgh',
    };
    // act
    chai
      .request(server)
      .post('/api/me/cart?productId=2')
      .send(accessToken)
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(401);
        done();
      });
  });

  it('should ERROR if access token contains invalid username', (done) => {
    //arrange: current, valid token with an invalid username. Valid productId
    let accessToken = {
      username: 'MissMaddieWiggums',
      lastUpdated: 'Sun Sep 27 2020 08:44:00 GMT-0400 (Eastern Daylight Time)',
      token: '12345678abcdefgh',
    };
    // act
    chai
      .request(server)
      .post('/api/me/cart?productId=2')
      .send(accessToken)
      // assert
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect('Content-Type', 'application/json');
        res.should.have.status(401);
        done();
      });
  });

});

//NOT DONE
// describe('DELETE/ an item from currentUser cart', () => {
//   // test: response is all brands
//   it('should DELETE an item from currentUser cart', (done) => {
//     // act
//     chai
//       .request(server)
//       .delete('/me/cart/1')
//       // assert
//       .end((err, res) => {
//         assert.isNotNull(res.body);
//         expect(err).to.be.null;
//         expect('Content-Type', 'application/json');
//         res.should.have.status(200);
//         res.body.should.be.an('array');
//         res.body.length.should.be.eql(5);
//         done();
//       });
//   });

//   it('should FAIL if currentUser is not logged in', (done) => {
//     // act
//     chai
//       .request(server)
//       .delete('/me/cart/1')
//       // assert
//       .end((err, res) => {
//         assert.isNotNull(res.body);
//         expect(err).to.be.null;
//         expect('Content-Type', 'application/json');
//         res.should.have.status(200);
//         res.body.should.be.an('array');
//         res.body.length.should.be.eql(5);
//         done();
//       });
//   });
// });

// describe('POST/ a new quantity of an item in currentUser cart', () => {
//   // test: response is all brands
//   it('should POST a new quantity of an item in currentUser cart', (done) => {
//     // act
//     chai
//       .request(server)
//       .post('/me/cart/1/4')
//       // assert
//       .end((err, res) => {
//         assert.isNotNull(res.body);
//         expect(err).to.be.null;
//         expect('Content-Type', 'application/json');
//         res.should.have.status(200);
//         res.body.should.be.an('array');
//         res.body.length.should.be.eql(5);
//         done();
//       });
//   });

//   it('should FAIL if currentUser is not logged in', (done) => {
//     // act
//     chai
//       .request(server)
//       .post('/me/cart/1/4')
//       // assert
//       .end((err, res) => {
//         assert.isNotNull(res.body);
//         expect(err).to.be.null;
//         expect('Content-Type', 'application/json');
//         res.should.have.status(200);
//         res.body.should.be.an('array');
//         res.body.length.should.be.eql(5);
//         done();
//       });
//   });
// });
