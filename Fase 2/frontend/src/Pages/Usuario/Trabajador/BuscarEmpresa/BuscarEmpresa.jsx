import React, { useState, useEffect } from 'react';
import './style-empresa-activa.css';
import jsPDF from 'jspdf';
const API_URL = "http://34.152.27.187:5000";
const BuscarEmpresaYAplicar = () => {
    const [companies, setCompanies] = useState([]);
    const [puestos, setPuestos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingPuestos, setLoadingPuestos] = useState(false);
    const [error, setError] = useState(null);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
    const [puestoSeleccionado, setPuestoSeleccionado] = useState(null);
    const [loadingDetalle, setLoadingDetalle] = useState(false);
    const [cv, setCv] = useState('');
    const [successMsg, setSuccessMsg] = useState(null);
    const [errorAplicar, setErrorAplicar] = useState(null);

    const fetchCompanies = async () => {
        setLoading(true);
        setError(null);
        try {
            const resp = await fetch(`${API_URL}/api/user/company/approved`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            if (resp.ok) {
                const data = await resp.json();
                setCompanies(data);
            } else {
                const err = await resp.json();
                setError(err.message || 'Error al obtener empresas');
            }
        } catch (e) {
            setError('Error de red. No se pudieron cargar las empresas.');
        } finally {
            setLoading(false);
        }
    };
    const fetchPuestos = async (empresaId) => {
        setLoadingPuestos(true);
        setError(null);
        setPuestos([]);
        setEmpresaSeleccionada(empresaId);
        setPuestoSeleccionado(null);
        setSuccessMsg(null);
        setErrorAplicar(null);
        setCv('');
        try {
            const resp = await fetch(`${API_URL}/api/user/company/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ empresa_id: empresaId }),
            });
            if (resp.ok) {
                const data = await resp.json();
                setPuestos(data);
            } else {
                const err = await resp.json();
                setError(err.message || 'Error al obtener puestos');
            }
        } catch (e) {
            setError('Error de red al obtener puestos');
        } finally {
            setLoadingPuestos(false);
        }
    };

    const seleccionarPuesto = (p) => {
        setPuestoSeleccionado(p);
        setSuccessMsg(null);
        setErrorAplicar(null);
        setCv('');
    };
    const aplicarTrabajo = async () => {
        if (!cv.trim()) {
            setErrorAplicar('Por favor, ingrese su CV antes de aplicar.');
            return;
        }
        if (!puestoSeleccionado) {
            setErrorAplicar('Seleccione un puesto antes de aplicar.');
            return;
        }
        setLoadingDetalle(true);
        setErrorAplicar(null);
        setSuccessMsg(null);
        try {
            const resp = await fetch(`${API_URL}/api/user/job/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    id: parseInt(puestoSeleccionado.id),
                    cv,
                }),
            });
            const result = await resp.json();
            if (resp.ok) {
                setSuccessMsg(result.message);
            } else {
                setErrorAplicar(result.message || 'No se pudo enviar la solicitud.');
            }
        } catch (e) {
            setErrorAplicar('Error de red. Intente nuevamente.');
        } finally {
            setLoadingDetalle(false);
        }
    };
    const generarPDF = () => {
        if (!puestoSeleccionado) return;
        const doc = new jsPDF();
        let y = 30;
        const margin = 14;
        const maxWidth = 180;
        doc.setFontSize(16);
        doc.setTextColor(20, 40, 80);
        doc.setFont('helvetica', 'bold');
        doc.text('Detalles del Puesto', margin, 20);
        doc.setLineWidth(0.5);
        doc.line(margin, 23, margin + 60, 23);
        const formatText = (text) => {
            if (!text) return 'No especificado';
            return text.toString()
                .replace(/[^\w\sáéíóúÁÉÍÓÚñÑ.,;:¿?¡!()@\-/]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        };
        const formatSalary = (salary) => {
            if (!salary) return 'No especificado';
            const num = parseFloat(salary.toString().replace(/[^\d.-]/g, ''));
            return isNaN(num) ? 'No especificado' : `Q. ${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        };
        const fields = [
            ['Nombre del puesto', formatText(puestoSeleccionado.nombre_puesto)],
            ['Ubicación', formatText(puestoSeleccionado.ubicacion_fisica)],
            ['Empresa', formatText(puestoSeleccionado.nombre_empresa)],
            ['Sueldo mensual', formatSalary(puestoSeleccionado.sueldo_mensual)],
            ['Tipo de contrato', formatText(puestoSeleccionado.tipo_contrato)],
            ['Jornada laboral', formatText(puestoSeleccionado.jornada_laboral)],
            ['Modalidad de trabajo', formatText(puestoSeleccionado.modalidad_trabajo)],
            ['Descripción', formatText(puestoSeleccionado.descripcion)],
            ['Educación mínima', formatText(puestoSeleccionado.educacion_minima)],
            ['Experiencia requerida', formatText(puestoSeleccionado.anios_experiencia)],
            ['Idiomas', formatText(puestoSeleccionado.idiomas)],
            ['Rango de edad', formatText(puestoSeleccionado.rango_edad)],
        ];
        doc.setFontSize(12);
        doc.setTextColor(40);
        for (let i = 0; i < fields.length; i++) {
            const [label, value] = fields[i];
            if (i % 2 === 0) {
                doc.setFillColor(245, 245, 255);
                doc.rect(margin - 2, y - 7, maxWidth + 4, 12, 'F');
            }
            doc.setFont('helvetica', 'bold');
            doc.text(`${label}:`, margin, y);
            doc.setFont('helvetica', 'normal');
            const splitText = doc.splitTextToSize(value, maxWidth - 50);
            doc.text(splitText, margin + 50, y);
            y += splitText.length * 7 + 6;
            if (y > 270 && i < fields.length - 1) {
                doc.addPage();
                y = 20;
            }
        }
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(`Impreso el ${new Date().toLocaleDateString()}`, margin, 285);
        doc.save(`Puesto_${formatText(puestoSeleccionado.nombre_puesto).substring(0, 20)}.pdf`);
    };
    useEffect(() => {
        fetchCompanies();
    }, []);
    return (
        <div className="container">
            <div className="header">
                <a href="/InicioUsuario" className="volver">Volver al inicio</a>
                <span className="icono-salida">⎋</span>
            </div>
            <h1 className="title">Empresas activas</h1>
            {loading && <p>Cargando empresas...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="tabla-scroll">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Nombre de la empresa</th>
                            <th>Dirección</th>
                            <th>Teléfono</th>
                            <th>Giro del Negocio</th>
                            <th>Correo</th>
                            <th>¿Aprobado?</th>
                            <th>¿Activo?</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.length === 0 && !loading ? (
                            <tr>
                                <td colSpan="10" style={{ textAlign: 'center' }}>No hay empresas disponibles</td>
                            </tr>
                        ) : (
                            companies.map((company, i) => (
                                <tr key={i}>
                                    <td>{company.nombre_empresa}</td>
                                    <td>{company.direccion}</td>
                                    <td>{company.telefono}</td>
                                    <td>{company.giro_negocio}</td>
                                    <td>{company.correo}</td>
                                    <td>{company.aprobado === '1' ? '✅' : company.aprobado}</td>
                                    <td>{company.activo === 'activo' ? '✅' : company.activo}</td>
                                    <td>
                                        <button onClick={() => fetchPuestos(company.id)}>Ver Puestos</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {empresaSeleccionada && (
                <div className="user-card" style={{ marginTop: 20 }}>
                    {loadingPuestos ? (
                        <p>Cargando puestos...</p>
                    ) : puestos.length > 0 ? (
                        <>
                        <h2>Puestos disponibles</h2>
                            <div className="tabla-scroll">
                                <table className="user-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre del Puesto</th>
                                            <th>Ubicación</th>
                                            <th>Salario</th>
                                            <th>Tipo Contrato</th>
                                            <th>Jornada</th>
                                            <th>Modalidad</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {puestos.map((p, i) => (
                                            <tr key={i}>
                                                <td>{p.id}</td>
                                                <td>{p.nombre_puesto}</td>
                                                <td>{p.ubicacion_fisica}</td>
                                                <td>{p.sueldo_mensual}</td>
                                                <td>{p.tipo_contrato}</td>
                                                <td>{p.jornada_laboral}</td>
                                                <td>{p.modalidad_trabajo}</td>
                                                <td>
                                                    <button onClick={() => seleccionarPuesto(p)}>Aplicar</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <p>No hay puestos disponibles para esta empresa.</p>
                    )}
                </div>
            )}

            {puestoSeleccionado && (
                <div className="user-card" style={{ marginTop: 20 }}>
                    <h2>Detalle del Puesto: {puestoSeleccionado.nombre_puesto}</h2>
                    {loadingDetalle && <p>Cargando detalles...</p>}
                    {errorAplicar && <p style={{ color: 'red' }}>{errorAplicar}</p>}
                    {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
                    <p><strong>Ubicación de la empresa:</strong> {puestoSeleccionado.ubicacion_fisica}</p>
                    <p><strong>Empresa que ofrece el puesto:</strong> {puestoSeleccionado.nombre_empresa}</p>
                    <p><strong>Sueldo ofrecido mensualmente:</strong> Q. {puestoSeleccionado.sueldo_mensual}</p>
                    <p><strong>Tipo de contrato:</strong> {puestoSeleccionado.tipo_contrato}</p>
                    <p><strong>Jornada laboral requerida:</strong> {puestoSeleccionado.jornada_laboral}</p>
                    <p><strong>Modalidad de trabajo:</strong> {puestoSeleccionado.modalidad_trabajo}</p>
                    <p><strong>Descripción:</strong> {puestoSeleccionado.descripcion}</p>
                    <p><strong>Educación mínima:</strong> {puestoSeleccionado.educacion_minima}</p>
                    <p><strong>Años de experiencia:</strong> {puestoSeleccionado.anios_experiencia}</p>
                    <p><strong>Idiomas solicitados:</strong> {puestoSeleccionado.idiomas}</p>
                    <p><strong>Rango de edad:</strong> {puestoSeleccionado.rango_edad}</p>

                    <label htmlFor="cv"><strong>CV:</strong></label>
                    <textarea
                        id="cv"
                        cols="30"
                        className="search-input"
                        placeholder="Ingrese el link de su CV (Debe estar subído a MEGA o Google Drive)"
                        value={cv}
                        onChange={(e) => setCv(e.target.value)}
                    ></textarea>

                    <button onClick={aplicarTrabajo} disabled={loadingDetalle} className="btn-aplicar" style={{ marginRight: 10 }}>
                        Enviar CV
                    </button>
                    <button onClick={generarPDF} className="btn-pdf">
                        Descargar información del puesto
                    </button>
                </div>
            )}
        </div>
    );
};

export default BuscarEmpresaYAplicar;
