import TradingHistoryController from '@src/controllers/TradingHistoryController';
import {Router} from 'express';

/**
 * @api {post} /trading_history/get_list_trading_histories_follow_expert 4. Get list trading histories follow expert
 * @apiVersion 0.1.0
 * @apiGroup IV. Trading History
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
 * @apiParam {String} id_expert
 * @apiParam {Number} page
 * @apiParam {Number} size
 *
 * @apiSuccess {Object} data
 *
 * @apiSuccessExample {json} Success
 *  HTTP/1.1 200 OK
 *  {
 *      "data": [
 *            {
 *              "status": false,
 *              "_id": "5fc2a71d7e0203763e368127",
 *              "id_user": "5fbf74c9c31dae69009936d1",
 *              "id_expert": "5fbf0a869fd1920a2f5de2fc",
 *              "opening_time": "2020-11-28T19:38:00.175Z",
 *              "type_of_order": "BUY",
 *              "opening_price": 17732.71,
 *              "closing_time": "2020-11-28T19:38:00.175Z",
 *              "closing_price": 17736.64,
 *              "investment_amount": 80,
 *              "profit": 20,
 *              "fee_to_expert": 1,
 *              "fee_to_trading": 1,
 *              "type_of_money": "BTC",
 *              "__v": 0
 *            },
 *            {
 *              "status": false,
 *              "_id": "5fc2a71d7e0203763e368127",
 *              "id_user": "5fbf74c9c31dae69009936d1",
 *              "id_expert": "5fbf0a869fd1920a2f5de2fc",
 *              "opening_time": "2020-11-28T19:38:00.175Z",
 *              "type_of_order": "BUY",
 *              "opening_price": 17732.71,
 *              "closing_time": "2020-11-28T19:38:00.175Z",
 *              "closing_price": 17736.64,
 *              "investment_amount": 80,
 *              "profit": 20,
 *              "fee_to_expert": 1,
 *              "fee_to_trading": 1,
 *              "type_of_money": "BTC",
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
  route.post(
    '/get_list_trading_histories_follow_expert',
    new TradingHistoryController().getListTradingHistoriesFollowExpert,
  );
