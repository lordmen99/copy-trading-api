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
 * @apiParam {String} id_expert Id của expert trong bản cp_experts
 * @apiParam {String} id_admin Id của admin thực hiện đánh trong bản cp_admins
 * @apiParam {String} type_of_order Loại đánh lệnh (WIN/LOSE)
 * @apiParam {Number} threshold_percent Ngưỡng % của total_amount
 * @apiParam {Number} orderedAt Thời gian thiết lập lệnh
 * @apiParam {String} time_zone TimeZone của người cài đặt lệnh
 *
 * @apiSuccess {Object} data
 *
 * @apiSuccessExample {json} Success
 *  HTTP/1.1 200 OK
 *  {
 *      "data": [
 *            {
 *              "_id": "5fbff8e935df029b281f06fe",
 *              "id_expert": "5fbf0a869fd1920a2f5de2f9",
 *              "type_of_order": "WIN",
 *              "threshold_percent": 10,
 *              "status": "ACTIVE",
 *              "createdAt": "2020-11-26T18:50:17.262Z",
 *              "ordereddAt": "2020-11-26T18:50:17.262Z",
 *              "timeSetup": "2020-11-26T18:50:17.262Z",
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
