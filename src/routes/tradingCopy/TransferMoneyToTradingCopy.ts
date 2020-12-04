import TradingCopyController from '@src/controllers/TradingCopyController';
import {isAuthenticated} from '@src/middleware/auth/oAuth2';
import {Router} from 'express';

/**
 * @api {post} /trading_copy/transfer_money_to_trading_copy 8. Transfer money to trading copy
 * @apiVersion 0.1.0
 * @apiGroup III. Trading Copy
 *
 * @apiHeader {String} Authorization The token can be generated after user login.
 * @apiHeader {String} Content-Type application/json.
 * @apiHeader {String} Accept application/json.
 *
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization": "Bearer fc4262627f14ec090ebc5b2b4bc7c3d7f528de4c0ef2a8e48"
 *      "Content-Type": "application/json"
 *      "Accept": "application/json"
 *
 * @apiParam {String} id_user Id của user trong bản cp_users
 * @apiParam {String} id_copy Id của copy trong bản cp_trading_copies
 * @apiParam {String} amount Số tiền chuyển vào ví copy trading
 *
 * @apiSuccess {Object} data
 *
 * @apiSuccessExample {json} Success
 *  HTTP/1.1 200 OK
 *  {
 *      "data": true
 *  }
 *
 * @apiError (404 Not Found) NotFound API not found
 * @apiErrorExample {json} 404 Not Found Error
 *      HTTP/1.1 404 Not Found
 *
 * @apiError (500 Internal Server Error) InternalServerError The server encountered an internal error
 * @apiErrorExample {json} 500 Internal Server Error
 *  HTTP/1.1 500 Internal Server Error
 *  {
 *    "message": "error message"
 *  }
 */
export default (route: Router) =>
  route.post(
    '/transfer_money_to_trading_copy',
    isAuthenticated,
    new TradingCopyController().transferMoneyToTradingCopy,
  );
