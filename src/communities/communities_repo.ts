export class Community {
	constructor(readonly name: string) {}
}

export abstract class CommunitiesRepo {
	readonly repo = 'communities';
}

export class PostgresCommunitiesRepo extends CommunitiesRepo {}
