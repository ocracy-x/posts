import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.send('Hello typescript');
});

export default app;
