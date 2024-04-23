import { Schema, model } from "mongoose";

const candidateSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    idCardNumber: {
        type: String,
        required: true,
        unique: true
    },
    party: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },

    candidatePic: {
        type: String,
    },
    partyPic: {
        type: String,
    },
    constituency: {
        type: String,
    },
    votes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            votedAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    votesCount: {
        type: Number,
        default: 0
    }


})

const Candidate = model("Candidate", candidateSchema);

export default Candidate;