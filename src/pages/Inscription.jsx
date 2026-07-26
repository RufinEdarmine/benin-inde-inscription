import { useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { supabase } from "../lib/supabase";

const initialForm = {
  nom: "",
  prenom: "",
  date_naissance: "",
  telephone: "",
  email: "",
  ville_inde: "",
  universite: "",
  filiere: "",
  date_arrivee: "",
  contact_urgence_nom: "",
  contact_urgence_telephone: "",
  consentement: false,
};

const LETTRES_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errors = {};

  if (!form.nom.trim()) errors.nom = "Ce champ est requis.";
  else if (!LETTRES_REGEX.test(form.nom)) errors.nom = "Lettres uniquement, pas de chiffres.";

  if (!form.prenom.trim()) errors.prenom = "Ce champ est requis.";
  else if (!LETTRES_REGEX.test(form.prenom)) errors.prenom = "Lettres uniquement, pas de chiffres.";

  if (!form.email.trim()) errors.email = "Ce champ est requis.";
  else if (!EMAIL_REGEX.test(form.email)) errors.email = "Format d'email invalide (ex: nom@exemple.com).";

  if (!form.telephone || !isValidPhoneNumber(form.telephone)) {
    errors.telephone = "Numéro de téléphone invalide.";
  }

  if (!form.ville_inde.trim()) errors.ville_inde = "Ce champ est requis.";
  else if (!LETTRES_REGEX.test(form.ville_inde)) errors.ville_inde = "Lettres uniquement, pas de chiffres.";

  if (!form.universite.trim()) errors.universite = "Ce champ est requis.";
  else if (!LETTRES_REGEX.test(form.universite)) errors.universite = "Lettres uniquement, pas de chiffres.";

  if (!form.contact_urgence_nom.trim()) errors.contact_urgence_nom = "Ce champ est requis.";
  else if (!LETTRES_REGEX.test(form.contact_urgence_nom)) errors.contact_urgence_nom = "Lettres uniquement, pas de chiffres.";

  if (!form.contact_urgence_telephone || !isValidPhoneNumber(form.contact_urgence_telephone)) {
    errors.contact_urgence_telephone = "Numéro de téléphone invalide.";
  }

  if (!form.consentement) errors.consentement = "Vous devez accepter cette condition pour continuer.";

  return errors;
}

function Champ({ label, error, children }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export default function Inscription() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [statut, setStatut] = useState("idle");
  const [erreurEnvoi, setErreurEnvoi] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  }

  function handlePhoneChange(field) {
    return (value) => {
      setForm((f) => ({ ...f, [field]: value || "" }));
      setErrors((er) => ({ ...er, [field]: undefined }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreurEnvoi("");

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setStatut("envoi");

    const payload = {
      ...form,
      email: form.email.trim().toLowerCase(),
      nom: form.nom.trim(),
      prenom: form.prenom.trim(),
    };

    const { error } = await supabase.from("inscriptions").insert([payload]);

    if (error) {
      setStatut("erreur");
      if (error.code === "23505") {
        if (error.message.includes("email_unique")) {
          setErreurEnvoi("Cet email est déjà enregistré. Si vous pensez qu'il s'agit d'une erreur, contactez directement l'ambassade.");
        } else if (error.message.includes("nom_prenom_unique")) {
          setErreurEnvoi("Une personne avec ce nom et ce prénom est déjà enregistrée. Si vous pensez qu'il s'agit d'une erreur, contactez directement l'ambassade.");
        } else {
          setErreurEnvoi("Cette inscription semble être un doublon. Contactez l'ambassade si besoin.");
        }
      } else {
        setErreurEnvoi(error.message);
      }
    } else {
      setStatut("succes");
    }
  }

  if (statut === "succes") {
    function nouvelleInscription() {
      setForm(initialForm);
      setErrors({});
      setStatut("idle");
    }

    return (
      <>
        <div className="top-bar" />
        <header className="site-header">
          <img src="/emblem.svg" alt="Emblème du Bénin" />
          <div>
            <h1>Ambassade du Bénin en Inde</h1>
            <p>Enregistrement des étudiants béninois en Inde</p>
          </div>
        </header>
        <div className="container">
          <div className="intro-box">
            <h2>Inscription enregistrée</h2>
            <p>
              Merci, {form.prenom}. Votre inscription a bien été prise en compte
              par l'Ambassade du Bénin en Inde.
            </p>
          </div>
          <button onClick={nouvelleInscription} className="btn-retour">
            Faire une nouvelle inscription
          </button>
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
          <p>Enregistrement des étudiants béninois en Inde</p>
        </div>
      </header>

      <div className="container">
        <div className="intro-box">
          <h2>Pourquoi s'enregistrer ?</h2>
          <p>
            Ce formulaire permet à l'Ambassade du Bénin en Inde de recenser les
            étudiants béninois présents sur le territoire indien, afin de mieux
            vous accompagner et vous joindre en cas de besoin. Vos informations
            restent confidentielles et ne sont utilisées qu'à des fins
            consulaires.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="reg-form" noValidate>
          <fieldset>
            <legend>Identité</legend>
            <Champ label="Nom" error={errors.nom}>
              <input name="nom" value={form.nom} onChange={handleChange} />
            </Champ>
            <Champ label="Prénom" error={errors.prenom}>
              <input name="prenom" value={form.prenom} onChange={handleChange} />
            </Champ>
            <Champ label="Date de naissance">
              <input type="date" name="date_naissance" value={form.date_naissance} onChange={handleChange} />
            </Champ>
            <Champ label="Téléphone" error={errors.telephone}>
              <PhoneInput international defaultCountry="IN" value={form.telephone} onChange={handlePhoneChange("telephone")} />
            </Champ>
            <Champ label="Email" error={errors.email}>
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </Champ>
          </fieldset>

          <fieldset>
            <legend>Coordonnées en Inde</legend>
            <Champ label="Ville en Inde" error={errors.ville_inde}>
              <input name="ville_inde" value={form.ville_inde} onChange={handleChange} />
            </Champ>
            <Champ label="Université / établissement" error={errors.universite}>
              <input name="universite" value={form.universite} onChange={handleChange} />
            </Champ>
            <Champ label="Filière / niveau d'études">
              <input name="filiere" value={form.filiere} onChange={handleChange} />
            </Champ>
            <Champ label="Date d'arrivée en Inde">
              <input type="date" name="date_arrivee" value={form.date_arrivee} onChange={handleChange} />
            </Champ>
          </fieldset>

          <fieldset>
            <legend>Contact d'urgence (au Bénin)</legend>
            <Champ label="Nom du contact" error={errors.contact_urgence_nom}>
              <input name="contact_urgence_nom" value={form.contact_urgence_nom} onChange={handleChange} />
            </Champ>
            <Champ label="Téléphone du contact" error={errors.contact_urgence_telephone}>
              <PhoneInput international defaultCountry="BJ" value={form.contact_urgence_telephone} onChange={handlePhoneChange("contact_urgence_telephone")} />
            </Champ>
          </fieldset>

          <label className="consent-line">
            <input type="checkbox" name="consentement" checked={form.consentement} onChange={handleChange} />
            J'accepte que ces informations soient utilisées par l'Ambassade du Bénin en Inde à des fins consulaires.
          </label>
          {errors.consentement && <p className="field-error">{errors.consentement}</p>}

          {statut === "erreur" && <p className="form-error">Erreur d'envoi : {erreurEnvoi}</p>}

          <button type="submit" disabled={statut === "envoi"}>
            {statut === "envoi" ? "Envoi en cours..." : "S'enregistrer"}
          </button>
        </form>
      </div>

      <footer className="site-footer">
        Ambassade du Bénin en Inde — Enregistrement des étudiants
      </footer>
    </>
  );
}