import pgPromise, { IDatabase } from 'pg-promise';

const dbConfig = {
    host: '147.45.247.226',
    port: 5432,
    database: 'diplom',
    user: 'gen_user',
    password: '-I*\\$,bG\\6Z\\;=',
};

const pgp = pgPromise();
export const db: IDatabase<{}> = pgp(dbConfig);