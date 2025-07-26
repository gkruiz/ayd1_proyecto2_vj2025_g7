ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE;

CREATE USER
    C##faseuno
IDENTIFIED BY
    contra
DEFAULT TABLESPACE
    USERS
QUOTA UNLIMITED ON
    USERS;
GRANT CONNECT, RESOURCE TO C##faseuno;


CREATE SEQUENCE usuario_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE puesto_trabajo_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE empresa_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE administradores_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE aplicaciones_id_seq START WITH 1 INCREMENT BY 1;


CREATE OR REPLACE TRIGGER validar_contrasena_usuario
BEFORE INSERT OR UPDATE ON USUARIO
FOR EACH ROW
BEGIN
    IF LENGTH(:NEW.contrasena) < 8 OR
    REGEXP_LIKE(:NEW.contrasena, '[a-z]') = FALSE OR
    REGEXP_LIKE(:NEW.contrasena, '[A-Z]') = FALSE OR
    REGEXP_LIKE(:NEW.contrasena, '[0-9]') = FALSE THEN
        RAISE_APPLICATION_ERROR(-20001, 'La contraseña debe tener al menos 8 caracteres, incluir una letra minúscula, una mayúscula y un número.');
    END IF;
END;

CREATE OR REPLACE TRIGGER validar_contrasena_empresa
BEFORE INSERT OR UPDATE ON EMPRESA
FOR EACH ROW
BEGIN
    IF LENGTH(:NEW.contrasena) < 8 OR
    REGEXP_LIKE(:NEW.contrasena, '[a-z]') = FALSE OR
    REGEXP_LIKE(:NEW.contrasena, '[A-Z]') = FALSE OR
    REGEXP_LIKE(:NEW.contrasena, '[0-9]') = FALSE THEN
        RAISE_APPLICATION_ERROR(-20002, 'La contraseña debe tener al menos 8 caracteres, incluir una letra minúscula, una mayúscula y un número.');
    END IF;
END;
/

CREATE TABLE USUARIO (
    id INTEGER DEFAULT usuario_id_seq.NEXTVAL PRIMARY KEY,
    nombre VARCHAR(100) CONSTRAINT usuario_nombre_nn NOT NULL,
    apellidos VARCHAR(100) CONSTRAINT usuario_apellidos_nn NOT NULL,
    genero VARCHAR(20) CONSTRAINT usuario_genero_ck CHECK (genero IN ('M','F')),
    activo VARCHAR(10) CONSTRAINT usuario_activo_ck CHECK (activo IN ('activo','inactivo')),
    cui VARCHAR(20) CONSTRAINT usuario_cui_uk UNIQUE NOT NULL,
    direccion VARCHAR(255) CONSTRAINT usuario_direccion_nn NOT NULL,
    telefono VARCHAR(50) CONSTRAINT usuario_telefono_nn NOT NULL,
    fecha_nacimiento DATE CONSTRAINT usuario_fecha_nacimiento_nn NOT NULL,
    correo VARCHAR(150) CONSTRAINT usuario_correo_uk UNIQUE NOT NULL,
    contrasena VARCHAR(100) CONSTRAINT usuario_contrasena_nn NOT NULL,
    fecha_creacion TIMESTAMP CONSTRAINT usuario_fecha_creacion_nn NOT NULL,
    fecha_actualizado TIMESTAMP CONSTRAINT usuario_fecha_actualizado_nn NOT NULL
);

CREATE TABLE EMPRESA (
    id INTEGER DEFAULT empresa_id_seq.NEXTVAL PRIMARY KEY,
    nombre_empresa VARCHAR(150) CONSTRAINT empresa_nombre_nn NOT NULL,
    nit VARCHAR(20) CONSTRAINT empresa_nit_uk UNIQUE NOT NULL,
    direccion VARCHAR(255) CONSTRAINT empresa_direccion_nn NOT NULL,
    telefono VARCHAR(50) CONSTRAINT empresa_telefono_nn NOT NULL,
    giro_negocio VARCHAR(100) CONSTRAINT empresa_giro_nn NOT NULL,
    correo VARCHAR(150) CONSTRAINT empresa_correo_uk UNIQUE NOT NULL,
    contrasena VARCHAR(100) CONSTRAINT empresa_contrasena_nn NOT NULL,
    aprobado VARCHAR2(2) CONSTRAINT  empresa_aprobado_ck CHECK (aprobado IN ('1','0')),
    fecha_creacion TIMESTAMP CONSTRAINT empresa_fecha_creacion_nn NOT NULL,
    fecha_actualizado TIMESTAMP CONSTRAINT empresa_fecha_actualizado_nn NOT NULL
);

ALTER TABLE EMPRESA ADD activo VARCHAR(10) CONSTRAINT empresa_activo_ck CHECK (activo IN ('activo','inactivo'));


CREATE TABLE PUESTO_TRABAJO (
    id INTEGER DEFAULT puesto_trabajo_id_seq.NEXTVAL PRIMARY KEY,
    nombre_puesto VARCHAR(150) CONSTRAINT puesto_nombre_nn NOT NULL,
    ubicacion_fisica VARCHAR(255) CONSTRAINT puesto_ubicacion_nn NOT NULL,
    id_empresa INTEGER CONSTRAINT puesto_empresa_nn NOT NULL,
    sueldo_mensual NUMBER(10, 2) CONSTRAINT puesto_sueldo_nn NOT NULL,
    tipo_contrato VARCHAR(20) CONSTRAINT puesto_tipo_contrato_nn NOT NULL,
    jornada_laboral VARCHAR(20) CONSTRAINT puesto_jornada_nn NOT NULL ,
    modalidad_trabajo VARCHAR(20) CONSTRAINT puesto_modalidad_nn NOT NULL,
    descripcion VARCHAR2(500) CONSTRAINT puesto_descripcion_nn NOT NULL,
    educacion_minima VARCHAR(100),
    anios_experiencia INTEGER,
    idiomas VARCHAR2(500),
    rango_edad VARCHAR(20),
    CONSTRAINT fk_puesto_empresa FOREIGN KEY (id_empresa) REFERENCES EMPRESA(id),
    fecha_creacion TIMESTAMP CONSTRAINT puesto_fecha_creacion_nn NOT NULL,
    fecha_actualizado TIMESTAMP CONSTRAINT puesto_fecha_actualizado_nn NOT NULL
);

ALTER TABLE PUESTO_TRABAJO ADD activo VARCHAR(10) CONSTRAINT puesto_activo_ck CHECK (activo IN ('activo','inactivo'));
ALTER TABLE PUESTO_TRABAJO ADD area VARCHAR2(200) CONSTRAINT puesto_area_nn NOT NULL;


CREATE TABLE APLICACIONES (
    id INTEGER DEFAULT aplicaciones_id_seq.NEXTVAL PRIMARY KEY,
    id_usuario INTEGER CONSTRAINT aplicaciones_usuario_nn NOT NULL,
    id_puesto INTEGER CONSTRAINT aplicaciones_puesto_nn NOT NULL,
    fecha_aplicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    estado_proceso VARCHAR(30) DEFAULT 'postulado' NOT NULL,
    cvitae VARCHAR(200) CONSTRAINT aplicaciones_cvitae_nn NOT NULL,
    CONSTRAINT aplicaciones_estado_ck CHECK (estado_proceso IN ('postulado', 'CV Visto', 'Finalista', 'Proceso Finalizado')),
    CONSTRAINT fk_aplicaciones_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id),
    CONSTRAINT fk_aplicaciones_puesto FOREIGN KEY (id_puesto) REFERENCES PUESTO_TRABAJO(id),
    fecha_creacion TIMESTAMP CONSTRAINT aplicaciones_fecha_creacion_nn NOT NULL,
    fecha_actualizado TIMESTAMP CONSTRAINT aplicaciones_fecha_actualizado_nn NOT NULL
);

CREATE TABLE ADMINISTRADORES (
    id INTEGER DEFAULT administradores_id_seq.NEXTVAL PRIMARY KEY,
    nombre VARCHAR2(100) NOT NULL,
    correo VARCHAR2(100) UNIQUE NOT NULL,
    contrasena VARCHAR2(255) NOT NULL,
    contrasena_autenticada VARCHAR2(255),
    fecha_creacion TIMESTAMP CONSTRAINT administradores_fecha_creacion_nn NOT NULL,
    fecha_actualizado TIMESTAMP CONSTRAINT administradores_fecha_actualizado_nn NOT NULL
);
