import TradingCopyController from '@src/controllers/TradingCopyController';
import {Router} from 'express';

/**
 * @api {post} /trading_copy/stop_trading_copy 2. Stop trading copy
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
 * @apiParam {Number} stop_loss Mức tiền cắt lỗ (nếu đạt mức này thì dừng copy trading)
 * @apiParam {Number} taken_profit Mức tiền lãi (nếu đạt mức này thì dừng copy trading)
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
 *              "stop_loss": 50,
 *              "taken_profit": 1000,
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
export default (route: Router) => route.post('/stop_trading_copy', new TradingCopyController().stopTradingCopy);
