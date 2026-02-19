import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    localStorage.setItem("bf_token", "demo");
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">Connexion</h1>
        <form onSubmit={handleLogin} className="mt-4 space-y-3">
          <input
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Email"
          />
          <input
            type="password"
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Mot de passe"
          />
          <button className="w-full rounded-xl bg-black py-2 text-white">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
