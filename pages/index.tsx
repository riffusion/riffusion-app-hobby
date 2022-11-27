import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useInterval, useTimeout } from "usehooks-ts";
import * as Tone from "tone";

import AudioPlayer from "../components/AudioPlayer";
import ThreeCanvas from "../components/ThreeCanvas";
import PromptPanel from "../components/PromptPanel";
import Info from "../components/Info";
import Pause from "../components/Pause";

import { InferenceResult, PromptInput } from "../types";

// TODO(hayk): Get this into a configuration.
const SERVER_URL = "http://129.146.52.68:3013/run_inference/";

const defaultPromptInputs = [
  { prompt: "A jazz pianist playing a classical concerto" },
  { prompt: "Country singer and a techno DJ" },
  { prompt: "A typewriter in the style of K-Pop" },
  { prompt: "lo-fi beat for the holidays" },
  { prompt: "" },
  { prompt: "" },
];

enum AppState {
  SamePrompt,
  Transition,
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

// TODO(hayk): Do this as soon as sample comes back
const timeout = 5000;
const maxLength = 10;
const maxNumInferenceResults = 15;

export default function Home() {
  // Create parameters for the inference request
  const [denoising, setDenoising] = useState(0.75);
  const [guidance, setGuidance] = useState(7.0);
  const [numInferenceSteps, setNumInferenceSteps] = useState(50);
  const [seedImageId, setSeedImageId] = useState("og_beat");
  const [maskImageId, setMaskImageId] = useState(null);

  // Create parameters for the app state
  const [appState, setAppState] = useState<AppState>(AppState.SamePrompt);
  const [alpha, setAlpha] = useState(0.0);
  const [alphaVelocity, setAlphaVelocity] = useState(0.25);
  const [seed, setSeed] = useState(getRandomInt(1000000));
  const [paused, setPaused] = useState(true);

  // If a prompt is available from a query string, set it as the initial
  const router = useRouter();

  const [promptInputs, setPromptInputs] =
    useState<PromptInput[]>(defaultPromptInputs);

  // Set the initial seed from the URL if available
  useEffect(() => {
    if (router.query.denoising) {
      setDenoising(parseFloat(router.query.denoising as string));
    }

    if (router.query.guidance) {
      setGuidance(parseFloat(router.query.guidance as string));
    }

    if (router.query.numInferenceSteps) {
      setNumInferenceSteps(parseInt(router.query.numInferenceSteps as string));
    }

    if (router.query.seedImageId) {
      setSeedImageId(router.query.seedImageId as string);
    }

    if (router.query.maskImageId) {
      if (router.query.maskImageId === "none") {
        setMaskImageId("");
      } else {
        setMaskImageId(router.query.maskImageId as string);
      }
    }

    if (router.query.alphaVelocity) {
      setAlphaVelocity(parseFloat(router.query.alphaVelocity as string));
    }

    if (router.query.seed) {
      console.log("setting seed");
      setSeed(parseInt(router.query.seed as string));
    }

    if (router.query.prompt) {
      setPromptInputs((promptInputs) => {
        promptInputs[3].prompt = router.query.prompt as string;
        return promptInputs;
      });
    }
  }, [router.query]);

  const [inferenceResults, setInferenceResults] = useState<InferenceResult[]>(
    []
  );

  // Set the app state based on the prompt inputs array
  useEffect(() => {
    if (alpha <= 1) {
      return;
    }

    const upNextPrompt = promptInputs[promptInputs.length - 1].prompt;
    const endPrompt = promptInputs[promptInputs.length - 2].prompt;

    if (appState == AppState.SamePrompt) {
      if (endPrompt) {
        setAppState(AppState.Transition);
      }
      setSeed(seed + 1);
    } else if (appState == AppState.Transition) {
      setPromptInputs([...promptInputs, { prompt: "" }]);

      if (upNextPrompt) {
        setAppState(AppState.Transition);
      } else {
        setAppState(AppState.SamePrompt);
      }
    }

    setAlpha(alpha - 1);
  }, [promptInputs, alpha, appState, seed]);

  // On any app state change, reset alpha
  useEffect(() => {
    console.log("App State: ", appState);
    setAlpha(0.25);
  }, [appState]);

  const runInference = async (
    alpha: number,
    seed: number,
    appState: AppState,
    promptInputs: PromptInput[]
  ) => {
    const startPrompt = promptInputs[promptInputs.length - 3].prompt;
    const endPrompt = promptInputs[promptInputs.length - 2].prompt;

    const transitioning = appState == AppState.Transition;

    const inferenceInput = {
      alpha: alpha,
      num_inference_steps: numInferenceSteps,
      seed_image_id: seedImageId,
      mask_image_id: maskImageId,
      start: {
        prompt: startPrompt,
        seed: seed,
        denoising: denoising,
        guidance: guidance,
      },
      end: {
        prompt: transitioning ? endPrompt : startPrompt,
        seed: transitioning ? seed : seed + 1,
        denoising: denoising,
        guidance: guidance,
      },
    };

    console.log("Running for input: ", inferenceInput);

    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(inferenceInput),
    });

    const data = await response.json();

    setInferenceResults((prevResults: InferenceResult[]) => {
      const maxResultCounter = Math.max(...prevResults.map((r) => r.counter));

      const lastResult = prevResults.find((r) => r.counter == maxResultCounter);

      const newCounter = lastResult ? lastResult.counter + 1 : 0;

      const newResult = {
        input: inferenceInput,
        image: data.image,
        audio: data.audio,
        duration_s: data.duration_s,
        counter: newCounter,
      };

      setAlpha(alpha + alphaVelocity);

      let results = [...prevResults, newResult];

      // TODO(hayk): Move this somewhere more reasonable to prune.
      if (results.length > maxLength) {
        results = results.slice(1);
      }

      console.log(results);

      return results;
    });
  };

  // Run inference on a timer.
  // TODO(hayk): Improve the strategy here.
  useInterval(() => {
    if (inferenceResults.length < maxNumInferenceResults) {
      runInference(alpha, seed, appState, promptInputs);
    }
  }, timeout);

  // TODO(hayk): Fix warning about effects.
  useTimeout(() => {
    runInference(alpha, seed, appState, promptInputs);
  }, 1000);

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
            inferenceResults={inferenceResults}
          />
        </div>

        <AudioPlayer paused={paused} inferenceResults={inferenceResults} />

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
