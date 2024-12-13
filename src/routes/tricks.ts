import express, { Request, Response } from 'express';
import { getAllFlipTricks, getAllTricks, filterTricks, getRandomTrick, getTrickofTheDay, searchTricksByName } from '../dbqueries';
import { convertToTitleCase } from '../caseFormatters';

const router = express.Router();

router.get('/', async (_req: Request, res: Response, next) => {
    try {
        const result = await getAllTricks();
        res.status(200).json(result);
        return
    } catch (err) {
        console.error('Error fetching tricks:', err); // Log the error for debugging
        res.status(500).json({ error: 'An unexpected error occurred' }); // Send a generic error message
        next(err)
    }
});

router.get('/flip-tricks', async (req: Request, res: Response, next) => {
    // only accept kickflip or heelflip
    if ((req.query && req.query.flipDirection && ['kickflip', 'heelflip'].includes((req.query.flipDirection as string).toLowerCase())) || !req.query.flipDirection) {
        try {
            const result = await getAllFlipTricks(req.query.flipDirection ? (req.query.flipDirection as string) : undefined);
            res.status(200).json(result)
        } catch (err) {
            console.error('Error fetching tricks:', err); // Log the error for debugging
            res.status(500).json({ error: 'An unexpected error occurred' }); // Send a generic error message
            next(err)
        }
    }
    else {
        res.status(400).json({ error: "Invalid flip direction. Must be in the form 'kickflip' or 'heelflip' or not specified" });
        next()
    }
})

router.get('/name/:name', async (req: Request, res: Response, next) => {
    const { name } = req.params
    try {
        const result = await searchTricksByName(convertToTitleCase(name))
        if (!result) {
            res.status(404).json({
                error: 'Trick not found',
                message: `Trick with name ${name} not found. Please check the name and try again. Multiword trick names must be in 'snake_case' or dash-case format`
            });
            return
        }
        res.status(200).json(result)
        return
    } catch (err) {
        console.error('Error fetching trick by name:', err); // Log the error for debugging
        res.status(500).json({ error: 'An unexpected error occurred while fetching trick by name' }); // Send a generic error message
        next(err)
    }
})

router.get('/name', async (req: Request, res: Response, next) => {
    res.status(400).json({ error: "Please provide a name parameter in the URL in the form '/name/trick-name'. Multiword trick names must be in 'snake_case' or dash-case format" });
    return
})

router.get('/random', async (_req: Request, res: Response, next) => {
    try {
        const result = await getRandomTrick()
        res.status(200).json(result)
    } catch (err) {
        console.error('Error fetching random trick:', err); // Log the error for debugging
        res.status(500).json({ error: 'An unexpected error occurred while fetching random trick' }); // Send a generic error message
        next(err)
    }
})

router.get('/trick-of-the-day', async (_req: Request, res: Response, next) => {
    try {
        const result = await getTrickofTheDay()
        res.status(200).json(result)
        return
    } catch (err) {
        console.error('Error fetching trick of the day:', err); // Log the error for debugging
        res.status(500).json({ error: 'An unexpected error occurred while fetching trick of the day' }); // Send a generic error message
        next(err)
    }
})

router.get('/filter', async (req: Request, res: Response, next) => {
    const {  difficulty, boardRotationDirection, boardRotationDegrees, bodyRotationDirection, bodyRotationDegrees, flipDirection } = req.query
    if (boardRotationDirection && !["frontside", "backside", "varied", "forward"].includes((boardRotationDirection as string).toLowerCase())) {
        res.status(400).json({ error: "Invalid board rotation direction. Must be in the form 'frontside', 'backside', 'varied' or 'forward'" });
        return
    }
    if (boardRotationDegrees && +boardRotationDegrees % 180 !== 0) {
        res.status(400).json({ error: "Invalid board rotation degrees. Must be a multiple of 180" });
        return
    }
    if (bodyRotationDirection && !["frontside", "backside", "varied", "forward"].includes((bodyRotationDirection as string).toLowerCase())) {
        res.status(400).json({ error: "Invalid body rotation direction. Must be in the form 'frontside', 'backside', 'varied' or 'forward'" });
        return
    }
    if (bodyRotationDegrees && +bodyRotationDegrees % 180 !== 0) {
        res.status(400).json({ error: "Invalid body rotation degrees. Must be a multiple of 180" });
        return
    }
    if (flipDirection && !["kickflip", "heelflip"].includes((flipDirection as string).toLowerCase())) {
        res.status(400).json({ error: "Invalid flip direction. Must be in the form 'kickflip' or 'heelflip'" });
        return
    }
    try {
        const result = await filterTricks(
            difficulty ? (difficulty as string) : undefined,
            boardRotationDirection ? (boardRotationDirection as string) : undefined,
            boardRotationDegrees ? +boardRotationDegrees : undefined,
            bodyRotationDirection ? (bodyRotationDirection as string) : undefined,
            bodyRotationDegrees ? +bodyRotationDegrees : undefined,
            flipDirection ? (flipDirection as string) : undefined
        )
        res.status(200).json(result)
    }
    catch (err) {
        console.error('Error fetching tricks:', err); // Log the error for debugging
        res.status(500).json({ error: 'An unexpected error occurred' }); // Send a generic error message
        next(err)
    }
})

export default router;
