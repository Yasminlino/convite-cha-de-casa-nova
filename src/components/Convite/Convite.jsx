import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Convite.css";
import ListaPresentes from "../ListaPresentes/ListaPresentes.jsx";
import confetti from "canvas-confetti";

async function enviarConfirmacao(payload) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbyREvtR6GpmcXIQUFDDnzygH7ktzKTaunwHyzP-L3sZKvWo0Q3kbTuYd6vsTt6KubFZMQ/exec";
  const formData = new FormData();
  // Mantido conforme seu código original (dois "nome")
  formData.append("id", payload.id ?? "");
  formData.append("nome", payload.nome ?? "");
  formData.append("presenca", payload.presenca ?? "");
  formData.append("quantidade", String(payload.quantidade ?? 0));
  formData.append("presente", payload.presenteDescricao || "PIX");
  formData.append("action", "confirmacao");
  await fetch(scriptURL, { method: "POST", body: formData, mode: "no-cors" });
}

export default function Convite({
  dadosConvidado = [],
  onClose = () => { },
  pixKey = "chave-pix@exemplo.com"
}) {
  const [form, setForm] = useState({
    id: dadosConvidado.id ? dadosConvidado.id : (Array.isArray(dadosConvidado) ? dadosConvidado?.[0]?.[0] : ""),
    nome: Array.isArray(dadosConvidado) && dadosConvidado.length > 0
      ? (dadosConvidado[0]?.[1] ?? "")
      : (dadosConvidado?.nome ?? ""),
    presenca: dadosConvidado.presenca ? dadosConvidado.presenca : "Sim",
    quantidade: dadosConvidado.quantidade ? dadosConvidado.quantidade : 1,
    presenteDescricao: "",
    mensagem: ""
  });

  const [enviando, setEnviando] = useState(false);

  // fluxo
  const [mostrarEscolha, setMostrarEscolha] = useState(false);
  const [mostrarPresentes, setMostrarPresentes] = useState(false);
  const [mostrarPix, setMostrarPix] = useState(false);

  // ✅ modal de agradecimento (sem auto-reload)
  const [showThanks, setShowThanks] = useState(false);

  const evento = useMemo(() => ({
    titulo: "Chá de Casa Nova",
    anfitrioes: "Carlos & Yasmin",
    dataTexto: "05 de Outubro de 2025",
    horaTexto: "16:00",
    localNome: "Rua Décio Barreto, 295",
    localMaps: "https://www.google.com/maps/place/R.+D%C3%A9cio+Barreto,+295+-+Cidade+Industrial+de+Curitiba,+Curitiba+-+PR,+81305-490/"
  }), []);

  const modalRef = useRef(null);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // 🔔 abre apenas a modal de agradecimento (sem redirecionar)
  const openThanks = () => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    setShowThanks(true)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.presenca) return;

    if (form.presenca === "Sim" && (!form.quantidade || form.quantidade < 1)) {
      alert("Por favor, informe pelo menos 1 pessoa.");
      return;
    }

    if (form.presenca === "Sim") {
      setMostrarEscolha(true);
    } else {
      setEnviando(true);
      await enviarConfirmacao(form);
      setEnviando(false);
      openThanks(); // apenas abre a modal
    }
  };

  const handleEscolheuPresente = async (nomePresente) => {
    setEnviando(true);
    await enviarConfirmacao({ ...form, presenteDescricao: nomePresente });
    setEnviando(false);
    openThanks(); // apenas abre a modal
  };

  const copiarChave = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      alert("Chave PIX copiada!");
    } catch {
      alert("Não foi possível copiar a chave.");
    }
  };

  const confirmarSemPresente = async () => {
    setEnviando(true);
    await enviarConfirmacao({ ...form, presenteDescricao: "" });
    setEnviando(false);
    openThanks(); // apenas abre a modal
  };

  return (
    <div
      className="convite-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="convite-title"
      onClick={handleBackdropClick}
    >
      <div
        className="convite-modal animate-in"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <section className="convite-body">
          <button type="button" className="convite-fechar" aria-label="Fechar" onClick={onClose}>×</button>

          {/* 1) Form */}
          {!mostrarEscolha && !mostrarPresentes && !mostrarPix && (
            <form className="rsvp-form" onSubmit={handleSubmit} noValidate>              
              <header className="hero padd">
                <h1 className="hero-title titlep">Chá de Casa Nova</h1>
                <p className="hero-subtitle textp">Carlos, Yasmin & Ágatha</p>
                <p className="subcopy">Venha celebrar esse novo capítulo com a gente! Sua presença fará toda a diferença 💛</p>
              </header>

              <ul className="detalhes-evento">
                <li><span className="icon" aria-hidden>📅</span><span><strong>{evento.dataTexto}</strong> • <span className="muted">às {evento.horaTexto}</span></span></li>
                <li><span className="icon" aria-hidden>📍</span><a href={evento.localMaps} target="_blank" rel="noreferrer">{evento.localNome} (ver no mapa)</a></li>
              </ul>

              <div className="campo">
                <label htmlFor="nome">Nome completo*</label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  maxLength={80}
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Ex.: Ana Silva"
                  autoFocus
                />
              </div>

              <div className="grid-2">
                <div className="campo">
                  <label htmlFor="presenca">Vai comparecer?*</label>
                  <select
                    id="presenca"
                    name="presenca"
                    required
                    value={form.presenca}
                    onChange={handleChange}
                  >
                    <option value="">Selecione...</option>
                    <option>Sim</option>
                    <option>Não</option>
                    <option>Talvez</option>
                  </select>
                </div>

                {form.presenca === "Sim" && (
                  <div className="campo">
                    <label htmlFor="quantidade">Quantidade</label>
                    <input
                      id="quantidade"
                      name="quantidade"
                      type="number"
                      min={1}
                      max={10}
                      value={form.quantidade}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>

              <div className="acoes">
                <button className="btn-primaria" type="submit" disabled={enviando}>
                  {enviando ? "Enviando..." : "Confirmar presença"}
                </button>
                <button className="btn-secundaria" type="button" onClick={onClose}>Fechar</button>
              </div>
              <p className="nota">*Campos obrigatórios. Se mudar de ideia depois, é só enviar outra resposta.</p>
            </form>
          )}

          {/* 2) Escolha: Presente ou PIX */}
          {mostrarEscolha && !mostrarPresentes && !mostrarPix && (
            <div className="escolha-wrap">
              <h3 className="escolha-title">Como você prefere contribuir?</h3>
              <div className="escolha-grid">
                <button
                  className="escolha-card"
                  onClick={() => { setMostrarPresentes(true); setMostrarEscolha(false); }}
                >
                  <div className="escolha-emoji" aria-hidden>🎁</div>
                  <div className="escolha-head">Escolher um presente</div>
                  <div className="escolha-sub">Veja nossa lista e selecione um item</div>
                </button>

                <button
                  className="escolha-card"
                  onClick={() => { setMostrarPix(true); setMostrarEscolha(false); }}
                >
                  <div className="escolha-emoji" aria-hidden>💳</div>
                  <div className="escolha-head">Fazer um PIX</div>
                  <div className="escolha-sub">Copie a chave e decida depois</div>
                </button>
              </div>
              <button className="btn-secundaria" onClick={() => setMostrarEscolha(false)}>Voltar</button>
            </div>
          )}

          {/* 3) Lista de Presentes */}
          {mostrarPresentes && (
            <ListaPresentes onConfirmar={handleEscolheuPresente} onClose={onClose} />
          )}

          {/* 4) PIX (simplificado) */}
          {mostrarPix && (
            <div className="pix-box">
              <div className="pix-title"><span aria-hidden>💛</span> Contribuir via PIX</div>

              <div className="campo">
                <label>Chave PIX</label>
                <div className="pix-key-row">
                  <input className="pix-key" value={pixKey} readOnly />
                  <button type="button" className="btn-secundaria" onClick={copiarChave}>Copiar</button>
                </div>
              </div>

              <p className="nota">
                Você pode fazer o PIX quando quiser. Se preferir, confirme a presença agora e decidir o presente depois.
              </p>

              <div className="acoes">
                <button className="btn-primaria" onClick={confirmarSemPresente} disabled={enviando}>
                  {enviando ? "Enviando..." : "Confirmar presença"}
                </button>
                <button
                  className="btn-secundaria"
                  onClick={() => { setMostrarPix(false); setMostrarEscolha(true); }}
                >
                  Voltar
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ✅ MODAL DE AGRADECIMENTO (só redireciona ao clicar no botão) */}
      {showThanks && (
        <div
          className="thanks-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="thanks-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowThanks(false); }}
        >
          <div className="thanks-modal" onClick={(e) => e.stopPropagation()}>
            <div className="thanks-emoji" aria-hidden>💛</div>
            <h3 id="thanks-title" className="thanks-title">Obrigado pela confirmação!</h3>
            <p className="thanks-sub">Sua presença foi registrada com sucesso.</p>
            <div className="thanks-actions">
              <button className="btn-primaria" onClick={() => window.location.reload()}>
                Ver resumo agora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
