import { getDb } from "../../../lib/db";

function isValidCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function generateCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET() {
  const db = getDb();
  const [rows] = await db.query("SELECT * FROM links ORDER BY created_at DESC");
  return Response.json(rows);
}

export async function POST(req) {
  const db = getDb();
  const body = await req.json();
  let { url, code } = body;

  url = (url || "").trim();
  code = (code || "").trim();

  if (!isValidUrl(url)) {
    return new Response(
      JSON.stringify({ message: "Invalid URL. It must start with http:// or https://" }),
      { status: 400 }
    );
  }

  if (code.length === 0) {
    // auto-generate 6-char code
    code = generateCode(6);
  } else if (!isValidCode(code)) {
    return new Response(
      JSON.stringify({ message: "Code must be 6–8 letters or digits (A–Z, a–z, 0–9)" }),
      { status: 400 }
    );
  }

  const [existing] = await db.query("SELECT id FROM links WHERE code = ?", [code]);
  if (existing.length > 0) {
    return new Response(JSON.stringify({ message: "Code already exists" }), { status: 409 });
  }

  await db.query("INSERT INTO links (code, target_url) VALUES (?, ?)", [code, url]);
  return new Response(JSON.stringify({ message: "Created", code }), { status: 201 });
}
