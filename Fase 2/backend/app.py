from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from configuracion import get_oracle_connection
from flask_mail import Mail, Message # Deben instalar flask-mail con el comando pip install Flask-Mail
import os
import bcrypt  # Deben instalar bcrypt con el comando pip install bcrypt 
import flask_login
from flask import session


app = Flask(__name__)
app.secret_key = "tu_clave_secreta" 
login_manager = flask_login.LoginManager()
login_manager.init_app(app)
mail = Mail(app)

'''
Si van a hacer pruebas con el envío de correos, deben crear una contraseña de aplicación.
Para Gmail, deben activar la verificación en dos pasos y luego generar una contraseña de aplicación.
https://myaccount.google.com/apppasswords

Recuerden no hacer commmit con la información tanto de su correo como de su contraseña de aplicación.

'''
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
'''
Para enviar correos con las variables de entorno, deben crear un archivo .env en la raíz del proyecto
instalar el paquete python-dotenv con el comando pip install python-dotenv
En el archivo .env deben de escribir lo siguiente
MAIL_USERNAME=''  <- Aquí deben poner el correo electrónico desde el cual se enviarán los correos.
MAIL_PASSWORD=''  <- Aquí deben poner la contraseña de aplicación que generaron en Gmail.
'''
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False
from flask_cors import CORS
CORS(app, supports_credentials=True, origins="*")


class Usuario(flask_login.UserMixin):
    def __init__(self, id, email):
        self.id = id
        self.email = email
        self.tipo = 'usuario'
    @classmethod
    def get_info(cls, id):
        conexion = get_oracle_connection()
        cursor = conexion.cursor()
        cursor.execute(
            "SELECT ID, CORREO FROM USUARIO WHERE ID = :id", {"id": id}
        )
        usuario = cursor.fetchone()
        cursor.close()
        conexion.close()
        if usuario:
            return cls(usuario[0], usuario[1])
        else:
            return None
        

class Admin(flask_login.UserMixin):
    def __init__(self, id, email):
        self.id = id
        self.email = email
        self.tipo = 'admin'
    @classmethod
    def get_info(cls, id):
        conexion = get_oracle_connection()
        cursor = conexion.cursor()
        cursor.execute(
            "SELECT ID, CORREO FROM ADMINISTRADORES WHERE ID = :id", {"id": id}
        )
        usuario = cursor.fetchone()
        cursor.close()
        conexion.close()
        if usuario:
            return cls(usuario[0], usuario[1])
        else:
            return None
        
class Empresa(flask_login.UserMixin):
    def __init__(self, id, email):
        self.id = id
        self.email = email
        self.tipo = 'empresa'
    @classmethod
    def get_info(cls, id):
        conexion = get_oracle_connection()
        cursor = conexion.cursor()
        cursor.execute(
            "SELECT ID, CORREO FROM EMPRESA WHERE ID = :id", {"id": id}
        )
        usuario = cursor.fetchone()
        cursor.close()
        conexion.close()
        if usuario:
            return cls(usuario[0], usuario[1])
        else:
            return None

@login_manager.user_loader
def load_user(user_id):
    tipo = session.get('tipo')
    if tipo == 'usuario':
        return Usuario.get_info(user_id)
    elif tipo == 'admin':
        return Admin.get_info(user_id)
    elif tipo == 'empresa':
        return Empresa.get_info(user_id)
    
    return None

@app.route('/api/perfil', methods=['GET'])
@flask_login.login_required
def perfil():
    return jsonify({
        "id": flask_login.current_user.id,
        "email": flask_login.current_user.email,
        "tipo": flask_login.current_user.tipo
    })

@app.route('/')
def index():
    return "Bienvenido al sistema"

@app.route("/prueba", methods=['GET'])
def prueba():
    try:
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT 'hola' FROM dual")
        resultado = cursor.fetchone()
        cursor.close()
        connection.close()
        return jsonify({"mensaje": resultado[0]})
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)}), 500

# Creación de usuarios
@app.route('/api/users', methods=['POST'])
def ingresar_usuario():
    try:
        info = request.get_json()
        nombre = info['nombre']
        apellidos = info['apellidos']
        genero = info['genero']  
        cui = info['cui']
        direccion = info['direccion']
        telefono = info['telefono']
        fecha_nacimiento = info['fecha_nacimiento']
        correo = info['correo']
        contrasena = info['contrasena']
        dpi = info['dpi']
        foto = info['foto']

        hash_contra = bcrypt.hashpw(contrasena.encode("utf-8"), bcrypt.gensalt())

        ahora = datetime.now().strftime('%Y-%m-%d')

        connection = get_oracle_connection()
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO USUARIO (
                nombre, apellidos, genero, cui, direccion, telefono,
                fecha_nacimiento, correo, contrasena, fecha_creacion, fecha_actualizado, activo, dpi, foto
            ) VALUES (
                :nombre, :apellidos, :genero, :cui, :direccion, :telefono,
                TO_DATE(:fecha_nacimiento, 'YYYY-MM-DD'), :correo, :contrasena, TO_DATE(:fecha_creacion, 'YYYY-MM-DD'), TO_DATE(:fecha_actualizado, 'YYYY-MM-DD'), 'activo', :dpi, :foto
            )
        """, {
            "nombre": nombre,
            "apellidos": apellidos,
            "genero": genero,
            "cui": cui,
            "direccion": direccion,
            "telefono": telefono,
            "fecha_nacimiento": fecha_nacimiento,
            "correo": correo,
            "contrasena": hash_contra.decode("utf-8"),
            "fecha_creacion": ahora,
            "fecha_actualizado": ahora,
            "dpi" : dpi,
            "foto" : foto
        })
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({
            "status": "success",
            "message": "Usuario creado exitosamente"
        }), 201
    except Exception as e:
        print("ERROR EN /api/user/insert:", e)
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


#Creación de empresas
@app.route('/api/company', methods=['POST'])
def ingresar_empresa():
    try:
        info = request.get_json()
        nombre_empresa = info['nombre_empresa']
        nit = info['nit']
        direccion = info['direccion']
        telefono = info['telefono']
        giro_negocio = info['giro_negocio']
        correo = info['correo']
        contrasena = info['contrasena']
        foto = info['foto']
        hash_contra = bcrypt.hashpw(contrasena.encode("utf-8"), bcrypt.gensalt())
        ahora = datetime.now().strftime('%Y-%m-%d')

        connection = get_oracle_connection()
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO EMPRESA (
                nombre_empresa, nit, direccion, telefono, giro_negocio, 
                correo, contrasena, aprobado, fecha_creacion, fecha_actualizado, activo, foto
            ) VALUES (
                :nombre_empresa, :nit, :direccion, :telefono, :giro_negocio, 
                :correo, :contrasena, '0', TO_DATE(:fecha_creacion, 'YYYY-MM-DD'), TO_DATE(:fecha_actualizado, 'YYYY-MM-DD'), 'activo', :foto
            )
        """, {
            "nombre_empresa": nombre_empresa,
            "nit": nit,
            "direccion": direccion,
            "telefono": telefono,
            "giro_negocio": giro_negocio,
            "correo": correo,
            "contrasena": hash_contra.decode("utf-8"),
            "fecha_creacion": ahora,
            "fecha_actualizado": ahora,
            "foto": foto
        })
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({
            "status": "success",
            "message": "Empresa creada exitosamente"
        }), 201
    except Exception as e:
        print("ERROR EN /api/company:", e)
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

'''
@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    try:
        info = request.get_json()
        email = info['email']
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM USUARIO WHERE correo = :email", {"email": email})
        user = cursor.fetchone()
        if not user:
            return jsonify({"status": "error", "message": "Email not found"}), 404
        msg = Message(
            'Hello ' + user[1],
            recipients=[user[2]],
            sender=os.getenv('MAIL_USERNAME'),
            body='Your password is: ' + user[3]
        )
        mail.send(msg)
        cursor.close()
        connection.close()
        return jsonify({"status": "success", "message": "Your password has been sent to your mail"}), 200
    except Exception as e:
        print("ERROR EN /api/forgot-password:", e)
        return jsonify({"status": "error", "message": str(e)}), 500
'''

# Login
@app.route('/api/login', methods=['POST'])
def login():
    try:
        info = request.get_json()
        email = info.get("email")
        password = info.get("password")

        if not email or not password:
            return jsonify({"status": "error", "message": "Faltan campos"}), 400

        connection = get_oracle_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT ID, CORREO, CONTRASENA, ACTIVO FROM USUARIO WHERE CORREO = :email", {"email": email})
        user = cursor.fetchone()
        if user and user[3] != 'inactivo' and bcrypt.checkpw(password.encode(), user[2].encode()):
            flask_login.login_user(Usuario(user[0], user[1]))
            session['tipo'] = 'usuario'
            return jsonify({"status": "success", "tipo": "usuario", "id": str(user[0])}), 200

        cursor.execute("SELECT ID, CORREO, CONTRASENA FROM ADMINISTRADORES WHERE CORREO = :email", {"email": email})
        admin = cursor.fetchone()
        if admin and bcrypt.checkpw(password.encode(), admin[2].encode()):
            flask_login.login_user(Admin(admin[0], admin[1]))
            session['tipo'] = 'admin'
            return jsonify({"status": "success", "tipo": "admin", "id": str(admin[0])}), 200

        cursor.execute("SELECT ID, CORREO, CONTRASENA, APROBADO, ACTIVO FROM EMPRESA WHERE CORREO = :email", {"email": email})
        empresa = cursor.fetchone()
        if empresa:
            if empresa[3] != '1' or empresa[4] == 'inactivo':
                return jsonify({"status": "error", "message": "Cuenta no aprobada o inactiva"}), 403
            if bcrypt.checkpw(password.encode(), empresa[2].encode()):
                flask_login.login_user(Empresa(empresa[0], empresa[1]))
                session['tipo'] = 'empresa'
                return jsonify({"status": "success", "tipo": "empresa", "id": str(empresa[0])}), 200

        return jsonify({"status": "error", "message": "Credenciales inválidas"}), 401

    except Exception as e:
        return jsonify({"status": "error", "message":str(e)}), 500

    finally:
        try:
            cursor.close()
            connection.close()
        except:
            pass


@app.route('/logout', methods=['POST'])
def logout():
    flask_login.logout_user()
    session.pop('tipo', None) 
    return jsonify({"success": True, "message": "Sesión cerrada."})

# Verificación 2FA para administradores
@app.route('/api/admin/verify-authfile', methods=['POST'])
@flask_login.login_required
def verificar_archivo_admin():
    if flask_login.current_user.tipo != 'admin':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado"
        }), 403

    archivo = request.files.get('archivo')
    if not archivo or archivo.filename != 'auth.ayd1':
        return jsonify({
            "status": "error",
            "message": "Archivo inválido o faltante"
        }), 400

    try:
        contenido_archivo = archivo.read().decode('utf-8').strip()

        # Obtener la contraseña encriptada desde la base de datos
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT contrasena_autenticada FROM ADMINISTRADORES WHERE ID = :id
        """, {"id": flask_login.current_user.id})

        resultado = cursor.fetchone()
        cursor.close()
        connection.close()

        if not resultado or not resultado[0]:
            return jsonify({
                "status": "error",
                "message": "Administrador no tiene contraseña de segundo paso registrada"
            }), 404

        hash_en_bd = resultado[0]

        if bcrypt.checkpw(contenido_archivo.encode(), hash_en_bd.encode()):
            session['admin_2fa'] = True
            return jsonify({
                "status": "success",
                "message": "Autenticación de segundo paso completada"
            }), 200
        else:
            return jsonify({
                "status": "error",
                "message": "Contraseña del archivo incorrecta"
            }), 401

    except Exception as e:
        print("ERROR en /api/admin/verify-authfile:", str(e))
        return jsonify({
            "status": "error",
            "message": "Error al procesar el archivo"
        }), 500


# Mostrar empresas en espera de ser aprobadas
@app.route('/api/company/pending', methods=['GET'])
@flask_login.login_required
def mostrar_empresas_pendientes():
    if flask_login.current_user.tipo == "admin":
        try:
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute("""
                SELECT * FROM EMPRESA WHERE APROBADO = '0'
            """)
            rows = cursor.fetchall()
            empresas = []
            for row in rows:
                empresa = {
                    "id": row[0],
                    "nombre_empresa": row[1],
                    "nit": row[2],
                    "direccion": row[3],
                    "telefono": row[4],
                    "giro_negocio": row[5],
                    "correo": row[6],
                    "aprobado": row[8],
                    "foto": row[12]
                }
                empresas.append(empresa)
            cursor.close()
            connection.close()
            return jsonify(empresas), 200
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los administradores pueden ver las empresas pendientes."
        }), 403

#Mostrar empresas aprobadas
@app.route('/api/company/approved', methods=['GET'])
@flask_login.login_required
def mostrar_empresas_aprobadas():
    if flask_login.current_user.tipo == 'admin':
        try:
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute("""
                SELECT * FROM EMPRESA WHERE APROBADO = '1'
            """)
            rows = cursor.fetchall()
            empresas = []
            for row in rows:
                empresa = {
                    "id": row[0],
                    "nombre_empresa": row[1],
                    "nit": row[2],
                    "direccion": row[3],
                    "telefono": row[4],
                    "giro_negocio": row[5],
                    "correo": row[6],
                    "aprobado": row[8],
                    "activo": row[11]
                }
                empresas.append(empresa)
            cursor.close()
            connection.close()
            return jsonify(empresas), 200
        except Exception as e:
            print("ERROR EN /api/company/approved:", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los administradores pueden ver las empresas aprobadas."
        }), 403

# Aprobar empresa
@app.route('/api/company/approve', methods=['PUT'])
@flask_login.login_required
def aprobar_empresa():
    if flask_login.current_user.tipo == 'admin':
        try:
            info = request.get_json()
            id = info["id"]
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute(
                "UPDATE EMPRESA SET APROBADO = '1' WHERE ID = :id",
                {"id": id}
            )
            connection.commit()
            cursor.close()
            connection.close()
            return jsonify({
                "status": "success",
                "message": "Empresa aprobada exitosamente"
            }), 200
        except Exception as e:
            print("ERROR EN /api/company/approve:", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los administradores pueden aprobar empresas."
        }), 403

# Visualizar usuarios
@app.route('/api/admin/user', methods=['GET'])
@flask_login.login_required
def ver_usuarios():
    if flask_login.current_user.tipo == 'admin':
        try:
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute("SELECT id, nombre, apellidos, genero, fecha_nacimiento, cui, direccion, telefono, correo, activo FROM USUARIO")
            usuarios_rows = cursor.fetchall()
            usuarios = []
            for row in usuarios_rows:
                usuario = {
                    "id": row[0],
                    "nombre": row[1],
                    "apellidos": row[2],
                    "genero": row[3],
                    "fecha_nacimiento": row[4],
                    "cui": row[5],
                    "direccion": row[6],
                    "telefono": row[7],
                    "correo": row[8],
                    "activo": row[9],
                }
                usuarios.append(usuario)
            cursor.close()
            connection.close()
            return jsonify(usuarios), 200
        except Exception as e:
            print("ERROR EN /api/admin/user:", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los administradores pueden ver los usuarios del sistema."
        }), 403

# Dar de baja a un usuario
@app.route('/api/admin/user/desactivate', methods=['PUT'])
@flask_login.login_required
def dar_baja_usuario():
    if flask_login.current_user.tipo == 'admin':
        try:
            info = request.get_json()
            id = info["id"]
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute(
                "UPDATE USUARIO SET ACTIVO = 'inactivo' WHERE ID = :id",
                {"id": id}
            )
            connection.commit()
            cursor.close()
            connection.close()
            return jsonify({
                "status": "success",
                "message": "Usuario dado de baja exitosamente"
            }), 200
        except Exception as e:
            print("ERROR EN /api/admin/deactivate_user:", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los administradores pueden dar de baja a usuarios."
        }), 403

# Dar de baja a una empresa
@app.route('/api/admin/company/desactivate', methods=['PUT'])
@flask_login.login_required
def dar_baja_empresa():
    if flask_login.current_user.tipo == 'admin':
        try:
            info = request.get_json()
            id = info["id"]
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute(
                "UPDATE EMPRESA SET ACTIVO = 'inactivo' WHERE ID = :id",
                {"id": id}
            )
            connection.commit()
            cursor.close()
            connection.close()
            return jsonify({
                "status": "success",
                "message": "Empresa dado de baja exitosamente"
            }), 200
        except Exception as e:
            print("ERROR EN /api/admin/deactivate_user:", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los administradores pueden dar de baja a usuarios."
        }), 403

# Visualizar trabajos activos.
@app.route('/api/user/job/active', methods=['GET'])
@flask_login.login_required
def ver_trabajos_disponibles():
    if flask_login.current_user.tipo == 'usuario':
        try:
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT
                    p.nombre_puesto,
                    e.nombre_empresa,
                    p.ubicacion_fisica,
                    p.sueldo_mensual,
                    p.area,
                    p.id,
                    p.modalidad_trabajo,
                    p.jornada_laboral,
                    p.fecha_creacion
                FROM
                    PUESTO_TRABAJO p
                JOIN
                    EMPRESA e ON p.id_empresa = e.id
                WHERE
                    p.activo = 'activo'
                """
            )
            rows = cursor.fetchall()
            jobs = []
            for row in rows:
                job = {
                    "nombre_puesto": row[0],
                    "nombre_empresa": row[1],
                    "ubicacion_fisica": row[2],
                    "sueldo":row[3],
                    "area":row[4],
                    "id":row[5],
                    "modalidad_trabajo":row[6],
                    "jornada_laboral":row[7],
                    "fecha_creacion":row[8]
                }
                jobs.append(job)
            cursor.close()
            connection.close()
            return jsonify(jobs), 200
        except Exception as e:
            print("ERROR EN /api/user/job/active", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden ver ofertas de trabajo."
        }), 403

# Visualizar trabajos por área
@app.route('/api/user/job/area', methods=['POST'])
@flask_login.login_required
def ver_empleos_area():
    if flask_login.current_user.tipo == 'usuario':
        try:
            info = request.get_json()
            area = info["area"]
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT 
                    p.nombre_puesto,
                    e.nombre_empresa,
                    p.ubicacion_fisica,
                    p.sueldo_mensual,
                    p.id,
                    p.modalidad_trabajo,
                    p.jornada_laboral,
                    p.fecha_creacion,
                    p.area
                FROM 
                    PUESTO_TRABAJO p
                JOIN 
                    EMPRESA e ON p.id_empresa = e.id
                WHERE 
                    p.activo = 'activo'
                    AND p.area = :area
                """,{"area":area}
            )
            rows = cursor.fetchall()
            jobs = []
            for row in rows:
                job = {
                    "nombre_puesto": row[0],
                    "nombre_empresa": row[1],
                    "ubicacion_fisica": row[2],
                    "sueldo": row[3],
                    "id": row[4],
                    "modalidad_trabajo": row[5],
                    "jornada_laboral": row[6],
                    "fecha_creacion": row[7],
                    "area": row[8]
                }
                jobs.append(job)
            cursor.close()
            connection.close()
            return jsonify(jobs), 200
        except Exception as e:
            print("ERROR EN /api/user/job/area", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden ver ofertas de trabajo."
        }), 403
    

@app.route('/api/user/job/location', methods=['POST'])
@flask_login.login_required
def ver_empleos_localizacion():
    if flask_login.current_user.tipo == 'usuario':
        try:
            info = request.get_json()
            ubicacion_fisica = info["ubicacion_fisica"]
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT 
                    p.nombre_puesto,
                    e.nombre_empresa,
                    p.ubicacion_fisica,
                    p.sueldo_mensual,
                    p.id,
                    p.modalidad_trabajo,
                    p.jornada_laboral,
                    p.fecha_creacion,
                    p.area
                FROM 
                    PUESTO_TRABAJO p
                JOIN 
                    EMPRESA e ON p.id_empresa = e.id
                WHERE 
                    p.activo = 'activo'
                    AND p.ubicacion_fisica = :ubicacion_fisica
                """,{"ubicacion_fisica":ubicacion_fisica}
            )
            rows = cursor.fetchall()
            jobs = []
            for row in rows:
                job = {
                    "nombre_puesto": row[0],
                    "nombre_empresa": row[1],
                    "ubicacion_fisica": row[2],
                    "sueldo": row[3],
                    "id": row[4],
                    "modalidad_trabajo": row[5],
                    "jornada_laboral": row[6],
                    "fecha_creacion": row[7],
                    "area": row[8]
                }
                jobs.append(job)
            cursor.close()
            connection.close()
            return jsonify(jobs), 200
        except Exception as e:
            print("ERROR EN /api/user/job/ubicacion_fisica", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden ver ofertas de trabajo."
        }), 403

# Buscar trabajos por fecha de creación
@app.route('/api/user/job/date', methods=['POST'])
@flask_login.login_required
def buscar_empleos_por_fecha():
    if flask_login.current_user.tipo == 'usuario':
        try:
            info = request.get_json()
            fecha_creacion = info.get("fecha_creacion")
            if not fecha_creacion:
                return jsonify({"status": "error", "message": "El campo 'fecha_creacion' es obligatorio"}), 400

            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT 
                    p.nombre_puesto,
                    e.nombre_empresa,
                    p.ubicacion_fisica,
                    p.sueldo_mensual,
                    p.id,
                    p.modalidad_trabajo,
                    p.jornada_laboral,
                    p.fecha_creacion,
                    p.area
                FROM 
                    PUESTO_TRABAJO p
                JOIN 
                    EMPRESA e ON p.id_empresa = e.id
                WHERE 
                    p.activo = 'activo'
                    AND TO_CHAR(p.fecha_creacion, 'YYYY-MM-DD') = :fecha_creacion
                """, {"fecha_creacion": fecha_creacion}
            )
            rows = cursor.fetchall()
            jobs = []
            for row in rows:
                job = {
                    "nombre_puesto": row[0],
                    "nombre_empresa": row[1],
                    "ubicacion_fisica": row[2],
                    "sueldo": row[3],
                    "id": row[4],
                    "modalidad_trabajo": row[5],
                    "jornada_laboral": row[6],
                    "fecha_creacion": row[7],
                    "area": row[8]
                }
                jobs.append(job)
            cursor.close()
            connection.close()
            return jsonify(jobs), 200
        except Exception as e:
            print("ERROR EN /api/user/job/date", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden ver ofertas de trabajo."
        }), 403

# Buscar trabajos por jornada laboral
@app.route('/api/user/job/jornada', methods=['POST'])
@flask_login.login_required
def buscar_empleos_por_jornada():
    if flask_login.current_user.tipo == 'usuario':
        try:
            info = request.get_json()
            jornada_laboral = info.get("jornada_laboral")
            if not jornada_laboral:
                return jsonify({"status": "error", "message": "El campo 'jornada_laboral' es obligatorio"}), 400

            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT 
                    p.nombre_puesto,
                    e.nombre_empresa,
                    p.ubicacion_fisica,
                    p.sueldo_mensual,
                    p.id,
                    p.modalidad_trabajo,
                    p.jornada_laboral,
                    p.fecha_creacion,
                    p.area
                FROM 
                    PUESTO_TRABAJO p
                JOIN 
                    EMPRESA e ON p.id_empresa = e.id
                WHERE 
                    p.activo = 'activo'
                    AND p.jornada_laboral = :jornada_laboral
                """, {"jornada_laboral": jornada_laboral}
            )
            rows = cursor.fetchall()
            jobs = []
            for row in rows:
                job = {
                    "nombre_puesto": row[0],
                    "nombre_empresa": row[1],
                    "ubicacion_fisica": row[2],
                    "sueldo": row[3],
                    "id": row[4],
                    "modalidad_trabajo": row[5],
                    "jornada_laboral": row[6],
                    "fecha_creacion": row[7],
                    "area": row[8]
                }
                jobs.append(job)
            cursor.close()
            connection.close()
            return jsonify(jobs), 200
        except Exception as e:
            print("ERROR EN /api/user/job/jornada", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden ver ofertas de trabajo."
        }), 403

# Buscar trabajos por modalidad de trabajo
@app.route('/api/user/job/modalidad', methods=['POST'])
@flask_login.login_required
def buscar_empleos_por_modalidad():
    if flask_login.current_user.tipo == 'usuario':
        try:
            info = request.get_json()
            modalidad_trabajo = info.get("modalidad_trabajo")
            if not modalidad_trabajo:
                return jsonify({"status": "error", "message": "El campo 'modalidad_trabajo' es obligatorio"}), 400

            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT 
                    p.nombre_puesto,
                    e.nombre_empresa,
                    p.ubicacion_fisica,
                    p.sueldo_mensual,
                    p.id,
                    p.modalidad_trabajo,
                    p.jornada_laboral,
                    p.fecha_creacion,
                    p.area
                FROM 
                    PUESTO_TRABAJO p
                JOIN 
                    EMPRESA e ON p.id_empresa = e.id
                WHERE 
                    p.activo = 'activo'
                    AND p.modalidad_trabajo = :modalidad_trabajo
                """, {"modalidad_trabajo": modalidad_trabajo}
            )
            rows = cursor.fetchall()
            jobs = []
            for row in rows:
                job = {
                    "nombre_puesto": row[0],
                    "nombre_empresa": row[1],
                    "ubicacion_fisica": row[2],
                    "sueldo": row[3],
                    "id": row[4],
                    "modalidad_trabajo": row[5],
                    "jornada_laboral": row[6],
                    "fecha_creacion": row[7],
                    "area": row[8]
                }
                jobs.append(job)
            cursor.close()
            connection.close()
            return jsonify(jobs), 200
        except Exception as e:
            print("ERROR EN /api/user/job/modalidad", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden ver ofertas de trabajo."
        }), 403

# Aplicar un empleo
# Primero buscaremos la plaza a la que queremos aplicar
@app.route('/api/user/job/application', methods=['POST'])
@flask_login.login_required
def ver_empleo_id():
    if flask_login.current_user.tipo == 'usuario':
        try:
            info = request.get_json()
            id = info["id"]
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT 
                    p.id,
                    p.nombre_puesto,
                    e.nombre_empresa,
                    p.ubicacion_fisica,
                    p.sueldo_mensual,
                    p.tipo_contrato,
                    p.jornada_laboral,
                    p.modalidad_trabajo,
                    p.descripcion,
                    p.educacion_minima,
                    p.anios_experiencia,
                    p.idiomas,
                    p.rango_edad,
                    p.activo,
                    p.area
                FROM 
                    PUESTO_TRABAJO p
                JOIN 
                    EMPRESA e ON p.id_empresa = e.id
                WHERE 
                    p.ID = :id
                """, {"id": id}
            )
            row = cursor.fetchone()
            cursor.close()
            connection.close()
            if row is None:
                return jsonify({
                    "status": "error",
                    "message": f"No se encontró oferta con id {id}"
                }), 404
            job = {
                "id": row[0],
                "nombre_puesto": row[1],
                "nombre_empresa": row[2],
                "ubicacion_fisica": row[3],
                "sueldo_mensual": row[4],
                "tipo_contrato": row[5],
                "jornada_laboral": row[6],
                "modalidad_trabajo": row[7],
                "descripcion": row[8],
                "educacion_minima": row[9],
                "anios_experiencia": row[10],
                "idiomas": row[11],
                "rango_edad": row[12],
                "activo": row[13],
                "area": row[14]
            }
            return jsonify(job), 200

        except Exception as e:
            print("ERROR EN /api/user/job/application", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden ver ofertas de trabajo."
        }), 403

#Luego volvemos a ingresar al id para aplicar y subimos nuestro CV
@app.route('/api/user/job/request', methods=['POST'])
@flask_login.login_required
def aplicar_empleo():
    if flask_login.current_user.tipo == 'usuario':
        try:
            info = request.get_json()
            id = info["id"]
            cv = info["cv"]
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT ID FROM PUESTO_TRABAJO
                WHERE ID = :id
                """, {"id": id}
            )
            row = cursor.fetchone()
            if row is None:
                return jsonify({
                    "status": "error",
                    "message": f"No se encontró oferta con id {id}"
                }), 404
            ahora = datetime.now().strftime('%Y-%m-%d')
            cursor.execute("""
            INSERT INTO APLICACIONES (
                id_usuario, id_puesto, fecha_aplicacion, estado_proceso, cvitae, fecha_creacion, fecha_actualizado
            ) VALUES (
                :id_usuario, :id_puesto, TO_DATE(:fecha_aplicacion, 'YYYY-MM-DD'), 'postulado', :cvitae,
                TO_DATE(:fecha_creacion, 'YYYY-MM-DD'), TO_DATE(:fecha_actualizado, 'YYYY-MM-DD')
            )
        """,{
            "id_usuario": flask_login.current_user.id,
            "id_puesto": row[0],
            "fecha_aplicacion": ahora,
            "cvitae": cv,
            "fecha_creacion": ahora,
            "fecha_actualizado": ahora
        })
            connection.commit()
            cursor.close()
            connection.close()
            
            return jsonify({
            "status": "success",
            "message": "Su aplicacion al trabajo se ha realizado exitosamente."
        }), 201
        except Exception as e:
            print("ERROR EN /api/user/job/request", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden ver ofertas de trabajo."
        }), 403

@app.route('/api/user/job/status', methods=['GET'])
@flask_login.login_required
def ver_puestos_aplicados():
    if flask_login.current_user.tipo == 'usuario':
        try:
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT 
                a.id,
                p.nombre_puesto,
                a.fecha_aplicacion,
                a.estado_proceso
            FROM 
                APLICACIONES a
            JOIN 
                PUESTO_TRABAJO p ON a.id_puesto = p.id
            WHERE 
                a.id_usuario = :id_usuario
                """,{"id_usuario":flask_login.current_user.id}
            )
            rows = cursor.fetchall()
            applications = []
            for row in rows:
                application = {
                    "id_aplicacion": row[0],
                    "nombre_puesto": row[1],
                    "fecha_aplicacion": row[2],
                    "estado_proceso": row[3]
                }
                applications.append(application)
            cursor.close()
            connection.close()
            return jsonify(applications), 200
        except Exception as e:
            print("ERROR EN /api/user/job/status", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden ver sus puestos aplicados."
        }), 403
    
@app.route('/api/user/job/delete', methods=['DELETE'])
@flask_login.login_required
def eliminar_puesto():
    if flask_login.current_user.tipo == 'usuario':
        try:
            info = request.get_json()
            id = info["id"]
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                DELETE FROM APLICACIONES WHERE ID = :id
                """,{"id":id}
            )
            connection.commit()
            cursor.close()
            connection.close()
            return jsonify({
                "status": "success",
                "message": "Se ha eliminado su aplicación de trabajo"
            }), 200
        except Exception as e:
            print("ERROR EN /api/user/job/status", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden ver sus puestos aplicados."
        }), 403

# Reporte: Empresa con más solicitudes de empleo --> Empresa más demandada
@app.route('/api/admin/report/empresa-top-solicitudes', methods=['GET'])
@flask_login.login_required
def empresa_mas_solicitudes():
    if flask_login.current_user.tipo != 'admin':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado"
        }), 403

    try:
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT 
                e.id,
                e.nombre_empresa,
                COUNT(a.id) AS total_solicitudes
            FROM EMPRESA e
            JOIN PUESTO_TRABAJO p ON e.id = p.id_empresa
            JOIN APLICACIONES a ON p.id = a.id_puesto
            GROUP BY e.id, e.nombre_empresa
            ORDER BY total_solicitudes DESC
            FETCH FIRST 1 ROWS ONLY
        """)
        resultado = cursor.fetchone()
        cursor.close()
        connection.close()

        if not resultado:
            return jsonify({
                "status": "success",
                "message": "No hay solicitudes registradas",
                "empresa": None
            }), 200

        return jsonify({
            "status": "success",
            "empresa": {
                "id": resultado[0],
                "nombre_empresa": resultado[1],
                "total_solicitudes": resultado[2]
            }
        }), 200

    except Exception as e:
        print("ERROR en /api/admin/report/empresa-top-solicitudes:", e)
        return jsonify({
            "status": "error",
            "message": "No se pudo generar el reporte."
        }), 500

# Reporte: Empresa con más publicaciones de puestos
@app.route('/api/admin/report/empresa-top-publicaciones', methods=['GET'])
@flask_login.login_required
def empresa_mas_publicaciones():
    if flask_login.current_user.tipo != 'admin':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado"
        }), 403

    try:
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT 
                e.id,
                e.nombre_empresa,
                COUNT(p.id) AS total_puestos
            FROM EMPRESA e
            JOIN PUESTO_TRABAJO p ON e.id = p.id_empresa
            GROUP BY e.id, e.nombre_empresa
            ORDER BY total_puestos DESC
            FETCH FIRST 1 ROWS ONLY
        """)
        resultado = cursor.fetchone()
        cursor.close()
        connection.close()

        if not resultado:
            return jsonify({
                "status": "success",
                "message": "No hay publicaciones de puestos registradas",
                "empresa": None
            }), 200

        return jsonify({
            "status": "success",
            "empresa": {
                "id": resultado[0],
                "nombre_empresa": resultado[1],
                "total_puestos_publicados": resultado[2]
            }
        }), 200

    except Exception as e:
        print("ERROR en /api/admin/report/empresa-top-publicaciones:", e)
        return jsonify({
            "status": "error",
            "message": "No se pudo generar el reporte."
        }), 500


# ====== EMPRESAS =======
@app.route('/api/company/job', methods=['POST'])
@flask_login.login_required
def publicar_puesto_de_trabajo():
    if flask_login.current_user.tipo == 'empresa':
        try:
            datos = request.json
            nombre_puesto = datos.get('nombre_puesto')
            ubicacion_fisica = datos.get('ubicacion_fisica')
            sueldo_mensual = datos.get('sueldo_mensual')
            tipo_contrato = datos.get('tipo_contrato')
            jornada_laboral = datos.get('jornada_laboral')
            modalidad_trabajo = datos.get('modalidad_trabajo')
            descripcion = datos.get('descripcion')
            educacion_minima = datos.get('educacion_minima')
            anios_experiencia = datos.get('anios_experiencia')
            idiomas = datos.get('idiomas')
            rango_edad = datos.get('rango_edad')
            area = datos.get('area')
            prioridad = datos.get('prioridad')

            if not all([nombre_puesto, ubicacion_fisica, sueldo_mensual, tipo_contrato, jornada_laboral, modalidad_trabajo, descripcion, area]):
                return jsonify({"status": "error", "message": "Todos los campos obligatorios deben estar llenos"}), 400

            if tipo_contrato not in ['indefinido', 'temporal']:
                return jsonify({"status": "error", "message": "El tipo de contrato debe ser 'indefinido' o 'temporal'"}), 400

            if jornada_laboral not in ['tiempo completo', 'medio tiempo']:
                return jsonify({"status": "error", "message": "La jornada laboral debe ser 'tiempo completo' o 'medio tiempo'"}), 400

            if modalidad_trabajo not in ['presencial', 'remoto', 'híbrido']:
                return jsonify({"status": "error", "message": "La modalidad de trabajo debe ser 'presencial', 'remoto' o 'híbrido'"}), 400

            if prioridad not in ['1', '0']:
                return jsonify({"status": "error", "message": "El campo prioridad debe ser '1' o '0'"}), 400

            connection = get_oracle_connection()
            cursor = connection.cursor()
            ahora = datetime.now().strftime('%Y-%m-%d')
            query = """
            INSERT INTO PUESTO_TRABAJO (
                nombre_puesto, ubicacion_fisica, id_empresa, sueldo_mensual, 
                tipo_contrato, jornada_laboral, modalidad_trabajo, descripcion, 
                educacion_minima, anios_experiencia, idiomas, rango_edad, 
                fecha_creacion, fecha_actualizado, area, activo, prioridad, editado
            ) VALUES (
                :nombre_puesto, :ubicacion_fisica, :id_empresa, 
                :sueldo_mensual, :tipo_contrato, :jornada_laboral, 
                :modalidad_trabajo, :descripcion, :educacion_minima, 
                :anios_experiencia, :idiomas, :rango_edad, 
                TO_DATE(:fecha_creacion, 'YYYY-MM-DD'), TO_DATE(:fecha_actualizado, 'YYYY-MM-DD'), 
                :area, 'activo', :prioridad, '0'
            )
            """
            cursor.execute(query, {
                'nombre_puesto': nombre_puesto,
                'ubicacion_fisica': ubicacion_fisica,
                'id_empresa': flask_login.current_user.id,
                'sueldo_mensual': sueldo_mensual,
                'tipo_contrato': tipo_contrato,
                'jornada_laboral': jornada_laboral,
                'modalidad_trabajo': modalidad_trabajo,
                'descripcion': descripcion,
                'educacion_minima': educacion_minima,
                'anios_experiencia': anios_experiencia,
                'idiomas': idiomas,
                'rango_edad': rango_edad,
                'fecha_creacion': ahora,
                'fecha_actualizado': ahora,
                'area': area,
                'prioridad': prioridad
            })

            connection.commit()
            cursor.close()
            connection.close()
            return jsonify({"status": "success", "message": "Puesto de trabajo publicado exitosamente"}), 201
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo las empresas pueden registrar puestos de trabajo."
        }), 403

#Para devolver las ofertas de trabajo que se pueden modificar
@app.route('/api/company/job/active', methods=['GET'])
@flask_login.login_required
def ver_trabajos_disponibles_empresa():
    if flask_login.current_user.tipo == 'empresa':
        try:
            empresa_id = flask_login.current_user.id
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT
                    p.nombre_puesto,
                    e.nombre_empresa,
                    p.ubicacion_fisica,
                    p.sueldo_mensual,
                    p.area,
                    p.id,
                    p.modalidad_trabajo,
                    p.jornada_laboral,
                    p.fecha_creacion,
                    p.descripcion,
                    p.idiomas,
                    p.rango_edad,
                    p.educacion_minima
                FROM
                    PUESTO_TRABAJO p
                JOIN
                    EMPRESA e ON p.id_empresa = e.id
                WHERE
                    p.activo = 'activo' AND p.id_empresa = :empresa_id
                """ ,
    {'empresa_id': empresa_id}
            )
            rows = cursor.fetchall()
            jobs = []
            for row in rows:
                job = {
                    "nombre_puesto": row[0],
                    "nombre_empresa": row[1],
                    "ubicacion_fisica": row[2],
                    "sueldo":row[3],
                    "area":row[4],
                    "id":row[5],
                    "modalidad_trabajo":row[6],
                    "jornada_laboral":row[7],
                    "fecha_creacion":row[8],
                    "descripcion": row[9],
                    "idiomas" : row[10],
                    "rango_edad": row[11],
                    "educacion_minima": row[12]
                }
                jobs.append(job)
            cursor.close()
            connection.close()
            return jsonify(jobs), 200
        except Exception as e:
            print("ERROR EN /api/user/job/active", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo las empresas pueden ver sus respectivos puestos de trabajo."
        }), 403


@app.route('/api/company/job/update', methods=['PUT'])
@flask_login.login_required
def actualizar_puesto_de_trabajo():
    if flask_login.current_user.tipo != 'empresa':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo las empresas pueden actualizar puestos de trabajo."
        }), 403
    try:
        info = request.get_json()
        if not info or 'id_puesto' not in info:
            return jsonify({
                "status": "error",
                "message": "El campo 'id_puesto' es obligatorio en el JSON"
            }), 400
        id_puesto = info.get('id_puesto')
        campos_permitidos = {
            "nombre_puesto", "ubicacion_fisica", "sueldo_mensual", "area",
            "modalidad_trabajo", "jornada_laboral", "descripcion", "idiomas",
            "rango_edad", "educacion_minima"
        }
        campos = []
        valores = {}
        errores = []
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT editado FROM PUESTO_TRABAJO WHERE id = :id AND id_empresa = :id_empresa", {
            "id": id_puesto,
            "id_empresa": flask_login.current_user.id
        })
        row = cursor.fetchone()
        if not row:
            cursor.close()
            connection.close()
            return jsonify({
                "status": "error",
                "message": "Puesto no encontrado o no pertenece a su empresa"
            }), 404
        if str(row[0]) == '1':
            cursor.close()
            connection.close()
            return jsonify({
                "status": "error",
                "message": "Este puesto ya fue editado una vez y no puede ser modificado nuevamente."
            }), 403

        for key, value in info.items():
            if key == 'id_puesto':
                continue
            if key not in campos_permitidos:
                continue
            campos.append(f"{key} = :{key}")
            valores[key] = value
        if errores:
            return jsonify({
                "status": "error",
                "message": " | ".join(errores)
            }), 400
        if not campos:
            return jsonify({
                "status": "error",
                "message": "No hay campos válidos para actualizar"
            }), 400
        valores['id_puesto'] = id_puesto
        campos.append("editado = 1")
        campos.append("fecha_actualizado = CURRENT_TIMESTAMP")
        query = f"""
        UPDATE PUESTO_TRABAJO 
        SET {', '.join(campos)} 
        WHERE id = :id_puesto
        """
        cursor.execute(query, valores)
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({
            "status": "success",
            "message": "Puesto de trabajo actualizado exitosamente. Solo puede editarse una vez."
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/company/job/application', methods=['GET'])
def ver_solicitudes():
    if flask_login.current_user.tipo == 'empresa':
        try:
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT
                    a.fecha_aplicacion,
                    u.nombre || ' ' || u.apellidos,
                    p.nombre_puesto
                FROM
                    APLICACIONES a
                    JOIN USUARIO u ON a.id_usuario = u.id
                    JOIN PUESTO_TRABAJO p ON a.id_puesto = p.id
                WHERE
                    p.id_empresa = :id_empresa
                """,{"id_empresa":flask_login.current_user.id}
            )
            rows = cursor.fetchall()
            applications = []
            for row in rows:
                application = {
                    "fecha_aplicacion": row[0],
                    "nombre_completo": row[1],
                    "nombre_puesto": row[2],
                }
                applications.append(application)
            cursor.close()
            connection.close()
            return jsonify(applications), 200
        except Exception as e:
            print("ERROR EN /api/user/job/status", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo las empresas pueden ver las aplicaciones de su empresa."
        }), 403

@app.route('/api/company/job/attention', methods=['GET'])
@flask_login.login_required
def ver_solicitudes_usuarios():
    if flask_login.current_user.tipo == 'empresa':
        try:
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT
                    pt.nombre_puesto,
                    pt.ubicacion_fisica,
                    pt.tipo_contrato,
                    pt.jornada_laboral,
                    pt.modalidad_trabajo,
                    pt.descripcion,
                    pt.educacion_minima,
                    pt.anios_experiencia,
                    pt.idiomas,
                    pt.rango_edad,
                    pt.fecha_creacion,
                    pt.activo,
                    pt.area,
                    a.estado_proceso,
                    u.nombre,
                    a.cvitae,
                    a.id
                FROM
                    PUESTO_TRABAJO pt
                LEFT JOIN APLICACIONES a ON pt.id = a.id_puesto
                LEFT JOIN USUARIO u ON a.id_usuario = u.id
                WHERE
                    pt.id_empresa = :id_empresa
                    AND a.estado_proceso = 'postulado' OR a.estado_proceso = 'CV Visto'
                """, {"id_empresa": flask_login.current_user.id}
            )
            rows = cursor.fetchall()
            puestos = []
            for row in rows:
                puesto = {
                    "nombre_puesto": row[0],
                    "ubicacion_fisica": row[1],
                    "tipo_contrato": row[2],
                    "jornada_laboral": row[3],
                    "modalidad_trabajo": row[4],
                    "descripcion": row[5],
                    "educacion_minima": row[6],
                    "anios_experiencia": row[7],
                    "idiomas": row[8],
                    "rango_edad": row[9],
                    "fecha_creacion": row[10],
                    "activo": row[11],
                    "area": row[12],
                    "estado_proceso": row[13],
                    "nombre_usuario":row[14],
                    "cv":row[15],
                    "id":row[16]
                }
                puestos.append(puesto)
            cursor.close()
            connection.close()
            return jsonify(puestos), 200
        except Exception as e:
            print("ERROR EN /api/company/job/attention", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo las empresas pueden ver el historial de sus puestos."
        }), 403


@app.route('/api/company/job/record', methods=['GET'])
@flask_login.login_required
def ver_historial_puestos_empresa():
    if flask_login.current_user.tipo == 'empresa':
        try:
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT
                    pt.nombre_puesto,
                    pt.ubicacion_fisica,
                    pt.tipo_contrato,
                    pt.jornada_laboral,
                    pt.modalidad_trabajo,
                    pt.descripcion,
                    pt.educacion_minima,
                    pt.anios_experiencia,
                    pt.idiomas,
                    pt.rango_edad,
                    pt.fecha_creacion,
                    pt.activo,
                    pt.area,
                    a.estado_proceso
                FROM
                    PUESTO_TRABAJO pt
                LEFT JOIN APLICACIONES a ON pt.id = a.id_puesto
                WHERE
                    pt.id_empresa = :id_empresa
                """, {"id_empresa": flask_login.current_user.id}
            )
            rows = cursor.fetchall()
            puestos = []
            for row in rows:
                puesto = {
                    "nombre_puesto": row[0],
                    "ubicacion_fisica": row[1],
                    "tipo_contrato": row[2],
                    "jornada_laboral": row[3],
                    "modalidad_trabajo": row[4],
                    "descripcion": row[5],
                    "educacion_minima": row[6],
                    "anios_experiencia": row[7],
                    "idiomas": row[8],
                    "rango_edad": row[9],
                    "fecha_creacion": row[10],
                    "activo": row[11],
                    "area": row[12],
                    "estado_proceso": row[13]
                }
                puestos.append(puesto)
            cursor.close()
            connection.close()
            return jsonify(puestos), 200
        except Exception as e:
            print("ERROR EN /api/company/job/record", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo las empresas pueden ver el historial de sus puestos."
        }), 403

# CV visto
@app.route('/api/company/job/cv', methods=['PUT'])
@flask_login.login_required
def ver_cv_usuario():
    if flask_login.current_user.tipo != 'empresa':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo las empresas pueden ver los CV de los postulantes."
        }), 403
    try:
        datos = request.get_json()
        id_aplicacion = datos.get('id_aplicacion')
        if not id_aplicacion:
            return jsonify({
                "status": "error",
                "message": "Falta el campo obligatorio: id_aplicacion"
            }), 400

        connection = get_oracle_connection()
        cursor = connection.cursor()

        # Verificar si la aplicación pertenece a esta empresa
        cursor.execute("""
            SELECT a.id
            FROM APLICACIONES a
            JOIN PUESTO_TRABAJO pt ON a.id_puesto = pt.id
            WHERE a.id = :id_aplicacion AND pt.id_empresa = :id_empresa
        """, {
            "id_aplicacion": id_aplicacion,
            "id_empresa": flask_login.current_user.id
        })
        resultado = cursor.fetchone()
        if not resultado:
            return jsonify({
                "status": "error",
                "message": "La aplicación no pertenece a un puesto de esta empresa."
            }), 404

        # Actualizar el estado a 'CV Visto'
        cursor.execute("""
            UPDATE APLICACIONES
            SET estado_proceso = 'CV Visto'
            WHERE id = :id_aplicacion
        """, {"id_aplicacion": id_aplicacion})

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({
            "status": "success",
            "message": "El estado de la aplicación fue actualizado a 'CV Visto'."
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Ocurrió un error: {str(e)}"
        }), 500

#Finalista
@app.route('/api/company/job/update/finalist', methods=['PUT'])
@flask_login.login_required
def actualizar_estado_puesto_finalista():
    if flask_login.current_user.tipo != 'empresa':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo las empresas pueden actualizar el estado de sus puestos."
        }), 403

    try:
        datos = request.get_json()
        id_aplicacion = datos.get('id_aplicacion')

        if not id_aplicacion:
            return jsonify({
                "status": "error",
                "message": "Falta el campo obligatorio: id_aplicacion"
            }), 400

        connection = get_oracle_connection()
        cursor = connection.cursor()

        # Verificamos si la aplicación pertenece a la empresa actual
        cursor.execute("""
            SELECT a.id
            FROM APLICACIONES a
            JOIN PUESTO_TRABAJO pt ON a.id_puesto = pt.id
            WHERE a.id = :id_aplicacion AND pt.id_empresa = :id_empresa
        """, {
            "id_aplicacion": id_aplicacion,
            "id_empresa": flask_login.current_user.id
        })

        resultado = cursor.fetchone()
        if not resultado:
            return jsonify({
                "status": "error",
                "message": "No se encontró una aplicación válida para esta empresa"
            }), 404

        # Actualizamos el estado a 'Finalista'
        cursor.execute("""
            UPDATE APLICACIONES
            SET estado_proceso = 'Finalista'
            WHERE id = :id_aplicacion
        """, {"id_aplicacion": id_aplicacion})

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({
            "status": "success",
            "message": "Estado actualizado a 'Finalista'"
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error al actualizar estado: {str(e)}"
        }), 500


# Proceso finalizado
@app.route('/api/company/job/update/process-finished', methods=['PUT'])
@flask_login.login_required
def actualizar_estado_puesto_proceso_finalizado():
    if flask_login.current_user.tipo != 'empresa':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo las empresas pueden actualizar el estado de sus puestos."
        }), 403

    try:
        datos = request.get_json()
        id_aplicacion = datos.get('id_aplicacion')

        if not id_aplicacion:
            return jsonify({
                "status": "error",
                "message": "Falta el campo obligatorio: id_aplicacion"
            }), 400

        connection = get_oracle_connection()
        cursor = connection.cursor()

        # Verificamos si la aplicación pertenece a la empresa actual
        cursor.execute("""
            SELECT a.id
            FROM APLICACIONES a
            JOIN PUESTO_TRABAJO pt ON a.id_puesto = pt.id
            WHERE a.id = :id_aplicacion AND pt.id_empresa = :id_empresa
        """, {
            "id_aplicacion": id_aplicacion,
            "id_empresa": flask_login.current_user.id
        })

        resultado = cursor.fetchone()
        if not resultado:
            return jsonify({
                "status": "error",
                "message": "No se encontró una aplicación válida para esta empresa"
            }), 404

        # Actualizamos el estado a 'Proceso finalizado'
        cursor.execute("""
            UPDATE APLICACIONES
            SET estado_proceso = 'Proceso Finalizado'
            WHERE id = :id_aplicacion
        """, {"id_aplicacion": id_aplicacion})

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({
            "status": "success",
            "message": "Estado actualizado a 'Proceso finalizado'"
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error al actualizar estado: {str(e)}"
        }), 500

@app.route('/api/company/job/notify', methods=['POST'])
@flask_login.login_required
def notificar_seleccionados():
    if flask_login.current_user.tipo != 'empresa':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo las empresas pueden enviar notificaciones."
        }), 403

    try:
        datos = request.get_json()
        id_puesto = datos.get('id_puesto')
        ids_usuarios = datos.get('ids_usuarios')  # lista de IDs
        mensaje = datos.get('mensaje')

        if not id_puesto or not ids_usuarios or not mensaje:
            return jsonify({
                "status": "error",
                "message": "Faltan campos obligatorios: id_puesto, ids_usuarios o mensaje"
            }), 400

        if not isinstance(ids_usuarios, list) or not all(isinstance(uid, int) for uid in ids_usuarios):
            return jsonify({
                "status": "error",
                "message": "El campo ids_usuarios debe ser una lista de enteros"
            }), 400

        connection = get_oracle_connection()
        cursor = connection.cursor()

        # Validar que el puesto pertenezca a la empresa logueada
        cursor.execute("""
            SELECT id FROM PUESTO_TRABAJO
            WHERE id = :id_puesto AND id_empresa = :id_empresa
        """, {
            "id_puesto": id_puesto,
            "id_empresa": flask_login.current_user.id
        })
        if not cursor.fetchone():
            cursor.close()
            connection.close()
            return jsonify({
                "status": "error",
                "message": "El puesto no existe o no pertenece a su empresa"
            }), 403

        # Obtener los correos de los usuarios seleccionados que aplicaron al puesto
        format_ids = ",".join([str(uid) for uid in ids_usuarios])
        cursor.execute(f"""
            SELECT u.correo, u.nombre
            FROM APLICACIONES a
            JOIN USUARIO u ON a.id_usuario = u.id
            WHERE a.id_puesto = :id_puesto
              AND u.id IN ({format_ids})
        """, {"id_puesto": id_puesto})

        seleccionados = cursor.fetchall()
        cursor.close()
        connection.close()

        if not seleccionados:
            return jsonify({
                "status": "warning",
                "message": "No se encontraron postulantes con esos IDs para el puesto indicado."
            }), 200

        enviados = 0
        for correo, nombre in seleccionados:
            msg = Message(
                subject="¡Has sido seleccionado para la entrevista!",
                sender=app.config['MAIL_USERNAME'],
                recipients=[correo]
            )
            msg.body = f"Hola {nombre},\n\n{mensaje}\n\n¡Nos vemos pronto!"
            try:
                mail.send(msg)
                enviados += 1
            except Exception as e:
                print(f"Error al enviar correo a {correo}: {e}")

        return jsonify({
            "status": "success",
            "message": f"Se enviaron {enviados} correo(s) a los postulantes seleccionados."
        }), 200

    except Exception as e:
        print("ERROR en /api/company/job/notify:", e)
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route('/api/admin/user/update', methods=['PUT'])
@flask_login.login_required
def update_user():
    if flask_login.current_user.tipo != 'admin':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los administradores pueden editar usuarios."
        }), 403
    try:
        info = request.get_json()
        if not info or 'id' not in info:
            return jsonify({
                "status": "error",
                "message": "El campo 'id' es obligatorio en el JSON"
            }), 400
        id = info.get('id')
        campos_permitidos = {
            "nombre", "apellidos", "genero", "activo",
            "direccion", "telefono", "fecha_nacimiento",
            "contrasena"
        }
        campos = []
        valores = {}
        errores = []
        for key, value in info.items():
            if key == 'id':
                continue
            if key not in campos_permitidos:
                continue
            if key == 'genero' and value not in ['M', 'F']:
                errores.append("El campo 'genero' solo acepta 'M' o 'F'")
                continue
            if key == 'activo' and value not in ['activo', 'inactivo']:
                errores.append("El campo 'activo' solo acepta 'activo' o 'inactivo'")
                continue
            if key == 'contrasena':
                hashed = bcrypt.hashpw(value.encode('utf-8'), bcrypt.gensalt())
                value = hashed.decode('utf-8')
            campos.append(f"{key.upper()} = :{key}")
            valores[key] = value
        if errores:
            return jsonify({
                "status": "error",
                "message": " | ".join(errores)
            }), 400
        if not campos:
            return jsonify({
                "status": "error",
                "message": "No hay campos válidos para actualizar"
            }), 400
        valores['id'] = id
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM USUARIO WHERE ID = :id", {"id": id})
        if not cursor.fetchone():
            cursor.close()
            connection.close()
            return jsonify({
                "status": "error",
                "message": "Usuario no encontrado"
            }), 404
        campos.append("FECHA_ACTUALIZADO = CURRENT_TIMESTAMP")
        query = f"""
        UPDATE USUARIO 
        SET {', '.join(campos)} 
        WHERE ID = :id
        """
        cursor.execute(query, valores)
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({
            "status": "success",
            "message": "Usuario actualizado exitosamente"
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/admin/company/update', methods=['PUT'])
@flask_login.login_required
def update_company():
    if flask_login.current_user.tipo != 'admin':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los administradores pueden editar empresas."
        }), 403
    try:
        info = request.get_json()
        if not info or 'id' not in info:
            return jsonify({
                "status": "error",
                "message": "El campo 'id' es obligatorio en el JSON"
            }), 400
        id = info.get('id')
        campos_permitidos = {
            "nombre_empresa", "nit", "direccion", "telefono",
            "giro_negocio", "contrasena"
        }
        campos = []
        valores = {}
        errores = []
        for key, value in info.items():
            if key == 'id':
                continue
            if key not in campos_permitidos:
                continue
            if key == 'contrasena':
                hashed = bcrypt.hashpw(value.encode('utf-8'), bcrypt.gensalt())
                value = hashed.decode('utf-8')
            campos.append(f"{key.upper()} = :{key}")
            valores[key] = value
        if errores:
            return jsonify({
                "status": "error",
                "message": " | ".join(errores)
            }), 400
        if not campos:
            return jsonify({
                "status": "error",
                "message": "No hay campos válidos para actualizar"
            }), 400
        valores['id'] = id
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM EMPRESA WHERE ID = :id", {"id": id})
        if not cursor.fetchone():
            cursor.close()
            connection.close()
            return jsonify({
                "status": "error",
                "message": "Empresa no encontrada"
            }), 404
        campos.append("FECHA_ACTUALIZADO = CURRENT_TIMESTAMP")
        query = f"""
        UPDATE EMPRESA 
        SET {', '.join(campos)} 
        WHERE ID = :id
        """
        cursor.execute(query, valores)
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({
            "status": "success",
            "message": "Empresa actualizada exitosamente"
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/user/info', methods=['GET'])
@flask_login.login_required
def obtener_info_usuario():
    if flask_login.current_user.tipo != 'usuario':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden ver su información."
        }), 403
    try:
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT * FROM USUARIO WHERE id = :id
        """, {"id": flask_login.current_user.id})
        row = cursor.fetchone()
        cursor.close()
        connection.close()
        if not row:
            return jsonify({
                "status": "error",
                "message": "Usuario no encontrado"
            }), 404
        usuario = {
            "id": row[0],
            "nombre": row[1],
            "apellidos": row[2],
            "genero": row[3],
            "cui": row[4],
            "direccion": row[5],
            "telefono": row[6],
            "fecha_nacimiento": row[7],
            "correo": row[8],
            "fecha_creacion": row[9],
            "fecha_actualizado": row[10],
            "activo": row[11]
        }
        return jsonify(usuario), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/company/info', methods=['GET'])
@flask_login.login_required
def obtener_info_empresa():
    if flask_login.current_user.tipo != 'empresa':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo las empresas pueden ver su información."
        }), 403
    try:
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT * FROM EMPRESA WHERE id = :id
        """, {"id": flask_login.current_user.id})
        row = cursor.fetchone()
        cursor.close()
        connection.close()
        if not row:
            return jsonify({
                "status": "error",
                "message": "Empresa no encontrada"
            }), 404
        empresa = {
            "id": row[0],
            "nombre_empresa": row[1],
            "nit": row[2],
            "direccion": row[3],
            "telefono": row[4],
            "giro_negocio": row[5],
            "correo": row[6],
            "contrasena": row[7],
            "aprobado": row[8],
            "fecha_creacion": row[9],
            "fecha_actualizado": row[10],
            "activo": row[11],
            "foto": row[12]
        }
        return jsonify(empresa), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/user/update', methods=['PUT'])
@flask_login.login_required
def update_user_as_user():
    if flask_login.current_user.tipo != 'usuario':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden editar su información."
        }), 403
    try:
        info = request.get_json()
        if not info:
            return jsonify({
                "status": "error",
                "message": "No se recibieron datos para actualizar"
            }), 400
        campos_permitidos = {
            "nombre", "apellidos", "direccion", "telefono", "contrasena"
        }
        campos = []
        valores = {}
        errores = []
        for key, value in info.items():
            if key not in campos_permitidos:
                continue
            if key == 'contrasena':
                hashed = bcrypt.hashpw(value.encode('utf-8'), bcrypt.gensalt())
                value = hashed.decode('utf-8')
            campos.append(f"{key.upper()} = :{key}")
            valores[key] = value
        if errores:
            return jsonify({
                "status": "error",
                "message": " | ".join(errores)
            }), 400
        if not campos:
            return jsonify({
                "status": "error",
                "message": "No hay campos válidos para actualizar"
            }), 400
        valores['id'] = flask_login.current_user.id
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM USUARIO WHERE ID = :id", {"id": flask_login.current_user.id})
        if not cursor.fetchone():
            cursor.close()
            connection.close()
            return jsonify({
                "status": "error",
                "message": "Usuario no encontrado"
            }), 404
        campos.append("FECHA_ACTUALIZADO = CURRENT_TIMESTAMP")
        query = f"""
        UPDATE USUARIO 
        SET {', '.join(campos)} 
        WHERE ID = :id
        """
        cursor.execute(query, valores)
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({
            "status": "success",
            "message": "Su usuario se ha actualizado exitosamente"
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    

@app.route('/api/user/company/approved', methods=['GET'])
@flask_login.login_required
def listar_empresas_aprobadas():
    if flask_login.current_user.tipo == 'usuario':
        try:
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute("""
                SELECT *
                FROM EMPRESA
                WHERE ACTIVO = 'activo' AND APROBADO = '1'
            """)
            rows = cursor.fetchall()
            empresas = []
            for row in rows:
                empresa = {
                    "id": row[0],
                    "nombre_empresa": row[1],
                    "nit": row[2],
                    "direccion": row[3],
                    "telefono": row[4],
                    "giro_negocio": row[5],
                    "correo": row[6],
                    "aprobado": row[8],
                    "activo": row[11]
                }
                empresas.append(empresa)
            cursor.close()
            connection.close()
            return jsonify(empresas), 200
        except Exception as e:
            print("ERROR EN /api/user/company/approved:", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden ver la información de empresas aprobadas."
        }), 403

@app.route('/api/user/company/jobs', methods=['POST'])
@flask_login.login_required
def listar_puestos_empresa_aprobada():
    if flask_login.current_user.tipo == 'usuario':
        try:
            data = request.get_json()
            empresa_id = data.get("empresa_id")
            if not empresa_id:
                return jsonify({
                    "status": "error",
                    "message": "El campo 'empresa_id' es obligatorio"
                }), 400

            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute("""
                SELECT id FROM EMPRESA WHERE id = :id AND APROBADO = '1'
            """, {"id": empresa_id})
            empresa = cursor.fetchone()
            if not empresa:
                cursor.close()
                connection.close()
                return jsonify({
                    "status": "error",
                    "message": "Empresa no encontrada o no aprobada"
                }), 404

            cursor.execute("""
                SELECT id, nombre_puesto, ubicacion_fisica, sueldo_mensual, tipo_contrato, jornada_laboral, modalidad_trabajo, descripcion, educacion_minima, anios_experiencia, idiomas, rango_edad, fecha_creacion, activo, area
                FROM PUESTO_TRABAJO
                WHERE id_empresa = :id_empresa
            """, {"id_empresa": empresa_id})
            puestos_rows = cursor.fetchall()
            puestos = []
            for p in puestos_rows:
                puesto = {
                    "id": p[0],
                    "nombre_puesto": p[1],
                    "ubicacion_fisica": p[2],
                    "sueldo_mensual": p[3],
                    "tipo_contrato": p[4],
                    "jornada_laboral": p[5],
                    "modalidad_trabajo": p[6],
                    "descripcion": p[7],
                    "educacion_minima": p[8],
                    "anios_experiencia": p[9],
                    "idiomas": p[10],
                    "rango_edad": p[11],
                    "fecha_creacion": p[12],
                    "activo": p[13],
                    "area": p[14]
                }
                puestos.append(puesto)
            cursor.close()
            connection.close()
            return jsonify(puestos), 200
        except Exception as e:
            print("ERROR EN /api/user/company/jobs:", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden ver los puestos de empresas aprobadas."
        }), 403



# Para realizar una reseña primero obtendremos los estados de los puestos por finalista o proceso finalizado
# Luego obtenemos los nombres de las empresas para ser enviados a un combobox
@app.route('/api/user/job/status/final', methods=['GET'])
@flask_login.login_required
def ver_estado_puestos():
    if flask_login.current_user.tipo == 'usuario':
        try:
            connection = get_oracle_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
            SELECT 
                a.id,
                p.nombre_puesto,
                e.nombre_empresa,
                a.estado_proceso,
                a.fecha_aplicacion
            FROM 
                APLICACIONES a
            JOIN 
                PUESTO_TRABAJO p ON a.id_puesto = p.id
            JOIN
                EMPRESA e ON p.id_empresa = e.id
            WHERE 
                a.id_usuario = :id_usuario 
                AND (a.estado_proceso = 'Finalista' OR a.estado_proceso = 'Proceso Finalizado')
                """,{"id_usuario":flask_login.current_user.id}
            )
            rows = cursor.fetchall()
            applications = []
            for row in rows:
                application = {
                    "id_aplicacion": row[0],
                    "nombre_puesto": row[1],
                    "nombre_empresa": row[2],
                    "estado_proceso": row[3],
                    "fecha_aplicacion": row[4]
                }
                applications.append(application)
            cursor.close()
            connection.close()
            return jsonify(applications), 200
        except Exception as e:
            print("ERROR EN /api/user/job/status", e)
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    else:
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden ver sus puestos aplicados."
        }), 403
    

@app.route('/api/user/review', methods=['POST'])
@flask_login.login_required
def crear_resena():
    if flask_login.current_user.tipo != 'usuario':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden crear reseñas."
        }), 403
    try:
        data = request.get_json()
        nombre_empresa = data.get("nombre_empresa")
        calificacion = data.get("calificacion")
        comentario = data.get("comentario")

        if not nombre_empresa or not calificacion:
            return jsonify({
                "status": "error",
                "message": "Los campos 'nombre_empresa' y 'calificacion' son obligatorios"
            }), 400

        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT id FROM EMPRESA WHERE nombre_empresa = :nombre_empresa
        """, {"nombre_empresa": nombre_empresa})
        fila_empresa = cursor.fetchone()
        if not fila_empresa:
            cursor.close()
            connection.close()
            return jsonify({
                "status": "error",
                "message": "Empresa no encontrada"
            }), 404
        id_empresa = fila_empresa[0]

        cursor.execute("""
            INSERT INTO RESENAS (id_usuario, id_empresa, calificacion, comentario)
            VALUES (:id_usuario, :id_empresa, :calificacion, :comentario)
        """, {
            "id_usuario": flask_login.current_user.id,
            "id_empresa": id_empresa,
            "calificacion": calificacion,
            "comentario": comentario
        })
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({
            "status": "success",
            "message": "Reseña creada exitosamente"
        }), 201
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    
@app.route('/api/user/report-company', methods=['POST'])
@flask_login.login_required
def reportar_empresa():
    if flask_login.current_user.tipo != 'usuario':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden reportar empresas."
        }), 403
    try:
        data = request.get_json()
        nombre_empresa = data.get("nombre_empresa")
        categoria = data.get("categoria")
        motivo = data.get("motivo")

        if not nombre_empresa or not categoria or not motivo:
            return jsonify({
                "status": "error",
                "message": "Los campos 'nombre_empresa', 'categoria' y 'motivo' son obligatorios"
            }), 400

        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT id FROM EMPRESA WHERE nombre_empresa = :nombre_empresa
        """, {"nombre_empresa": nombre_empresa})
        fila_empresa = cursor.fetchone()
        if not fila_empresa:
            cursor.close()
            connection.close()
            return jsonify({
                "status": "error",
                "message": "Empresa no encontrada"
            }), 404
        id_empresa = fila_empresa[0]

        cursor.execute("""
            INSERT INTO REPORTE_EMPRESA (id_reportante, id_reportado, categoria, motivo)
            VALUES (:id_reportante, :id_reportado, :categoria, :motivo)
        """, {
            "id_reportante": flask_login.current_user.id,
            "id_reportado": id_empresa,
            "categoria": categoria,
            "motivo": motivo
        })
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({
            "status": "success",
            "message": "Reporte enviado correctamente"
        }), 201
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/reviews', methods=['GET'])
@flask_login.login_required
def listar_resenas():
    if flask_login.current_user.tipo != 'usuario':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden crear reseñas."
        }), 403
    try:
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT 
                u.nombre || ' ' || u.apellidos AS nombre_usuario,
                e.nombre_empresa,
                r.calificacion,
                r.comentario
            FROM RESENAS r
            JOIN USUARIO u ON r.id_usuario = u.id
            JOIN EMPRESA e ON r.id_empresa = e.id
        """)
        rows = cursor.fetchall()
        resenas = []
        for row in rows:
            resena = {
                "nombre_usuario": row[0],
                "nombre_empresa": row[1],
                "calificacion": row[2],
                "comentario": row[3]
            }
            resenas.append(resena)
        cursor.close()
        connection.close()
        return jsonify(resenas), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/company/update', methods=['PUT'])
@flask_login.login_required
def update_company_as_company():
    if flask_login.current_user.tipo != 'empresa':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo las empresas pueden editar su información."
        }), 403
    try:
        info = request.get_json()
        if not info:
            return jsonify({
                "status": "error",
                "message": "No se recibieron datos para actualizar"
            }), 400

        campos_permitidos = {
            "nombre_empresa", "nit", "direccion", "telefono", "giro_negocio",
            "contrasena", "aprobado", "fecha_creacion", "fecha_actualizado",
            "activo", "foto"
        }
        campos = []
        valores = {}
        errores = []
        for key, value in info.items():
            if key not in campos_permitidos:
                continue
            if key == 'contrasena':
                hashed = bcrypt.hashpw(value.encode('utf-8'), bcrypt.gensalt())
                value = hashed.decode('utf-8')
            campos.append(f"{key.upper()} = :{key}")
            valores[key] = value
        if errores:
            return jsonify({
                "status": "error",
                "message": " | ".join(errores)
            }), 400
        if not campos:
            return jsonify({
                "status": "error",
                "message": "No hay campos válidos para actualizar"
            }), 400
        valores['id'] = flask_login.current_user.id
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM EMPRESA WHERE ID = :id", {"id": flask_login.current_user.id})
        if not cursor.fetchone():
            cursor.close()
            connection.close()
            return jsonify({
                "status": "error",
                "message": "Empresa no encontrada"
            }), 404
        campos.append("FECHA_ACTUALIZADO = CURRENT_TIMESTAMP")
        query = f"""
        UPDATE EMPRESA 
        SET {', '.join(campos)} 
        WHERE ID = :id
        """
        cursor.execute(query, valores)
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({
            "status": "success",
            "message": "Su empresa se ha actualizado exitosamente"
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Buscar trabajos de la empresa por fecha de creación
@app.route('/api/company/job/date', methods=['POST'])
@flask_login.login_required
def buscar_empleos_empresa_por_fecha():
    if flask_login.current_user.tipo != 'empresa':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo las empresas pueden buscar sus puestos."
        }), 403
    try:
        info = request.get_json()
        fecha_creacion = info.get("fecha_creacion")
        if not fecha_creacion:
            return jsonify({"status": "error", "message": "El campo 'fecha_creacion' es obligatorio"}), 400

        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute(
            """
            SELECT 
                id, nombre_puesto, ubicacion_fisica, sueldo_mensual, tipo_contrato, jornada_laboral, modalidad_trabajo, descripcion, educacion_minima, anios_experiencia, idiomas, rango_edad, fecha_creacion, activo, area
            FROM 
                PUESTO_TRABAJO
            WHERE 
                id_empresa = :id_empresa
                AND TO_CHAR(fecha_creacion, 'YYYY-MM-DD') = :fecha_creacion
            """, {
                "id_empresa": flask_login.current_user.id,
                "fecha_creacion": fecha_creacion
            }
        )
        rows = cursor.fetchall()
        puestos = []
        for p in rows:
            puesto = {
                "id": p[0],
                "nombre_puesto": p[1],
                "ubicacion_fisica": p[2],
                "sueldo_mensual": p[3],
                "tipo_contrato": p[4],
                "jornada_laboral": p[5],
                "modalidad_trabajo": p[6],
                "descripcion": p[7],
                "educacion_minima": p[8],
                "anios_experiencia": p[9],
                "idiomas": p[10],
                "rango_edad": p[11],
                "fecha_creacion": p[12],
                "activo": p[13],
                "area": p[14]
            }
            puestos.append(puesto)
        cursor.close()
        connection.close()
        return jsonify(puestos), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Buscar trabajos de la empresa por jornada laboral
@app.route('/api/company/job/jornada', methods=['POST'])
@flask_login.login_required
def buscar_empleos_empresa_por_jornada():
    if flask_login.current_user.tipo != 'empresa':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo las empresas pueden buscar sus puestos."
        }), 403
    try:
        info = request.get_json()
        jornada_laboral = info.get("jornada_laboral")
        if not jornada_laboral:
            return jsonify({"status": "error", "message": "El campo 'jornada_laboral' es obligatorio"}), 400

        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute(
            """
            SELECT 
                id, nombre_puesto, ubicacion_fisica, sueldo_mensual, tipo_contrato, jornada_laboral, modalidad_trabajo, descripcion, educacion_minima, anios_experiencia, idiomas, rango_edad, fecha_creacion, activo, area
            FROM 
                PUESTO_TRABAJO
            WHERE 
                id_empresa = :id_empresa
                AND jornada_laboral = :jornada_laboral
            """, {
                "id_empresa": flask_login.current_user.id,
                "jornada_laboral": jornada_laboral
            }
        )
        rows = cursor.fetchall()
        puestos = []
        for p in rows:
            puesto = {
                "id": p[0],
                "nombre_puesto": p[1],
                "ubicacion_fisica": p[2],
                "sueldo_mensual": p[3],
                "tipo_contrato": p[4],
                "jornada_laboral": p[5],
                "modalidad_trabajo": p[6],
                "descripcion": p[7],
                "educacion_minima": p[8],
                "anios_experiencia": p[9],
                "idiomas": p[10],
                "rango_edad": p[11],
                "fecha_creacion": p[12],
                "activo": p[13],
                "area": p[14]
            }
            puestos.append(puesto)
        cursor.close()
        connection.close()
        return jsonify(puestos), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Buscar trabajos de la empresa por modalidad de trabajo
@app.route('/api/company/job/modalidad', methods=['POST'])
@flask_login.login_required
def buscar_empleos_empresa_por_modalidad():
    if flask_login.current_user.tipo != 'empresa':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo las empresas pueden buscar sus puestos."
        }), 403
    try:
        info = request.get_json()
        modalidad_trabajo = info.get("modalidad_trabajo")
        if not modalidad_trabajo:
            return jsonify({"status": "error", "message": "El campo 'modalidad_trabajo' es obligatorio"}), 400

        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute(
            """
            SELECT 
                id, nombre_puesto, ubicacion_fisica, sueldo_mensual, tipo_contrato, jornada_laboral, modalidad_trabajo, descripcion, educacion_minima, anios_experiencia, idiomas, rango_edad, fecha_creacion, activo, area
            FROM 
                PUESTO_TRABAJO
            WHERE 
                id_empresa = :id_empresa
                AND modalidad_trabajo = :modalidad_trabajo
            """, {
                "id_empresa": flask_login.current_user.id,
                "modalidad_trabajo": modalidad_trabajo
            }
        )
        rows = cursor.fetchall()
        puestos = []
        for p in rows:
            puesto = {
                "id": p[0],
                "nombre_puesto": p[1],
                "ubicacion_fisica": p[2],
                "sueldo_mensual": p[3],
                "tipo_contrato": p[4],
                "jornada_laboral": p[5],
                "modalidad_trabajo": p[6],
                "descripcion": p[7],
                "educacion_minima": p[8],
                "anios_experiencia": p[9],
                "idiomas": p[10],
                "rango_edad": p[11],
                "fecha_creacion": p[12],
                "activo": p[13],
                "area": p[14]
            }
            puestos.append(puesto)
        cursor.close()
        connection.close()
        return jsonify(puestos), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# Ver reportes de empresas (ADMIN)
@app.route('/api/user/company/report', methods=['GET'])
@flask_login.login_required
def listar_reportes_empresa():
    if flask_login.current_user.tipo != 'admin':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los administradores pueden ver los reportes."
        }), 403
    try:
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT 
                u.nombre || ' ' || u.apellidos AS nombre_usuario,
                e.nombre_empresa,
                re.categoria,
                re.motivo,
                e.id AS id_empresa
            FROM REPORTE_EMPRESA re
            JOIN USUARIO u ON re.id_reportante = u.id
            JOIN EMPRESA e ON re.id_reportado = e.id
            ORDER BY re.fecha_reporte DESC
        """)
        rows = cursor.fetchall()
        reportes = []
        for row in rows:
            reporte = {
                "nombre_usuario": row[0],
                "nombre_empresa": row[1],
                "categoria": row[2],
                "motivo": row[3],
                "id_empresa": row[4]
            }
            reportes.append(reporte)
        cursor.close()
        connection.close()
        return jsonify(reportes), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# Ver reporte de usuarios (denuncias)
@app.route('/api/admin/user-reports', methods=['GET'])
@flask_login.login_required
def ver_reportes_usuarios():
    if flask_login.current_user.tipo != 'admin':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los administradores pueden ver los reportes."
        }), 403
    try:
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT 
                u.nombre || ' ' || u.apellidos AS nombre_usuario,
                e.nombre_empresa,
                r.categoria,
                r.motivo,
                u.id 
            FROM REPORTE_USUARIO r
            JOIN USUARIO u ON r.id_reportado = u.id
            JOIN EMPRESA e ON r.id_reportante = e.id
            ORDER BY r.fecha_reporte DESC
        """)
        rows = cursor.fetchall()
        reportes = []
        for row in rows:
            reporte = {
                "nombre_usuario": row[0],
                "nombre_empresa_reportante": row[1],
                "categoria": row[2],
                "motivo": row[3],
                "id_usuario": row[4]
            }
            reportes.append(reporte)
        cursor.close()
        connection.close()
        return jsonify(reportes), 200
    except Exception as e:
        print("ERROR EN /api/admin/user-reports:", e)
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# Calificar usuario como empresa
@app.route('/api/company/report/user', methods=['POST'])
@flask_login.login_required
def reportar_usuario():
    if flask_login.current_user.tipo != 'empresa':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo las empresas pueden reportar usuarios."
        }), 403
    try:
        data = request.get_json()
        nombre_usuario = data.get("nombre_usuario")  # Formato: "Nombre Apellido"
        categoria = data.get("categoria")
        motivo = data.get("motivo")

        if not nombre_usuario or not categoria or not motivo:
            return jsonify({
                "status": "error",
                "message": "Los campos 'nombre_usuario', 'categoria' y 'motivo' son obligatorios"
            }), 400

        connection = get_oracle_connection()
        cursor = connection.cursor()

        # Buscar al usuario por nombre completo
        cursor.execute("""
            SELECT id FROM USUARIO
            WHERE LOWER(nombre || ' ' || apellidos) = LOWER(:nombre_usuario)
        """, {"nombre_usuario": nombre_usuario})
        fila_usuario = cursor.fetchone()
        if not fila_usuario:
            cursor.close()
            connection.close()
            return jsonify({
                "status": "error",
                "message": "Usuario no encontrado"
            }), 404
        id_usuario = fila_usuario[0]

        # Validar que el usuario haya aplicado a un puesto de esta empresa y esté en estado final
        cursor.execute("""
            SELECT 1
            FROM APLICACIONES a
            JOIN PUESTO_TRABAJO p ON a.id_puesto = p.id
            WHERE a.id_usuario = :id_usuario
              AND p.id_empresa = :id_empresa
              AND a.estado_proceso IN ('Finalista', 'Proceso Finalizado')
        """, {
            "id_usuario": id_usuario,
            "id_empresa": flask_login.current_user.id
        })
        validacion = cursor.fetchone()
        if not validacion:
            cursor.close()
            connection.close()
            return jsonify({
                "status": "error",
                "message": "Solo puedes reportar a usuarios con los que se haya finalizado el proceso de selección."
            }), 403

        # Insertar reporte
        cursor.execute("""
            INSERT INTO REPORTE_USUARIO (id_reportante, id_reportado, categoria, motivo)
            VALUES (:id_reportante, :id_reportado, :categoria, :motivo)
        """, {
            "id_reportante": flask_login.current_user.id,
            "id_reportado": id_usuario,
            "categoria": categoria,
            "motivo": motivo
        })
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({
            "status": "success",
            "message": "Reporte enviado al administrador correctamente."
        }), 201

    except Exception as e:
        print("ERROR EN /api/company/report/user:", e)
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# ver repseñas de empresas como usuario
@app.route('/api/user/company/reviews', methods=['GET'])
@flask_login.login_required
def ver_resenas_empresa():
    if flask_login.current_user.tipo != 'usuario':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los usuarios pueden ver calificaciones de empresas."
        }), 403
    try:
        connection = get_oracle_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT 
                u.nombre || ' ' || u.apellidos AS nombre_usuario,
                p.nombre_puesto,
                e.nombre_empresa,
                r.calificacion,
                r.comentario
            FROM RESENAS r
            JOIN USUARIO u ON r.id_usuario = u.id
            JOIN EMPRESA e ON r.id_empresa = e.id
            JOIN APLICACIONES a ON a.id_usuario = u.id AND a.id_puesto IN (
                SELECT id FROM PUESTO_TRABAJO WHERE id_empresa = e.id
            )
            JOIN PUESTO_TRABAJO p ON a.id_puesto = p.id
            WHERE a.estado_proceso IN ('Finalista', 'Proceso Finalizado')
        """)
        rows = cursor.fetchall()
        resenas = []
        for row in rows:
            resena = {
                "nombre_usuario": row[0],
                "nombre_puesto": row[1],
                "nombre_empresa": row[2],
                "calificacion": row[3],
                "comentario": row[4]
            }
            resenas.append(resena)

        cursor.close()
        connection.close()
        return jsonify(resenas), 200

    except Exception as e:
        print("ERROR EN /api/user/company/reviews:", e)
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


#Ver promedio de calificaciones por empresa
@app.route('/api/user/company/ratings', methods=['GET'])
@flask_login.login_required
def ver_promedios_empresas():
    if flask_login.current_user.tipo != 'admin':
        return jsonify({
            "status": "error",
            "message": "Acceso no autorizado. Solo los administradores pueden ver calificaciones de empresas."
        }), 403
    try:
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT
                e.nombre_empresa,
                r.id_empresa,
                ROUND(AVG(r.calificacion), 2) AS promedio_calificacion
            FROM RESENAS r
            JOIN EMPRESA e ON r.id_empresa = e.id
            GROUP BY e.nombre_empresa, r.id_empresa
        """)
        rows = cursor.fetchall()
        promedios = []
        for row in rows:
            promedio = {
                "nombre_empresa": row[0],
                "id_empresa": row[1],
                "promedio_calificacion": float(row[2])
            }
            promedios.append(promedio)
        cursor.close()
        connection.close()
        return jsonify(promedios), 200
    except Exception as e:
        print("ERROR EN /api/user/company/ratings:", e)
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/admin/report/empresa-mas-reportes', methods=['GET'])
@flask_login.login_required
def empresa_mas_reportes():
    if flask_login.current_user.tipo != 'admin':
        return jsonify({"status": "error", "message": "Acceso no autorizado"}), 403
    try:
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT e.id, e.nombre_empresa, COUNT(*) AS total_reportes
            FROM REPORTE_EMPRESA r
            JOIN EMPRESA e ON r.id_reportado = e.id
            GROUP BY e.id, e.nombre_empresa
            ORDER BY total_reportes DESC
            FETCH FIRST 1 ROWS ONLY
        """)
        row = cursor.fetchone()
        cursor.close()
        connection.close()
        if not row:
            return jsonify({"status": "success", "empresa": None, "message": "No hay reportes registrados"}), 200
        return jsonify({
            "status": "success",
            "empresa": {
                "id": row[0],
                "nombre_empresa": row[1],
                "total_reportes": row[2]
            }
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/api/admin/report/empresa-mejor-promedio', methods=['GET'])
@flask_login.login_required
def empresa_mejor_promedio_resenas():
    if flask_login.current_user.tipo != 'admin':
        return jsonify({"status": "error", "message": "Acceso no autorizado"}), 403
    try:
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT e.id, e.nombre_empresa, ROUND(AVG(r.calificacion),2) AS promedio
            FROM RESENAS r
            JOIN EMPRESA e ON r.id_empresa = e.id
            GROUP BY e.id, e.nombre_empresa
            HAVING COUNT(r.id_resena) > 0
            ORDER BY promedio DESC
            FETCH FIRST 1 ROWS ONLY
        """)
        row = cursor.fetchone()
        cursor.close()
        connection.close()
        if not row:
            return jsonify({"status": "success", "empresa": None, "message": "No hay reseñas registradas"}), 200
        return jsonify({
            "status": "success",
            "empresa": {
                "id": row[0],
                "nombre_empresa": row[1],
                "promedio_calificacion": float(row[2])
            }
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/admin/report/empresa-mejor-salario', methods=['GET'])
@flask_login.login_required
def empresa_mejor_salario():
    if flask_login.current_user.tipo != 'admin':
        return jsonify({"status": "error", "message": "Acceso no autorizado"}), 403
    try:
        connection = get_oracle_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT e.id, e.nombre_empresa, MAX(p.sueldo_mensual) AS salario_maximo
            FROM PUESTO_TRABAJO p
            JOIN EMPRESA e ON p.id_empresa = e.id
            GROUP BY e.id, e.nombre_empresa
            ORDER BY salario_maximo DESC
            FETCH FIRST 1 ROWS ONLY
        """)
        row = cursor.fetchone()
        cursor.close()
        connection.close()
        if not row:
            return jsonify({"status": "success", "empresa": None, "message": "No hay salarios registrados"}), 200
        return jsonify({
            "status": "success",
            "empresa": {
                "id": row[0],
                "nombre_empresa": row[1],
                "salario_maximo": float(row[2])
            }
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
 

@app.route('/api/empresa/aplicaciones-finalistas', methods=['GET'])
@flask_login.login_required
def ver_aplicaciones_finalistas_empresa():
    if flask_login.current_user.tipo != 'empresa':
        return jsonify({"status": "error", "message": "Acceso no autorizado"}), 403
    try:
        connection = get_oracle_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT u.id AS id_usuario,
                u.nombre || ' ' || u.apellidos AS nombre_completo,
                a.estado_proceso
            FROM APLICACIONES a
            JOIN USUARIO u ON a.id_usuario = u.id
            JOIN PUESTO_TRABAJO p ON a.id_puesto = p.id
            WHERE p.id_empresa = :id_empresa
            AND a.estado_proceso IN ('Finalista', 'Proceso Finalizado')
        """, {'id_empresa': flask_login.current_user.id })
        rows = cursor.fetchall()
        cursor.close()
        connection.close()
        aplicaciones = [
            {
                "id_usuario": row[0],
                "nombre_completo": row[1],
                "estado_proceso": row[2]
            }
            for row in rows
        ]
        return jsonify({"status": "success", "aplicaciones": aplicaciones}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



# Método que verifica el id más alto y desde ahí asigna el siguiente para el usuario
def sincronizar_secuencia_usuario():
    connection = get_oracle_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT NVL(MAX(id), 0) FROM USUARIO")
        max_id = cursor.fetchone()[0]
        print(max_id)
        nuevo_inicio = max_id + 1

        # Eliminar secuencia si existe
        try:
            cursor.execute("DROP SEQUENCE usuario_id_seq")
        except Exception:
            pass  # Si no existe, ignorar error

        # Crear secuencia sin cache, START WITH max_id + 1
        cursor.execute(f"""
            CREATE SEQUENCE usuario_id_seq
            START WITH {nuevo_inicio}
            INCREMENT BY 1
            NOCACHE
            NOCYCLE
        """)
        connection.commit()

        print(f"[SYNC_SIMPLE] Secuencia reiniciada en {nuevo_inicio}")

    finally:
        cursor.close()
        connection.close()

def sincronizar_secuencia_puesto():
    connection = get_oracle_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT NVL(MAX(id), 0) FROM PUESTO_TRABAJO")
        max_id = cursor.fetchone()[0]
        print(max_id)
        nuevo_inicio = max_id + 1

        # Eliminar secuencia si existe
        try:
            cursor.execute("DROP SEQUENCE puesto_trabajo_id_seq")
        except Exception:
            pass  # Si no existe, ignorar error

        # Crear secuencia sin cache, START WITH max_id + 1
        cursor.execute(f"""
            CREATE SEQUENCE puesto_trabajo_id_seq
            START WITH {nuevo_inicio}
            INCREMENT BY 1
            NOCACHE
            NOCYCLE
        """)
        connection.commit()

        print(f"[SYNC_SIMPLE] Secuencia reiniciada en {nuevo_inicio}")

    finally:
        cursor.close()
        connection.close()

def sincronizar_secuencia_aplicacion():
    connection = get_oracle_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT NVL(MAX(id), 0) FROM APLICACIONES")
        max_id = cursor.fetchone()[0]
        print(max_id)
        nuevo_inicio = max_id + 1

        # Eliminar secuencia si existe
        try:
            cursor.execute("DROP SEQUENCE aplicaciones_id_seq")
        except Exception:
            pass  # Si no existe, ignorar error

        # Crear secuencia sin cache, START WITH max_id + 1
        cursor.execute(f"""
            CREATE SEQUENCE aplicaciones_id_seq
            START WITH {nuevo_inicio}
            INCREMENT BY 1
            NOCACHE
            NOCYCLE
        """)
        connection.commit()

        print(f"[SYNC_SIMPLE] Secuencia reiniciada en {nuevo_inicio}")

    finally:
        cursor.close()
        connection.close()

def sincronizar_secuencia_empresa():
    connection = get_oracle_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT NVL(MAX(id), 0) FROM EMPRESA")
        max_id = cursor.fetchone()[0]
        print(max_id)
        nuevo_inicio = max_id + 1

        # Eliminar secuencia si existe
        try:
            cursor.execute("DROP SEQUENCE empresa_id_seq")
        except Exception:
            pass  # Si no existe, ignorar error

        # Crear secuencia sin cache, START WITH max_id + 1
        cursor.execute(f"""
            CREATE SEQUENCE empresa_id_seq
            START WITH {nuevo_inicio}
            INCREMENT BY 1
            NOCACHE
            NOCYCLE
        """)
        connection.commit()

        print(f"[SYNC_SIMPLE] Secuencia reiniciada en {nuevo_inicio}")

    finally:
        cursor.close()
        connection.close()


if __name__ == "__main__":
    sincronizar_secuencia_usuario()
    sincronizar_secuencia_puesto()
    sincronizar_secuencia_aplicacion()
    sincronizar_secuencia_empresa()
    app.run(host="0.0.0.0", port=5000, debug=True)
