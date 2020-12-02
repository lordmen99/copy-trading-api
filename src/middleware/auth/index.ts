import IAccessTokenModel from '@src/models/cpAccessToken/IAccessTokenModel';
import IAdminEntities from '@src/models/cpAdmin/IAdminModel';
import IClientModel from '@src/models/cpClient/IClientModel';
import AccessTokenRepository from '@src/repository/AccessTokenRepository';
import AdminRepository from '@src/repository/AdminRepository';
import ClientRepository from '@src/repository/ClientRepository';
import {security} from '@src/utils';
import {createHash} from 'crypto';
import passport from 'passport';
import {BasicStrategy} from 'passport-http';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import {Strategy as ClientPasswordStrategy} from 'passport-oauth2-client-password';

export default () => {
  passport.use(
    new BasicStrategy(async (username, password, done) => {
      try {
        const adminRepository = new AdminRepository();
        const admin = await adminRepository.findOne({username} as IAdminEntities);
        if (!admin) return done(null, false);
        if (!security.checkPassword(password, admin.salt, admin.hashed_password)) return done(null, false);
      } catch (error) {
        done(error);
      }
    }),
  );
  passport.use(
    new ClientPasswordStrategy(async (clientId, clientSecret, done) => {
      try {
        const clientRes = new ClientRepository();
        const result = await clientRes.findOne({
          client_id: clientId,
        } as IClientModel);
        if (!result) return done(null, false);
        const hashClientSecret = createHash('sha512').update(clientSecret).digest('hex');
        if (result.client_secret !== hashClientSecret) return done(null, false);
        return done(null, result);
      } catch (error) {
        done(error);
      }
    }),
  );
  passport.use(
    new BearerStrategy(async (token, done) => {
      try {
        const accessTokenRes = new AccessTokenRepository();
        const accessToken = await accessTokenRes.findOne({token} as IAccessTokenModel);
        if (!accessToken) return done({code: 403, type: 'invalidToken', message: 'Token invalid'});
        const adminRepository = new AdminRepository();
        const admin = await adminRepository.findById(accessToken.id_admin);
        if (!admin) return done(null, false, {message: 'Unknown User', scope: '*'});
        done(null, admin);
      } catch (error) {
        done({code: 403, type: 'invalidToken', message: 'Token invalid'});
      }
    }),
  );
};
