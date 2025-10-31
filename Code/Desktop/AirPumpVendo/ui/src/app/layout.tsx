import "./globals.css";

export const metadata = {
  title: "AirPumpVendo • Tire Service Kiosk",
  description: "Your complete tire safety and maintenance solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Material Symbols (Rounded) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400..700,1,0"
        />
      </head>
      <body className="min-h-dvh bg-gradient-to-b from-slate-100 to-slate-200 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
