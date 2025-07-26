import React, { useState } from 'react';
import { Mail, AlertCircle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [emailSent, setEmailSent] = useState(false);

    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        },
        wrapper: {
            width: '100%',
            maxWidth: '24rem'
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            padding: '2rem'
        },
        header: {
            textAlign: 'center',
            marginBottom: '2rem'
        },
        iconContainer: {
            width: '4rem',
            height: '4rem',
            backgroundColor: '#dbeafe',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827',
            margin: '0 0 0.5rem'
        },
        subtitle: {
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0,
            lineHeight: '1.5'
        },
        formGroup: {
            marginBottom: '1.5rem'
        },
        label: {
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
        },
        inputContainer: {
            position: 'relative'
        },
        inputIcon: {
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            pointerEvents: 'none'
        },
        input: {
            width: '100%',
            paddingLeft: '2.5rem',
            paddingRight: '0.75rem',
            paddingTop: '0.625rem',
            paddingBottom: '0.625rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'all 0.2s',
            boxSizing: 'border-box'
        },
        inputFocus: {
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
        },
        inputDisabled: {
            backgroundColor: '#f9fafb',
            cursor: 'not-allowed'
        },
        message: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            lineHeight: '1.5'
        },
        messageSuccess: {
            backgroundColor: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0'
        },
        messageError: {
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca'
        },
        button: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1rem',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            outline: 'none'
        },
        buttonPrimary: {
            backgroundColor: '#2563eb',
            color: 'white'
        },
        buttonPrimaryHover: {
            backgroundColor: '#1d4ed8'
        },
        buttonSecondary: {
            backgroundColor: 'transparent',
            color: '#6b7280',
            border: 'none',
            fontSize: '0.875rem',
            padding: '0.5rem',
            marginTop: '1rem'
        },
        buttonSecondaryHover: {
            color: '#374151'
        },
        buttonDisabled: {
            opacity: 0.5,
            cursor: 'not-allowed'
        },
        successContainer: {
            textAlign: 'center'
        },
        successIconContainer: {
            width: '4rem',
            height: '4rem',
            backgroundColor: '#dcfce7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
        },
        successTitle: {
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            margin: '0 0 0.5rem'
        },
        successText: {
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: '0 0 1.5rem',
            lineHeight: '1.5'
        },
        emailDisplay: {
            backgroundColor: '#f3f4f6',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '1.5rem',
            textAlign: 'center',
            wordBreak: 'break-all'
        },
        backLink: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: '#2563eb',
            fontSize: '0.875rem',
            textDecoration: 'none',
            cursor: 'pointer'
        },
        backLinkHover: {
            color: '#1d4ed8',
            textDecoration: 'underline'
        }
    };

    const handleInputChange = (e) => {
        setEmail(e.target.value);
        if (message.text) {
            setMessage({ type: '', text: '' });
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setMessage({ type: 'error', text: 'Por favor ingrese su dirección de correo electrónico' });
            return;
        }

        if (!validateEmail(email)) {
            setMessage({ type: 'error', text: 'Por favor ingrese una dirección de correo válida' });
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: '', text: '' });

            const response = await fetch('http://127.0.0.1:5000/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim()
                })
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                setEmailSent(true);
                setMessage({ type: 'success', text: data.message });
            } else {
                setMessage({
                    type: 'error',
                    text: data.message === 'Email not found'
                        ? 'No se encontró una cuenta con esta dirección de correo'
                        : data.message || 'Error al enviar el correo'
                });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión al servidor. Intente nuevamente.' });
            console.error('Forgot password error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        window.location.href = '/login';
    };

    const [inputFocused, setInputFocused] = useState(false);

    if (emailSent) {
        return (
            <div style={styles.container}>
                <div style={styles.wrapper}>
                    <div style={styles.card}>
                        <div style={styles.successContainer}>
                            <div style={styles.successIconContainer}>
                                <CheckCircle size={32} color="#16a34a" />
                            </div>
                            <h2 style={styles.successTitle}>Correo Enviado</h2>
                            <p style={styles.successText}>
                                Se ha enviado tu contraseña a la siguiente dirección de correo:
                            </p>
                            <div style={styles.emailDisplay}>
                                {email}
                            </div>
                            <p style={styles.successText}>
                                Por favor revisa tu bandeja de entrada (y la carpeta de spam) para encontrar el correo con tu contraseña.
                            </p>
                            <button
                                onClick={handleBackToLogin}
                                style={{
                                    ...styles.button,
                                    ...styles.buttonPrimary
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = styles.buttonPrimaryHover.backgroundColor;
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = styles.buttonPrimary.backgroundColor;
                                }}
                            >
                                <ArrowLeft size={16} />
                                Volver al Inicio de Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <div style={styles.card}>
                    {/* Header */}
                    <div style={styles.header}>
                        <div style={styles.iconContainer}>
                            <Mail size={32} color="#2563eb" />
                        </div>
                        <h1 style={styles.title}>¿Olvidaste tu contraseña?</h1>
                        <p style={styles.subtitle}>
                            Ingresa tu dirección de correo electrónico y te enviaremos tu contraseña por correo.
                        </p>
                    </div>

                    {/* Email Form */}
                    <div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Correo Electrónico
                            </label>
                            <div style={styles.inputContainer}>
                                <div style={styles.inputIcon}>
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleInputChange}
                                    onFocus={() => setInputFocused(true)}
                                    onBlur={() => setInputFocused(false)}
                                    style={{
                                        ...styles.input,
                                        ...(inputFocused ? styles.inputFocus : {}),
                                        ...(loading ? styles.inputDisabled : {})
                                    }}
                                    placeholder="nombre@ejemplo.com"
                                    disabled={loading}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Message */}
                        {message.text && (
                            <div style={{
                                ...styles.message,
                                ...(message.type === 'success' ? styles.messageSuccess : styles.messageError)
                            }}>
                                {message.type === 'success' ? (
                                    <CheckCircle size={20} style={{ flexShrink: 0, marginTop: '1px' }} />
                                ) : (
                                    <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '1px' }} />
                                )}
                                <span>{message.text}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !email.trim()}
                            style={{
                                ...styles.button,
                                ...styles.buttonPrimary,
                                ...(loading || !email.trim() ? styles.buttonDisabled : {})
                            }}
                            onMouseEnter={(e) => {
                                if (!loading && email.trim()) {
                                    e.target.style.backgroundColor = styles.buttonPrimaryHover.backgroundColor;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading && email.trim()) {
                                    e.target.style.backgroundColor = styles.buttonPrimary.backgroundColor;
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Mail size={16} />
                                    Enviar Contraseña
                                </>
                            )}
                        </button>

                        {/* Back to Login Link */}
                        <div style={{ textAlign: 'center' }}>
                            <button
                                onClick={handleBackToLogin}
                                style={styles.buttonSecondary}
                                onMouseEnter={(e) => {
                                    e.target.style.color = styles.buttonSecondaryHover.color;
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = styles.buttonSecondary.color;
                                }}
                            >
                                <ArrowLeft size={16} />
                                Volver al inicio de sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;