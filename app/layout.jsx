import "./globals.css";

export const metadata = {
  title: "TinyLink",
  description: "Simple URL shortener built with Next.js and MySQL"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <h1>TinyLink</h1>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>TinyLink &copy; 2025</p>
        </footer>
      </body>
    </html>
  );
}
