import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async () => {
    if (!username || !password) {
        setError('El correo y la contraseña son obligatorios.');
        return;
    }

    setIsLoading(true);
    setError('');

    try {
        const response = await fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email: username, password }),
        });

        const data = await response.json();
        console.log('Respuesta del backend:', data);

        if (!response.ok) {
            setError(data.message || 'Error en el servidor');
            setIsLoading(false);
            return;
        }

        if (data.status !== 'success') {
            setError(data.message || 'Credenciales inválidas');
            setIsLoading(false);
            return;
        }

        console.log('Login successful:', data);
        alert('Login successful!');

        if (data.token) {
            localStorage.setItem('authToken', data.token);
            console.log(data.token);
        }

        switch (data.tipo) {
            case 'usuario':
                navigate('/InicioUsuario');
                break;
            case 'admin':
                console.log("Redirigiendo a menu del admin");
                navigate('/cargar_env');
                break;
            case 'empresa':
                navigate('/Menu-Empresa');
                break;
            default:
                setError('Usuario no reconocido en el sistema');
                break;
        }

    } catch (error) {
        console.error('Login error:', error);
        setError('Error de red. Inténtalo de nuevo.');
    } finally {
        setIsLoading(false);
    }
};


    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5'
        }}>
            <div style={{
                width: '300px',
                padding: '2rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                textAlign: 'center'
            }}>
                <h1>Login</h1>
                {error && (
                    <div style={{ color: 'red', marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}
                <div>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='E-mail'
                        disabled={isLoading}
                        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                        disabled={isLoading}
                        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                    />
                </div>
                <div>
                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                    >
                        {isLoading ? 'Iniciando...' : 'Login'}
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => navigate('/')}
                        style={{ width: '100%', padding: '0.5rem' }}
                    >
                        Regresar
                    </button>
                </div>
            </div>
        </div>
    );
}
