
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

  const email = `testuser_${Date.now()}@example.com`;
  const password = 'password123';

  console.log('Registering user...');
  // 1. Register
  await request(app.getHttpServer())
    .post('/api/auth/register')
    .send({ fullName: 'Test User', email, password, role: 'JOB_SEEKER' }) // Normal user
    .expect(201);

  console.log('Logging in...');
  // 2. Login
  const loginRes = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email, password })
    .expect(200);
    
  const token = loginRes.body.access_token;
  console.log('Login successful, token obtained.');
  const [header, payload, signature] = token.split('.');
  console.log('Token Header:', Buffer.from(header, 'base64').toString());
  console.log('Token Payload:', Buffer.from(payload, 'base64').toString());

  // 3. Fetch All Users
  const fetchRes = await request(app.getHttpServer())
    .get('/api/users')
    .set('Authorization', `Bearer ${token}`);

  console.log('Fetch Users Status:', fetchRes.status);
  
  if (fetchRes.status === 200) {
     console.log('SUCCESS: Normal user CAN fetch all users. This confirms the security hole.');
  } else {
     console.log('FAILURE: Normal user CANNOT fetch users. Status:', fetchRes.status);
  }

  await app.close();
}
test();
