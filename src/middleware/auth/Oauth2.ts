// import CUserities from '@src/entities/UseUserties';
// import ClientEntities from '@src/entities/clients.entities';
// import AccessTokenRepository from '@src/repository/access_tokens.repository';
// import CUserository from '@src/repository/UseUsersitory';
// import { contants } from '@src/utils';
// import { randomBytes } from 'crypto';
// import { createServer, exchange, ExchangeDoneFunction } from 'oauth2orize';
// import passport from 'passport';
// import { security } from '../../utils';

// // initialization token
// const initToken = async (client: ClientEntities, userModel: CUserities, done: ExchangeDoneFunction) => {
//   try {
//     const accessTokenRes = new AccessTokenRepository();
//     await accessTokenRes.removeByUserlientId(userModel.id, client.id);
//     const tokenValue = randomBytes(128).toString('hex');
//     await accessTokenRes.create({
//       client_id: client.id,
//       User: userModel.id,
//       token: tokenValue,
//     });
//     done(null, tokenValue);
//   } catch (error) {
//     done(error);
//   }
// };

// // Create OAuth 2.0 server
// const server = createServer();

// // Exchange username & password for an access token.
// server.exchange(
//   exchange.password(
//     {},
//     async (client, username: string, password: string, _scope, body, issused: ExchangeDoneFunction) => {
//       try {
//         console.log(body, 'body');
//         const cUser = new CUseUsertory();
//         const cUserawait cUseUserndOne({ where: { email: username } });
//         if (!cUsereturn issused(new Error('UseUserxist'));
//         if (!security.checkPassword(password, cUserlt, cUseUserd_password))
//           return issused(new Error('Login Fail'));
//         else {
//           if (cUseratus === contants.STATUS.ACTIVE) {
//             await cUser.clearFCMToken(body.fcm_token);
//             await cUser.updateById(cUseUser fcm_token: body.fcm_token });
//             initToken(client, cUserssused);
//           } else if (cUseratus === contants.STATUS.DELETE) return issused(new Error('UseUserEEN_DELETED'));
//           else return issused(new Error('UserT_ACTIVE'));
//         }
//       } catch (error) {
//         issused(error);
//       }
//     },
//   ),
// );

// const token = [
//   passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
//   server.token(),
//   server.errorHandler(),
// ];

// const isAuthenticated = passport.authenticate('bearer', { session: false });

// export { token, isAuthenticated };
