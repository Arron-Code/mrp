import Link from "next/link";

export default function Home() {
  return (
    <main className="wrap landing">
      <p className="eyebrow">Habesha Restaurant</p>
      <h1>Restaurant ERP</h1>
      <p className="muted">
        Verwalte Speisekarte, Bestellungen, Lagerbestand, Lieferanten und Einkäufe an einem Ort.
      </p>
      <Link className="btn" href="/admin">
        Zur Verwaltung
      </Link>
    </main>
  );
}
