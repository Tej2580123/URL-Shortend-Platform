import { getDb } from "../../../lib/db";


import Link from "next/link";

export default async function CodeStatsPage(props) {
  const params = await props.params;
  const db = getDb();
  const { code } = params;
  const [rows] = await db.query("SELECT * FROM links WHERE code = ?", [code]);

  if (!rows.length) {
    return (
      <div className="container">
        <h2>Stats</h2>
        <p>No link found for code: <strong>{code}</strong></p>
        <Link href="/">&larr; Back to dashboard</Link>
      </div>
    );
  }

  const link = rows[0];

  return (
    <div className="container">
      <h2>Stats for: {link.code}</h2>
      <p className="badge">/code/{link.code} — Stats page</p>

      <p><strong>Target URL:</strong> {link.target_url}</p>
      <p><strong>Total clicks:</strong> {link.total_clicks}</p>
      <p><strong>Last clicked:</strong> {link.last_clicked ? new Date(link.last_clicked).toLocaleString() : "-"}</p>
      <p><strong>Created at:</strong> {link.created_at?.toString()}</p>

      <p>
        Redirect link:{" "}
        <a className="code-link" href={`/${link.code}`}>
          /{link.code}
        </a>
      </p>

      <Link href="/">&larr; Back to dashboard</Link>
    </div>
  );
}
