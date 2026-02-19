import { NavLink, useNavigate } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/transactions", label: "Transactions" },
  { to: "/plan", label: "Planification" },
  { to: "/categories", label: "Catégories" },
];

export default function Navbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("bf_token");
    navigate("/login");
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <NavLink to="/dashboard" className="text-sm font-semibold tracking-tight">
            BudgetFlow
          </NavLink>

          <nav className="hidden gap-1 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  [
                    "rounded-xl px-3 py-2 text-sm",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50",
                  ].join(" ")
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          onClick={logout}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Déconnexion
        </button>
      </div>

      {/* Nav mobile ultra simple */}
      <div className="border-t border-gray-100 bg-white md:hidden">
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 py-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                [
                  "whitespace-nowrap rounded-xl px-3 py-2 text-sm",
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600",
                ].join(" ")
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
