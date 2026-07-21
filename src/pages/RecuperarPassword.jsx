import { useState } from 'react';
import api from '../services/api';
import '../styles/recuperarPassword.css';

export default function RecuperarPassword(){

const [email,setEmail]=useState('');
const enviar=async()=>{

try{
const res=
await api.post('/auth/forgot-password',
{
email
}
);
alert(
'Correo enviado.\n\nRevisa tu bandeja.'
);

console.log(res.data);
}catch{

alert(
'Error'
);
}
};
return (
  <div className="recuperar-page">
    <div className="recuperar-card">
      <div className="recuperar-icon">🔐</div>

      <h1>Recuperar contraseña</h1>

      <p>
        Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
      </p>

      <input
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={enviar}>
        Enviar enlace
      </button>

      <a href="/login">
        ← Volver al inicio de sesión
      </a>
    </div>
  </div>
);
}