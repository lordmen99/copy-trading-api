import TradingCopyController from '@src/controllers/TradingCopyController';
import {isAuthenticated} from '@src/middleware/auth/oAuth2';
import {Router} from 'express';

/**
 * @api {post} /trading_copy/create_trading_copy 1. Create trading copy
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
 * @apiParam {String} id_expert Id của expert trong bản cp_experts
 * @apiParam {Number} investment_amount Khoản đầu tư của user
 * @apiParam {Number} maximum_rate Phần trăm của mỗi lệnh đánh dựa trên investment_amount
 * @apiParam {Boolean} has_maximum_rate Bật/tắt giá trị maximum_rate
 * @apiParam {Number} stop_loss Mức tiền cắt lỗ (nếu đạt mức này thì dừng copy trading)
 * @apiParam {Boolean} has_stop_loss Bật/tắt giá trị stop_loss
 * @apiParam {Number} taken_profit Mức tiền lãi (nếu đạt mức này thì dừng copy trading)
 * @apiParam {Boolean} has_taken_profit Bật/tắt giá trị taken_profit
 *
 *
 * @apiSuccess {Object} data
 *
 * @apiSuccessExample {json} Success
 *  HTTP/1.1 200 OK
 *  {
 *      "data": [
 *            {
 *              "status": "ACTIVE",
 *              "_id": "5fbf39160e4c24344ffe6cb4",
 *              "id_user": "5fbf350b93a52d31f0b426a1",
 *              "id_expert": "5fbf0a869fd1920a2f5de2ff",
 *              "investment_amount": 500,
 *              "maximum_rate": 15,
 *              "has_maximum_rate": true,
 *              "stop_loss": 50,
 *              "has_stop_loss": true,
 *              "taken_profit": 1000,
 *              "has_taken_profit": true,
 *              "__v": 0
 *            }
 *        ]
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
  route.post('/create_trading_copy', isAuthenticated, new TradingCopyController().createTradingCopy);
