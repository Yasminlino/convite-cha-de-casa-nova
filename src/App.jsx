import Header from './components/Header/Header.jsx';
import ResumoConfirmacao from './components/ResumoConfirmacao/ResumoConfirmacao.jsx';
import { useEffect, useState } from 'react';
import { getListas } from './services/GetListas';
import { useParams } from 'react-router-dom';
import './App.css';

function App() {
  const { id } = useParams();
  const [dadosConvidado, setDadosConvidado] = useState(null);
  const [loading, setLoading] = useState(!!id); // só carrega se existir id

  useEffect(() => {
    if (!id) return; // sem id, não busca
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const dados = await getListas("getListaDeConvidados");
        const convidado = Array.isArray(dados) ? dados.find(item => item?.[0] === id) : null;
        if (!cancelled && convidado) {
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
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  // 1) Acesso sem id: mostra página inicial
  if (!id) {
    return (
      <div className="tela-inicial">
        <Header />
        <p>Bem-vindo! Para acessar seu convite, use o link personalizado encaminhado para você.</p>
      </div>
    );
  }

  // 2) Com id: enquanto busca
  if (loading) return <div>Carregando...</div>;

  // 3) Já confirmou? Mostra resumo
  if (dadosConvidado && dadosConvidado.presenca !== "Ainda não confirmou") {
    return (
      <ResumoConfirmacao
        theme="light"
        dados={dadosConvidado}
        onEditar={() => window.location.reload()}
      />
    );
  }

  // 4) Não confirmou: mostra Header com modal de confirmação
  return <Header nomeConvidado={id} />;
}

export default App;
