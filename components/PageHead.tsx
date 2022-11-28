import Head from "next/head";

export default function PageHead() {
  return (
    <Head>
      <title>Riffusion</title>
      <meta
        name="description"
        content="My name is Riffusion, and I write music."
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
