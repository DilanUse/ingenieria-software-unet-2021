const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const userService = require('../../components/user/user.service');

passport.use(
  new BasicStrategy((async (email, password, cb) => {
    try {
      const user = await userService.getUserByEmail(email);

      if (!user) {
        return cb(boom.unauthorized('Wrong email or password'), false);
      }
      console.log(`Password ${password} user.password ${user.password}`);
      if (!user.password || !await bcrypt.compare(password, user.password)) {
        return cb(boom.unauthorized('Wrong email or password'), false);
      }

      delete user.password;

      return cb(null, user);
    } catch (error) {
      return cb(error);
    }
  })),
);
