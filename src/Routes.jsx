// routes/Routes.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import ResumoPage from './components/ResumoConfirmacao/ResumoPage.jsx'

function RoutesConfig() {
  return (
    <Router>
      <Routes>
        <Route path="/convite-cha-de-casa-nova/:id" element={<App />} />
        <Route path="/convite-cha-de-casa-nova/:id/confirmado" element={<ResumoPage />} />
      </Routes>
    </Router>
  );
}

export default RoutesConfig;
