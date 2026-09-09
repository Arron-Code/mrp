"use client";
import { useEffect, useState } from "react";
import { AdminNav } from "../admin-nav";
const states = ["NEW", "CONFIRMED", "PREPARING", "SERVED", "PAID", "CANCELLED"];
const labels: any = {
  NEW: "Neu",
  CONFIRMED: "Bestätigt",
  PREPARING: "In Zubereitung",
  SERVED: "Serviert",
  PAID: "Bezahlt",
  CANCELLED: "Storniert",
};
export default function Page() {
  const [rows, setRows] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  async function load() {
    const r = await fetch("/api/admin/orders", { cache: "no-store" });
    if (r.status === 401) return (location.href = "/admin");
    setRows(await r.json());
  }
  useEffect(() => {
    load();
  }, []);
  async function change(id: string, status: string) {
    const r = await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (r.ok) load();
    else setMsg((await r.json()).error);
  }
  return (
    <main className="wrap">
      <AdminNav />
      <h1>Bestellungen</h1>
      {msg && <p>{msg}</p>}
      <div className="admin-list">
        {rows.map((o) => (
          <article className="card" key={o.id}>
            <div className="row">
              <div>
                <b>Tisch {o.table.number}</b>
                <p className="muted">
                  {new Date(o.createdAt).toLocaleString("de-DE")}
                </p>
              </div>
              <strong>
                {o.items.reduce(
                  (s: number, i: any) => s + i.quantity * i.unitPriceCents,
                  0,
                ) / 100}{" "}
                €
              </strong>
            </div>
            <ul>
              {o.items.map((i: any) => (
                <li key={i.id}>
                  {i.quantity} x {i.menuItem.name}
                </li>
              ))}
            </ul>
            {o.note && <p>Hinweis: {o.note}</p>}
            <select
              value={o.status}
              onChange={(e) => change(o.id, e.target.value)}
            >
              {states.map((s) => (
                <option key={s} value={s}>
                  {labels[s]}
                </option>
              ))}
            </select>
          </article>
        ))}
      </div>
    </main>
  );
}
