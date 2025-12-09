
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';

async function check() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api');
  
  const config = new DocumentBuilder()
    .setTitle('Check')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  console.log('PATHS:', JSON.stringify(Object.keys(document.paths), null, 2));
  await app.close();
}
check();
