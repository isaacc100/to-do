import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "tasks.isaaccritchley.uk",
  description: "Submit tasks that sync to Apple Reminders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50 font-sans">
        {children}
      </body>
    </html>
  );
}
