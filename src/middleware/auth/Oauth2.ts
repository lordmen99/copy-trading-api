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

// /**
//  * @api {post} /oauth/token 1. Sign in
//  * @apiVersion 0.1.0
//  * @apiGroup I. Authorization
//  *
//  * @apiHeader {String} Content-Type application/json.
//  * @apiHeader {String} Accept application/json.
//  *
//  * @apiHeaderExample {Header} Header-Example
//  *    "Content-Type": "application/json"
//  *    "Accept": "application/json"
//  *
//  * @apiParam {String} username
//  * @apiParam {String} password
//  * @apiParam {String} grant_type password
//  * @apiParam {String} client_id b109f3bbbc244eb82441917ed06d618b9008dd09b3bef
//  * @apiParam {String} client_secret password
//  * @apiParam {String} scope offline_access
//  *
//  * @apiSuccess {Object} data
//  *
//  * @apiSuccessExample {json} Success
//  *    HTTP/1.1 200 OK
//  *    {
//  *      "access_token": "b02997aa94260d7b94d097a73d54c33efdff3fdadc6ea6209b17ab2e9e1f4e13283ee4ce52",
//  *      "token_type": "Bearer"
//  *    }
//  *
//  * @apiError (404 Not Found) NotFound API not found
//  * @apiErrorExample {json} 404 Not Found Error
//  *    HTTP/1.1 404 Not Found
//  *
//  * @apiError (500 Internal Server Error) InternalServerError The server encountered an internal error
//  * @apiErrorExample {json} 500 Usert exist
//  *    HTTP/1.1 500 Internal Server Error
//  *    {
//  *       {
//  *          "error": "server_error",
//  *          "error_description": "Usert exist"
//  *       }
//  *    }
//  * @apiErrorExample {json} 500 Login Fail
//  *    HTTP/1.1 500 Internal Server Error
//  *    {
//  *       {
//  *          "error": "server_error",
//  *          "error_description": "Login Fail"
//  *       }
//  *    }
//  * @apiErrorExample {json} 500 Usert active
//  *    HTTP/1.1 500 Internal Server Error
//  *    {
//  *       {
//  *          "error": "server_error",
//  *          "error_description": "UserT_ACTIVE"
//  *       }
//  *    }
//  */
// const token = [
//   passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
//   server.token(),
//   server.errorHandler(),
// ];

// const isAuthenticated = passport.authenticate('bearer', { session: false });

// export { token, isAuthenticated };
