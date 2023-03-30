import "./globals.css";

export const metadata = {
  title: "Shiroko",
  description: "Personal assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="dark:bg-black dark:text-white">{children}</body>
    </html>
  );
}
