import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import {
  AppState,
  InferenceInput,
  InferenceResult,
  PromptInput,
} from "../types";

// TODO(hayk): Get this into a configuration.
const SERVER_URL = "http://129.146.52.68:3013/run_inference/";
// Baseten worklet api url. Using cors-anywhere to get around CORS issues.
const BASETEN_URL = "http://cors-anywhere.herokuapp.com/https://app.baseten.co/applications/2qREaXP/production/worklets/mP7KkLP/invoke";
// Temporary basten API key "irritating-haircut"
const BASETEN_API_KEY = "JocxKmyo.g0JreAA8dZy5F20PdMxGAV34a4VGGpom"

interface ModelInferenceProps {
  alpha: number;
  seed: number;
  appState: AppState;
  promptInputs: PromptInput[];
  nowPlayingResult: InferenceResult;
  newResultCallback: (input: InferenceInput, result: InferenceResult) => void;
}

/**
 * Calls the server to run model inference.
 *
 *
 */
export default function ModelInference({
  alpha,
  seed,
  appState,
  promptInputs,
  nowPlayingResult,
  newResultCallback,
}: ModelInferenceProps) {
  // Create parameters for the inference request
  const [denoising, setDenoising] = useState(0.75);
  const [guidance, setGuidance] = useState(7.0);
  const [numInferenceSteps, setNumInferenceSteps] = useState(50);
  const [seedImageId, setSeedImageId] = useState("og_beat");
  const [maskImageId, setMaskImageId] = useState(null);

  const [initializedUrlParams, setInitializedUrlParams] = useState(false);
  const [numRequestsMade, setNumRequestsMade] = useState(0);
  const [numResponsesReceived, setNumResponsesReceived] = useState(0);

  // Set initial params from URL query strings
  const router = useRouter();
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

    setInitializedUrlParams(true);
  }, [router.query]);

  // Memoized function to kick off an inference request
  const runInference = useCallback(
    async (
      alpha: number,
      seed: number,
      appState: AppState,
      promptInputs: PromptInput[]
    ) => {
      const startPrompt = promptInputs[promptInputs.length - 3].prompt;
      const endPrompt = promptInputs[promptInputs.length - 2].prompt;

      const transitioning = appState == AppState.TRANSITION;

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

      console.log(`Inference #${numRequestsMade}: `, {
        alpha: alpha,
        prompt_a: inferenceInput.start.prompt,
        seed_a: inferenceInput.start.seed,
        prompt_b: inferenceInput.end.prompt,
        seed_b: inferenceInput.end.seed,
        appState: appState,
      });

      setNumRequestsMade((n) => n + 1);

      // Server API call
      // const ServerResponse = await fetch(SERVER_URL, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Access-Control-Allow-Origin": "*",
      //   },
      //   body: JSON.stringify(inferenceInput),
      // });

      // Baseten worklet API call
      const response = await fetch(BASETEN_URL, {
        method: "POST",
        headers: {
          "Authorization": "Api-Key JocxKmyo.g0JreAA8dZy5F20PdMxGAV34a4VGGpom",
          "Access-Control-Allow-Origin": "*",
        },
        // add the body of the request with {"worklet_input": {}}
        body: JSON.stringify({worklet_input: inferenceInput}),
      });

      const data = await response.json();

      console.log(`Got result #${numResponsesReceived}`);
      newResultCallback(inferenceInput, data);
      setNumResponsesReceived((n) => n + 1);
    },
    [
      denoising,
      guidance,
      maskImageId,
      numInferenceSteps,
      seedImageId,
      newResultCallback,
      numRequestsMade,
      numResponsesReceived,
    ]
  );

  // Kick off inference requests
  useEffect(() => {
    // Make sure things are initialized properly
    if (
      !initializedUrlParams ||
      appState == AppState.UNINITIALIZED ||
      promptInputs.length == 0
    ) {
      return;
    }

    if (numRequestsMade == 0) {
      // Kick off the first request
      runInference(alpha, seed, appState, promptInputs);
    } else if (numRequestsMade == numResponsesReceived) {
      // Otherwise buffer ahead a few from where the audio player currently is
      // TODO(hayk): Replace this with better buffer management

      const nowPlayingCounter = nowPlayingResult ? nowPlayingResult.counter : 0;
      const numAhead = numRequestsMade - nowPlayingCounter;

      if (numAhead < 3) {
        runInference(alpha, seed, appState, promptInputs);
      }
    }
  }, [
    initializedUrlParams,
    alpha,
    seed,
    appState,
    promptInputs,
    nowPlayingResult,
    numRequestsMade,
    numResponsesReceived,
    runInference,
  ]);

  return null;
}
