import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import './style.css';

const Registrar_Usuario = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);


  const registraUsuario = async () => {

  var nombre = document.getElementById("nombre").value.trim();
  var apellido = document.getElementById("apellido").value.trim();
  var cui = document.getElementById("cui").value.trim();
  var genero = document.getElementById("genero").value.trim();
  var direccion = document.getElementById("direccion").value.trim();
  var telefono = document.getElementById("telefono").value.trim();
  var fecha = document.getElementById("fecha").value.trim();
  var correo = document.getElementById("correo").value.trim();
  var contrasena = document.getElementById("contrasena").value.trim();

  var val0 = !nombre || !apellido || !cui || !genero;
  var val1 = !direccion || !telefono || !fecha || !correo;
  var val2 = !contrasena; 

    if (val0||val1||val2) {
      setError('Falta un campo para llenar!');
      return;
    }


    var retorno = {
    "nombre": nombre,
    "apellidos": apellido,
    "genero": genero,
    "cui": cui,
    "direccion": direccion,
    "telefono": telefono,
    "fecha_nacimiento": fecha,
    "correo": correo,
    "contrasena": contrasena
  }


  console.log(retorno)

    //try {
      const response = await fetch('http://127.0.0.1:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(retorno),
      });
  /*
      if (response.ok) {
        const data = await response.json();
        //setJob(data);
      } else {
        const err = await response.json();
        setError(err.message || 'Error la ingresar el usuario');
      }
  } catch (e) {
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
      <div class="tab active">Usuario</div>

      <form>
        <label>Nombre:</label>
        <input type="text" name="nombre" id="nombre"  required />

        <label>Apellidos:</label>
        <input type="text" name="apellidos" id="apellido" required />

        <label>CUI:</label>
        <input type="text" name="cui" id="cui" required />

        <label>Género:</label>
        <input type="text" name="genero" id="genero" required />

        <label>Dirección:</label>
        <input type="text" name="direccion" id="direccion" required />

        <label>Teléfono:</label>
        <input type="tel" name="telefono" id="telefono" required />

        <label>Fecha de nacimiento:</label>
        <input type="date" name="fecha" id="fecha" required />

        <label>Correo electrónico:</label>
        <input type="email" name="correo" id="correo" required />

        <label>Contraseña:</label>
        <input type="password" name="contrasena" id="contrasena" required />

        <button type="submit" onClick={registraUsuario}>Crear usuario</button>
      </form>
    </div>
  </div>
  );
 
  
};

export default Registrar_Usuario;