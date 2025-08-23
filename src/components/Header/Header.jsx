import React, { useEffect, useState } from "react";
import "./Header.css";
import Convite from "../Convite/Convite";
import { getListas } from "../../services/GetListas";
import { useNavigate } from "react-router-dom";

// 👉 Altere aqui a data do evento
const dataEvento = new Date("2025-10-05T16:00:00");

export default function Header({ nomeConvidado }) {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalTipo, setModalTipo] = useState(null);
  const [tempoRestante, setTempoRestante] = useState({
    dias: "00",
    horas: "00",
    minutos: "00",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const dados = await getListas("getListaDeConvidados");
      const convidado = dados.filter((item) => item[0] === nomeConvidado);

      if (convidado.length > 0) {
        setLista(convidado);
        const [, nome, quantidade, presenca, presenteDescricao] = convidado[0];
        if (presenca === "Sim") {
          navigate(`/convite-cha-de-casa-nova/${nomeConvidado}/confirmado`, {
            state: {
              dados: {
                nome,
                presenca,
                quantidade: Number(quantidade) || 0,
                presenteDescricao,
                mensagem: "",
              },
            },
          });
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [nomeConvidado, navigate]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      const agora = new Date();
      const diferenca = dataEvento - agora;
      if (diferenca <= 0) { clearInterval(intervalo); return; }

      const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor((diferenca / (1000 * 60)) % 60);

      setTempoRestante({
        dias: String(dias).padStart(2, "0"),
        horas: String(horas).padStart(2, "0"),
        minutos: String(minutos).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    document.body.style.overflow = modalTipo ? "hidden" : "auto";
  }, [modalTipo]);

  const fecharModal = () => setModalTipo(null);

  return (
    <div className="header">
      {/* HERO / TÍTULO */}
      <header className="hero">
        <div className="hero-icon" role="img" aria-label="Casa">🏡</div>
        <h1 className="hero-title">Chá de Casa Nova</h1>
        <p className="hero-subtitle">Yasmin & Carlos</p>
        <img className="imagem-principal" src="./assets/Images/Familia.jpg" alt="" />
      </header>

      <div className="secao-geral">
        {/* CARTÃO PRINCIPAL */}
        <main className="convite-card">
          <h2 className="script-title">Você está convidado(a)!</h2>
          <p className="lead">
            Estamos muito felizes em compartilhar este momento especial com você!
            Acabamos de nos mudar para nossa nova casa e queremos celebrar com
            quem amamos.
          </p>

          <div className="emoji-row" aria-hidden="true">🎉 ☕ 🍰 🎁</div>

          <div className="cta-wrapper" id="confirmar">
            <button className="btn-primary" onClick={() => setModalTipo("confirmar")}>
              Confirmar presença
            </button>
          </div>
        </main>

        {/* CONTAGEM REGRESSIVA */}
        <section className="info-card countdown">
          <div className="info-title"><span className="pill-emoji">⏳</span>Contagem regressiva</div>
          <div className="count-grid">
            <div className="count-box">
              <span className="count-number">{tempoRestante.dias}</span>
              <span className="count-label">Dias</span>
            </div>
            <div className="count-box">
              <span className="count-number">{tempoRestante.horas}</span>
              <span className="count-label">Horas</span>
            </div>
            <div className="count-box">
              <span className="count-number">{tempoRestante.minutos}</span>
              <span className="count-label">Min</span>
            </div>
          </div>
        </section>

        {/* DATA & HORÁRIO — mesmo layout da imagem */}
        <section className="info-card" id="data-horario">
          <div className="info-title"><span className="icon">📅</span>Data & Horário</div>
          <p className="info-line"><strong>Sábado, 05 de Outubro de 2025</strong></p>
          <p className="info-sub">às 16h00</p>
        </section>

        {/* LOCALIZAÇÃO */}
        <section className="info-card" id="localizacao">
          <div className="info-title"><span className="icon">📍</span>Localização</div>
          <p className="info-line">
            <strong>Rua das Flores, 123 – Centro, Cidade/UF</strong>
          </p>
          <a
            className="btn-link"
            href="https://www.google.com/maps/search/?api=1&query=Rua%20das%20Flores%20123%20Centro"
            target="_blank" rel="noreferrer"
          >
            Ver no Google Maps
          </a>
        </section>

        {/* MODAL */}
        {modalTipo && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && fecharModal()}>
            <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
              <button className="fechar-modal" onClick={fecharModal} aria-label="Fechar modal">×</button>
              {modalTipo === "confirmar" && <Convite dadosConvidado={lista} onClose={fecharModal} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
