import express from 'express';
import jwt from '../middlewares/auth-middleware.js'
import voteController from '../controllers/vote-controller.js'

const router = express.Router();


router.route('/newVote/:candidateId').post(jwt.authMiddleware, voteController.vote)
router.route('/voteCount/:constituency').get(voteController.voteCount)
router.route('/totalvotes/:constituency').get(voteController.totalVotes)


export default router;