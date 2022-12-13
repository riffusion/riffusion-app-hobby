import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Tone from "tone";

import AudioPlayer from "../components/AudioPlayer";
import PageHead from "../components/PageHead";
import Share from "../components/Share";
import Settings from "../components/Settings";
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
import Link from "next/link";

const defaultPromptInputs = [
  { prompt: "A jazz pianist playing a concerto" },
  { prompt: "Techno DJ and a Country Singer" },
  { prompt: "Classical italian tenor operatic pop" },
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

  // Settings
  const [denoising, setDenoising] = useState(0.75);
  const [seedImageId, setSeedImageId] = useState("og_beat");

  // Prompts shown on screen and maintained by the prompt panel
  const [promptInputs, setPromptInputs] = useState<PromptInput[]>([]);

  // Model execution results
  const [inferenceResults, setInferenceResults] = useState<InferenceResult[]>(
    []
  );

  // Currently playing result, from the audio player
  const [nowPlayingResult, setNowPlayingResult] =
    useState<InferenceResult>(null);

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

    if (router.query.denoising) {
      setDenoising(parseFloat(router.query.denoising as string));
    }

    if (router.query.seedImageId) {
      setSeedImageId(router.query.seedImageId as string);
    }
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
      if (upNextPrompt) {
        newAppState = AppState.TRANSITION;

        // swap the last two prompts to bring the upNextPrompt into the next inference call
        setPromptInputs((prevPromptInputs) => {
          const newPromptInputs = [...prevPromptInputs];
          newPromptInputs[newPromptInputs.length - 1] = {
            prompt: endPrompt,
          };
          newPromptInputs[newPromptInputs.length - 2] = {
            prompt: upNextPrompt,
          };
          return newPromptInputs;
        });
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
      result.played = false;

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

    // find the first promptInput that matches the result.input.end.prompt and set it's transitionCounter to the result.counter if not already set
    setPromptInputs((prevPromptInputs) => {
      const newPromptInputs = [...prevPromptInputs];
      const promptInputIndex = newPromptInputs.findIndex(
        (p) => p.prompt == result.input.end.prompt
      );
      if (promptInputIndex >= 0) {
        if (newPromptInputs[promptInputIndex].transitionCounter == null) {
          newPromptInputs[promptInputIndex].transitionCounter = result.counter;
        }
      }
      return newPromptInputs;
    });

    // set played state for the result to true
    setInferenceResults((prevResults: InferenceResult[]) => {
      return prevResults.map((r) => {
        if (r.counter == result.counter) {
          r.played = true;
        }
        return r;
      });
    });
  };

  // TODO(hayk): This is not done yet but it's supposed to clear out future state and prompts
  // and allow the user to immediately start a new prompt.
  const resetCallback = () => {
    console.log("RESET");

    setPromptInputs([
      promptInputs[0],
      promptInputs[1],
      promptInputs[2],
      { prompt: "" },
      { prompt: "" },
      { prompt: "" },
    ]);

    if (nowPlayingResult == null) {
      setInferenceResults([]);
    }

    // const counter = nowPlayingResult ? nowPlayingResult.counter : -1;
    // setInferenceResults(inferenceResults.filter((r) => r.counter <= counter));
    // setNowPlayingResult(null);
  };

  return (
    <>
      <PageHead />

      <div className="absolute w-full h-screen z-10">
          {/* Note, top bg section is used to maintain color in background on ios notch devices */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#0A2342]" />
          <div className="absolute top-1 left-0 right-0 h-1/2 bg-gradient-to-b from-[#0A2342]" />
        </div>

      <div className="bg-[#0A2342] flex flex-row min-h-screen text-white">

        <div className="absolute w-full md:w-1/3">
          <div className="absolute top-4 md:top-6 left-0 right-0 flex justify-center">
            <div
              className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-t from-white/80 to-white/20 z-20 cursor-pointer"
              onClick={() => window.open("/about", "_blank")}
            >
              [RIFFUSION]
            </div>
          </div>
        </div>

        <div className="brightness-50	md:filter-none w-full z-0 md:w-1/3 min-h-screen">
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
          useBaseten={process.env.NEXT_PUBLIC_RIFFUSION_USE_BASETEN == "true"}
          denoising={denoising}
          seedImageId={seedImageId}
        />

        <AudioPlayer
          paused={paused}
          inferenceResults={inferenceResults}
          nowPlayingCallback={nowPlayingCallback}
        />

        <PromptPanel
          prompts={promptInputs}
          inferenceResults={inferenceResults}
          nowPlayingResult={nowPlayingResult}
          appState={appState}
          changePrompt={(prompt: string, index: number) => {
            const newPromptInputs = [...promptInputs];
            newPromptInputs[index].prompt = prompt;
            setPromptInputs(newPromptInputs);
          }}
          resetCallback={resetCallback}
        />

        <Pause paused={paused} setPaused={setPaused} />

        <Share
          inferenceResults={inferenceResults}
          nowPlayingResult={nowPlayingResult}
        />

        <Settings
          promptInputs={promptInputs}
          inferenceResults={inferenceResults}
          nowPlayingResult={nowPlayingResult}
          denoising={denoising}
          setDenoising={setDenoising}
          seedImage={seedImageId}
          setSeedImage={setSeedImageId}
        />
      </div>
    </>
  );
}
