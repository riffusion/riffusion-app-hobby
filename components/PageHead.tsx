import Head from "next/head";

export default function PageHead() {
  return (
    <Head>
      <title>Riffusion</title>
      <meta property="og:site_name" content="Riffusion" />

      <meta
        property="article:author"
        content="Seth Forsgren and Hayk Martiros"
      />

      <meta property="article:tag" content="music" />
      <meta property="article:tag" content="machine learning" />
      <meta property="article:tag" content="artificial intelligence" />
      <meta property="article:tag" content="generative music" />

      <meta property="og:title" content="Riffusion" />
      <meta name="twitter:title" content="Riffusion" />

      <meta
        name="description"
        content="Stable diffusion for real-time music generation"
      />
      <meta
        name="og:description"
        content="Stable diffusion for real-time music generation"
      />
      <meta
        name="twitter:description"
        content="Stable diffusion for real-time music generation"
      />

      <meta name="twitter:card" content="summary" />

      <meta property="og:image" content="https://i.imgur.com/fywZpQ7.jpeg" />
      <meta name="twitter:image" content="https://i.imgur.com/fywZpQ7.jpeg" />

      <meta property="og:type" content="website" />

      <meta property="og:url" content="http://www.riffusion." />
      <meta property="og:locale" content="en_US" />
      <meta property="og:website" content="http://wwww.riffusion" />

      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
