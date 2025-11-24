import { redirect } from "next/navigation";
import { getDb } from "../../lib/db";



export default async function RedirectPage(props) {
  const params = await props.params;
  const db = getDb();
  const { code } = params;

  const [rows] = await db.query("SELECT * FROM links WHERE code = ?", [code]);

  if (!rows.length) {
    return (
      <div className="container">
        <h2>404 - Not found</h2>
        <p>No link exists for this code.</p>
      </div>
    );
  }

  await db.query(
    "UPDATE links SET total_clicks = total_clicks + 1, last_clicked = NOW() WHERE code = ?",
    [code]
  );

  redirect(rows[0].target_url);
}
