import Head from "next/head";
import Image from "next/image";

import ThreeCanvas from "../components/ThreeCanvas";


import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Riffusion</title>
        <meta
          name="description"
          content="My name is Riffusion, and I write music."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Riffusion</h1>

        <p className={styles.description}>Hello</p>

      <ThreeCanvas />

      </main>

      {/* <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} /> */}
    </div>
  );
}
