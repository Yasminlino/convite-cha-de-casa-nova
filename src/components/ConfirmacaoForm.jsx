import { useState } from 'react';

export default function ConfirmacaoForm() {
  const [nome, setNome] = useState('');
  const [presenca, setPresenca] = useState('Sim');
  const [presente, setPresente] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
  e.preventDefault();

  const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeo8guyF6aC2Gl0wtdJ7Vzya7zoGxlz1W9OZGTyRzvn7PNvCw/formResponse";

  const formData = new URLSearchParams();
    formData.append("entry.452741845", nome);
    formData.append("entry.111392562", presenca);
    formData.append("entry.889573436", presente);

    fetch(formUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData
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
