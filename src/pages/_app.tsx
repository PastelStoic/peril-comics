import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import Header from "src/components/header";
import Footer from "src/components/footer";
import { trpc } from "../utils/trpc";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Peril Comics</title>
        <meta name="description" content="The ultimate destination for peril comics." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Header />
        <Component {...pageProps} />
        <Analytics />
        <Footer />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
