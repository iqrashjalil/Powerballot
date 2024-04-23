import User from '../models/user-model.js'
import express from 'express';
import { ErrorHandler } from '../utils/error-handler.js';
import { catchAsyncError } from '../middlewares/catch-async-error.js';
import Candidate from '../models/candidate-model.js'





//*****************************************

// * Check for admin Role

// ***************************************** 


const checkAdmin = async (userID)=> {
    const user = await User.findById(userID);
    if(user.role === "admin"){
        return true;
    }else{
        return false;
    }
}



//*****************************************

// * newCandidate Functionality Controller Code

// ***************************************** 

const newCandidate = catchAsyncError(async (req, res, next) => {
    if (! await checkAdmin(req.user.id))
        return next(new ErrorHandler("Unauthorized User! user must be admin ", 400));

    const { name, party, idCardNumber, age, constituency } = req.body;
    const { partyPic, candidatePic } = req.files;

    

    const candidateExist = await Candidate.findOne({ idCardNumber });
    
    if (candidateExist) {
        return next(new ErrorHandler("Candidate Already Exist", 400));
    }

    const isNumeric = /^\d+$/.test(idCardNumber);

    if (!isNumeric) {
        return next(new ErrorHandler("Remove Any Special Characters/dashes", 400));
    }

    const candidateAdded = await Candidate.create({
        name,
        party,
        idCardNumber,
        age,
        constituency,
        candidatePic: partyPic ? `/uploads/${candidatePic[0].filename}` : null,
        partyPic: candidatePic ? `/uploads/${partyPic[0].filename}` : null
    });

    res.status(201).json({ message: "Candidate Added Successfully!", data: candidateAdded });
});

//*****************************************

// * updateCandidate Functionality Controller Code

// ***************************************** 


const updateCandidate = catchAsyncError(async(req, res, next)=>{
    if (! await checkAdmin(req.user.id))
        return next(new ErrorHandler("Unauthorized User! user must be admin ", 400));

    const candidateId = req.params.candidateID;
    const updatedData = req.body;

    const response = await Candidate.findByIdAndUpdate(candidateId, updatedData, {
        new: true,
        runValidators: true
    })

    if(!response)
    return next(new ErrorHandler("Candidate not found", 404));


    res.status(200).json({message: "Candidate updated successfully"})

})

//*****************************************

// * deleteCandidate Functionality Controller Code

// ***************************************** 


const deleteCandidate = catchAsyncError(async(req, res, next)=>{
    if (! await checkAdmin(req.user.id))
    return next(new ErrorHandler("Unauthorized User! user must be admin ", 400));

    const candidateId = req.params.candidateID;

    const response = await Candidate.findByIdAndDelete(candidateId)

    if(!response)
    return next(new ErrorHandler("Candidate not found", 404));


    res.status(200).json({message: "Candidate Deleted"})

})


//*****************************************

// * Get all candidates Functionality Controller Code

// ***************************************** 


const getAllCandidates = catchAsyncError(async(req, res, next)=> {
    const candidates = await Candidate.find();
    res.status(200).json({Candidates: candidates});
})



//*****************************************

// * Get constituency candidates Functionality Controller Code

// ***************************************** 





const getCandidatesWithConstituency = catchAsyncError(async(req, res, next)=> {
    const constituency = req.params.constituency;
    const candidates = await Candidate.find({constituency});
    res.status(200).json({Candidates: candidates});
})



//*****************************************

// * Get all parties Functionality Controller Code

// ***************************************** 

const getAllParties = catchAsyncError( async(req, res, next)=> {
    const uniqueParties = await Candidate.distinct('party');
    const partyPics = await Candidate.find({}, { partyPic: 1, _id: 0 }); // Fetch party pics for all candidates
    const partiesWithPics = uniqueParties.map((party, index) => ({
      party,
      partyPic: partyPics[index].partyPic
    }));
    res.status(200).send({partiesWithPics: partiesWithPics});
})






export default {newCandidate, updateCandidate, deleteCandidate, getAllCandidates, getAllParties, getCandidatesWithConstituency};