import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <div className="top-bar" />
      <header className="site-header">
        <img src="/emblem.svg" alt="Emblème du Bénin" />
        <div>
          <h1>Ambassade du Bénin en Inde</h1>
          <p>Enregistrement des étudiants béninois en Inde</p>
        </div>
        <nav className="site-nav">
          <Link to="/contact">Contact de l'ambassade</Link>
        </nav>
      </header>
    </>
  );
}