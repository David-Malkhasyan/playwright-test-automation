export enum DbType {
    Pet = "Pet",
}
export class Config {
    static getEnv(): string {
        return (process.env.ENV ?? "test").toLowerCase();
    }

    static getJetBrainsBaseURL(): string {
        return "https://www.jetbrains.com/";
    }

    static getPetStoreApiBaseURL(): string {
        return "https://petstore.swagger.io";
    }

    static getApiTimeout(): number {
        return parseInt(process.env.API_TIMEOUT_MS || "60000");
    }

    static getApiRequestLog(): boolean {
        return process.env.API_REQUEST_LOG === 'true';
    }

    static getDbRequestLog(): boolean {
        return process.env.DB_REQUEST_LOG === 'true';
    }

    static getDbConfig(dbType: DbType) {
        const env = this.getEnv().toUpperCase();

        const server = process.env[`DB_${env}_SERVER`];
        const user = process.env[`DB_${env}_USER`];
        const password = process.env[`DB_${env}_PASSWORD`];
        const database = dbType;

        if (!server) throw new Error(`Missing ${env}`);
        if (!user) throw new Error(`Missing DB_${env}_USER`);
        if (!password) throw new Error(`Missing DB_${env}_PASSWORD`);
        if (!database) throw new Error(`Missing DB_${env}_${dbType}_DATABASE`);

        return {
            user,
            password,
            server,
            database,
            options: {encrypt: true, trustServerCertificate: true},
        } as const;
    }
}
