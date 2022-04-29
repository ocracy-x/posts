import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';

import app from './src/app';
import { firebaseConfig } from './firebaseConfig';
import { cleanUpMetadata } from 'inversify-express-utils';

dotenv.config();
const port = process.env.PORT || 3001;

initializeApp(firebaseConfig);
cleanUpMetadata();

app.listen(port, () => {
	console.log(`Listening on port=${port}`);
});
