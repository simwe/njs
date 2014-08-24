

module.exports.passport = require('passport'), GoogleStrategy = require('passport-google').Strategy;


var users = [
    { id: 'https://www.google.com/accounts/o8/id?id=AItOawnTxjub2VwX91fKRfHrmUnRhRiLTixNEwY', username: 'simon', email: 'simonwestin@gmail.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.id === id.identifier) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}

module.exports.passport.serializeUser(function (user, done) {
    done(null, user);
});


module.exports.passport.deserializeUser(function (id, done) {
    console.log('DESERIaLIzING USER:'+id);
    findById(id, function (err, user) {
        done(err, user);
    });
});


// Use the GoogleStrategy within Passport.
// Strategies in passport require a `validate` function, which accept
// credentials (in this case, an OpenID identifier and profile), and invoke a
// callback with a user object.
module.exports.passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:'+ process.env.PORT + '/auth/google/return',
    realm: 'http://localhost:' + process.env.PORT
},
function (identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
        // To keep the example simple, the user's Google profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the Google account with a user record in your database,
        // and return that user instead.
        profile.identifier = identifier;
        console.log('profile id set to:' + identifier);
        return done(null, profile);
    });
}
));
