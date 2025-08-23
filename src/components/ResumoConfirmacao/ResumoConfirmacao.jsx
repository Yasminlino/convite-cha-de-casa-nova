import React from "react";
import "./ResumoConfirmacao.css";

export default function ResumoConfirmacao({
  dados = { nome: "", presenca: "", quantidade: 0, presenteDescricao: "", mensagem: "" },
  onEditar = () => {},
  theme = "light",
}) {
  const statusLabel = (p) => {
    if (!p) return "—";
    const s = p.toLowerCase();
    if (s === "sim") return "Confirmado";
    if (s === "não" || s === "nao") return "Não vai";
    if (s === "talvez") return "Talvez";
    return p;
  };

  return (
    <div className={`rc ${theme === "light" ? "rc--light" : ""}`}>
      <header className="rc-head">
        <div className="rc-pill"><span aria-hidden>🎉</span> Resumo da sua confirmação</div>
        <button className="rc-edit" onClick={onEditar}>Editar resposta</button>
      </header>

      {/* Nome */}
      <section className="rc-info-card">
        <div className="rc-title"><span className="icon" aria-hidden>👤</span>Convidado(a)</div>
        <p className="rc-line"><strong>{dados.nome || "—"}</strong></p>
      </section>

      {/* Presença + Quantidade */}
      <section className="rc-info-card">
        <div className="rc-title"><span className="icon" aria-hidden>✅</span>Status</div>
        <p className="rc-line">
          <strong>{statusLabel(dados.presenca)}</strong>
          {dados.presenca?.toLowerCase() === "sim" ? (
            <span className="rc-sub"> · {Number(dados.quantidade || 0)} pessoa(s)</span>
          ) : null}
        </p>
      </section>

      {/* Presente / PIX */}
      <section className="rc-info-card">
        <div className="rc-title"><span className="icon" aria-hidden>🎁</span>Presente / PIX</div>
        <p className="rc-line"><strong>{dados.presenteDescricao || "Decidir depois"}</strong></p>
      </section>

      {/* Mensagem opcional */}
      {dados.mensagem ? (
        <section className="rc-info-card">
          <div className="rc-title"><span className="icon" aria-hidden>💬</span>Mensagem</div>
          <p className="rc-line rc-pre">{dados.mensagem}</p>
        </section>
      ) : null}
    </div>
  );
}
