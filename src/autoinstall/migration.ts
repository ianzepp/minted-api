

export abstract class Migration {
    abstract async run(): Promise<any>;
}
