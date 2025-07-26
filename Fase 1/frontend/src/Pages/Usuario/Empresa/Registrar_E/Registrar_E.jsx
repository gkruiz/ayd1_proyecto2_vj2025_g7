import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Registrar_Empresa = () => {
const navigate = useNavigate();
  const [error, setError] = useState(null);


  const registraEmpresa = async () => {

  var nombre = document.getElementById("nombre_empresa").value.trim();
  var nit = document.getElementById("nit").value.trim();
  var direccion = document.getElementById("direccion").value.trim();
  var telefono = document.getElementById("telefono").value.trim();
  var giro = document.getElementById("giro_negocio").value.trim();
  var correo = document.getElementById("correo").value.trim();
  var contrasena = document.getElementById("contrasena").value.trim();

  var val0 = !nombre || !nit || !direccion || !telefono;
  var val1 = !giro || !correo || !contrasena 

    if (val0||val1) {
      setError('Falta un campo para llenar!');
      return;
    }


    var retorno ={
    "nombre_empresa": nombre,
    "nit": nit,
    "direccion": direccion,
    "telefono": telefono,
    "giro_negocio": giro,
    "correo": correo,
    "contrasena": contrasena
  }



  console.log(retorno)

    //try {
      const response = await fetch('http://127.0.0.1:5000/api/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(retorno),
      });

      if (response.ok) {
        const data = await response.json();
        //setJob(data);
      } else {
        const err = await response.json();
        setError(err.message || 'Error la ingresar el usuario');
      }
    /*} catch (e) {
      console.error('Error en búsqueda:', e);
      setError('Error de red. Intente nuevamente.');
    } finally {
      setLoading(false);
    }*/
  };





  return (<div class="form-wrapper">
    <div class="form-container">
      <h2>Regístrate</h2>
      <button onClick={() => navigate('/')}>Regresar</button>
      <div class="tab active">Empresa</div>

      <form>
        <label>Nombre:</label>
        <input type="text" name="nombre_empresa" id="nombre_empresa" required />

        <label>NIT:</label>
        <input type="text" name="nit" id="nit" required />

        <label>Dirección:</label>
        <input type="text" name="direccion" id="direccion" required />

        <label>Teléfono:</label>
        <input type="tel" name="telefono" id="telefono" required />

        <label>Giro de negocio:</label>
        <input type="text" name="giro_negocio" id="giro_negocio" required />

        <label>Correo electrónico:</label>
        <input type="email" name="correo" id="correo" required />

        <label>Contraseña:</label>
        <input type="password" name="contrasena" id="contrasena" required />

        <button type="submit"  onClick={registraEmpresa}>Crear Empresa</button>
      </form>
    </div>
  </div>
  );
};

export default Registrar_Empresa;