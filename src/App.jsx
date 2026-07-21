import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import Home from './pages/Home';
import EmpresaDetalle from './pages/EmpresaDetalle';
import DashboardEmpresa from './pages/DashboardEmpresa';
import Login from './pages/Login';
import RegistroEmpresa from './pages/RegistroEmpresa';
import CategoriaEmpresas from './pages/CategoriaEmpresas';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Planes from './pages/Planes';
import PagoPlan from './pages/PagoPlan';
import RecuperarPassword from './pages/RecuperarPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/empresa/:id" element={<EmpresaDetalle />} />

        <Route path="/dashboard" element={<DashboardEmpresa />} />

        <Route path="/login" element={<Login />} />

        <Route path="/registro-empresa" element={<RegistroEmpresa />} />

        <Route path="/categoria/:categoria" element={<CategoriaEmpresas />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/admin" element={<Admin />} />

        <Route path="/planes" element={<Planes />} />

        <Route path="/pago-plan/:plan" element={<PagoPlan />} />

        <Route path="/recuperar-password" element={<RecuperarPassword/>} />

        <Route path="/reset-password/:token" element={<ResetPassword/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;