import TradingOrderController from '@src/controllers/TradingOrderController';
import {isAuthenticated} from '@src/middleware/auth/oAuth2';
import {Router} from 'express';

/**
 * @api {post} /trading_order/create_trading_order 1. Create trading order
 * @apiVersion 0.1.0
 * @apiGroup VI. Trading Order
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
 * @apiParam {String} id_admin Id của admin thực hiện đánh trong bản cp_admins
 * @apiParam {String} type_of_order Loại đánh lệnh (WIN/LOSE)
 * @apiParam {Number} threshold_percent Ngưỡng % của total_amount
 * @apiParam {Number} threshold_amount Ngưỡng tiền của total_amount
 * @apiParam {String} type Loại ngưỡng (PERCENT/AMOUNT)
 * @apiParam {Number} total_amount Khoản tiền đánh của lệnh
 *
 * @apiSuccess {Object} data
 *
 * @apiSuccessExample {json} Success
 *  HTTP/1.1 200 OK
 *  {
 *      "data": [
 *            {
 *              "_id": "5fbff8e935df029b281f06fe",
 *               "id_user": "5fbf74c9c31dae69009936d0",
 *              "id_expert": "5fbf0a869fd1920a2f5de2f9",
 *              "id_admin": "5fbfdbd604a4f08d567385ec",
 *              "type_of_order": "WIN",
 *              "threshold_percent": 10,
 *              "threshold_amount": 0,
 *              "type": "PERCENT",
 *              "total_amount": 500,
 *              "status": "ACTIVE",
 *              "createdAt": "2020-11-26T18:50:17.262Z",
 *              "updatedAt": "2020-11-26T18:50:17.262Z",
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
  route.post('/create_trading_order', isAuthenticated, new TradingOrderController().createTradingOrder);
