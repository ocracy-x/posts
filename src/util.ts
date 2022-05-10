import { injectable } from 'inversify/lib/annotation/injectable';
import { unmanaged } from 'inversify/lib/annotation/unmanaged';

@injectable()
export abstract class CRUD<T, Fields> {
	constructor(@unmanaged() readonly key: string) {}
	abstract create(item: T): Promise<T | void>;
	abstract read(id: string): Promise<T | void>;
	abstract patch(id: string, item: Fields): Promise<T | void>;
	abstract delete(id: string): Promise<boolean>;
}
