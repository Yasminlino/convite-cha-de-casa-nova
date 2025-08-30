import React, { useState, useRef, useEffect, useMemo } from "react";
import "./ListaPresentes.css";
import confetti from "canvas-confetti";
import { createPortal } from "react-dom";
import { getListas } from "../../services/GetListas";

export default function ListaPresentes({ onConfirmar, onClose }) {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [selecionado, setSelecionado] = useState(null);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const btnRef = useRef(null);

  // confete com z-index alto
  const confettiInstance = useMemo(() => {
    try {
      return confetti.create(undefined, { resize: true, useWorker: true, zIndex: 9999 });
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dados = await getListas("getListaDePresentes");
        setLista(Array.isArray(dados) ? dados : []);
      } catch {
        setErro("Não foi possível carregar a lista de presentes.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // bloqueia scroll e fecha com ESC quando a modal está aberta
  useEffect(() => {
    if (!mostrarModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setMostrarModal(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [mostrarModal]);

  const handleSelecionar = (nome, imagem) => {
    setSelecionado(nome);
    setImagemSelecionada(imagem);
    setTimeout(() => btnRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
  };

  // ✅ confirma presente, fecha tudo e recarrega a página
  const handleConfirmar = async () => {
    try {
      (confettiInstance || confetti)({
        particleCount: 180,
        spread: 75,
        origin: { y: 0.6 },
        ticks: 220,
        zIndex: 9999
      });
    } catch {}

    setMostrarModal(false);

    // aguarda o callback do pai (pode enviar para o Apps Script)
    if (onConfirmar) {
      await Promise.resolve(onConfirmar(selecionado));
    }

    // fecha a modal pai (Convite), se existir
    onClose?.();

    // dá um respiro pro confete e recarrega
    setTimeout(() => window.location.reload(), 300);
  };

  if (loading) {
    return (
      <div className="lp-container">
        <h2>Lista de Presentes</h2>
        <p className="lp-msg">Carregando…</p>
        <div className="lp-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="lp-card lp-skeleton" aria-hidden />
          ))}
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="lp-container">
        <h2>Lista de Presentes</h2>
        <p className="lp-error">{erro}</p>
      </div>
    );
  }

  const itens = lista.slice(1);

  return (
    <div className="lp-container">
      <h2>Lista de Presentes</h2>
      <p className="lp-msg">Escolha com carinho um presente que gostaria de nos dar 💛</p>

      <div className="lp-grid">
        {itens.map((item, index) => {
          const nome = item.nome ?? item[0];
          const imagem = item.imagem ?? item[1];
          const confirmado =
            (item.confirmado ?? item[2] ?? "").toString().toUpperCase() === "SIM";

          const ativo = selecionado === nome;
          const imgUrl = `./assets/Images/Presentes/${imagem}`;

          return (
            <article
              key={`${nome}-${index}`}
              className={`lp-card ${ativo ? "is-active" : ""} ${confirmado ? "is-disabled" : ""}`}
              role="button"
              aria-pressed={ativo}
              tabIndex={confirmado ? -1 : 0}
              onClick={() => !confirmado && handleSelecionar(nome, imgUrl)}
              onKeyDown={(e) => {
                if (!confirmado && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  handleSelecionar(nome, imgUrl);
                }
              }}
            >
              {confirmado && <span className="lp-badge">Já selecionado</span>}
              <div className="lp-thumb">
                <img src={imgUrl} alt={nome} loading="lazy" />
              </div>
              <h3 className="lp-title">{nome}</h3>
              <div className="lp-cta">
                <span
                  className={`lp-chip ${ativo ? "chip-active" : ""} ${
                    confirmado ? "chip-disabled" : ""
                  }`}
                >
                  {ativo ? "Selecionado 💛" : confirmado ? "Indisponível" : "Escolher"}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {selecionado && (
        <button
          ref={btnRef}
          className="lp-btn-finish"
          onClick={() => setMostrarModal(true)}
        >
          Finalizar seleção
        </button>
      )}

      {/* Modal em PORTAL (texto ajustado) */}
      {mostrarModal &&
        createPortal(
          <div
            className="lp-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lp-modal-title"
            onClick={(e) => e.target === e.currentTarget && setMostrarModal(false)}
          >
            <div className="lp-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="lp-modal-close"
                aria-label="Fechar"
                onClick={() => setMostrarModal(false)}
              >
                ×
              </button>

              <h2 id="lp-modal-title">Confirmar presente?</h2>
              <p className="lp-modal-sub">
                Você selecionou o presente abaixo. Podemos registrar a sua escolha?
              </p>

              <div className="lp-modal-present">
                {imagemSelecionada && <img src={imagemSelecionada} alt="" aria-hidden="true" />}
                <div className="lp-modal-info">
                  <h3>Presente escolhido</h3>
                  <p><strong>{selecionado}</strong></p>
                </div>
              </div>

              <div className="lp-modal-actions">
                <button className="lp-btn-primary" onClick={handleConfirmar}>
                  Confirmar seleção
                </button>
                <button className="lp-btn-secondary" onClick={() => setMostrarModal(false)}>
                  Voltar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
