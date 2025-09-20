import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import SeoAnalyzer from "./SeoAnalyzer";

function Dashboard({ user, goToAnalyzer }) {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome, {user.email}</h1>
      <button onClick={() => supabase.auth.signOut()}>Logout</button>

      <div style={{ marginTop: "20px" }}>
        <button onClick={goToAnalyzer}>Go to SEO Analyzer</button>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard"); // 👈 manage pages

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!user) {
    return <Auth />;
  }

  return (
    <div>
      {page === "dashboard" && (
        <Dashboard user={user} goToAnalyzer={() => setPage("analyzer")} />
      )}

      {page === "analyzer" && (
        <div>
          <button onClick={() => setPage("dashboard")}>⬅ Back to Dashboard</button>
          <SeoAnalyzer user={user} />
        </div>
      )}
    </div>
  );
}
