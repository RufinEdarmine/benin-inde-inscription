import Header from "../components/Header";

const membres = [
  { nom: "M. Jean-Marie ZINSOU", fonction: "Ambassadeur", telephone: "+91 92 11 68 64 90" },
  { nom: "Mme Adélaide ZINSOU", fonction: "Ambassadrice", telephone: "+91 84 48 59 68 63" },
  { nom: "M. Armand HOUNTONDJI", fonction: "Ministre Conseiller", telephone: "+229 01 97 98 13 42" },
  { nom: "M. Freud Ulrich KLISSOU", fonction: "Ministre Conseiller", telephone: "+91 92 66 14 22 78" },
];

function telHref(numero) {
  return "tel:" + numero.replace(/\s+/g, "");
}

export default function Contact() {
  return (
    <>
      <Header />
      <div className="container">
        <div className="intro-box">
          <h2>Coordonnées de l'ambassade</h2>
          <p>
            <strong>Adresse :</strong> D 5/14, Vasant Vihar, New Delhi 110057
          </p>
          <p>
            <strong>Téléphone :</strong>{" "}
            <a href={telHref("+91 01145261941")}>+91 011 45261941</a>
          </p>
          <p>
            <strong>Email :</strong>{" "}
            <a href="mailto:ambassade.newdelhi@gouv.bj">ambassade.newdelhi@gouv.bj</a>
          </p>
        </div>

        <h2>Membres de la délégation</h2>
        <div className="contact-list">
          {membres.map((m) => (
            <div key={m.nom} className="contact-card">
              <div>
                <strong>{m.nom}</strong>
                <p className="contact-fonction">{m.fonction}</p>
              </div>
              <a href={telHref(m.telephone)} className="contact-tel">
                {m.telephone}
              </a>
            </div>
          ))}
        </div>
      </div>
      <footer className="site-footer">
        Ambassade du Bénin en Inde — Enregistrement des étudiants
      </footer>
    </>
  );
}