import React from "react";
import './DetalhesEvento.css';
// Se desejar usar ícones bonitos, você pode instalar: npm install react-icons
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";

export default function DetalhesEvento() {
  return (
    <div className="detalhesEvento">
      <h2>📌 Detalhes do Evento</h2>
      <div className="cartoesContainer">
        <div className="card data">
          <FaCalendarAlt className="icone" />
          <h3>Data</h3>
          <p>Sábado, 15 de Outubro de 2025</p>
        </div>
        <div className="card horario">
          <FaClock className="icone" />
          <h3>Horário</h3>
          <p>15:00</p>
        </div>
        <div className="card local">
          <FaMapMarkerAlt className="icone" />
          <h3>Local</h3>
          <p>Rua Décio Barreto, 295</p>
        </div>
      </div>
    </div>
  );
}
