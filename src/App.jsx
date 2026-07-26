import { HashRouter, Routes, Route } from "react-router-dom";
import Inscription from "./pages/Inscription";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Inscription />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  );
}