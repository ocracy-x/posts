import app from './src/app';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 3001;

app.listen(port, () => {
	console.log(`Listening on port=${port}`);
});
