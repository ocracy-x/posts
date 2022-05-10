import faker from '@faker-js/faker';
import axios from 'axios';
import cliProgress from 'cli-progress';

async function seed() {
	const max = 5;
	const total = new cliProgress.SingleBar(
		{},
		cliProgress.Presets.shades_classic,
	);
	total.start(max, 0);
	for (let i = 1; i <= max; i++) {
		try {
			const username = faker.internet.userName();
			await axios.post(
				`http://localhost:3000/api/v1/profiles?username=${username}`,
			);
		} catch (_) {}
		total.update(i);
	}
	process.exit(0);
}

seed();
