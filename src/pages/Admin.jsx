import { useState } from "react";

export default function Admin() {
  const [motDePasse, setMotDePasse] = useState("");
  const [inscriptions, setInscriptions] = useState(null);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  async function seConnecter(e) {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    try {
      const res = await fetch("/api/admin-list", {
        headers: { "x-admin-password": motDePasse },
      });
      const data = await res.json();

      if (!res.ok) {
        setErreur(data.error || "Mot de passe incorrect.");
        setInscriptions(null);
      } else {
        setInscriptions(data.inscriptions);
      }
    } catch (err) {
      setErreur("Erreur de connexion.");
    } finally {
      setChargement(false);
    }
  }

  if (!inscriptions) {
    return (
      <>
        <div className="top-bar" />
        <header className="site-header">
          <img src="/emblem.svg" alt="Emblème du Bénin" />
          <div>
            <h1>Ambassade du Bénin en Inde</h1>
            <p>Espace réservé — consultation des inscriptions</p>
          </div>
        </header>
        <div className="container">
          <div className="admin-login">
            <h2>Accès Ambassade</h2>
            <p className="admin-login-sub">Entrez le mot de passe fourni pour consulter la liste des étudiants enregistrés.</p>
            <form onSubmit={seConnecter}>
              <input
                type="password"
                placeholder="Mot de passe"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="admin-login-input"
              />
              <button type="submit" disabled={chargement}>
                {chargement ? "Vérification..." : "Voir les inscriptions"}
              </button>
              {erreur && <p className="field-error">{erreur}</p>}
            </form>
          </div>
        </div>
        <footer className="site-footer">
          Ambassade du Bénin en Inde — Enregistrement des étudiants
        </footer>
      </>
    );
  }

  return (
    <>
      <div className="top-bar" />
      <header className="site-header">
        <img src="/emblem.svg" alt="Emblème du Bénin" />
        <div>
          <h1>Ambassade du Bénin en Inde</h1>
          <p>Espace réservé — consultation des inscriptions</p>
        </div>
      </header>
      <div className="container container-wide">
        <div className="admin-toolbar">
          <h2>Étudiants enregistrés ({inscriptions.length})</h2>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Ville</th>
                <th>Université</th>
                <th>Filière</th>
                <th>Contact urgence</th>
                <th>Tél. urgence</th>
                <th>Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {inscriptions.map((i) => (
                <tr key={i.id}>
                  <td>{i.nom}</td>
                  <td>{i.prenom}</td>
                  <td>{i.email}</td>
                  <td>{i.telephone}</td>
                  <td>{i.ville_inde}</td>
                  <td>{i.universite}</td>
                  <td>{i.filiere}</td>
                  <td>{i.contact_urgence_nom}</td>
                  <td>{i.contact_urgence_telephone}</td>
                  <td>{new Date(i.created_at).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <footer className="site-footer">
        Ambassade du Bénin en Inde — Enregistrement des étudiants
      </footer>
    </>
  );
}