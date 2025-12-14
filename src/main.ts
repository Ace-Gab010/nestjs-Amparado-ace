import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  const basePort = Number(process.env.PORT) || 3000;
  const maxRetries = 10; // try up to basePort + maxRetries
  let port = basePort;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await app.listen(port);
      /* eslint-disable no-console */
      console.log(`Server listening on port ${port}`);
      return;
    } catch (err: any) {
      // handle port-in-use and try next port
      if (err && (err.code === 'EADDRINUSE' || err.code === 'EACCES')) {
        console.error(`Port ${port} unavailable (code=${err.code}).`);
        if (attempt < maxRetries) {
          port++;
          console.error(`Retrying on port ${port} (${attempt + 1}/${maxRetries})...`);
          // small delay before retrying
          await new Promise((res) => setTimeout(res, 200));
          continue;
        }
        console.error(
          `Failed to bind any port in range ${basePort}..${port}. Exiting.`,
        );
        process.exit(1);
      }
      // rethrow for other errors
      throw err;
    }
  }
}

bootstrap();