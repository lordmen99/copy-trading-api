import TradingOrderController from '@src/controllers/TradingOrderController';
import {Router} from 'express';

/**
 * @api {post} /trading_order/get_list_trading_orders_by_expert 3. Get list trading orders by expert
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
 * @apiParam {Number} page
 * @apiParam {Number} size
 * @apiParam {Date} fromDate
 * @apiParam {Date} toDate
 * @apiParam {String} action
 * @apiParam {String} status
 *
 * @apiSuccess {Object} data
 *
 * @apiSuccessExample {json} Success
 *  HTTP/1.1 200 OK
 *  {
 *      "data": [
 *            {
 *              "_id": "5fbff8e935df029b281f06fe",
 *              "id_user": "5fbf74c9c31dae69009936d0",
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
 *          },
 *          {
 *              "_id": "5fbff8e935df029b281f06fe",
 *              "id_user": "5fbf74c9c31dae69009936d0",
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
 *          },
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
  route.post('/get_list_trading_orders_by_expert', new TradingOrderController().getListTradingOrdersByExpert);
