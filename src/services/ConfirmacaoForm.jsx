import React, { useState, useRef, useEffect } from "react";
import "./ListaPresentes.css";
import confetti from "canvas-confetti";
import { getListas } from "../../services/GetListas";

export default function ListaPresentes({ onConfirmar }) {
  const [selecionado, setSelecionado] = useState(null);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const btnRef = useRef(null);
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cache = window.localStorage.getItem("listaPresentes");
    if (cache) {
      setLista(JSON.parse(cache));
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      const dados = await getListas("getListaDePresentes");
      setLista(dados);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSelecionar = (nome, imagem) => {
    setSelecionado(nome);
    setImagemSelecionada(imagem);
    setTimeout(() => {
      btnRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const handleConfirmar = () => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    setMostrarModal(false);
    if (onConfirmar) onConfirmar(selecionado);
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="container-presentes">
      <h2>Lista de Presentes</h2>
      <p className="mensagem">Escolha com carinho um presente que gostaria de nos dar 💛</p>

      <div className="lista-presentes">
        {lista.slice(1).map((item, index) => {
          // Se sua API retorna arrays, adapte aqui: const [nome, imagem, confirmado] = item;
          const nome = item.nome ?? item[0];
          const imagem = item.imagem ?? item[1];
          const confirmado = item.confirmado ?? item[2]; // "SIM" | "NAO"

          const jaSelecionado = confirmado === "SIM";
          const ativo = selecionado === nome;

          return (
            <div
              key={index}
              className={`card-presente ${ativo ? "selecionado" : ""} ${jaSelecionado ? "bloqueado" : ""}`}
              onClick={() => !jaSelecionado && handleSelecionar(nome, `/assets/Images/Presentes/${imagem}`)}
            >
              <h3>{nome}</h3>
              <img src={`/assets/Images/Presentes/${imagem}`} alt={nome} />
              <p className={ativo || jaSelecionado ? "textocardSelecionado" : "textocard"}>
                {ativo ? "Selecionado 💛" : jaSelecionado ? "Já selecionado" : "Escolher"}
              </p>
            </div>
          );
        })}
      </div>

      {selecionado && (
        <button ref={btnRef} className="btn-finalizar" onClick={() => setMostrarModal(true)}>
          Finalizar Seleção
        </button>
      )}

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🎉 Presença Confirmada!</h2>
            <p>Obrigada por compartilhar esse momento tão especial conosco 💛</p>
            <h3>🎁 Presente Escolhido</h3>
            <p><strong>{selecionado}</strong></p>
            {imagemSelecionada && <img src={imagemSelecionada} alt="presente" className="modal-imagem" />}
            <button onClick={handleConfirmar}>Confirmar</button>
          </div>
        </div>
      )}
    </div>
  );
}
