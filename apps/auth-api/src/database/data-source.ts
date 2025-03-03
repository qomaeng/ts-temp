import 'reflect-metadata';

import { DataSource } from 'typeorm';

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'alli_admin',
  password: 'alli_admin',
  database: 'alli_admin',
  schema: 'alli_admin',
  connectTimeoutMS: 10_000,
  synchronize: false,
  logging: false,
  poolSize: 30,
  entities: [],
  migrations: [],
  subscribers: [],
});
