import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import * as packageJSON from '../../../package.json';

export function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Job Vacancy Application Management System API Documentation')
    .setDescription(
      'The Job Vacancy Application System connects job seekers with employers by allowing companies to post job openings and candidates to apply online. This system supports SDG 8 (Decent Work and Economic Growth) by facilitating employment opportunities and reducing unemployment. Global API Prefix: /api',
    )
    .setVersion(packageJSON.version)
    .addTag('Endpoints')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/reference',
    apiReference({
      content: document,
      layout: 'modern',
      theme: 'kepler',
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'fetch',
      },
    }),
  );
}
