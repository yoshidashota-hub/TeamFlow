import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "TeamFlow",
  description: "Task management with real-time collaboration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
