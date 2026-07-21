import { useState } from 'react';

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  name,
  required = false,
  autoComplete = 'current-password'
}) {
  const [mostrar, setMostrar] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        marginBottom: '18px'
      }}
    >
      <input
        type={mostrar ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        style={{
          width: '100%',
          height: '52px',
          boxSizing: 'border-box',
          paddingLeft: '16px',
          paddingRight: '58px',
          marginBottom: 0
        }}
      />

      <button
        type="button"
        onClick={() => setMostrar((actual) => !actual)}
        aria-label={
          mostrar
            ? 'Ocultar contraseña'
            : 'Mostrar contraseña'
        }
        title={
          mostrar
            ? 'Ocultar contraseña'
            : 'Mostrar contraseña'
        }
        style={{
          position: 'absolute',
          top: '50%',
          right: '12px',
          transform: 'translateY(-50%)',
          width: '38px',
          height: '38px',
          minWidth: '38px',
          padding: 0,
          margin: 0,
          border: 'none',
          borderRadius: '50%',
          background: 'transparent',
          color: '#111827',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 50
        }}
      >
        {mostrar ? (
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3l18 18" />
            <path d="M10.6 10.7a2 2 0 002.7 2.7" />
            <path d="M9.9 4.3A10 10 0 0112 4c5 0 8.5 4.5 9.5 8a16 16 0 01-3.5 4.8" />
            <path d="M6.2 6.2A16 16 0 002.5 12c1 3.5 4.5 8 9.5 8 1 0 2-.2 2.9-.5" />
          </svg>
        ) : (
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}