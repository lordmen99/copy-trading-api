import ExpertController from '@src/controllers/ExpertController';
import {isAuthenticated} from '@src/middleware/auth/oAuth2';
import {Router} from 'express';

/**
 * @api {post} /expert/get_user_copy_by_expert 2. Get trading copy by expert
 * @apiVersion 0.1.0
 * @apiGroup II. Expert
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
export default (route: Router) =>
  route.post('/get_user_copy_by_expert', isAuthenticated, new ExpertController().getUserCopyByExpert);
