import pgPromise, { IDatabase } from 'pg-promise';

const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'my_online_store',
    user: 'postgres',
    password: 'postgrespw',
};

const pgp = pgPromise();
export const db: IDatabase<{}> = pgp(dbConfig);