import './VideosAdmin.css';
import { VIDEOS_URL } from '../../config/urls';

export default function VideosAdmin({
  videos = [],
  onAprobar,
  onRechazar
}) {
  return (
    <section className="videos-admin">
      <div className="videos-admin-header">
        <h2>🎥 Videos pendientes</h2>

        <span>
          {videos.length} {videos.length === 1 ? 'pendiente' : 'pendientes'}
        </span>
      </div>

      {videos.length === 0 ? (
        <div className="videos-empty">
          No hay videos pendientes.
        </div>
      ) : (
        videos.map((item) => {
          const videoSrc = `${VIDEOS_URL}/${item.video_pendiente}`;

          console.log('URL VIDEO ADMIN:', videoSrc);

          return (
            <div
              key={item.id}
              className="video-admin-card"
            >
              <div className="video-admin-info">
                <h3>{item.nombre_empresa}</h3>
                <p>{item.categoria}</p>
                <small>{item.distrito}</small>
              </div>

              <video
                key={item.video_pendiente}
                controls
                preload="metadata"
                playsInline
              >
                <source
                  src={videoSrc}
                  type="video/mp4"
                />

                Tu navegador no soporta videos.
              </video>

              <div className="video-actions">
                <button
                  type="button"
                  onClick={() => onAprobar(item.id)}
                  className="approve"
                >
                  ✔ Aprobar
                </button>

                <button
                  type="button"
                  onClick={() => onRechazar(item.id)}
                  className="reject"
                >
                  ✖ Rechazar
                </button>
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}