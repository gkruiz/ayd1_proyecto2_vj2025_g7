import bcrypt
from datetime import datetime
from configuracion import get_oracle_connection

contra2fa = b"Contrasenasegura123AYD1"
hash_2fa = bcrypt.hashpw(contra2fa, bcrypt.gensalt())

print("Hash de la contraseña 2FA:", hash_2fa.decode())

with open('auth.ayd1', 'wb') as f:
    f.write(contra2fa)

def crear_admin(nombre, correo, contrasena_login, contrasena_2fa):
    try:
        hash_login = bcrypt.hashpw(contrasena_login.encode(), bcrypt.gensalt()).decode()
        hash_2fa = bcrypt.hashpw(contrasena_2fa.encode(), bcrypt.gensalt()).decode()

        connection = get_oracle_connection()
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO ADMINISTRADORES (nombre, correo, contrasena, contrasena_autenticada, fecha_creacion, fecha_actualizado)
            VALUES (:nombre, :correo, :contrasena, :contrasena_2fa, :fecha_creacion, :fecha_actualizado)
        """, {
            "nombre": nombre,
            "correo": correo,
            "contrasena": hash_login,
            "contrasena_2fa": hash_2fa,
            "fecha_creacion": datetime.now(),
            "fecha_actualizado": datetime.now()
        })

        connection.commit()
        cursor.close()
        connection.close()
        print("Administrador creado exitosamente.")
    except Exception as e:
        print("Error al crear administrador:", e)
        
        
crear_admin(
    nombre="admin",
    correo="admin@gmail.com",
    contrasena_login="ContrasenaSegura123",
    contrasena_2fa="Contrasenasegura123AYD1"
)