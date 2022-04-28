import app from './src/app';
import dotenv from 'dotenv';

import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';

dotenv.config();
const port = process.env.PORT || 3001;

initializeApp(firebaseConfig);

app.listen(port, () => {
	console.log(`Listening on port=${port}`);
});
