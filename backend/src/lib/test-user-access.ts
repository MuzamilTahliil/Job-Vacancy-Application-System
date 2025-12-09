import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/modules/app.module';
import request from 'supertest';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from 'src/common/filters/http-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';

async function test() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api');
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();

  const email = `testuser_${Date.now()}@example.com`;
  const password = 'password123';

  // 1. Register
  await request(app.getHttpServer())
    .post('/api/auth/register')
    .send({ fullName: 'Test User', email, password, role: 'USER' }) // Normal user
    .expect(201);

  // 2. Login
  const loginRes = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email, password })
    .expect(200);

  const token = loginRes.body.accessToken;
  console.log('Login successful, token obtained.');

  // 3. Fetch All Users
  const fetchRes = await request(app.getHttpServer())
    .get('/api/users')
    .set('Authorization', `Bearer ${token}`);

  console.log('Fetch Users Status:', fetchRes.status);
  console.log('Fetch Users Body:', JSON.stringify(fetchRes.body, null, 2));

  await app.close();
}
test();
