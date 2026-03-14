# 📄 Documentación y API (Swagger)

Es OBLIGATORIO documentar cada endpoint en el Client Gateway y los patrones en los Microservicios.

## Swagger en Client Gateway
Todo endpoint REST debe estar decorado con `@nestjs/swagger`.

### Ejemplo de Decoradores:
```typescript
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  
  @Post('login')
  @ApiOperation({ summary: 'Login de usuario' })
  @ApiResponse({ status: 200, description: 'Login exitoso', type: UserEntity })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginUserDto: LoginUserDto) { ... }
}
```

## Configuración de Swagger
En `main.ts` del Client Gateway:
```typescript
const config = new DocumentBuilder()
  .setTitle('Microservicios API')
  .setDescription('Documentación de la API para el frontend')
  .setVersion('1.0')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

## Microservicios (Protocolo Interno)
Aunque los microservicios internos no exponen REST directamente, se debe documentar cada `@MessagePattern` o `@EventPattern` con un comentario breve (si no es obvio) y el tipo de dato que espera (DTO).
