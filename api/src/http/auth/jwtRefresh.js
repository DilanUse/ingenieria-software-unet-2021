const passport = require('passport');
const { Strategy } = require('passport-jwt');

const { config } = require('../../config');

passport.use('renovateToken',
  new Strategy(
    {
      secretOrKey: config.authJwtSecretRefreshToken,
      jwtFromRequest(req) {
        let token = null;

        if (req.headers.authorization) {
          if (req.headers.authorization.split(' ')[0] === 'Bearer') {
            // eslint-disable-next-line prefer-destructuring
            token = req.headers.authorization.split(' ')[1];
            return token;
          }
        }

        if (req && req.session.refreshToken) {
          token = req.session.refreshToken;
          return token;
        }

        /*
        if (req && req.cookies.refreshToken) {
          token = req.cookies.refreshToken;
          return token;
        } */

        return token;
      },
      passReqToCallback: true,
    },
    // eslint-disable-next-line consistent-return
    (async (req, tokenPayload, cb) => {
      delete tokenPayload.iat;
      delete tokenPayload.exp;
      return cb(null, tokenPayload);
    }),
  ));
