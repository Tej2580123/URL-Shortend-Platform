import { getDb } from "../../../../lib/db";

export async function GET(_req, props) {
  const params = await props.params;
  const db = getDb();
  const { code } = params;
  const [rows] = await db.query("SELECT * FROM links WHERE code = ?", [code]);
  if (!rows.length) {
    return new Response(JSON.stringify({ message: "Not found" }), { status: 404 });
  }
  return Response.json(rows[0]);
}

export async function DELETE(_req, props) {
  const params = await props.params;
  const db = getDb();
  const { code } = params;
  await db.query("DELETE FROM links WHERE code = ?", [code]);
  return Response.json({ message: "Deleted" });
}
