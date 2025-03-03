import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { type NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';

import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // const config: AppConfig = app.get(ConfigService).getOrThrow('instance');

  const host = '127.0.0.1'; // FIXME: config.HOST;
  const port = 3000; // FIXME: config.PORT;

  await app.listen(port, host);
  Logger.log(`Listening at http://${host}:${port}`);
}

bootstrap().catch((error: Error) => {
  Logger.error(`Error occured while bootstraping the server: ${error}`, error.stack);
});
