import Head from "next/head";

import ThreeCanvas from "../components/ThreeCanvas";
import { FiSliders, FiPause } from "react-icons/fi";

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
          <div className="pl-20 pt-10">
            <p className="pb-32 text-lg text-gray-400">
              A jazz pianist playing a classical concerto
            </p>
            <p className="pb-32 text-xl text-gray-300">
              Taylor Swift with a tropical beat
            </p>
            <p className="pb-32 text-3xl text-white">Justin Bieber Anger Rap</p>
            <p className="pb-32 text-m text-gray-400">
              new york city rap, with a dust storm, cinematic score, dramatic,
              composition, tons of energy, brutalistic
            </p>
          </div>
        </main>

        {/* TODO(hayk): Convert into components. */}
        <button
          title="Settings"
          className="fixed z-90 top-8 right-8 bg-slate-100 w-14 h-14 rounded-full drop-shadow-lg
          flex justify-center items-center text-black text-2xl hover:bg-sky-500 hover:drop-shadow-2xl"
        >
          <FiSliders />
        </button>

        <button
          title="Pause"
          className="fixed z-90 top-28 right-8 bg-slate-100 w-14 h-14 rounded-full drop-shadow-lg
          flex justify-center items-center text-black text-2xl hover:bg-sky-500 hover:drop-shadow-2xl"
        >
          <FiPause />
        </button>

        <input
          className="fixed z-90 bottom-20 right-40 w-1/2 h-12 pl-3 text-xl text-black"
          type="text"
          id="prompt"
          name="prompt"
          placeholder="What do you want to hear?"
        />
      </div>
    </>
  );
}
