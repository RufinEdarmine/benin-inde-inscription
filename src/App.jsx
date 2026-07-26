import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inscription from "./pages/Inscription";
import Admin from "./pages/Admin";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inscription />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}