import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/predict", label: "Predict" },
  { to: "/history", label: "History" },
  { to: "/about", label: "About" }
];

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <h1 className="text-lg font-semibold text-teal-400">Kidney AI Classifier</h1>
        <div className="flex gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm ${isActive ? "bg-teal-500 text-slate-950" : "text-slate-300 hover:bg-slate-800"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
