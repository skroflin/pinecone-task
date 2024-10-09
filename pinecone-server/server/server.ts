import express from 'express';
import http from 'http';
import cors from 'cors'

const app = express();
const server = http.createServer(app);

app.get('/health', (_req, res) => {
    res.sendStatus(200)
})

app.use(express.json());
app.use(express.urlencoded())

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

app.options('*', cors())

app.use('/api/nodes', require('./nodes/routes'));

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});