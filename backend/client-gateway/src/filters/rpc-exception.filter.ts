import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('RpcExceptionFilter');

  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.BAD_GATEWAY;
    let message = 'Error en el microservicio';

    const error = exception.getError();

    if (typeof error === 'object' && error !== null) {
      const err = error as any;
      if (err.statusCode) {
        status = err.statusCode;
      }
      message = err.message || message;
    } else if (typeof error === 'string') {
      message = error;
    }

    this.logger.error(`RPC Error: ${message}`, exception.stack);

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
