import User from '../models/user-model.js'
import { ErrorHandler } from '../utils/error-handler.js';
import { catchAsyncError } from '../middlewares/catch-async-error.js';
import Candidate from '../models/candidate-model.js'




//*****************************************

// * vote Functionality Controller Code

// ***************************************** 

const vote = catchAsyncError(async(req, res, next)=>{

    const candidateId = req.params.candidateId;
    const userId = req.user.id;


    const candidate = await Candidate.findById(candidateId);
    if(!candidate){
        return next(new ErrorHandler("Candidate not found", 404))
    }

    const user = await User.findById(userId);
    if(!user){
        return next(new ErrorHandler("User not found", 404))
    }

    if(user.isVoted){
        return next(new ErrorHandler("You have already voted", 400))
    }

    if(user.role === "admin"){
        return next(new ErrorHandler("Admins are not allowed to vote", 400))
    }

    candidate.votes.push({user: userId})
    candidate.votesCount++;
    await candidate.save();

    await User.findOneAndUpdate(
        { _id: userId },
        { $set: { isVoted: true } }
      );

    res.status(200).json({message: "Vote Casted Successfully"})


})


//*****************************************

// * voteCount Functionality Controller Code

// ***************************************** 

const voteCount = catchAsyncError(async (req, res, next) => {
    // Extract the selected constituency from the request
    const constituency = req.params.constituency;

    // Fetch candidates based on the selected constituency
    const candidates = await Candidate.find({ constituency}).sort({ votesCount: 'desc' });

    // Map the candidates to extract relevant information
    if (!candidates || candidates.length === 0) {
        return res.status(404).json({ message: 'No candidates found for the specified constituency' });
    }
    const voteRecord = candidates.map((candidate) => ({
        party: candidate.party,
        candidate: candidate.name,
        count: candidate.votesCount,
        constituency: candidate.constituency
    }));

    res.status(200).json({ voteRecord });
});




//*****************************************

// * Total Votes Functionality Controller Code

// ***************************************** 





// Vote count controller function
const totalVotes = catchAsyncError(async (req, res, next) => {
    try {
        // Extract the selected constituency from the request parameters
        const { constituency } = req.params;

        // Validate if constituency is provided
        if (!constituency) {
            return res.status(400).json({ message: 'Constituency parameter is required' });
        }

        // Fetch candidates based on the selected constituency
        const candidates = await Candidate.find({ constituency });

        // Check if candidates exist for the specified constituency
        if (!candidates || candidates.length === 0) {
            return res.status(404).json({ message: 'No candidates found for the specified constituency' });
        }

        // Calculate total votes for the specified constituency
        let totalVotes = 0;
        candidates.forEach(candidate => {
            totalVotes += candidate.votesCount;
        });

        // Send the total votes count in the response
        res.status(200).json({ totalVotes, constituency });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});



export default {vote, voteCount, totalVotes};