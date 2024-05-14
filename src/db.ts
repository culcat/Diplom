import pgPromise, { IDatabase } from 'pg-promise';

const dbConfig = {
    host: '5.tcp.eu.ngrok.io',
    port: 17016,
    database: 'diplom',
    user: 'postgres',
    password: 'postgrespw',
};

const pgp = pgPromise();
export const db: IDatabase<{}> = pgp(dbConfig);