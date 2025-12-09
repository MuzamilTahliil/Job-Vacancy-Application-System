
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import request from 'supertest';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';

async function test() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api');
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();

  console.log('Attempting to fetch users WITHOUT token...');
  // Fetch All Users WITHOUT Token
  const fetchRes = await request(app.getHttpServer())
    .get('/api/users');

  console.log('Fetch Users Status:', fetchRes.status);
  
  if (fetchRes.status === 200) {
     console.log('SUCCESS: Accessed users endpoint without token!');
  } else {
     console.log('FAILURE: Still received status:', fetchRes.status);
  }

  await app.close();
}
test();
