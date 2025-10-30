// ui/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "AirPumpVendo • Tire Service Kiosk",
  description: "Your complete tire safety and maintenance solution",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
