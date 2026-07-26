import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const motDePasse = req.headers["x-admin-password"];

  if (motDePasse !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: "Mot de passe incorrect." });
    return;
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from("inscriptions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ inscriptions: data });
}