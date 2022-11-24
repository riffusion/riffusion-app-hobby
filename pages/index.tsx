import Head from "next/head";
import { useEffect, useState } from "react";

import ThreeCanvas from "../components/ThreeCanvas";
import PromptPanel from "../components/PromptPanel";
import Settings from "../components/Settings";
import Pause from "../components/Pause";

import { InferenceResult, PromptInput } from "../types";

import * as Tone from "tone";

const defaultPromptInputs = [
  { prompt: "A jazz pianist playing a classical concerto"},
  { prompt: "Taylor Swift singing with a tropical beat"},
];

const defaultInferenceResults = [
  {
    input: {
      alpha: 0.0,
      start: defaultPromptInputs[0],
      end: defaultPromptInputs[1],
    },
    image: "rap_sample.jpg",
    audio: "rap_sample.mp3",
    counter: 0,
  },
];

const timeout = 5000;
const maxLength = 10;

export default function Home() {
  const [paused, setPaused] = useState(false);

  const [promptInputs, setPromptInputs] =
    useState<PromptInput[]>(defaultPromptInputs);

  const [inferenceResults, setInferenceResults] = useState<InferenceResult[]>(
    defaultInferenceResults
  );

  // /////////////

  const [tonePlayer, setTonePlayer] = useState(null);

  useEffect(() => {
    setTonePlayer(
      new Tone.Player(defaultInferenceResults[0].audio).toDestination()
    );
    // play as soon as the buffer is loaded
    // player.autostart = true;
  }, [inferenceResults]);

  useEffect(() => {
    if (tonePlayer && tonePlayer.loaded) {
      if (!paused) {
        tonePlayer.start();
      } else {
        tonePlayer.stop();
      }
    }
  }, [paused, tonePlayer]);

  // /////////////

  useEffect(() => {
    setTimeout(() => {
      const lastResult = inferenceResults[inferenceResults.length - 1];
      const newResult = { ...lastResult, counter: lastResult.counter + 1 };

      let results = [...inferenceResults, newResult];

      if (results.length > maxLength) {
        results = results.slice(1);
      }

      console.log("Adding to inference results");
      console.log(results);

      setInferenceResults(results);
    }, timeout);
  });

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

      <div className="bg-[#0A2342] flex flex-row min-h-screen text-white">
        <div className="w-1/3 min-h-screen">
          <ThreeCanvas paused={paused} inferenceResults={inferenceResults} />
        </div>

        <PromptPanel
          prompts={promptInputs}
          addPrompt={(prompt: string) => {
            setPromptInputs([...promptInputs, { prompt: prompt}]);
          }}
        />

        <Settings />

        <Pause paused={paused} setPaused={setPaused} />
      </div>
    </>
  );
}
