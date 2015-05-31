var passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt        = require('bcrypt');

var User = require('../api/models/User.js');

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function(user, done) {

    sails.log('serializeUser:'+user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {

    sails.log('deserializeUser:'+id);
  User.findById(id,function (err, user) {
    sails.log('deserializeUser:'+user);
    done(err, user);
  });
});

passport.use(new LocalStrategy({
  'usernameField':'phone',
  'passwordField':'password'
},
  function(phone, password, done) {

    sails.log(phone+'\t'+password);
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // Find the user by username or email.
      // If there is no user with the given username,
      // or the password is not correct,
      // set the user to `false` to indicate failure
      // and set a flash message.
      // Otherwise, return the authenticated `user`.
      User.findOne({'phone':phone}, function(err, user){


        sails.log(err+'\n'+user);
        if (err) { return done(err,null); }
        if (!user) {
          return done(null,false,'用户不存在');
        }


        sails.log(err+'\n'+typeof(user)+'\n'+user.password);

        if(user.virtify(password)){
          return done(null, user,'登录成功');
        }
        return done(null, false, '用户名密码不匹配');

        // bcrypt.compare(password, user.password, function(err, res) {
        //   if (!res) return done(null, false, { message: 'Invalid Password'});
        //   return done(null, user, { message: 'Logged In Successfully'} );
        // });
      });
    });
  }
));

module.exports = {
  providers: {
    'github': {},
    'facebook': {},
    'twitter': {}
  },
  http: {
    customMiddleware: function(app){
      console.log('Express midleware for passport');
      app.use(passport.initialize());
      app.use(passport.session());
    }
  }
};
