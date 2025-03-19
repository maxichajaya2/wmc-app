
Necesito que diagrames un flujo para un proyecto de programación. Hazlo con Mermaid.

### Especificaciones:
Habrán dos entidades de usuario: Usuario Web (Portal Intranet) - Usuario Admin (Dashboard Administrador)

- PROCESOS
PRESELECCIONADO
SELECCIONADO

- ESTADOS
REGISTRADO
RECIBIDO
ENVIADO (LIDER)
ASIGNADO
EN REVISION
ACEPTADO
DESESTIMADO

-Cada proceso pasa por los estados: Registrado, Recibido, Enviado, Asignado, En Revisión, Aceptado, Desestimado

- PERFILES
ADMIN
LIDER
REVISOR

### USUARIO WEB
El Usuario Web entrará al Portal Intranet a través de un login, dentro tendrá dos tabs, uno para actualizar su información, y otro que es la "bandeja de trabajos técnicos"

En esa bandeja, tendrá distintas acciones:
# Nuevo
Debe poder crear un trabajo técnico (Este botón se mostrará si la fecha actual es menor o igual a un parámetro llamado: fecha de cierre)
Esta acción registrará el trabajo técnico en estado "Registrado" y proceso PRESLECCIONADO

# Modificar
Debe poder modificar un trabajo técnico (Este botón se mostrará si el estado del trabajo técnico es "Registrado")

# Comentarios
Debe poder ver los comentarios de un trabajo técnico (Este botón se mostrará si el estado del trabajo técnico es "En Revisión")

# Enviar
Debe poder enviar un trabajo técnico (Este botón se mostrará si el estado del trabajo técnico es "Registrado")
Esta acción cambiará el estado del trabajo técnico a "Recibido"
Envío de correo de confirmación al usuario web

### USUARIO ADMIN
El Usuario Admin entrará al Dashboard Administrador a través de un login, dentro tendrá varios tabs:
- Tabla Usuarios Web
- Tabla Usuario (Roles y permisos)
- Tabla Categorías
- Tabla Temas
- Bandeja Trabajos Técnicos

## Bandeja Trabajos Técnicos
Esta bandeja solo mostrará los trabajos técnicos en estado "Recibido"
Los trabajos tecnicos deben tener correlativo (TT-0001, TT-0002, etc)
En la tabla de trabajos técnicos, se mostrará el correlativo, el usuario web, la categoría, el tema, el estado, el proceso y la fecha de creación

En la bandeja de trabajos técnicos, tendrá distintas acciones:
# Nuevo
Debe poder crear un trabajo técnico.
Aquí podrá seleccionar un usuario web, y llena el resto de campos.
Esta acción registrará el trabajo técnico en estado "Recibido"
Envío de correo de confirmación al usuario web
Esta acción solo la podrá realizar un usuario con perfil ADMIN

# Modificar
Debe poder modificar un trabajo técnico (Este botón se mostrará si el estado del trabajo técnico es "Recibido")
Esta acción solo la podrá realizar un usuario con perfil ADMIN

# Eliminar
Debe poder eliminar un trabajo técnico (Este botón se mostrará si el estado del trabajo técnico es "Recibido")
Esta acción solo la podrá realizar un usuario con perfil ADMIN
Eliminado lógico

# Comentarios
Debe poder crear, ver, editar y eliminar comentarios de un trabajo técnico.
Esta acción solo la podrá realizar un usuario con perfil ADMIN, REVISOR o LIDER

# Enviar a Lider
Debe poder enviar un trabajo técnico a un Lider (Este botón se mostrará si el estado del trabajo técnico es "Recibido")
Esta acción cambiará el estado del trabajo técnico a "Enviado"
Debe seleccionar un Lider de la tabla de usuarios
Esta acción solo la podrá realizar un usuario con perfil ADMIN

# Asignar
Debe poder asignar un trabajo técnico a un Revisor (Este botón se mostrará si el estado del trabajo técnico es "Enviado")
Esta acción cambiará el estado del trabajo técnico a "Asignado"
Debe seleccionar un Revisor de la tabla de usuarios
Esta acción solo la podrá realizar un usuario con perfil LIDER

# En Revisión
Esta acción cambiará el estado del trabajo técnico a "En Revisión"
Esta acción solo la podrá realizar un usuario con perfil REVISOR y LIDER

# Aceptar
Debe seleccionar un tipo (ORAL, POSTER o PRESENTACION INTERACTIVA)
Esta acción cambiará el estado del trabajo técnico a "Aceptado"
Esta acción solo la podrá realizar un usuario con perfil REVISOR y LIDER
Envío de correo de confirmación al usuario web
Cuando el proceso sea "PRESELECCIONADO" el label será "PRESELECCIONAR"
Cuando el proceso sea "SELECCIONADO" el label será "SELECCIONAR"

# Desestimar
Esta acción cambiará el estado del trabajo técnico a "Desestimado"
Esta acción solo la podrá realizar un usuario con perfil REVISOR y LIDER