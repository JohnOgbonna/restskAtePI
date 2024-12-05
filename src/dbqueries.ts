import mongoose from "mongoose";
import dotenv from "dotenv"
import { standardTrick, trickOfTheDay } from "./schemas";
import { StandardTrick, TrickOfTheDay } from "./typesAndInterfaces";
import { toTitleCase } from "./caseFormatters";
dotenv.config()
const dbURI = process.env.DB_CONNECTION_STRING as string

export const getAllTricks = async () => {
    try {
        await mongoose.connect(dbURI)
        const allTricks: StandardTrick[] = await standardTrick.find()
        if (allTricks.length > 0) return allTricks
        else return []
    }
    catch (err) {
        console.error("Error getting all tricks", err)
    }
    finally {
        mongoose.connection.close()
    }
}

export const getAllFlipTricks = async (flipDirection?: string) => {
    try {
        await mongoose.connect(dbURI)
        let allFlipTricks: StandardTrick[] = []
        if (!flipDirection) {
            allFlipTricks = await standardTrick.find({ flipTrick: true })
        }
        else {
            allFlipTricks = await standardTrick.find({ flipTrick: true, flipDirection: { $regex: flipDirection, $options: "i" } })
        }
        return allFlipTricks
    }
    catch (err) {
        console.error("Error getting all tricks", err)
    }
    finally {
        mongoose.connection.close()
    }
}

export const getRandomTrick = async () => {
    try {
        const allTricks: StandardTrick[] = await getAllTricks() as StandardTrick[]
        const randomIndex = Math.floor(Math.random() * allTricks.length)
        return allTricks[randomIndex]
    }
    catch (err) {
        console.error("Error getting random trick", err)
    }
    finally {
        mongoose.connection.close()
    }
}
export const searchTricksByName = async (name: string) => {
    try {
        await mongoose.connect(dbURI)
        const trick = await standardTrick.find({ name: { $regex: name, $options: "i" } })
        return trick
    }
    catch (err) {
        console.error("Error getting trick by name", err)
    }
    finally {
        mongoose.connection.close()
    }
}

export const getTrickofTheDay = async () => {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
    const query = {
        date: {
            $gte: startOfDay,
            $lt: endOfDay
        }
    };
    try {
        await mongoose.connect(dbURI)
        let todaysTrickQuery: TrickOfTheDay = await trickOfTheDay.findOne(query) as TrickOfTheDay
        let todaysTrick: StandardTrick

        if (!todaysTrickQuery) {
            const allTricks: StandardTrick[] = await getAllTricks() as StandardTrick[]
            await mongoose.connect(dbURI) // reconnect to db
            const last10Days: any = await trickOfTheDay.find({}).sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
                .limit(10);

            // Ensure the random trick is not in the last 10 days
            let randomIndex: number
            do {
                randomIndex = Math.floor(Math.random() * allTricks.length);
            } while (last10Days.some((trick: TrickOfTheDay) => trick.trick.name === allTricks[randomIndex].name));

            const todaysTrickSave = {
                date: new Date(),
                trick: allTricks[randomIndex]
            }
            todaysTrick = await standardTrick.findById(todaysTrickSave.trick) as StandardTrick
            await trickOfTheDay.create(todaysTrickSave)
        }
        else {
            todaysTrick = await standardTrick.findById(todaysTrickQuery.trick) as StandardTrick
        }
        return todaysTrick
    }
    catch (err) {
        console.error("Error getting trick of the day", err)
    }
    finally {
        mongoose.connection.close()
    }
}

export const filterTricks = async (difficulty?: string, boardRotationDirection?: string, boardRotationDegrees?: number, bodyRotationDirection?: string, bodyRotationDegrees?: number, flipDirection?: string) => {
    try {
        await mongoose.connect(dbURI)
        type Filters = {
            degreeOfBoardRotation: number | { $gte: 0 },
            boardRotationDirection: { $exists: true } | string,
            degreeOfBodyRotation: number | { $gte: 0 },
            bodyRotationDirection: { $exists: true } | string,
            flipDirection?: { $exists: true } | string,
            difficulty?: { $exists: true } | string
        }

        const filters: Filters = {
            difficulty: { $exists: true },
            degreeOfBoardRotation: { $gte: 0 },
            boardRotationDirection: { $exists: true },
            degreeOfBodyRotation: { $gte: 0 },
            bodyRotationDirection: { $exists: true },
            flipDirection: { $exists: true },
        }

        let boardRotationTricks: StandardTrick[] = []
        if (difficulty) {
            filters.difficulty = toTitleCase(difficulty)
        }
        if (boardRotationDegrees && boardRotationDegrees >= 0) {
            filters.degreeOfBoardRotation = boardRotationDegrees
        }
        if (boardRotationDirection) {
            filters.boardRotationDirection = toTitleCase(boardRotationDirection)
        }
        if (bodyRotationDegrees && bodyRotationDegrees >= 0) {
            filters.degreeOfBodyRotation = bodyRotationDegrees
        }
        if (bodyRotationDirection) {
            filters.bodyRotationDirection = toTitleCase(bodyRotationDirection)
        }
        if (flipDirection) {
            filters.flipDirection = toTitleCase(flipDirection)
        }
       
        boardRotationTricks = await standardTrick.find(filters)
        if (boardRotationTricks.length < 1) return { message: "No tricks found for the given filters" }
        return boardRotationTricks
    }
    catch (err) {
        console.error("Error getting requireds tricks", err)
    }
    finally {
        mongoose.connection.close()
    }
}