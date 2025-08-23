import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ResumoConfirmacao from "../ResumoConfirmacao/ResumoConfirmacao.jsx";
import "./ResumoPage.css";

export default function ResumoPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const dados = state?.dados || {
    nome: "",
    presenca: "",
    quantidade: 0,
    presenteDescricao: "",
    mensagem: "",
  };

  return (
    <div className="rp">
      {/* HERO igual ao estilo do Header */}
      <header className="rp-hero">
        <div className="rp-emoji" aria-hidden>🏡</div>
        <h1 className="rp-title">Chá de Casa Nova</h1>
        <p className="rp-sub">Sua confirmação</p>
        <img className="rp-cover" src="./assets/Images/Familia.jpg" alt="" />
      </header>

      {/* CONTEÚDO */}
      <main className="rp-container">
        <section className="rp-card">
          <ResumoConfirmacao
            dados={dados}
            theme="light"
            onEditar={() => navigate(`/convite-cha-de-casa-nova/${id}`)}
          />
        </section>
      </main>
    </div>
  );
}
