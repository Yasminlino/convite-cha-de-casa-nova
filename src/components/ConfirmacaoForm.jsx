import { useState } from 'react';

export default function ConfirmacaoForm() {
  const [nome, setNome] = useState('');
  const [presenca, setPresenca] = useState('Sim');
  const [presente, setPresente] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const scriptURL = "https://script.google.com/macros/s/AKfycbzbl_18XnPrNzOy1pju_2UtYBt9ifmYsYSLg2hTjh9tc8CPGjCsfQrAPPSjKbvCbM-rCA/exec";

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('presenca', presenca);
    formData.append('presente', presente);
    formData.append('action', 'confirmacao');
    

    fetch(scriptURL, {
      method: "POST",
      body: formData,
      mode: "no-cors"
    }).then(() => setEnviado(true));
  };

  if (enviado) return <p>Obrigado por confirmar! ❤️</p>;

  return (
    <form onSubmit={handleSubmit}>
      <label>Nome:
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
      </label>

      <label>Vai comparecer?
        <select value={presenca} onChange={(e) => setPresenca(e.target.value)}>
          <option>Sim</option>
          <option>Não</option>
        </select>
      </label>

      <label>Qual presente você vai levar?
        <input type="text" value={presente} onChange={(e) => setPresente(e.target.value)} required />
      </label>

      <button type="submit">Confirmar</button>
    </form>
  );
}
