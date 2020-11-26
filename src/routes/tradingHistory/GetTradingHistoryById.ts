import TradingHistoryController from '@src/controllers/TradingHistoryController';
import {Router} from 'express';

/**
 * @api {get} /trading_history 1. Get trading history
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
 * @apiSuccess {Object} data
 *
 * @apiSuccessExample {json} Success
 *  HTTP/1.1 200 OK
 *  {
 *      "data": [
 *            {
 *              "id": 1,
 *              "User_id": 26,
 *              "email_friend": "danh.nguyenminh@pgpg.com",
 *              "status": "IN_ACTIVE",
 *              "created_at": "2020-04-07T03:27:46.000Z",
 *              "updated_at": "2020-04-07T03:27:46.000Z"
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
export default (route: Router) => route.get('', new TradingHistoryController().getTradingHistoryById);
