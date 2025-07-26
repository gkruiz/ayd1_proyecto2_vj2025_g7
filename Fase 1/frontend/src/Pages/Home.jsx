import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    const containerStyle = {
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
    };

    const buttonStyle = {
        backgroundColor: '#3B82F6', 
        color: 'white',
        padding: '10px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '200px',
    };

    const buttonHoverStyle = {
        backgroundColor: '#2563EB', 
    };


    return (
        <div style={containerStyle}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Menú Principal</h1>

            <button
                style={buttonStyle}
                onMouseOver={e => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                onMouseOut={e => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
                onClick={() => navigate('/login')}
            >
                Login
            </button>

            <button
                style={buttonStyle}
                onMouseOver={e => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                onMouseOut={e => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
                onClick={() => navigate('/RegistrarUsuario')}
            >
                Registrar Usuario
            </button>

            <button
                style={buttonStyle}
                onMouseOver={e => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                onMouseOut={e => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
                 onClick={() => navigate('/RegistrarEmpresa')}
            >
                Registrar Empresa
            </button>
        </div>
    );
}
