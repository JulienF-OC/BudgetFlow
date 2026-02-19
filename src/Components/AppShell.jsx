import Navbar from "./Navbar";

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
