// ============================================================
// IBSB — Ao Vivo
// Mostra "Não estamos ao vivo neste momento" quando não há
// transmissão. Preparado para integração futura com YouTube.
// ============================================================

import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/ui/Icon';
import { useData } from '../../context/DataContext';

export default function AoVivo() {
  const { settings, app } = useData();
  const live = settings?.live || {};
  const isLive = Boolean(live.active && live.streamUrl);
  const youtube = settings?.contact?.youtube;

  return (
    <>
      <PageHeader title="Ao Vivo" subtitle={`Transmissões dos cultos da ${app.name}`} />

      <section className="live-panel">
        <div className="live-player">
          {isLive ? (
            <iframe
              className="video-frame"
              src={live.streamUrl}
              title={live.title || 'Transmissão ao vivo'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="live-placeholder">
              <span className="live-icon-ring">
                <Icon name="live" size={42} />
              </span>
              <span className="live-status-off">
                <span className="live-dot-gray" /> Não estamos ao vivo neste momento
              </span>
              <span className="small" style={{ maxWidth: 380, opacity: 0.85 }}>
                Quando o culto estiver em transmissão, o vídeo aparecerá aqui.
              </span>
            </div>
          )}
        </div>

        <div className="live-panel-body">
          <h3>{isLive ? live.title || 'Transmissão ao vivo' : 'Nossas transmissões'}</h3>
          <p className="small ink-soft">
            Acompanhe os cultos ao vivo pelo aplicativo ou pelo canal oficial no YouTube.
          </p>

          <div className="live-notes mt-12">
            <div className="live-note">
              <span className="live-note-ic"><Icon name="bell" size={17} /></span>
              <span>
                <strong>Fique atento:</strong> os cultos são transmitidos nos horários
                informados na agenda. O aviso de transmissão aparece na página inicial.
              </span>
            </div>
            <div className="live-note">
              <span className="live-note-ic"><Icon name="youtube" size={17} /></span>
              <span>
                <strong>YouTube:</strong> as gravações dos cultos serão publicadas no canal
                oficial.
                {youtube ? (
                  <>
                    {' '}
                    <a href={youtube} target="_blank" rel="noreferrer" className="section-link">
                      Acessar canal <Icon name="external" size={13} />
                    </a>
                  </>
                ) : (
                  ' Enquanto isso, você pode assistir as pregações na aba Conteúdos.'
                )}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
