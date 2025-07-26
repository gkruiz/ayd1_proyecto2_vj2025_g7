 // Import your CSS styles

const NoAuth = () => {

  const redirect = (path) => {
    window.location.href = path;
  };

  return (
    <center>
    <div className="no-auth-container">
      <h1 className="no-auth-title">Acceso Denegado</h1>
      <p className="no-auth-message">No tienes permiso para acceder a esta página.</p>
      <button type="button" onClick={() => redirect("/")}>
      Ir al inicio
      <span className="no-auth-icon">🏠</span>
      </button>
    </div>
    </center>
  );
}
export default NoAuth;