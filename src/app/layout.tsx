import Head from "next/head";

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <Head>
      <title>Peril Comics</title>
      <meta name="description" content="The ultimate destination for peril comics." />
      <link rel="icon" href="/favicon.ico" />
    </Head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}