import express from 'express';
import http from 'http';
import cors from 'cors'

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: 'http://localhost:5173',
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 204
}))

app.get('/health', (_req, res) => {
    res.sendStatus(200)
})

app.use(express.json());
app.use(express.urlencoded())

app.use((_req, res, next) => {
    console.log('Response headers:', res.getHeaders());
    next();
});

app.use('/api/nodes', require('./nodes/routes'));

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});