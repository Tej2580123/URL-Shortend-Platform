"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const loadLinks = async () => {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!url.trim()) {
      setStatus({ type: "error", message: "Please enter a URL" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, code })
      });

      if (res.status === 201) {
        setStatus({ type: "success", message: "Link created successfully" });
        setUrl("");
        setCode("");
        await loadLinks();
      } else if (res.status === 409) {
        setStatus({ type: "error", message: "This code already exists. Choose another one." });
      } else {
        const body = await res.json().catch(() => ({}));
        setStatus({
          type: "error",
          message: body.message || "Failed to create link"
        });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (code) => {
    if (!confirm("Delete this link?")) return;
    setStatus(null);
    try {
      const res = await fetch(`/api/links/${code}`, { method: "DELETE" });
      if (res.ok) {
        setStatus({ type: "success", message: "Link deleted" });
        await loadLinks();
      } else {
        setStatus({ type: "error", message: "Failed to delete" });
      }
    } catch {
      setStatus({ type: "error", message: "Network error" });
    }
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <p className="badge">/ — Dashboard (list, add, delete)</p>

      <form className="form-row" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Long URL (must start with http:// or https://)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Custom code (6–8 letters/digits, optional)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Shorten"}
        </button>
      </form>

      {status && (
        <div className={`status ${status.type}`}>
          {status.message}
        </div>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Short code</th>
              <th>Target URL</th>
              <th>Total clicks</th>
              <th>Last clicked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.length === 0 && (
              <tr>
                <td colSpan={5}>No links yet. Add one above.</td>
              </tr>
            )}
            {links.map((link) => (
              <tr key={link.code}>
                <td>
                  <a className="code-link" href={`/code/${link.code}`}>
                    {link.code}
                  </a>
                </td>
                <td className="url-cell" title={link.target_url}>
                  {link.target_url}
                </td>
                <td>{link.total_clicks}</td>
                <td>{link.last_clicked || "-"}</td>
                <td>
                  <button
                    className="danger"
                    type="button"
                    onClick={() => handleDelete(link.code)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
