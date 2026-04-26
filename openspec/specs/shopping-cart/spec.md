# Shopping Cart Specification

## Purpose
Este dominio gestiona el estado temporal de los productos seleccionados por un usuario antes de proceder a la compra. Utiliza persistencia volátil para garantizar rapidez y eficiencia.

## Requirements

### Requirement: Gestionar Ítems del Carrito
El sistema MUST permitir a los usuarios agregar, actualizar la cantidad y eliminar productos de su carrito de compras.

#### Scenario: Agregar un producto nuevo al carrito
- GIVEN un carrito vacío para el usuario "user-1"
- WHEN el usuario agrega el producto "prod-abc" con cantidad 2 y precio 10.50
- THEN el carrito MUST contener 1 ítem con el producto "prod-abc"
- AND la cantidad total MUST ser 2

#### Scenario: Actualizar cantidad de un producto existente
- GIVEN un carrito que ya contiene el producto "prod-abc" con cantidad 2
- WHEN el usuario actualiza la cantidad del producto "prod-abc" a 5
- THEN la cantidad del producto "prod-abc" en el carrito MUST ser 5

#### Scenario: Eliminar un ítem del carrito
- GIVEN un carrito con los productos "prod-abc" y "prod-def"
- WHEN el usuario elimina el producto "prod-abc"
- THEN el carrito MUST contener solo el producto "prod-def"

### Requirement: Persistencia y Expiración
El sistema MUST persistir el estado del carrito por un tiempo limitado y MUST expirar automáticamente después de un período de inactividad.

#### Scenario: Recuperar carrito existente
- GIVEN un usuario con una sesión activa y un carrito guardado en Redis
- WHEN el usuario solicita su carrito
- THEN el sistema MUST devolver la lista completa de productos guardados

#### Scenario: Expiración por inactividad
- GIVEN un carrito creado hace 24 horas
- WHEN el tiempo de vida (TTL) configurado expira
- THEN el sistema MUST eliminar automáticamente los datos del carrito de Redis

### Requirement: Limpieza del Carrito
El sistema MUST permitir vaciar completamente el carrito de un usuario.

#### Scenario: Vaciar carrito
- GIVEN un carrito con múltiples productos
- WHEN el usuario solicita vaciar el carrito
- THEN el sistema MUST eliminar todos los ítems asociados a ese usuario
