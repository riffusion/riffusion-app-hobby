import Head from "next/head";

import ThreeCanvas from "../components/ThreeCanvas";
import PromptPanel from "../components/PromptPanel";
import Settings from '../components/Settings'
import Pause from '../components/Pause'

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

        <PromptPanel />

        <Settings />
        <Pause />
      </div>
    </>
  );
}
