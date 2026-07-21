import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-mark">ET</span>
        <span className="brand-text">
          <strong>Eventos Trujillo</strong>
          <small>Proveedores locales</small>
        </span>
      </Link>

      <nav className="navbar-nav">
        <Link to="/">Inicio</Link>
        <a href="#categorias">Categorias</a>
        <a href="#proveedores">Empresas</a>
      </nav>

      <div className="navbar-actions">
        <Link to="/login" className="btn-login">
          Ingresar
        </Link>

        <Link to="/registro-empresa" className="btn-register">
          Registrar empresa
        </Link>
      </div>
    </header>
  );
}
