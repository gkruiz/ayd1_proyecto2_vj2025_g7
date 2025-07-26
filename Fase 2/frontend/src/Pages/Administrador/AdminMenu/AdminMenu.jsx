import React, { useEffect } from "react";
import "./AdminMenu.css"; // Import your CSS styles
import { useNavigate } from 'react-router-dom';
const API_URL = "http://34.152.27.187:5000";

const AdminMenu = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
  }, []);

  // Placeholder: replace with real auth check
  const checkAdminAuth = () => {
    const isAdminLoggedIn = true; // Replace with actual logic
    if (!isAdminLoggedIn) {
      window.location.href = "/error"; // Redirect to error page
    }
  };
  const handleLogout = async () => {
        try {
            const response = await fetch(`${API_URL}/logout`, {
                method: 'POST',
            });
            const data = await response.json();
            if (response.ok && data.success) {
                alert("Sesión cerrada correctamente.");
                navigate('/');
            } else {
                alert("Error al cerrar sesión.");
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error en logout:", error);
            alert("Error al cerrar sesión.");
        }
    };

  const redirect = (path) => {
    window.location.href = path;
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Administrador</h1>
      <ul className="admin-menu">
        <li onClick={() => redirect("/admin/empresas")}>Empresas sin aprobar</li>
        <li onClick={() => redirect("/admin/empresas_aprobadas")}>Empresas aprobadas</li>
        <li onClick={() => redirect("/admin/usuarios")}>Ver usuarios</li>
        <li onClick={() => redirect("/reporte-usuario")}>Ver usuarios reportados</li>
        <li onClick={() => redirect("/report-company-summary")}>Ver empresas reportados</li>
        <li onClick={() => redirect("/average-qualification")}>Ver promedio de reseñas</li>
        <li onClick={() => redirect("/admin/reportes")}>Reportes generales</li>
        <li onClick={handleLogout}>Cerrar Sesión</li>

      </ul>
    </div>
  );
};

export default AdminMenu;
