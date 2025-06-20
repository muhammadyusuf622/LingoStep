import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilters implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.log('exception m=>', (exception as any).message);
    console.log('exception n=>', (exception as any).name);

    console.log(exception);
    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : `Internal server error`;

    let message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || 'Something went wrong';

    let error =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).error || null;

    const details =
      Array.isArray((exceptionResponse as any).message) &&
      typeof (exceptionResponse as any).message[0] === 'string'
        ? (exceptionResponse as any).message.map((msg: string) => {
            const [field, ...rest] = msg.split(' ');
            return {
              field,
              message: msg,
            };
          })
        : null;
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = HttpStatus.BAD_REQUEST;
        const target = (exception.meta as any)?.target?.join(', ') || 'Field';
        message = `${target} must be unique`;
        error = exception.code;
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message: message,
      error: error,
      timestamp: new Date().toISOString(),
      path: request.url,
      details,
    });
  }
}
