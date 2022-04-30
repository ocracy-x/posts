import dotenv from 'dotenv';

import app from './src/app';
import { cleanUpMetadata } from 'inversify-express-utils';

dotenv.config();
const port = process.env.PORT || 3001;

cleanUpMetadata();

app.listen(port, () => {
	console.log(`Listening on port=${port}`);
});
