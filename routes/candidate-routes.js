import express from 'express';
import jwt from '../middlewares/auth-middleware.js'
import upload from '../middlewares/upload-middleware.js';
import candidateController from '../controllers/candidate-controller.js';


const router = express.Router();


router.route('/newCandidate').post(jwt.authMiddleware,upload.fields([{ name: 'partyPic', maxCount: 1 }, { name: 'candidatePic', maxCount: 1 }]), candidateController.newCandidate);
router.route('/updateCandidate/:candidateID').put(jwt.authMiddleware, candidateController.updateCandidate);
router.route('/deleteCandidate/:candidateID').delete(jwt.authMiddleware, candidateController.deleteCandidate);

router.route('/getAllCandidates').get(jwt.authMiddleware, candidateController.getAllCandidates)
router.route('/getCandidatesWithConstituency/:constituency').get(jwt.authMiddleware, candidateController.getCandidatesWithConstituency)
router.route('/getAllParties').get(jwt.authMiddleware, candidateController.getAllParties)


export default router;