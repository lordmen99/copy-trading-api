// import AccessTokenRepository from '@src/repository/access_tokens.repository';
// import CUserRepository from '@src/repository/Users.repository';
// import ClientRepository from '@src/repository/clients.repository';
// import { security } from '@src/utils';
// import { createHash } from 'crypto';
// import passport from 'passport';
// import { BasicStrategy } from 'passport-http';
// import { Strategy as BearerStrategy } from 'passport-http-bearer';
// import { Strategy as ClientPasswordStrategy } from 'passport-oauth2-client-password';

// export default () => {
//   passport.use(
//     new BasicStrategy(async (username, password, done) => {
//       try {
//         const cUserRes = new CUserRepository();
//         const cUser = await cUserRes.findOne({ where: { email: username } });
//         if (!cUser) return done(null, false);
//         if (!security.checkPassword(password, cUser.salt, cUser.hashed_password)) return done(null, false);
//       } catch (error) {
//         done(error);
//       }
//     }),
//   );
//   passport.use(
//     new ClientPasswordStrategy(async (clientId, clientSecret, done) => {
//       try {
//         const clientRes = new ClientRepository();
//         const result = await clientRes.findById(clientId);
//         if (!result) return done(null, false);
//         const hashClientSecret = createHash('sha512').update(clientSecret).digest('hex');
//         if (result.client_secret !== hashClientSecret) return done(null, false);
//         return done(null, result);
//       } catch (error) {
//         done(error);
//       }
//     }),
//   );
//   passport.use(
//     new BearerStrategy(async (token, done) => {
//       try {
//         const accessTokenRes = new AccessTokenRepository();
//         const accessToken = await accessTokenRes.findOne({ where: { token } });
//         if (!accessToken) return done({ code: 403, type: 'invalidToken', message: 'Token invalid' });
//         const cUserRes = new CUserRepository();
//         const cUser = await cUserRes.findById(accessToken.User_id);
//         if (!cUser) return done(null, false, { message: 'Unknown User', scope: '*' });
//         done(null, cUser);
//       } catch (error) {
//         done({ code: 403, type: 'invalidToken', message: 'Token invalid' });
//       }
//     }),
//   );
// };
