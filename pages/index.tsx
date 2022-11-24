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
  { prompt: "A typewriter in the bahamas"},
  { prompt: "Justin Bieber anger rap"},
  { prompt: "New york city rap, with a dust storm, cinematic score, dramatic, composition"},
  { prompt: "Jack Johnson playing a harmonica in the 1920s"},
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

// TODO(hayk): Do this as soon as sample comes back
const timeout = 5150;
const maxLength = 10;

export default function Home() {
  const [paused, setPaused] = useState(true);

  const [promptInputs, setPromptInputs] =
    useState<PromptInput[]>(defaultPromptInputs);

  const [inferenceResults, setInferenceResults] = useState<InferenceResult[]>(
    defaultInferenceResults
  );

  // /////////////

  const [tonePlayer, setTonePlayer] = useState<Tone.Player>(null);

  useEffect(() => {
    // HACK(hayk): Kill
    if (tonePlayer) {
      return;
    }

    if (inferenceResults.length == 0) {
      return;
    }
    console.log(inferenceResults);

    const player = new Tone.Player(
      inferenceResults[inferenceResults.length - 1].audio,
      () => {
        console.log("New player loaded.");

        player.sync().start(0);

        // if (tonePlayer) {
        //   tonePlayer.stop();
        //   tonePlayer.dispose();
        // }
        setTonePlayer(player);
      }
    ).toDestination();
    player.loop = true;
  }, [inferenceResults]);

  useEffect(() => {
    if (!paused) {
      console.log("Play");

      if (Tone.context.state == "suspended") {
        Tone.context.resume();
      }

      if (tonePlayer) {
        Tone.Transport.start();
      }
    } else {
      console.log("Pause");

      if (tonePlayer) {
        Tone.Transport.pause();
      }
    }
  }, [paused, tonePlayer]);

  // /////////////

  useEffect(() => {
    console.log("setInterval");
    setInterval(() => {
      setInferenceResults((prevResults) => {
        const lastResult = prevResults[prevResults.length - 1];
        const newResult = { ...lastResult, counter: lastResult.counter + 1 };

        let results = [...prevResults, newResult];

        if (results.length > maxLength) {
          results = results.slice(1);
        }

        return results;
      });
    }, timeout);
  }, []);

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
          <ThreeCanvas
            paused={paused}
            getTime={() => Tone.Transport.seconds}
            audioLength={tonePlayer ? tonePlayer.sampleTime * tonePlayer.buffer.length : 5}
            inferenceResults={inferenceResults}
          />
        </div>

        <PromptPanel
          prompts={promptInputs}
          addPrompt={(prompt: string) => {
            setPromptInputs([...promptInputs, { prompt: prompt }]);
          }}
          changeUpNextPrompt={(prompt: string) => {
            const newPromptInputs = [...promptInputs];
            newPromptInputs[newPromptInputs.length - 1].prompt = prompt;
            setPromptInputs(newPromptInputs);
          }}
        />

        <Settings />

        <Pause paused={paused} setPaused={setPaused} />
      </div>
    </>
  );
}
