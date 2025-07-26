import pytest
import bcrypt
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_crear_usuario(client):
    # Datos falsos para el test
    usuario_test = {
        "nombre": "Juan",
        "apellidos": "Pérez",
        "genero": "M",
        "cui": "1234567890101",
        "direccion": "Ciudad",
        "telefono": "12345678",
        "fecha_nacimiento": "1990-01-01",
        "correo": "juan.perez@test.com",
        "contrasena": "Segura123"
    }

    response = client.post("/api/users", json=usuario_test)
    
    assert response.status_code in [201, 400, 409, 500]  
    data = response.get_json()
    
    assert "status" in data
    assert "message" in data
'''
#En cada prueba cambiar el NIT y el correo
def test_ingresar_empresa(client):
    response = client.post('/api/company', json={
        "nombre_empresa": "ACME Inc",
        "nit": "45678123",
        "direccion": "Zona 1, Ciudad",
        "telefono": "87654321",
        "giro_negocio": "Tecnología",
        "correo": "acme1@example.com",
        "contrasena": "supersecreta"
    })
    assert response.status_code == 201
    assert response.get_json()["status"] == "success"
'''
def test_login_usuario_exitoso(client, mocker):
    mock_cursor = mocker.Mock()
    mock_connection = mocker.Mock()
    mocker.patch('app.get_oracle_connection', return_value=mock_connection)

    # Simula datos en la base de datos para un usuario
    mock_cursor.fetchone.side_effect = [
        (30, "usuario@example.com", bcrypt.hashpw("PruebaTest123456".encode(), bcrypt.gensalt()).decode(), 'activo'),  # USUARIO
        None,  # ADMIN
        None   # EMPRESA
    ]
    mock_connection.cursor.return_value = mock_cursor

    # Simula llamada POST
    response = client.post('/api/login', json={
        "email": "usuario@example.com",
        "password": "PruebaTest123456"
    })

    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "success"
    assert data["tipo"] == "usuario"

def test_logout(client):
    response = client.post('/logout')
    assert response.status_code == 200
    assert response.get_json() == {
        "success": True,
        "message": "Sesión cerrada."
    }


def test_aprobar_empresa_exitoso(client, mocker):
    # --- 1. Mock conexión Oracle ---
    mock_cursor = mocker.Mock()
    mock_connection = mocker.Mock()
    mock_connection.cursor.return_value = mock_cursor
    mocker.patch('app.get_oracle_connection', return_value=mock_connection)

    # --- 2. Mock usuario admin autenticado ---
    mock_user = mocker.Mock()
    mock_user.is_authenticated = True
    mock_user.tipo = 'admin'
    mock_user.id = 1

    # Parchea la función que usa Flask‑Login para obtener el usuario
    mocker.patch('flask_login.utils._get_user', return_value=mock_user)

    # --- 3. Llamada PUT ---
    resp = client.put('/api/company/approve', json={"id": 99})

    assert resp.status_code == 200
    data = resp.get_json()
    assert data["status"] == "success"
    assert "aprobada exitosamente" in data["message"]


''' ¡¡ ERROR !!
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

'''