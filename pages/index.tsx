import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Tone from "tone";

import AudioPlayer from "../components/AudioPlayer";
import PageHead from "../components/PageHead";
import Info from "../components/Info";
import ModelInference from "../components/ModelInference";
import Pause from "../components/Pause";
import PromptPanel from "../components/PromptPanel";
import ThreeCanvas from "../components/ThreeCanvas";

import {
  AppState,
  InferenceInput,
  InferenceResult,
  PromptInput,
} from "../types";

const defaultPromptInputs = [
  { prompt: "A jazz pianist playing a classical concerto" },
  { prompt: "Country singer and a techno DJ" },
  { prompt: "A typewriter in the style of K-Pop" },
  { prompt: "lo-fi beat for the holidays" },
  { prompt: "" },
  { prompt: "" },
];

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export default function Home() {
  // High-level state of the prompts
  const [appState, setAppState] = useState<AppState>(AppState.UNINITIALIZED);

  // Whether playback is paused
  const [paused, setPaused] = useState(true);

  // Current interpolation parameters
  const [alpha, setAlpha] = useState(0.0);
  const [alphaVelocity, setAlphaVelocity] = useState(0.25);
  const [seed, setSeed] = useState(getRandomInt(1000000));

  // Prompts shown on screen and maintained by the prompt panel
  const [promptInputs, setPromptInputs] = useState<PromptInput[]>([]);

  // Model execution results
  const [inferenceResults, setInferenceResults] = useState<InferenceResult[]>(
    []
  );

  // Currently playing result, from the audio player
  const [nowPlayingResult, setNowPlayingResult] = useState<InferenceResult>(null);

  // Set the initial seed from the URL if available
  const router = useRouter();
  useEffect(() => {
    // Make sure params are ready
    if (!router.isReady) {
      return;
    }

    if (router.query.alphaVelocity) {
      setAlphaVelocity(parseFloat(router.query.alphaVelocity as string));
    }

    if (router.query.seed) {
      setSeed(parseInt(router.query.seed as string));
    }

    // Set prompt inputs here so that they are empty and incorrect information isn't shown
    // until URL params have a chance to be read.
    let initPromptInputs = defaultPromptInputs;
    if (router.query.prompt) {
      initPromptInputs[3].prompt = router.query.prompt as string;
    }
    setPromptInputs(defaultPromptInputs);
  }, [router.isReady, router.query]);

  // Set the app state based on the prompt inputs array
  useEffect(() => {
    if (alpha <= 1) {
      return;
    }

    const upNextPrompt = promptInputs[promptInputs.length - 1].prompt;
    const endPrompt = promptInputs[promptInputs.length - 2].prompt;

    let newAppState = appState;

    if (appState == AppState.SAME_PROMPT) {
      if (endPrompt) {
        newAppState = AppState.TRANSITION;
      }
      setSeed(seed + 1);
    } else if (appState == AppState.TRANSITION) {
      setPromptInputs([...promptInputs, { prompt: "" }]);

      if (upNextPrompt) {
        newAppState = AppState.TRANSITION;
      } else {
        newAppState = AppState.SAME_PROMPT;
      }
    }

    if (newAppState != appState) {
      setAppState(newAppState);
    }

    setAlpha(alpha - 1);
  }, [promptInputs, alpha, appState, seed]);

  // On any app state change, reset alpha
  useEffect(() => {
    console.log("App State: ", appState);

    if (appState == AppState.UNINITIALIZED) {
      setAppState(AppState.SAME_PROMPT);
    } else {
      setAlpha(0.25);
    }
  }, [appState]);

  // What to do when a new inference result is available
  const newResultCallback = (
    input: InferenceInput,
    result: InferenceResult
  ) => {
    setInferenceResults((prevResults: InferenceResult[]) => {
      const maxResultCounter = Math.max(...prevResults.map((r) => r.counter));

      const lastResult = prevResults.find((r) => r.counter == maxResultCounter);

      const newCounter = lastResult ? lastResult.counter + 1 : 0;

      result.counter = newCounter;
      result.input = input;

      setAlpha(alpha + alphaVelocity);

      return [...prevResults, result];
    });
  };

  const nowPlayingCallback = (result: InferenceResult, playerTime: number) => {
    console.log(
      "Now playing result ",
      result.counter,
      ", player time is ",
      playerTime
    );

    setNowPlayingResult(result);
  };

  return (
    <>
      <PageHead />

      <div className="bg-[#0A2342] flex flex-row min-h-screen text-white">
        <div className="w-1/3 min-h-screen">
          <ThreeCanvas
            paused={paused}
            getTime={() => Tone.Transport.seconds}
            inferenceResults={inferenceResults}
          />
        </div>

        <ModelInference
          alpha={alpha}
          seed={seed}
          appState={appState}
          promptInputs={promptInputs}
          nowPlayingResult={nowPlayingResult}
          newResultCallback={newResultCallback}
        />
        <AudioPlayer
          paused={paused}
          inferenceResults={inferenceResults}
          nowPlayingCallback={nowPlayingCallback}
        />

        <PromptPanel
          prompts={promptInputs}
          changePrompt={(prompt: string, index: number) => {
            const newPromptInputs = [...promptInputs];
            newPromptInputs[index].prompt = prompt;
            setPromptInputs(newPromptInputs);
          }}
        />

        <Info />

        <Pause paused={paused} setPaused={setPaused} />
      </div>
    </>
  );
}
