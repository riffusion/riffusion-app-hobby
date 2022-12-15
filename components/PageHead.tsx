import Head from "next/head";

export default function PageHead() {
  return (
    <Head>
      <title>Riffusion</title>
      <meta property="og:site_name" content="Riffusion" />
      <meta
        property="og:title"
        content="Riffusion - Stable diffusion for real-time music generation"
      />
      <meta
        property="article:author"
        content="Seth Forsgren and Hayk Martiros"
      />
      <meta
        name="description"
        content="Stable diffusion for real-time music generation"
      />
      <meta
        name="og:description"
        content="Stable diffusion for real-time music generation"
      />
      <meta property="og:url" content="http://www.riffusion." />
      <meta property="og:locale" content="en_US" />
      <meta property="og:website" content="http://wwww.riffusion" />
      <meta property="og:image" content="/public/pop_sample.jpg" />

      <meta name="twitter:card" content="summary" />
      <meta
        name="twitter:title"
        content="Stable diffusion for real-time music generation"
      />
      <meta name="twitter:image" content="/public/pop_sample.jpg" />

      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
