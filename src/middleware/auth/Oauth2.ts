import IAccessTokenModel from '@src/models/cpAccessToken/IAccessTokenModel';
import IAdminEntities from '@src/models/cpAdmin/IAdminModel';
import ClientEntities from '@src/models/cpClient/IClientModel';
import AccessTokenRepository from '@src/repository/AccessTokenRepository';
import AdminRepository from '@src/repository/AdminRepository';
import {contants} from '@src/utils';
import {randomBytes} from 'crypto';
import {createServer, exchange, ExchangeDoneFunction} from 'oauth2orize';
import passport from 'passport';

// initialization token
const initToken = async (client: ClientEntities, adminModel: IAdminEntities, done: ExchangeDoneFunction) => {
  try {
    const _accessTokenRepository = new AccessTokenRepository();
    const result = await _accessTokenRepository.findOne({
      client_id: client.client_id,
      id_admin: adminModel._id,
    } as IAccessTokenModel);
    await _accessTokenRepository.delete(result._id);
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

        // if (!security.checkPassword(password.toString(), admin.salt.toString(), admin.hashed_password.toString()))
        //   return issused(new Error('Login Fail'));
        // else {
        if (admin.status === contants.STATUS.ACTIVE) {
          // await admin.clearFCMToken(body.fcm_token);
          // await cUser.updateById(cUseUser fcm_token: body.fcm_token });
          initToken(client, admin, issused);
        } else if (admin.status === contants.STATUS.DELETE) return issused(new Error('UseUserEEN_DELETED'));
        else return issused(new Error('UserT_ACTIVE'));
        // }
      } catch (error) {
        issused(error);
      }
    },
  ),
);

const token = [
  passport.authenticate(['basic', 'oauth2-client-password'], {session: false}),
  server.token(),
  server.errorHandler(),
];

const isAuthenticated = passport.authenticate('bearer', {session: false});

export {token, isAuthenticated};
