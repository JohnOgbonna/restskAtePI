import express from 'express';
import cors from 'cors';
import tricksRoute from './routes/tricks';

const port = process.env.PORT || 4000
const app = express();

app.use(cors());
app.use(async (_req, res, next) => {
    // Log incoming headers
    res.set('X-Powered-By', 'Node.js');
    res.set('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.use('/tricks', tricksRoute)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})