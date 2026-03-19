import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 3000;
const FILE = path.join(__dirname, '../players.json');

const API_KEY = "mi_clave_secreta_123";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userKey = req.headers['x-api-key'];

    if (userKey === API_KEY) {
        next();
    } else {
        res.status(401).json({ error: 'Acceso denegado: API Key inválida o ausente' });
    }
};

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/api', authMiddleware);

interface Player {
    id?: string;
    name: string;
    kills: number;
    deaths: number;
}

interface DBStructure {
    nId: number;
    players: { [key: string]: Player };
}

const read = async (): Promise<DBStructure> => {
    try {
        const data = await fs.readFile(FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { nId: 1, players: {} };
    }
};

const write = async (data: DBStructure): Promise<void> => {
    await fs.writeFile(FILE, JSON.stringify(data, null, 2), 'utf8');
};

app.get('/api/leaderboard/:type', async (req: Request, res: Response) => {
    const { type } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;

    const data = await read();
    const playersArr = Object.entries(data.players).map(([id, stats]) => ({
        id,
        ...stats
    }));

    playersArr.sort((a, b) => {
        if (type === 'kills') return b.kills - a.kills || a.deaths - b.deaths;
        return b.deaths - a.deaths || a.kills - b.kills;
    });

    const total = playersArr.length;
    const paginated = playersArr.slice((page - 1) * limit, page * limit);

    res.json({
        data: paginated,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    });
});

app.get('/api/player/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await read();
    const player = data.players[id];
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json({ id, ...player });
});

app.post('/api/player', async (req: Request, res: Response) => {
    const { name, kills, deaths } = req.body;
    if (!name || kills === undefined || deaths === undefined) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    const data = await read();
    const id = data.nId.toString();

    data.players[id] = { name, kills, deaths };
    data.nId++;

    await write(data);
    res.status(201).json({ id, ...data.players[id] });
});

app.listen(port, () => console.log(`🚀 Server ready at http://localhost:${port}`));
