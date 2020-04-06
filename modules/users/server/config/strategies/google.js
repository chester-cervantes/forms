'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  users = require('../../controllers/users.server.controller');

module.exports = function (config) {
  // Use google strategy
  passport.use(new GoogleStrategy({
    clientID: "286508029428-b2bqol5rqtog7gomd5uq97a4s6bkga5i.apps.googleusercontent.com",
    clientSecret: "JkqkqJvVSyQpzt0CSKUgNMk2",
    callbackURL: config.google.callbackURL,
    passReqToCallback: true,
    scope: ['https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  },
    function (req, accessToken, refreshToken, profile, done) {
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      // Create the user OAuth profile
      var providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        username: profile.username,
        profileImageURL: (providerData.picture) ? providerData.picture : undefined,
        provider: 'google',
        providerIdentifierField: 'id',
        providerData: providerData
      };

      console.log("firstName " + providerUserProfile.firstName + "\tlastName: " + providerUserProfile.lastName + "\temail: " + providerUserProfile.email);

      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);
    }));
};
