// Removed Next.js router dependency
import { useCallback, useEffect, useState } from "react";

import {
  AppState,
  InferenceInput,
  InferenceResult,
  PromptInput,
} from "../types";

interface ModelInferenceProps {
  alpha: number;
  alphaRollover: boolean;
  seed: number;
  appState: AppState;
  promptInputs: PromptInput[];
  nowPlayingResult: InferenceResult;
  newResultCallback: (input: InferenceInput, result: InferenceResult) => void;
  useBaseten: boolean;
  denoising: number;
  seedImageId: string;
}

/**
 * Calls the server to run model inference.
 *
 *
 */
export default function ModelInference({
  alpha,
  alphaRollover,
  seed,
  appState,
  promptInputs,
  nowPlayingResult,
  newResultCallback,
  useBaseten,
  denoising,
  seedImageId,
}: ModelInferenceProps) {
  // Create parameters for the inference request
  const [guidance, setGuidance] = useState(7.0);
  const [numInferenceSteps, setNumInferenceSteps] = useState(50);
  const [maskImageId, setMaskImageId] = useState(null);

  const [initializedUrlParams, setInitializedUrlParams] = useState(false);
  const [numRequestsMade, setNumRequestsMade] = useState(0);
  const [numResponsesReceived, setNumResponsesReceived] = useState(0);

  useEffect(() => {
    console.log("Using baseten: ", useBaseten);
  }, [useBaseten]);

  // Set initial params (removed router dependency)
  useEffect(() => {
    setInitializedUrlParams(true);
  }, []);

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

      // Customize for baseten
      const apiHandler = useBaseten
        ? process.env.NEXT_PUBLIC_RIFFUSION_BASETEN_GC_URL
        : "/api/server";
      const payload = useBaseten
        ? { worklet_input: inferenceInput }
        : inferenceInput;

      // NOTE(hayk): Clean this up with server.js, there's something fishy going on.
      const headers = useBaseten ? { "Content-Type": "application/json" } : {};

      const response = await fetch(apiHandler, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: headers,
      });

      const data = await response.json();

      console.log(`Got result #${numResponsesReceived}`);

      if (useBaseten) {
        if (data?.output) {
          newResultCallback(inferenceInput, data.output);
        } else {
          console.error("Baseten call failed: ", data);
        }
      } else {
        // Note, data is currently wrapped in a data field
        newResultCallback(inferenceInput, data.data);
      }

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
      useBaseten,
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

    // Wait for alpha rollover to resolve.
    if (alphaRollover) {
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
    alphaRollover,
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
