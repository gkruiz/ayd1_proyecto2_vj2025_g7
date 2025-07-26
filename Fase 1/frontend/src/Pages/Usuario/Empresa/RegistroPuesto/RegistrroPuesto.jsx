import React, { useState } from 'react';

const PublicarPuesto = () => {
    const [formulario, setFormulario] = useState({
        nombre_puesto: '',
        ubicacion_fisica: '',
        sueldo_mensual: '',
        tipo_contrato: 'indefinido',
        jornada_laboral: 'tiempo completo',
        modalidad_trabajo: 'presencial',
        descripcion: '',
        educacion_minima: '',
        anios_experiencia: '',
        idiomas: '',
        rango_edad: '',
        area: ''
    });

    const [mensaje, setMensaje] = useState('');

    const handleChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');

        try {
            const response = await fetch('http://127.0.0.1:5000/api/company/job', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formulario)
            });

            const data = await response.json();
            if (response.ok) {
                setMensaje(data.message);
            } else {
                setMensaje(data.message);
            }
        } catch (error) {
            setMensaje(' Error al conectar con el servidor.');
        }
    };

    return (
        <div className="container">
            <h2>Publicar Puesto de Trabajo</h2>
            <a href="/Menu-Empresa" className="volver">Volver al inicio</a>        
            <form onSubmit={handleSubmit}>
                <input
                    name="nombre_puesto"
                    placeholder="Nombre del puesto"
                    onChange={handleChange}
                    required
                />
                <input
                    name="ubicacion_fisica"
                    placeholder="Ubicación física"
                    onChange={handleChange}
                    required
                />
                <input
                    name="sueldo_mensual"
                    placeholder="Sueldo mensual"
                    type="number"
                    onChange={handleChange}
                    required
                />
                <select name="tipo_contrato" onChange={handleChange}>
                    <option value="indefinido">Indefinido</option>
                    <option value="temporal">Temporal</option>
                </select>
                <select name="jornada_laboral" onChange={handleChange}>
                    <option value="tiempo completo">Tiempo completo</option>
                    <option value="medio tiempo">Medio tiempo</option>
                </select>
                <select name="modalidad_trabajo" onChange={handleChange}>
                    <option value="presencial">Presencial</option>
                    <option value="remoto">Remoto</option>
                    <option value="híbrido">Híbrido</option>
                </select>
                <textarea
                    name="descripcion"
                    placeholder="Descripción del puesto"
                    onChange={handleChange}
                    required
                />
                <input
                    name="educacion_minima"
                    placeholder="Educación mínima"
                    onChange={handleChange}
                />
                <input
                    name="anios_experiencia"
                    placeholder="Años de experiencia"
                    type="number"
                    onChange={handleChange}
                />
                <input
                    name="idiomas"
                    placeholder="Idiomas requeridos"
                    onChange={handleChange}
                />
                <input
                    name="rango_edad"
                    placeholder="Rango de edad"
                    onChange={handleChange}
                />
                <input
                    name="area"
                    placeholder="Área"
                    onChange={handleChange}
                    required
                />

                <button type="submit">Publicar</button>
            </form>
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
};

export default PublicarPuesto;
