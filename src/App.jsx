import Header from './components/Header/Header.jsx';
import ResumoConfirmacao from './components/ResumoConfirmacao/ResumoConfirmacao.jsx';
import { useEffect, useState } from 'react';
import { getListas } from './services/GetListas';
import { useParams } from 'react-router-dom';
import './App.css';

function App() {
  const { id } = useParams(); 
  const [dadosConvidado, setDadosConvidado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const dados = await getListas("getListaDeConvidados");
        const convidado = Array.isArray(dados) ? dados.find(item => item?.[0] === id) : null;
        if (convidado) {
          const [, nome, quantidade, presenca, presenteDescricao] = convidado;
          setDadosConvidado({
            nome,
            presenca,
            quantidade: Number(quantidade) || 0,
            presenteDescricao,
            mensagem: "",
          });
        }
      } catch (err) {
        console.error("Erro ao carregar convidado:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div>Carregando...</div>;

  // ✅ decide qual tela mostrar
  if (dadosConvidado?.presenca === "Sim") {
    return (
      <ResumoConfirmacao
        theme="light"
        dados={dadosConvidado}
        onEditar={() => window.location.reload()} // ou outro fluxo para reabrir Header
      />
    );
  }

  return <Header nomeConvidado={id} />;
}

export default App;
