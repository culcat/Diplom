import pgPromise, { IDatabase } from 'pg-promise';

const dbConfig = {
    host: '192.168.0.106',
    port: 5432,
    database: 'diplom',
    user: 'postgres',
    password: 'postgrespw',
};

const pgp = pgPromise();
export const db: IDatabase<{}> = pgp(dbConfig);