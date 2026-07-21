import '../styles/trustBadges.css';

export default function TrustBadges({ empresa, promedio = 0, total = 0 }) {
  const esPremium = empresa?.plan === 'PREMIUM';
  const esPro = empresa?.plan === 'PRO';

  const estaVerificada =
    empresa?.logo &&
    empresa?.telefono &&
    empresa?.whatsapp &&
    empresa?.direccion &&
    empresa?.descripcion;

    const esDestacada =
        Number(promedio || empresa?.promedio || 0) >= 4.5 &&
        Number(total || empresa?.total_valoraciones || 0) >= 5;

    const tieneRedSocial =
    empresa?.facebook || empresa?.instagram || empresa?.tiktok;

    const perfilCompleto =
    empresa?.logo &&
    empresa?.descripcion &&
    empresa?.telefono &&
    empresa?.whatsapp &&
    empresa?.direccion &&
    tieneRedSocial;

  return (
    <div className="trust-badges">
      {esPremium && <span className="trust-badge premium">👑 Premium</span>}
      {esPro && <span className="trust-badge pro">⭐ Pro</span>}
      {estaVerificada && <span className="trust-badge verified">✔ Verificada</span>}
      {esDestacada && <span className="trust-badge featured">🏆 Destacada</span>}
      {perfilCompleto && (<span className="trust-badge complete">📷 Perfil completo</span>
        )}
    </div>
  );
}