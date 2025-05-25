export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="h-full">{children}</section>;
}
