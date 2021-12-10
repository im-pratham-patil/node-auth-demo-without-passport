const JWT = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {
        name: 'sd',
        iss: 'df',
      };

      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: '1h',
        issuer: 'pratham.com',
        audience: userId.toString(),
      };

      JWT.sign(payload, secret, options, (err, accessToken) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
        }
        resolve(accessToken);
      });
    });
  },
};
