# Ejemplos Prácticos NestJS + RabbitMQ

## 1. DTO de Validación (Microservicio)
Usa `class-validator` y `class-transformer`.

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
```

## 2. Controlador de Microservicio (Auth-MS)
Manejo de mensajes con respuesta.

```typescript
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'login_user' })
  async login(@Payload() loginUserDto: LoginUserDto) {
    try {
      return await this.usersService.login(loginUserDto);
    } catch (error) {
      // Lanzar RpcException para que llegue al Gateway
      throw new RpcException({
        statusCode: 401,
        message: 'Credenciales inválidas'
      });
    }
  }
}
```

## 3. Controlador de Gateway (Client-Gateway)
Mapeo de REST a RabbitMQ.

```typescript
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    // catchError en el Gateway para re-lanzar como HttpException de NestJS
    return this.client.send({ cmd: 'login_user' }, loginUserDto)
      .pipe(
        catchError(error => {
          throw new UnauthorizedException(error.message);
        })
      );
  }
}
```

## 4. Configuración de Entorno
Asegúrate de centralizar las URLs de RabbitMQ.

```typescript
export const envs = {
  rabbitmq_url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  port: parseInt(process.env.PORT, 10) || 3000,
};
```
