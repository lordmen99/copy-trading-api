import IAccessTokenModel from '@src/models/cpAccessToken/IAccessTokenModel';
import IAdminEntities from '@src/models/cpAdmin/IAdminModel';
import ClientEntities from '@src/models/cpClient/IClientModel';
import AccessTokenRepository from '@src/repository/AccessTokenRepository';
import AdminRepository from '@src/repository/AdminRepository';
import {contants, security} from '@src/utils';
import {randomBytes} from 'crypto';
import {createServer, exchange, ExchangeDoneFunction} from 'oauth2orize';
import passport from 'passport';

// initialization token
const initToken = async (client: ClientEntities, adminModel: IAdminEntities, done: ExchangeDoneFunction) => {
  try {
    const _accessTokenRepository = new AccessTokenRepository();
    const result = await _accessTokenRepository.findOne({
      client_id: client.client_id,
      id_admin: adminModel._id.toString(),
    } as IAccessTokenModel);
    if (result) {
      await _accessTokenRepository.delete(result._id);
    }
    const tokenValue = randomBytes(128).toString('hex');
    await _accessTokenRepository.create({
      client_id: client.client_id,
      id_admin: adminModel._id.toString(),
      token: tokenValue,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IAccessTokenModel);
    done(null, tokenValue);
  } catch (error) {
    done(error);
  }
};

// Create OAuth 2.0 server
const server = createServer();

// Exchange username & password for an access token.
server.exchange(
  exchange.password(
    {},
    async (client, username: string, password: string, _scope, body, issused: ExchangeDoneFunction) => {
      try {
        console.log(body, 'body');
        const _adminRepository = new AdminRepository();
        const admin = await _adminRepository.findOne({username} as IAdminEntities);
        if (!admin) return issused(new Error('UseUserxist'));

        if (!security.checkPassword(password.toString(), admin.salt.toString(), admin.hashed_password.toString()))
          return issused(new Error('Login Fail'));
        else {
          if (admin.status === contants.STATUS.ACTIVE) {
            // await admin.clearFCMToken(body.fcm_token);
            // await cUser.updateById(cUseUser fcm_token: body.fcm_token });
            initToken(client, admin, issused);
          } else if (admin.status === contants.STATUS.DELETE) return issused(new Error('UseUserEEN_DELETED'));
          else return issused(new Error('UserT_ACTIVE'));
        }
      } catch (error) {
        issused(error);
      }
    },
  ),
);

/**
 * @api {post} /oauth/token 1. Sign in
 * @apiVersion 0.1.0
 * @apiGroup VII. Authorization
 *
 * @apiHeader {String} Content-Type application/json.
 * @apiHeader {String} Accept application/json.
 *
 * @apiHeaderExample {Header} Header-Example
 *    "Content-Type": "application/json"
 *    "Accept": "application/json"
 *
 * @apiParam {String} username
 * @apiParam {String} password
 * @apiParam {String} grant_type password
 * @apiParam {String} client_id b109f3bbbc244eb82441917ed06d618b9008dd09b3bef
 * @apiParam {String} client_secret password
 * @apiParam {String} scope offline_access
 *
 * @apiSuccess {Object} data
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "access_token": "d8e52612c0015c818fc76b007797e342bad3a6959f4241f11642c4249be7dae31d023112e0f605f23b0b950a032408222581f6044a38bf1979160b555b103ac36234c99981bb2eae67ae3f267a6358066210ef1637ad83880d83f6b16e67365363efde7485ac837496f59d08686f777212da67fc85dbc1901d5df34cd6675a52",
 *      "token_type": "Bearer"
 *    }
 *
 * @apiError (404 Not Found) NotFound API not found
 * @apiErrorExample {json} 404 Not Found Error
 *    HTTP/1.1 404 Not Found
 *
 * @apiError (500 Internal Server Error) InternalServerError The server encountered an internal error
 * @apiErrorExample {json} 500 Account not exist
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *       {
 *          "error": "server_error",
 *          "error_description": "Account not exist"
 *       }
 *    }
 * @apiErrorExample {json} 500 Login Fail
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *       {
 *          "error": "server_error",
 *          "error_description": "Login Fail"
 *       }
 *    }
 * @apiErrorExample {json} 500 Account not active
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *       {
 *          "error": "server_error",
 *          "error_description": "ACCOUNT_NOT_ACTIVE"
 *       }
 *    }
 */

const token = [
  passport.authenticate(['basic', 'oauth2-client-password'], {session: false}),
  server.token(),
  server.errorHandler(),
];

const isAuthenticated = passport.authenticate('bearer', {session: false});

export {token, isAuthenticated};
