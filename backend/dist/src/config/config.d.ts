export interface Config {
    port: number;
    mongodbUri: string;
    jwt: {
        secret: string;
        accessExpirationMinutes: string;
    };
    env: string;
}
declare const config: Config;
export default config;
//# sourceMappingURL=config.d.ts.map