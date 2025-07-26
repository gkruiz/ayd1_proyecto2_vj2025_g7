import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styleUsuario.css';
const API_URL = "http://34.152.27.187:5000";

const Registrar_Usuario = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cui, setCui] = useState('');
  const [genero, setGenero] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fecha, setFecha] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [dpi, setDpi] = useState('');
  const [foto, setFoto] = useState('');
  const limpiarCampos = () => {
    setNombre('');
    setApellido('');
    setCui('');
    setGenero('');
    setDireccion('');
    setTelefono('');
    setFecha('');
    setCorreo('');
    setContrasena('');
    setDpi('');
    setFoto('');
  };

  const registraUsuario = async () => {
    if (!nombre || !apellido || !cui || !genero || !direccion || !telefono || !fecha || !correo || !contrasena) {
      setError('¡Falta un campo por llenar!');
      return;
    }

    const retorno = {
      nombre,
      apellidos: apellido,
      genero,
      cui,
      direccion,
      telefono,
      fecha_nacimiento: fecha,
      correo,
      contrasena,
      dpi,
      foto
    };


    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(retorno),
      });

      if (response.ok) {
        alert("Usuario creado exitosamente.");
        limpiarCampos();
        setError(null);
      } else {
        const err = await response.json();
        setError(err.message || 'Error al ingresar el usuario');
      }
    } catch (e) {
      console.error('Error en registro:', e);
      setError('Error de red. Intente nuevamente.');
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2>Regístrate</h2>
        <button onClick={() => navigate('/')}>Regresar</button>
        <div className="tab active">Usuario</div>

        <form onSubmit={(e) => { e.preventDefault(); registraUsuario(); }}>
          {error && <div className="error">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Nombre:</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Apellidos:</label>
              <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>CUI:</label>
              <input type="text" value={cui} onChange={(e) => setCui(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Género:</label>
              <input type="text" value={genero} onChange={(e) => setGenero(e.target.value)} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Dirección:</label>
              <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Teléfono:</label>
              <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha de nacimiento:</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Correo electrónico:</label>
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Contraseña:</label>
              <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>DPI:</label>
              <input
                type="text"
                value={dpi}
                onChange={(e) => setDpi(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Foto:</label>
              <input
                type="text"
                value={foto}
                onChange={(e) => setFoto(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit">Crear usuario</button>
        </form>

      </div>
    </div>
  );
};

export default Registrar_Usuario;