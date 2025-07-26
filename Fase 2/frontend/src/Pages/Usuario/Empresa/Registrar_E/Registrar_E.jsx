import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styleEmpresa.css';
const API_URL = "http://34.152.27.187:5000";
const Registrar_Empresa = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const [nombre, setNombre] = useState('');
  const [nit, setNit] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [giro, setGiro] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [foto, setFoto] = useState('');

  const limpiarCampos = () => {
    setNombre('');
    setNit('');
    setDireccion('');
    setTelefono('');
    setGiro('');
    setCorreo('');
    setContrasena('');
    setFoto('');
  };


  const registraEmpresa = async () => {
    if (!nombre || !nit || !direccion || !telefono || !giro || !correo || !contrasena || !foto) {
      setError('Falta un campo por llenar!');
      return;
    }

    const retorno = {
      nombre_empresa: nombre,
      nit,
      direccion,
      telefono,
      giro_negocio: giro,
      correo,
      contrasena,
      foto
    };


    try {
      const response = await fetch(`${API_URL}/api/company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(retorno),
      });

      if (response.ok) {
        alert("Empresa creada exitosamente.");
        limpiarCampos();
        setError(null);
      } else {
        const err = await response.json();
        setError(err.message || 'Error al ingresar la empresa');
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
        <div className="tab active">Empresa</div>

        <form onSubmit={(e) => { e.preventDefault(); registraEmpresa(); }}>
          {error && <div className="error">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Nombre:</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>NIT:</label>
              <input type="text" value={nit} onChange={(e) => setNit(e.target.value)} required />
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
              <label>Giro de negocio:</label>
              <input type="text" value={giro} onChange={(e) => setGiro(e.target.value)} required />
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
            <div className="form-group" style={{ flex: 1 }}>
              <label>Foto:</label>
              <input
                type="text"
                value={foto}
                onChange={(e) => setFoto(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit">Crear Empresa</button>
        </form>
      </div>
    </div>
  );
};

export default Registrar_Empresa;
