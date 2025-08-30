import React, { useState, useEffect } from "react";
import "./ResumoConfirmacao.css";
import "./ResumoPage.css";
import Convite from "../Convite/Convite";
import { getListas } from "../../services/GetListas";

export default function ResumoConfirmacao({
  dados = { nome: "", presenca: "", quantidade: 0, presenteDescricao: "", mensagem: "" },
  onEditar = () => {},
  theme = "light",
}) {
  const [modalTipo, setModalTipo] = useState(null);
  const [presenteSel, setPresenteSel] = useState(null);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);

  const statusLabel = (p) => {
    if (!p) return "—";
    const s = p.toLowerCase();
    if (s === "sim") return "Irá comparecer";
    if (s === "não" || s === "nao") return "Não irá comparecer";
    if (s === "talvez") return "Talvez";
    return p;
  };

  useEffect(() => {
    // só busca a lista se NÃO for PIX e houver descrição de presente
    if (!dados.presenteDescricao || dados.presenteDescricao === "PIX") {
      setPresenteSel(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const presentes = await getListas("getListaDePresentes");

        // normaliza cada linha para {nome, imagem, confirmado}
        const norm = (row) => ({
          nome: row?.nome ?? row?.[0] ?? "",
          imagem: row?.imagem ?? row?.[1] ?? "",
          confirmado: (row?.confirmado ?? row?.[2] ?? "").toString().toUpperCase(),
        });

        const listaNorm = Array.isArray(presentes) ? presentes.slice(1).map(norm) : [];

        // encontra o presente pelo nome
        const found = listaNorm.find((p) => p.nome === dados.presenteDescricao) || null;
        setPresenteSel(found);
      } catch {
        setErro("Não foi possível carregar a lista de presentes.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dados.presenteDescricao]);

  const pixKey = "chave-pix@exemplo.com";

  const copiarChave = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      alert("Chave PIX copiada!");
    } catch {
      alert("Não foi possível copiar a chave.");
    }
  };

  useEffect(() => {
    document.body.style.overflow = modalTipo ? "hidden" : "auto";
  }, [modalTipo]);

  const fecharModal = () => setModalTipo(null);

  // caminho da imagem (quando houver)
  const presenteImgSrc = presenteSel?.imagem
    ? `./assets/Images/Presentes/${presenteSel.imagem}`
    : null;

  return (
    <div>
      <div className="rp">
        <header className="rp-hero">
          <div className="rp-emoji" aria-hidden>🏡</div>
          <h1 className="rp-title">Chá de Casa Nova</h1>
          <p className="rp-sub">Sua confirmação</p>
          <img className="rp-cover" src="./assets/Images/Familia.jpg" alt="" />
        </header>
      </div>

      <div className={`rc ${theme === "light" ? "rc--light" : ""} secao-geral`}>
        <header className="rc-head">
          <div className="rc-pill"><span aria-hidden>🎉</span> Resumo da sua confirmação</div>
          <button className="rc-edit" onClick={() => setModalTipo("confirmar")}>
            Alterar informações
          </button>
        </header>

        {/* Nome */}
        <section className="rc-info-card ">
          <div className="rc-title"><span className="icon" aria-hidden>👤</span>Convidado(a)</div>
          <p className="rc-line"><strong>{dados.nome || "—"}</strong></p>
        </section>

        {/* Presença + Quantidade */}
        <section className="rc-info-card">
          <div className="rc-title"><span className="icon" aria-hidden>{dados.presenca === "Sim" ? "🟢" : dados.presenca === "Não" ? "🔴" : "🟠"}</span>Status</div>
          <p className="rc-line">
            {dados.presenca == "Sim" ? (
              <span className="icon" aria-hidden>✅</span>
            ) : dados.presenca == "Não" ? (
              <span className="icon" aria-hidden>❌</span>
             ) : dados.presenca == "Talvez" ? (
              <span className="icon" aria-hidden>❔</span>
            ) : null            
            }
            <strong>{statusLabel(dados.presenca)}</strong>
            {dados.presenca?.toLowerCase() === "sim" ? (
              <div>
                <span className="icon" aria-hidden>✅</span>
                <span className="rc-sub"> · {Number(dados.quantidade || 0)} pessoa(s)</span>
              </div>
            ) 
            : null}
          </p>
        </section>

        {/* Presente / PIX */}
        <section className="rc-info-card">
          <div className="rc-title">
            <span className="icon" aria-hidden>{dados.presenteDescricao === "PIX" ? "💲" : "🎁"}</span>
            {dados.presenteDescricao === "PIX" ? "PIX" : "Presente"}
          </div>

          {dados.presenteDescricao === "PIX" ? (
            <div className="pix-key-row">
              <input className="pix-key" value={pixKey} readOnly />
              <button type="button" className="btn-secundaria" onClick={copiarChave}>
                Copiar
              </button>
            </div>
          ) : (
            <>
              {loading && <p className="rc-line">Carregando presente…</p>}
              {erro && <p className="rc-line">Não foi possível carregar a imagem.</p>}
              {!loading && !erro && (
                presenteImgSrc ? (
                  <img
                    className="presente-img"
                    src={presenteImgSrc}
                    alt={`Presente escolhido: ${presenteSel?.nome ?? ""}`}
                  />
                ) : (
                  <p className="rc-line">Presente: <strong>{dados.presenteDescricao}</strong></p>
                )
              )}
            </>
          )}
        </section>

        {/* Mensagem opcional */}
        {dados.mensagem ? (
          <section className="rc-info-card">
            <div className="rc-title"><span className="icon" aria-hidden>💬</span>Mensagem</div>
            <p className="rc-line rc-pre">{dados.mensagem}</p>
          </section>
        ) : null}

        {/* Modal para editar */}
        {modalTipo && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && fecharModal()}>
            <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
              <button className="fechar-modal" onClick={fecharModal} aria-label="Fechar modal">×</button>
              {modalTipo === "confirmar" && <Convite dadosConvidado={dados} onClose={fecharModal} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
