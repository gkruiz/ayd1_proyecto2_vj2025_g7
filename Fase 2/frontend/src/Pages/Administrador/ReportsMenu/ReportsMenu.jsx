import React, { useEffect, useState } from "react";
import "./ReportsMenu.css";
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
const API_URL = "http://34.152.27.187:5000";
const ReportsMenu = () => {
  const [empresaSolicitudes, setEmpresaSolicitudes] = useState(null);
  const [empresaPublicaciones, setEmpresaPublicaciones] = useState(null);
  const [empresaMasReportes, setEmpresaMasReportes] = useState(null);
  const [empresaMejorPromedio, setEmpresaMejorPromedio] = useState(null);
  const [empresaMejorSalario, setEmpresaMejorSalario] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/admin/report/empresa-top-solicitudes`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setEmpresaSolicitudes(data.empresa);
        } else {
          setError("Error cargando empresa con más solicitudes.");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setError("Error de red al cargar solicitudes.");
      });

    fetch(`${API_URL}/api/admin/report/empresa-top-publicaciones`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setEmpresaPublicaciones(data.empresa);
        } else {
          setError("Error cargando empresa con más publicaciones.");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setError("Error de red al cargar publicaciones.");
      });

    fetch(`${API_URL}/api/admin/report/empresa-mas-reportes`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setEmpresaMasReportes(data.empresa);
        } else {
          setError("Error cargando empresa con más reportes.");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setError("Error de red al cargar reportes.");
      });

    fetch(`${API_URL}/api/admin/report/empresa-mejor-promedio`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setEmpresaMejorPromedio(data.empresa);
        } else {
          setError("Error cargando empresa con mejor promedio.");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setError("Error de red al cargar promedios.");
      });

    fetch(`${API_URL}/api/admin/report/empresa-mejor-salario`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setEmpresaMejorSalario(data.empresa);
        } else {
          setError("Error cargando empresa con mejor salario.");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setError("Error de red al cargar salarios.");
      });
  }, []);


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

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const margin = 14;

    doc.setFontSize(16);
    doc.setTextColor(20, 40, 80);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte General de Empresas', margin, y);
    doc.setLineWidth(0.5);
    doc.line(margin, y + 3, margin + 100, y + 3);
    y += 12;

    const sections = [
      {
        title: "Empresa con más solicitudes de empleo",
        data: empresaSolicitudes,
        fields: [
          ["ID", formatText(empresaSolicitudes?.id)],
          ["Nombre", formatText(empresaSolicitudes?.nombre_empresa)],
          ["Total de Solicitudes", formatText(empresaSolicitudes?.total_solicitudes)]
        ]
      },
      {
        title: "Empresa con más publicaciones de puestos",
        data: empresaPublicaciones,
        fields: [
          ["ID", formatText(empresaPublicaciones?.id)],
          ["Nombre", formatText(empresaPublicaciones?.nombre_empresa)],
          ["Total de Publicaciones", formatText(empresaPublicaciones?.total_puestos_publicados)]
        ]
      },
      {
        title: "Empresa con más reportes",
        data: empresaMasReportes,
        fields: [
          ["ID", formatText(empresaMasReportes?.id)],
          ["Nombre", formatText(empresaMasReportes?.nombre_empresa)],
          ["Total de Reportes", formatText(empresaMasReportes?.total_reportes)]
        ]
      },
      {
        title: "Empresa con mejor promedio en reseñas",
        data: empresaMejorPromedio,
        fields: [
          ["ID", formatText(empresaMejorPromedio?.id)],
          ["Nombre", formatText(empresaMejorPromedio?.nombre_empresa)],
          ["Promedio de Calificación", formatText(empresaMejorPromedio?.promedio_calificacion)]
        ]
      },
      {
        title: "Empresa que ofrece el salario más alto",
        data: empresaMejorSalario,
        fields: [
          ["ID", formatText(empresaMejorSalario?.id)],
          ["Nombre", formatText(empresaMejorSalario?.nombre_empresa)],
          ["Salario Máximo", formatSalary(empresaMejorSalario?.salario_maximo)]
        ]
      }
    ];

    doc.setFontSize(13);

    sections.forEach((section, idx) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 120);
      doc.text(section.title, margin, y);
      y += 7;
      doc.setFontSize(11);
      doc.setTextColor(40);

      if (section.data) {
        section.fields.forEach(([label, value]) => {
          doc.setFont('helvetica', 'bold');
          doc.text(`${label}:`, margin, y);
          doc.setFont('helvetica', 'normal');
          doc.text(String(value), margin + 50, y);
          y += 7;
        });
        y += 4;
      } else {
        doc.setFont('helvetica', 'normal');
        doc.text("No hay datos registrados.", margin, y);
        y += 10;
      }

      if (y > 260 && idx < sections.length - 1) {
        doc.addPage();
        y = 20;
      }
    });

    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Impreso el ${new Date().toLocaleDateString()}`, margin, 285);

    doc.save("reporte_empresas.pdf");
  };

  return (
    <div className="container">
      <h1 className="titulo">Reportes Generales de Empresas</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="card">
        <div className="header">
          <button onClick={() => navigate('/admin_menu')} className="report-btn volver">Volver al menú</button>
          <button onClick={handleDownloadPDF} className="btn-pdf">Descargar PDF</button>
        </div>

        <div className="formulario">
          <div className="report-section">
            <h2>Empresa con más solicitudes de empleo</h2>
            {empresaSolicitudes ? (
              <div className="report-card">
                <p><strong>ID:</strong> {empresaSolicitudes.id}</p>
                <p><strong>Nombre:</strong> {empresaSolicitudes.nombre_empresa}</p>
                <p><strong>Total de Solicitudes:</strong> {empresaSolicitudes.total_solicitudes}</p>
              </div>
            ) : (
              <p>No hay solicitudes registradas.</p>
            )}
          </div>

          <div className="report-section">
            <h2>Empresa con más publicaciones de puestos</h2>
            {empresaPublicaciones ? (
              <div className="report-card">
                <p><strong>ID:</strong> {empresaPublicaciones.id}</p>
                <p><strong>Nombre:</strong> {empresaPublicaciones.nombre_empresa}</p>
                <p><strong>Total de Publicaciones:</strong> {empresaPublicaciones.total_puestos_publicados}</p>
              </div>
            ) : (
              <p>No hay publicaciones registradas.</p>
            )}
          </div>

          <div className="report-section">
            <h2>Empresa con más reportes</h2>
            {empresaMasReportes ? (
              <div className="report-card">
                <p><strong>ID:</strong> {empresaMasReportes.id}</p>
                <p><strong>Nombre:</strong> {empresaMasReportes.nombre_empresa}</p>
                <p><strong>Total de Reportes:</strong> {empresaMasReportes.total_reportes}</p>
              </div>
            ) : (
              <p>No hay reportes registrados.</p>
            )}
          </div>

          <div className="report-section">
            <h2>Empresa con mejor promedio en reseñas</h2>
            {empresaMejorPromedio ? (
              <div className="report-card">
                <p><strong>ID:</strong> {empresaMejorPromedio.id}</p>
                <p><strong>Nombre:</strong> {empresaMejorPromedio.nombre_empresa}</p>
                <p><strong>Promedio de Calificación:</strong> {empresaMejorPromedio.promedio_calificacion}</p>
              </div>
            ) : (
              <p>No hay reseñas registradas.</p>
            )}
          </div>

          <div className="report-section">
            <h2>Empresa que ofrece el salario más alto</h2>
            {empresaMejorSalario ? (
              <div className="report-card">
                <p><strong>ID:</strong> {empresaMejorSalario.id}</p>
                <p><strong>Nombre:</strong> {empresaMejorSalario.nombre_empresa}</p>
                <p><strong>Salario Máximo:</strong> Q. {empresaMejorSalario.salario_maximo}</p>
              </div>
            ) : (
              <p>No hay salarios registrados.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsMenu;