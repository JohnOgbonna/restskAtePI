export interface StandardTrick extends Document {
  name: string;
  path: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  flipTrick: boolean;
  flipDirection?: "Kickflip" | "Heelflip" | null;
  description: string;
  boardRotationDirection?: string;
  bodyRotationDirection?: "Frontside" | "Backside" | null;
  degreeOfBoardRotation?: number | null;
  degreeOfBodyRotation?: number;
  directionOfFlippingRelativeToRotationOfBoard: "Inward" | "Outward" | null;
  howToPerform?: string[];
  youtubeLinks?: string[];
  prerequisites?: string[]; // Array of strings for YouTube links
}

export interface TrickOfTheDay {
  date: Date,
  trick: StandardTrick
}
