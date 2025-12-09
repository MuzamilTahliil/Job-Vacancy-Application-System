import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost, AbstractHttpAdapter } from '@nestjs/core';

interface ValidationResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const httpAdapter = this.httpAdapterHost
      .httpAdapter as unknown as AbstractHttpAdapter<unknown, unknown, unknown>;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let errorMessage: string | string[] =
      exception instanceof Error ? exception.message : 'Unknown error';

    // If it's a validation error, standard NestJS returns { statusCode, message: [], error }
    // We want to extract that 'message' array directly.
    if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      errorMessage = (exceptionResponse as ValidationResponse).message;
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      // path: httpAdapter.getRequestUrl(ctx.getRequest()) as string,
      message: errorMessage,
    };

    if (httpStatus === (HttpStatus.INTERNAL_SERVER_ERROR as number)) {
      this.logger.error(exception);
      responseBody.message = 'Internal Server Error';
    }

    if (httpStatus === (HttpStatus.NOT_FOUND as number)) {
      const method = httpAdapter.getRequestMethod(ctx.getRequest()) as string;
      const url = httpAdapter.getRequestUrl(ctx.getRequest()) as string;
      responseBody.message = `The route ${method} ${url} was not found.`;
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
