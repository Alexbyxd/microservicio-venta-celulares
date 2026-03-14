# 🧪 Testing y Calidad de Código

Cada módulo debe estar cubierto por pruebas unitarias e integración para asegurar la confiabilidad del sistema distribuido.

## Umbral de Cobertura
- **Cobertura Mínima Exigida**: **80%**.
- No se permiten merges a la rama principal si el umbral es inferior.

## Pruebas por Módulo
Cada controlador, servicio o pipe debe tener su archivo `.spec.ts` correspondiente.

### Ejemplo de Prueba Unitaria (Service):
```typescript
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });
});
```

## Pruebas de Integración (E2E)
- Ubicadas en la carpeta `test/` de cada microservicio.
- Deben probar el flujo completo desde el Gateway hasta el microservicio (usando mocks para RabbitMQ si es necesario).

## Estándares de Calidad
1.  **Mocking**: Usa mocks para dependencias externas (DBs, otros servicios) en las pruebas unitarias.
2.  **Supertest**: Usa `supertest` para pruebas de endpoints REST en el Gateway.
3.  **Isolation**: Cada test debe ser independiente y no depender del estado de otros.
