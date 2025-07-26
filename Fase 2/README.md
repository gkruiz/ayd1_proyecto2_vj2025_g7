# AYD1_Proyecto2_VJ2025_G7

# Universidad de San Carlos de Guatemala
**Facultad de Ingeniería**  
**Escuela de Ciencias y Sistemas**  
### Curso: *Análisis y Diseño de Sistemas 1*  
### Proyecto 2 - Fase 1
---
**Grupo 7**  
**Integrantes:**
| Nombre                                 | Carnet     |
|-----------------------------------------|------------|
| Kevin Golwer Enrique Ruiz Barbales      | 201603009  |
| Luis Carlos de León Torón               | 202212535  |
| Diego Fernando Debroy Salazar           | 202101923  |
| Luciano Isaac Xiquin Ajpop              | 201800632  |

**Catedrático:** Ing. José Manuel Ruíz Juárez  
**Auxiliar:** José Manuel Ibarra Pirir  
**Fecha de entrega:** 20 de Junio 2025  

---

## 📑 Índice

1. [Requerimientos Funcionales y No Funcionales](#1-requerimientos-funcionales-y-no-funcionales)
  - [Requerimientos Funcionales](#requerimientos-funcionales)
  - [Requerimientos No Funcionales](#requerimientos-no-funcionales)
2. [Diagrama de Casos de Uso](#2-diagrama-de-casos-de-uso)
3. [Historias de Usuario](#3-historias-de-usuario)
4. [Diagrama de Clases](#4-diagrama-de-clases)
5. [Diagrama de Componentes](#5-diagrama-de-componentes)
6. [Diagrama de Despliegue](#6-diagrama-de-despliegue)
7. [Diagrama Entidad-Relación](#7-diagrama-entidad-relación)
8. [Mockups / Prototipos de Interfaces](#8-mockups--prototipos-de-interfaces)
9. [Documentación de Pruebas](#9-documentación-de-pruebas)
10. [Documentación de Pruebas E2E](#10-documentación-de-pruebas-e2e)
  - [Herramienta](#herramienta)
  - [Cobertura](#cobertura)
  - [Automatización](#automatización)
  - [Resultados Esperados](#resultados-esperados)
11. [Herramienta de Gestión Kanban](#10-herramienta-de-gestión-kanban)
  - [Link a la Herramienta](#link-a-la-herramienta)
  - [Capturas del Tablero Kanban](#capturas-del-tablero-kanban)
12. [Grabaciones del Sprint](#11-grabaciones-del-sprint)
  - [Link a las Grabaciones](#link-a-las-grabaciones)
13. [Evaluación del Scrum Master](#12-evaluación-del-scrum-master)

---

## 1. Requerimientos Funcionales y No Funcionales

### ✅ Requerimientos Funcionales

#### Generales
* Registro y autenticación con validación de correo y tokens
* Recuperación de contraseña con token vía correo electrónico
* Gestión de perfiles y carga de archivos
* Plataforma de ofertas laborales con filtros y búsqueda

#### Administrador
* Aprobar o rechazar registro de empresas
* Ver, editar y dar de baja a empresas y usuarios
* Ver reportes de usuarios y empresas, y tomar decisiones
* Ver calificaciones de empresas
* Doble autenticación con archivo .ayd1 cifrado

#### Usuario
* Registrarse y autenticar su cuenta
* Ver ofertas de empleo activas
* Buscar empleos con múltiples filtros: área, jornada, modalidad entre otros
* Aplicar a empleos, subir CV y ver detalles del puesto
* Ver, actualizar o eliminar postulaciones
* Ver y editar su perfil
* Calificar empresas, solo si es finalista o proceso finalizado
* Reportar empresas
* Ver calificaciones de empresas
* Imprimir detalles de una oferta en PDF

#### Empresa
* Solicitar registro ,tiene que ser aprobado
* Publicar ofertas de empleo con opción de "urgente"
* Gestionar aplicaciones: cambiar estado :CV visto, finalista, no apto
* Enviar correos automáticos a finalistas
* Ver historial de puestos publicados
* Editar ofertas una vez  
* Ver y actualizar su perfil  
* Finalizar un proceso y notificar a los postulantes
* Reportar usuarios


### ⚙️ Requerimientos No Funcionales

#### Técnicos
* La contraseña debe ser almacenada encriptada en la base de datos.
* Autenticación con tokens
* Validación de correo electrónico y doble autenticación para administrador
* Usar una base de datos relacional (Oracle)
* El sistema debe de estar disponible 24h
* De preferencia que el desarrollo sea hecho en react js
* Debe de ser agil al momento de moverse entre vistas

#### Desempeño y despliegue
* El sistema debe ejecutarse en Docker 
* Despliegue en una máquina virtual (en la nube).
* Implementación de CI/CD

#### Calidad de Software
* Pruebas unitarias
* Pruebas E2E automatizadas en la parte de usuario


---

## 2. Diagrama de Casos de Uso

  ![Caso De Uso Proyecto2](Documentación/Imagenes/casos.png)
---

## 3. Historias de Usuario
  
### Administrador

#### 1. Aprobación de empresas
**Como** administrador autenticado  
**Quiero** acceder a la lista de empresas pendientes  
**Entonces** puedo ver su información y aprobar o rechazar cada solicitud.

#### 2. Visualización y baja de empresas
**Como** administrador autenticado  
**Quiero** visualizar la lista de empresas aceptadas  
**Entonces** puedo dar de baja a cualquier empresa que lo requiera.

#### 3. Visualización y baja de usuarios
**Como** administrador autenticado  
**Quiero** acceder a la lista de usuarios registrados  
**Entonces** puedo dar de baja a cualquier usuario por motivos válidos.

#### 4. Edición de Usuarios y Empresas
**Como** administrador autentificado
**Quiero** acceder a la lista de usuarios y empresas registradass 
**Entonces** puedo editar sus datos

#### 5. Calificación de Empresas
**Como** administrador autentificado
**Quiero** acceder a la lista de empresas aceptadas
**Entonces** puedo ver la calificación promedio de cada una

#### 6. Generación de reportes
**Como** administrador autenticado  
**Quiero** ingreso al módulo de reportes  
**Entonces** puedo generar estadísticas sobre vacantes, áreas más buscadas, usuarios y empresas.

---

### Empresa

#### 5. Registro de empresa
**Como** empresa nueva  
**Quiero** ingreso mis datos en el formulario de registro  
**Entonces** mi solicitud quedará pendiente hasta ser aprobada por el administrador.

#### 6. Autenticación con aprobación
**Como** empresa registrada pero no aprobada  
**Quiero** intento iniciar sesión  
**Entonces** se me informa que debo esperar aprobación antes de acceder.

#### 7. Publicar vacante
**Como** empresa aprobada y autenticada  
**Quiero** ingreso al formulario de publicación de empleo  
**Entonces** puedo crear un nuevo puesto completando toda la información requerida.

#### 8. Ver aplicaciones
**Como** empresa autenticada  
**Quiero** accedo a la sección de aplicaciones  
**Entonces** puedo ver la lista de postulantes ordenada por fecha.

#### 9. Atender aplicación
**Como** he recibido aplicaciones a una vacante  
**Quiero** visualizo el CV de un postulante  
**Entonces** puedo cambiar su estado a “CV visto”, “Finalista” o “No apto”.

#### 10. Actualizar datos
**Como** empresa registrada en la plataforma
**Quiero** poder visualizar y editar los datos de mi perfil corporativo
**Entonces** podré mantener mi información actualizada para los candidatos

#### 11. Modificar oferta laboral
**Como** empresa que ha publicado ofertas de trabajo
**Quiero** poder modificar una vez los detalles de mis ofertas publicadas
**Entonces** podré corregir errores o actualizar información sin afectar los procesos de selección en curso ni perder las aplicaciones recibidas.

#### 12. Filtrar ofertas laborales
**Como** empresa con múltiples ofertas publicadas
**Quiero** poder filtrar mis ofertas por fecha de publicación, jornada laboral y modalidad de trabajo
**Entonces** podré encontrar y gestionar específicamente las ofertas que necesito revisar.

#### 13. Finalizar proceso de selección
**Como** empresa que ha completado un proceso de selección
**Quiero** poder finalizar formalmente el proceso de una oferta de empleo
**Entonces** todos los procesos activos se cancelarán automáticamente y se notificará por correo a todos los candidatos involucrados que el proceso ha finalizado.

#### 14. Reportar Usuario
**Como** empresa que ha finalizado un proceso de selección
**Quiero** poder reportar a un candidato por conducta inapropiada durante el proceso
**Entonces** podré contribuir a mantener la calidad de la plataforma mediante un reporte que será revisado por el administrador.

#### 15. Notificar a finalistas
**Como** he marcado a un postulante como finalista  
**Quiero** confirmo su selección  
**Entonces** el sistema le envía automáticamente un correo con los pasos a seguir.

#### 16. Ver historial de vacantes
**Como** soy una empresa autenticada  
**Quiero** ingreso a mi historial de publicaciones  
**Entonces** puedo ver los procesos activos, finalizados y cancelados.

---

### Usuario

#### 17. Registro de usuario
**Como** persona interesada en buscar empleo  
**Quiero** completo el formulario de registro  
**Entonces** puedo iniciar sesión y acceder a las vacantes.

#### 18. Autenticación sin aprobación
**Como** usuario registrado  
**Quiero** ingreso mis credenciales correctamente  
**Entonces** accedo al sistema sin necesidad de aprobación previa.

#### 19. Ver ofertas laborales
**Como** usuario autenticado  
**Quiero** accedo a la página principal  
**Entonces** puedo ver todas las vacantes disponibles con sus datos clave.

#### 20. Buscar empleo por área
**Como** usuario autenticado  
**Quiero** selecciono un área en el filtro de búsqueda  
**Entonces** se me muestran únicamente las vacantes relacionadas con esa área.

#### 21. Aplicar a un empleo
**Como** usuario interesado en una vacante  
**Quiero** ingreso al detalle del puesto y cargo mi CV  
**Entonces** mi postulación se registra y se envía a la empresa correspondiente.

#### 22. Ver mis postulaciones
**Como** usuario autenticado  
**Quiero** accedo a mi historial de aplicaciones  
**Entonces** puedo ver el estado y detalles de cada postulación.

#### 23. Calificación de Empresas
**Como** usuario autentificado
**Quiero** acceder a la lista de empresas aceptadas
**Entonces** puedo ver la calificación promedio de cada una

#### 24. Ver y Actualizar Perfil
**Como** usuario registrado en la plataforma,
**Quiero** poder visualizar y editar los datos de mi perfil corporativo,
**Entonces** podré mantener mi información actualizada para los candidatos, excepto mi correo electrónico que permanecerá fijo por seguridad.

#### 25. Búsqueda de Empresas
**Como** usuario en búsqueda de empleo,
**Quiero** poder visualizar todas las empresas activas en la plataforma con su información relevante,
**Entonces** podré explorar oportunidades laborales específicas por empresa y aplicar directamente a sus ofertas desde su perfil corporativo.

#### 26. Imprimir Oferta de Empleo
**Como** usuario interesado en una oferta laboral,
**Quiero** poder generar un archivo PDF con todos los detalles de la oferta,
**Entonces** podré llevar la información física a entrevistas o compartirla fácilmente con otros.

#### 27. Calificar Empresas
**Como** usuario que ha completado un proceso de selección,
**Quiero** poder calificar mi experiencia con la empresa durante el proceso,
**Entonces** podré contribuir a mantener la transparencia y calidad de las empresas en la plataforma para futuros candidatos.

#### 28. Reportar Empresa
**Como** usuario que ha finalizado un proceso de selección,
**Quiero** poder reportar a una empresa por conducta inapropiada durante el proceso,
**Entonces** podré contribuir a mantener la calidad y ética de la plataforma mediante un reporte que será revisado por el administrador.

#### 30. Eliminar postulación
**Como** ya apliqué a un empleo  
**Quiero** decido eliminar mi candidatura  
**Entonces** se me pide confirmación y, si acepto, la postulación se elimina del listado.

---

### Autenticación Especial

#### 31. Autenticación de administrador con doble paso
**Como** administrador  
**Quiero** inicio sesión con credenciales válidas y subo el archivo `auth.ayd1`  
**Entonces** el sistema valida el archivo y me da acceso al panel principal.

---

## 4. Diagrama de Clases

![Diagrama de Clases](Documentación/Imagenes/clases.png)

---

## 5. Diagrama de Componentes
![DC](Documentación/Imagenes/Componentes.jpg)

---

## 6. Diagrama de Despliegue

![DD](Documentación/Imagenes/Despliegue.png)
---

## 7. Diagrama Entidad-Relación

  ![ER](Documentación/Imagenes/ER.png)
---

## 8. Mockups / Prototipos de Interfaces

  ![Mockup de la Interfaz Principal](Documentación/Imagenes/mockup_page-0001.jpg)

---

## 9. Documentación de Pruebas

### Pruebas Unitarias

Las pruebas unitarias son muy importantes ya que se toman unidades individuales del código y se prueban de forma aislada para comprobar su correcto funcionamiento, asegurando que producen los resultados esperados. Estas pruebas no dependen de la interfaz de usuario, únicamente del código.

### Herramienta Utilizadas

* Pytest

### Activación del Entorno Virtual

> [!TIP]
> .\venv\Scripts\activate

### Comando para Ejecutar las Pruebas Unitarias

> [!TIP]
> pytest tests/

### Instrucciones Claras sobre Cómo Ejecutar las Pruebas

* **Herramienta Utilizada:** Pytest
* **Código de Error:** 403 (como ejemplo en el caso de prueba fallida)
* **Captura de Pantalla:** [Insertar captura de pantalla aquí]
* **Descripción del Error:** El error 403 indica que el usuario no tiene permisos para aprobar una empresa, ya que solo los administradores pueden realizar esta acción.
* **Qué Debería Hacer el Código:**  El código debería permitir la aprobación de una empresa solo si el usuario autenticado es un administrador, devolviendo un estado 200 con un mensaje de éxito; de lo contrario, debería devolver un 403 con un mensaje de error.

### Código de error
```
# ¡¡ ERROR !!
def test_aprobar_empresa_no_autorizado(client, mocker):
    # Simula que el usuario es de tipo empresa, no admin
    mock_user = mocker.Mock()
    mock_user.tipo = 'empresa'
    mock_user.is_authenticated = True
    mocker.patch('flask_login.current_user', new=mock_user)

    response = client.put("/api/company/approve", json={"id": 99})

    assert response.status_code == 403
    data = response.get_json()
    assert data["status"] == "error"
    assert "Solo los administradores pueden aprobar" in data["message"]

```

### Captura de las pruebas unitarias:
  ![PruebasUnitarias1-5](./Documentación/Imagenes/unit1.png)
  ![PruebasUnitarias6-11](./Documentación/Imagenes/unit2.png)

### Explicación del código erróneo:

Esta prueba no es correcta y nos ayuda a validar que la implementación del endpoint relacionado a la aceptación de empresas puede darse únicamente desde el lado del administrador. No puede ser de tipo usuario o empresa porque dará error.

### ¿Qué debería hacer el código?

1. **test_errores_crear_usuario**
* Simula el registro de un nuevo usuario.
* Verifica que el API /api/users responda correctamente con algún estado esperado (201, 400, 409 o 500).
* Asegura que se devuelvan campos "status" y "message" en la respuesta.

2. **test_ingresar_empresa**
* Simula el registro de una nueva empresa.
* Verifica que el API /api/users responda correctamente con algún estado esperado (201, 400, 409 o 500).
* Asegura que se devuelvan campos "status" y "message" en la respuesta.

3. **test_login_usuario_exitoso**
* Simula el inicio de sesión de un usuario.
* Usa mocker para evitar la conexión real a Oracle y simula la autenticación.
* Verifica que se retorne un login exitoso (código 200) y tipo "usuario".

4. **test_logout**
* Verifica que el endpoint /logout funcione y cierre sesión correctamente.
* Espera una respuesta con success = True y un mensaje adecuado.

5. **test_aprobar_empresa_exitoso**
* Simula que un admin autenticado aprueba una empresa (vía /api/company/approve).
* Mockea la base de datos y el usuario admin.
* Asegura que se retorne un estado 200 y un mensaje de éxito.

6. **test_dar_baja_usuario**
* Simula un intento de dar de baja un usuario.
* Mockea la base de datos y el usuario admin.
* Se comprueban 4 escenarios, uno exisitoso mientras los otros presentan errores de autetificación, autorización y falta de campos.
* Se retorna un estado 200 si la prueba es exitosa

7. **test_dat_baja_empresa**
* Simula un intento de dar de baja una empresa.
* Mockea la base de datos y el usuario admin.
* Se comprueban 4 escenarios, uno exisitoso mientras los otros presentan errores de autetificación, autorización y falta del campo ID.
* Se retorna un estado 200 si la prueba es exitosa

8. **test_eliminar_puesto**
* Simula una petición para eliminar un puesto de trabajo por parte de un usuario.
* Se parametriza con distintos escenarios que incluyen una eliminación exitosa, un intento sin autenticación, un intento por un usuario no autorizado (tipo admin), y una petición con campos faltantes.
* Se mockean tanto la conexión a la base de datos como el usuario.
  
9. **test_ver_cv_usuario**
* Verifica la funcionalidad para que una empresa pueda marcar un CV como visto en una aplicación de empleo.
* Se prueban cuatro escenarios: éxito con una empresa autenticada, intento sin autenticación, intento por un tipo de usuario no autorizado (admin), y solicitud sin el campo id_aplicacion.
* Se mockean la conexión a la base de datos y el usuario autenticado. 
* Además, se simula la consulta que comprueba si la aplicación pertenece a la empresa.
  
10.  **test_listar_resenas**
* Evalúa la funcionalidad que permite a un usuario listar las reseñas de empresas que ha dejado.
* Se prueban tres escenarios: uno exitoso con un usuario autenticado, otro con un usuario no autenticado y uno más con un usuario del tipo incorrecto.
* Se mockean la conexión a la base de datos.
* Se verifica que la respuesta tenga el estado HTTP esperado y que, en caso de éxito, se reciba una lista con el número correcto de reseñas; en los demás casos, que contenga el mensaje de error correspondiente.

11.  **test_ver_puestos_aplicados**
* Prueba la funcionalidad que permite a un usuario consultar los puestos a los que ha aplicado, junto con su estado.
* Incluye cuatro escenarios: uno exitoso con aplicaciones registradas, otro exitoso sin aplicaciones, un intento de acceso por una empresa no autorizada, y una solicitud de un usuario no autenticado.
* Se mockean tanto la conexión a la base de datos como el usuario autenticado mediante flask_login.

## 10. Documentación de Pruebas E2E

### Herramienta utilizada
Selenium

![Selenium](Documentación/Imagenes/seleniumlogo.png)

### Cobertura
Pruebas realizadas:

  - Login
  - Autenticación del administrador
  - Ver tablero de empresas pendientes de ser aprobadas
  - Actualizar tablero
  - Volver al menú principal del Administrador
  - Cerrar Sesión

### Automatización

Se creó un archivo .bat de nombre e2e_start el cual tiene de contenido el comando comoo tal para ejecutar un archivo de python

python selenium
---

### Resultados Esperados
Primero incia en el menú principal
![Menú principal](Documentación/Imagenes/menuadminauto.png)

Luego se va al login y se escribe automaticamente las credenciales
NOTA: Esto realizará una autenticación a un usuario de tipo ADMIN

![Login Auto](Documentación/Imagenes/loginauto.png)

Se realiza la segunda autenticación con un archivo de una ruta definifa.

![2FA Auto](Documentación/Imagenes/2FAauto.png)

Posterior a eso se activa la alerta que será atendida automáticamente.

![ALERTA 2FA](Documentación/Imagenes/alerta2FAauto.png)

Luego se dirije al respectivo menú de administrador.

![Menu admin AUTO](Documentación/Imagenes/menuadminauto.png)

Revisa las tablas de empresas pendientes.

![Tablas empresa](Documentación/Imagenes/empresapendienteauto.png)

Por ultimo regresa al menú del admin, cierra sesión y se termina las pruebas satisfactoriamente.
![Logout AUTO](Documentación/Imagenes/logoutauto.png)

Resultados en consola del proceso realizado.
![Consola](Documentación/Imagenes/consola.png)

## 10. Herramienta de Gestión Kanban

### 🔗 Link a la Herramienta

- [Tablero: Sprint 1](https://ingenieria-team-s9kv3ztx.atlassian.net/jira/software/projects/GRUP/boards/3)
- [Tablero: Sprint 2](https://ingenieria-usac-ayd1.atlassian.net/jira/software/projects/KAN/boards/1)

### 🖼️ Capturas del Tablero Kanban

#### Primer Sprint

**Inicio del Sprint**

![Kanban Inicial](Documentación/Imagenes/kanbaninicial.png)

**Durante el Sprint**

- Primer cambio  
  ![Kanban 1](Documentación/Imagenes/kanban1.png)

- Segundo cambio  
  ![Kanban 2](Documentación/Imagenes/kanban2.png)

**Final del Sprint**  
![Kanban Final 1](Documentación/Imagenes/kanbanfinal1.png)

---

#### Segundo Sprint

**Inicio del Sprint**

![Kanban Inicial 2](Documentación/Imagenes/kanbaninicial2.png)
![Kanban Inicial 2_1](Documentación/Imagenes/kanbaninicial2_1.png)
![Kanban Inicial 2_2](Documentación/Imagenes/kanbaninicial2_2.png)
![Kanban Inicial 2_3](Documentación/Imagenes/kanbaninicial2_3.png)

**Durante el Sprint**

- Primer cambio  
  ![Kanban 3](Documentación/Imagenes/kanban3.png)

- Segundo cambio
  ![Kanban 4](Documentación/Imagenes/kanban4.png)

- Tercer cambio
  ![Kanban 5](Documentación/Imagenes/kanban5.png)
  ![Kanban 51](Documentación/Imagenes/kanban5_1.png)

- Ultimo cambio
  ![Kanban6](Documentación/Imagenes/kanban6.png)
  ![Kanban61](Documentación/Imagenes/kanban61.png)

#### Tercer Sprint

**Durante el Sprint**
![alt text](Documentación/Imagenes/kanbanf2_1.1.png)
![alt text](Documentación/Imagenes/kanbanf2_1.2.png)
![alt text](Documentación/Imagenes/kanbaninicial2_3.png)

**Durante el Sprint**
- Primer cambio  
  ![Kanban 1](Documentación/Imagenes/kanban_fase2/img5.jpg)
  ![Kanban 1.1](Documentación/Imagenes/kanban_fase2/img9.jpg)

- Segundo cambio  
  ![Kanban 2](Documentación/Imagenes/kanban_fase2/img10.jpg)
  ![Kanban 2.1](Documentación/Imagenes/kanban_fase2/img13.jpg)

- Tercer cambio
  ![Kanban 3](Documentación/Imagenes/kanban_fase2/img16.jpg)
  ![Kanban 3.1](Documentación/Imagenes/kanban_fase2/img17.jpg)
  ![Kanban 3.2](Documentación/Imagenes/kanban_fase2/img20.jpg)
  ![Kanban 3.3](Documentación/Imagenes/kanban_fase2/img23.jpg)
  ![Kanban 3.4](Documentación/Imagenes/kanban_fase2/img24.jpg)

**Final del Sprint** 
  ![Kanban 4](Documentación/Imagenes/kanban_fase2/img27.jpg)
  ![Kanban 4.1](Documentación/Imagenes/kanban_fase2/img28.jpg)
  ![Kanban 4.2](Documentación/Imagenes/kanban_fase2/img31.jpg)
  ![Kanban 4.3](Documentación/Imagenes/kanban_fase2/img32.jpg)
  ![Kanban 4.4](Documentación/Imagenes/kanban_fase2/img35.jpg)
  ![Kanban 4.5](Documentación/Imagenes/kanban_fase2/img36.jpg)

---

## 11. Grabaciones del Sprint

### 🎥 Link a las Grabaciones

#### Primer Sprint

- **Sprint Planning:** [Ver video](https://drive.google.com/drive/folders/1MxFjZui32G51F-oeXP3gGUhKWwSwVsyp)
- **Daily Scrum 1:** [Ver carpeta](https://drive.google.com/drive/folders/1z5ZXUQTpSfpoICPBvUqIyra6HgGYVJNe)
- **Daily Scrum 2:** [Ver carpeta]()
- **Daily Scrum 3:** [Ver carpeta]()
- **Sprint Retrospective:** [Ver video]()

---

## 12. Evaluación del Scrum Master
**1 (muy deficiente)** a **100 (excelente)**.

| Criterio                              | Calificación (1 - 100) |
|---------------------------------------|-------------------------|
| Cumplimiento de objetivos del sprint  |            70             |
| Trabajo establecido en el menor tiempo|            75            |
| Comunicación                          |            70             |
| Trabajo en equipo                     |            75             |
| Código entendible                     |            90             |
| Organización                          |            100             |
| Reuniones                             |            100             |                                                              
---
