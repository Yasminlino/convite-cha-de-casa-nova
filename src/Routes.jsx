// routes/Routes.js
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";

function RoutesConfig() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:id" element={<App />} />
      </Routes>
    </Router>
  );
}

export default RoutesConfig;
