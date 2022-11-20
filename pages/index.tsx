import Head from "next/head";
import Image from "next/image";

import ThreeCanvas from "../components/ThreeCanvas";

// import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Riffusion</title>
        <meta
          name="description"
          content="My name is Riffusion, and I write music."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-sky-900 flex flex-row min-h-screen text-white">
        <div className="w-1/3 min-h-screen">
          <ThreeCanvas />
        </div>

        <main className="w-2/3 min-h-screen p-4">
          <h2 className="text-2xl text-center text-white text-right">
            Riffusion
          </h2>

          <div className="pl-20">
            <p className="pb-32 text-lg text-gray-400">A jazz pianist playing a classical concerto</p>
            <p className="pb-32 text-xl text-gray-300">Taylor Swift with a tropical beat</p>
            <p className="pb-32 text-3xl text-white">Justin Bieber Anger Rap</p>
            <p className="pb-32 text-m text-gray-400">
              new york city rap, with a dust storm, cinematic score, dramatic,
              composition, tons of energy, brutalistic
            </p>
          </div>
        </main>

        {/* <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} /> */}
      </div>
    </>
  );
}
