import React, { useEffect, useState } from "react";
import "../Header/Header.css"; // reaproveita o estilo do Header
import ResumoConfirmacao from "../ResumoConfirmacao/ResumoConfirmacao.jsx";

// 👉 mesma data usada no Header
const dataEvento = new Date("2025-10-05T16:00:00");

export default function Confirmed({ nomeConvidado, dados, onEditar = () => {} }) {
  const [tempoRestante, setTempoRestante] = useState({
    dias: "00",
    horas: "00",
    minutos: "00",
  });

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

  return (
    <div className="header">
      {/* HERO / TÍTULO — igual ao Header */}
      <header className="hero">
        <div className="hero-icon" role="img" aria-label="Casa">🏡</div>
        <h1 className="hero-title">Chá de Casa Nova</h1>
        <p className="hero-subtitle">Yasmin & Carlos</p>
        <img className="imagem-principal" src="/assets/Images/Familia.jpg" alt="" />
      </header>

      <div className="secao-geral">
        {/* CARD DE RESUMO — no mesmo estilo do Header */}
        <section className="card">
          <ResumoConfirmacao
            theme="light"
            dados={dados}
            onEditar={onEditar}
          />
        </section>

        {/* CONTAGEM REGRESSIVA — mesmo bloco do Header */}
        <section className="info-card countdown">
          <div className="info-title">
            <span className="pill-emoji">⏳</span>Contagem regressiva
          </div>
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

        {/* DATA & HORÁRIO — mesmo layout */}
        <section className="info-card" id="data-horario">
          <div className="info-title"><span className="icon">📅</span>Data & Horário</div>
          <p className="info-line"><strong>Sábado, 05 de Outubro de 2025</strong></p>
          <p className="info-sub">às 16h00</p>
        </section>

        {/* LOCALIZAÇÃO — mesmo layout */}
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
      </div>
    </div>
  );
}
