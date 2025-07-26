
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import CargarENV from './Pages/Administrador/CargarEnv/CargarEnv';
import AdminMenu from './Pages/Administrador/AdminMenu/AdminMenu';
import CompanyRequests from './Pages/Administrador/CompanyRequests/CompanyRequests';
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

import SolicitudesEmpresa from './Pages/Usuario/Empresa/Solicitudes/Solicitudes';
import RegistrarUsuario from './Pages/Usuario/Trabajador/Registrar_U/Registrar_U';
import RegistrarEmpresa from './Pages/Usuario/Empresa/Registrar_E/Registrar_E';
import MenuEmpresa from './Pages/Usuario/Empresa/Menu/MenuEmpresa';
import RegistroPuesto from './Pages/Usuario/Empresa/RegistroPuesto/RegistrroPuesto'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="InicioUsuario" element={<InicioUsuario />} />
            <Route path="AplicacionUsuario" element={<AplicacionUsuario />} />
            <Route path="TrabajosUsuario" element={<TrabajosUsuario />} />
            <Route path="RegistrarUsuario" element={<RegistrarUsuario />} />
            <Route path="Menu-Empresa" element={<MenuEmpresa />} />
            <Route path="Registrar-Puesto" element={<RegistroPuesto />} />

            <Route path="HistorialOfertas" element={<HistorialOfertas />} />

            <Route path="SolicitudesEmpresa" element={<SolicitudesEmpresa />} />
            <Route path="RegistrarEmpresa" element={<RegistrarEmpresa />} />


            <Route path="cargar_env" element={<CargarENV />} />
            <Route path="admin_menu" element={<AdminMenu />} />
            <Route path="admin/company_requests" element={<CompanyRequests />} />
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