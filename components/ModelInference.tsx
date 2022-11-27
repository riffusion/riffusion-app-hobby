import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";

import {
  AppState,
  InferenceInput,
  InferenceResult,
  PromptInput,
} from "../types";

// TODO(hayk): Get this into a configuration.
const SERVER_URL = "http://129.146.52.68:3013/run_inference/";

interface ModelInferenceProps {
  alpha: number;
  seed: number;
  appState: AppState;
  promptInputs: PromptInput[];
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
  const runInference = useCallback(async (
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

    console.log("Running for input: ", inferenceInput);
    setNumRequestsMade((n) => n + 1);

    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(inferenceInput),
    });

    const data = await response.json();

    newResultCallback(inferenceInput, data);
  }, [denoising, guidance, maskImageId, numInferenceSteps, seedImageId, newResultCallback]);

  // Kick off the first inference run when everything is ready.
  useEffect(() => {
    if (numRequestsMade > 0) {
      return;
    }
    if (
      !initializedUrlParams ||
      appState == AppState.UNINITIALIZED ||
      promptInputs.length == 0
    ) {
      return;
    }

    console.log("First inference");
    runInference(alpha, seed, appState, promptInputs);
  }, [
    initializedUrlParams,
    numRequestsMade,
    alpha,
    seed,
    appState,
    promptInputs,
    runInference,
  ]);

  // Run inference on a timer.
  // TODO(hayk): Fix this to properly handle state.
  useInterval(() => {
    // if (inferenceResults.length < maxNumInferenceResults) {
    runInference(alpha, seed, appState, promptInputs);
    // }
  }, 4900);

  return null;
}
