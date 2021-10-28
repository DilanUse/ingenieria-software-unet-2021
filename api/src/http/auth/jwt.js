const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('@hapi/boom');
const { AUTH_STRATEGIES } = require('../constants');
const userService = require('../../components/user/user.service');
const { config } = require('../../config');

passport.use(AUTH_STRATEGIES.JWT,
  new Strategy(
    {
      secretOrKey: config.authJwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    },
    // eslint-disable-next-line consistent-return
    (async (req, tokenPayload, cb) => {
      req.params.userIdPayloadToken = tokenPayload.sub;
      req.params.tenantIdPayloadToken = tokenPayload.tenant;

      try {
        const user = await userService.getOne(tokenPayload.sub);

        if (!user) {
          return cb(boom.unauthorized(), false);
        }

        req.params.userRolePayloadToken = user.role.name;
        delete user.password;

        cb(null, { ...user.toObject() });
      } catch (error) {
        return cb(error);
      }
    }),
  ));
