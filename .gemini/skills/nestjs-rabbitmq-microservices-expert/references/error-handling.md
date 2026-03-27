# Manejo de Errores y Excepciones en Microservicios NestJS

En una arquitectura de microservicios con RabbitMQ, las excepciones lanzadas en el microservicio NO se propagan automáticamente al Gateway a menos que se usen filtros RPC.

## Filtro Global RPC (`RpcExceptionFilter`)

Este filtro debe ser registrado en el microservicio para capturar errores y enviarlos correctamente por el canal de RabbitMQ.

```typescript
import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class GlobalRpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError();
    // Podrías mapear errores aquí
    return throwError(() => error);
  }
}
```

## Validación en Microservicios
Configura `ValidationPipe` para que en caso de error, lance una `RpcException` que el filtro anterior pueda capturar.

```typescript
// main.ts del microservicio
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  exceptionFactory: (errors) => {
    return new RpcException({
      statusCode: 400,
      message: errors.map(e => Object.values(e.constraints)).flat(),
      error: 'Bad Request'
    });
  }
}));
```

## Interceptores para Logging
Captura el tiempo de respuesta y logs de los mensajes entrantes.

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rmqContext = context.switchToRpc().getContext<RmqContext>();
    const pattern = rmqContext.getPattern();
    
    console.log(`[RMQ] Incoming: ${pattern}`);
    const now = Date.now();
    
    return next.handle().pipe(
      tap(() => console.log(`[RMQ] Finished: ${pattern} (${Date.now() - now}ms)`)),
      catchError(err => {
        console.error(`[RMQ] Error: ${pattern}`, err);
        return throwError(() => err);
      })
    );
  }
}
```
