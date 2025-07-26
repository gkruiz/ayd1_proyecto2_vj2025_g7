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
