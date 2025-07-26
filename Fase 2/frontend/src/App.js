
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import CargarENV from './Pages/Administrador/CargarEnv/CargarEnv';
import AdminMenu from './Pages/Administrador/AdminMenu/AdminMenu';
import EmpresasTabla from './Pages/Administrador/EmpresaTabla/EmpresaTabla';
import ReportsMenu from './Pages/Administrador/ReportsMenu/ReportsMenu';
import UsuariosTabla from './Pages/Administrador/UsuarioTabla/UsuarioTabla';
import NoAuth from './Pages/NoAuth';
import Login from './Pages/Login';
import EmpresasAprobadas from './Pages/Administrador/EmpresasAprobadas/EmpresasAprobadas';

import HistorialOfertas from './Pages/Usuario/Empresa/HistorialOfertas/HistorialOfertas'
import Home from './Pages/Home';
import InicioUsuario from './Pages/Usuario/Trabajador/Inicio/Inicio';
import AplicacionUsuario from './Pages/Usuario/Trabajador/Aplicacion/Aplicacion';
import TrabajosUsuario from './Pages/Usuario/Trabajador/Trabajos/Trabajos';
import ActualizarOferta from './Pages/Usuario/Empresa/ActualizarOferta/ActualizarOferta'

import SolicitudesEmpresa from './Pages/Usuario/Empresa/Solicitudes/Solicitudes';
import RegistrarUsuario from './Pages/Usuario/Trabajador/Registrar_U/Registrar_U';
import RegistrarEmpresa from './Pages/Usuario/Empresa/Registrar_E/Registrar_E';
import MenuEmpresa from './Pages/Usuario/Empresa/Menu/MenuEmpresa';
import RegistroPuesto from './Pages/Usuario/Empresa/RegistroPuesto/RegistrroPuesto'
import ForgotPassword from './Pages/ForgotPassword';
import ActualizarUsuario from './Pages/Usuario/Trabajador/ActualizarUsuario/ActualizarUsuario'
import BuscarEmpresas from './Pages/Usuario/Trabajador/BuscarEmpresa/BuscarEmpresa'
import CrearResena from './Pages/Usuario/Trabajador/CrearReseña/CrearResena'
import VerResenas from './Pages/Usuario/Trabajador/VerResenas/VerResenas';
import ReporteEmpresa from './Pages/Administrador/Reporte_Empresa/reporte_empresa'
import ReporteUsuario from './Pages/Administrador/Reporte_Usuario/reporte_usuario'
import ActualizarEmpresa from './Pages/Usuario/Empresa/ActualizarEmpresa/ActualizarEmpresa';
import BuscarPuesto from './Pages/Usuario/Empresa/BuscarPuesto/BuscarPuesto';
import CalificacionEmpresa from './Pages/Administrador/CalificaciónEmpresa/CalificacionEmpresa';
import ReportarEmpresa from './Pages/Usuario/Trabajador/ReportarEmpresa/ReportarEmpresa';
import ReportarUsuario from './Pages/Usuario/Empresa/ReportarUsuario/ReportarUsuario'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="InicioUsuario" element={<InicioUsuario />} />
            <Route path="AplicacionUsuario" element={<AplicacionUsuario />} />
            <Route path="aplicaciones" element={<TrabajosUsuario />} />
            <Route path="RegistrarUsuario" element={<RegistrarUsuario />} />
            <Route path="Menu-Empresa" element={<MenuEmpresa />} />
            <Route path="Registrar-Puesto" element={<RegistroPuesto />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="update-user" element={<ActualizarUsuario />} />
            <Route path="empresas-activas" element={<BuscarEmpresas />} />
            <Route path="crear-resena" element={<CrearResena />} />
            <Route path="ver-resena" element={<VerResenas />} />
            <Route path="reporte-usuario" element={<ReporteUsuario />} />
            <Route path="HistorialOfertas" element={<HistorialOfertas />} />
            <Route path="average-qualification" element={<CalificacionEmpresa />} />
            <Route path="report-company" element={<ReportarEmpresa />} />
            <Route path="report-company-summary" element={<ReporteEmpresa />} />
            <Route path="report-user" element={<ReportarUsuario />} />

            <Route path="SolicitudesEmpresa" element={<SolicitudesEmpresa />} />
            <Route path="RegistrarEmpresa" element={<RegistrarEmpresa />} />
            <Route path="RegistrarEmpresa" element={<RegistrarEmpresa />} />
            <Route path="update-job" element={<ActualizarOferta/>}/>
            <Route path="update-company" element={<ActualizarEmpresa/>}/>
            <Route path="find-job" element={<BuscarPuesto/>}/>


            <Route path="cargar_env" element={<CargarENV />} />
            <Route path="admin_menu" element={<AdminMenu />} />
            <Route path="admin/empresas" element={<EmpresasTabla />} />
            <Route path="/admin/empresas_aprobadas" element={<EmpresasAprobadas />} />
            <Route path="admin/usuarios" element={<UsuariosTabla />} />
            <Route path="admin/reportes" element={<ReportsMenu />} />
            <Route path="login" element={<Login />} />
            <Route path="error" element={<NoAuth />} />

            {/* Placeholder for other admin routes */}
            <Route path="*" element={<center><h1>404 Not Found</h1></center>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
