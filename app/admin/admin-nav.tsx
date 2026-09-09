"use client";

export function AdminNav({ logout }: { logout?: () => void }) {
  return (
    <nav className="admin-nav">
      <a href="/admin">Dashboard</a>
      <a href="/admin/menu">Speisekarte</a>
      <a href="/admin/orders">Bestellungen</a>
      <a href="/admin/inventory">Lager</a>
      <a href="/admin/recipes">Rezepturen</a>
      <a href="/admin/suppliers">Lieferanten</a>
      <a href="/admin/purchases">Einkauf</a>
      {logout && (
        <button className="btn secondary" onClick={logout}>
          Abmelden
        </button>
      )}
    </nav>
  );
}
