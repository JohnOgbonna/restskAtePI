import mongoose from "mongoose";

export const standardTrickSchema = new mongoose.Schema({
    name: { type: String, required: true },
    path: { type: String, required: true },
    difficulty: { 
      type: String, 
      enum: ["Beginner", "Intermediate", "Advanced"], 
      required: true 
    },
    flipTrick: { type: Boolean, required: true },
    flipDirection: { 
      type: String, 
      enum: ["Kickflip", "Heelflip", "Forward", null], 
      default: null 
    },
    description: { type: String, required: true },
    boardRotationDirection: { type: String, required: false },
    bodyRotationDirection: { 
      type: String, 
      enum: ["Frontside", "Backside", "Frontside Or Backside", null], 
      default: null 
    },
    degreeOfBoardRotation: { type: Number, required: false },
    degreeOfBodyRotation: { type: Number, required: false },
    directionOfFlippingRelativeToRotationOfBoard: { 
      type: String, 
      enum: ["Inward", "Outward", "Mixed", null], 
      default: null 
    },
    howToPerform: { type: [String], default: [] },
    youtubeLinks: { type: [String], default: [] },
    prerequisites: { type: [String], default: [] },
  }, { timestamps: true }); // Adds createdAt and updatedAt fields automatically
  
  // Export the model
export const standardTrick = mongoose.model('standard_trick', standardTrickSchema);

export const trickOfTheDaySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    trick: { type: mongoose.Schema.Types.ObjectId, ref: 'standard_trick', required: true }
}, { timestamps: true });

export const trickOfTheDay = mongoose.model('daily_trick', trickOfTheDaySchema);