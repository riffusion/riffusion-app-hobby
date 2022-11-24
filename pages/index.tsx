import Head from "next/head";
import { useState } from "react";

import ThreeCanvas from "../components/ThreeCanvas";
import PromptPanel from "../components/PromptPanel";
import Settings from "../components/Settings";
import Pause from "../components/Pause";

import { InferenceResult, PromptInput } from "../types";

const defaultPromptInputs = [
  { prompt: "A jazz pianist playing a classical concerto", seed: 10 },
  { prompt: "Taylor Swift singing with a tropical beat", seed: 10 },
];

export default function Home() {
  const [paused, setPaused] = useState(false);

  const [promptInputs, setPromptInputs] =
    useState<PromptInput[]>(defaultPromptInputs);

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
          <ThreeCanvas paused={paused} />
        </div>

        <PromptPanel
          prompts={promptInputs}
          addPrompt={(prompt: string, seed: number) => {
            setPromptInputs([...promptInputs, { prompt: prompt, seed: seed }]);
          }}
        />

        <Settings />

        <Pause paused={paused} setPaused={setPaused} />
      </div>
    </>
  );
}
