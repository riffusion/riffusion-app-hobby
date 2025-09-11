import React, { useCallback, useEffect, useState } from "react";
import { unmute } from "../external/unmute";
import * as Tone from "tone";

import AudioPlayer from "../components/AudioPlayer";
import FallingBehindWarning from "../components/FallingBehindWarning";
import PageHead from "../components/PageHead";
import Share from "../components/Share";
import Settings from "../components/Settings";
import ModelInference from "../components/ModelInference";
import Pause from "../components/Pause";
import PromptPanel from "../components/PromptPanel";
import ThreeCanvas from "../components/ThreeCanvas";

import { samplePrompts, initialSeeds, initialSeedImageMap } from "../samplePrompts";

import {
  AppState,
  InferenceInput,
  InferenceResult,
  PromptInput,
} from "../types";

function getRandomFromArray(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

export default function App() {
  // High-level state of the prompts
  const [appState, setAppState] = useState(AppState.UNINITIALIZED);

  // Whether playback is paused
  const [paused, setPaused] = useState(true);

  // Current interpolation parameters
  const [alpha, setAlpha] = useState(0.0);
  const [alphaRollover, setAlphaRollover] = useState(false);
  const [alphaVelocity, setAlphaVelocity] = useState(0.25);

  // Settings
  const [denoising, setDenoising] = useState(0.75);
  const [seedImageId, setSeedImageId] = useState(
    initialSeeds[Math.floor(Math.random() * initialSeeds.length)]
  );
  const [seed, setSeed] = useState(
    initialSeedImageMap[seedImageId][
      Math.floor(Math.random() * initialSeedImageMap[seedImageId].length)
    ]
  );

  // Prompts shown on screen and maintained by the prompt panel
  const [promptInputs, setPromptInputs] = useState([]);

  // Model execution results
  const [inferenceResults, setInferenceResults] = useState([]);

  // Currently playing result, from the audio player
  const [nowPlayingResult, setNowPlayingResult] = useState(null);

  // Initialize prompts on component mount (replaces Next.js router logic)
  useEffect(() => {
    // Set prompt inputs here so that they are empty and incorrect information isn't shown
    let initPromptInputs = [
      { prompt: "" },
      { prompt: "" },
      { prompt: "" },
      { prompt: "" },
      { prompt: "" },
      { prompt: "" },
    ];

    // Set random initial prompts
    const samples = getRandomFromArray(samplePrompts, 4);
    for (let i = 0; i < 4; i++) {
      initPromptInputs[i].prompt = samples[i];
    }
    
    // Check URL parameters if available
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('prompt')) {
      initPromptInputs[3].prompt = urlParams.get('prompt');
    }
    if (urlParams.get('alphaVelocity')) {
      setAlphaVelocity(parseFloat(urlParams.get('alphaVelocity')));
    }
    if (urlParams.get('seed')) {
      setSeed(parseInt(urlParams.get('seed')));
    }
    if (urlParams.get('denoising')) {
      setDenoising(parseFloat(urlParams.get('denoising')));
    }
    if (urlParams.get('seedImageId')) {
      setSeedImageId(urlParams.get('seedImageId'));
    }

    setPromptInputs(initPromptInputs);
  }, []);

  // Set the app state based on the prompt inputs array
  useEffect(() => {
    if (!alphaRollover) {
      return;
    }
    setAlphaRollover(false);

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
  }, [promptInputs, alpha, alphaRollover, appState, seed]);

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
  const newResultCallback = useCallback(
    (input, result) => {
      setInferenceResults((prevResults) => {
        const maxResultCounter = Math.max(...prevResults.map((r) => r.counter));

        const lastResult = prevResults.find(
          (r) => r.counter == maxResultCounter
        );

        const newCounter = lastResult ? lastResult.counter + 1 : 0;

        result.counter = newCounter;
        result.input = input;
        result.played = false;

        let newAlpha = alpha + alphaVelocity;
        if (newAlpha > 1 + 1e-3) {
          newAlpha = newAlpha - 1;
          setAlphaRollover(true);
        }
        setAlpha(newAlpha);

        return [...prevResults, result];
      });
    },
    [alpha, alphaVelocity]
  );

  // State to handle the timeout for the player to not hog GPU forever
  const timeoutIncrement = 600.0;
  const [timeoutPlayerTime, setTimeoutPlayerTime] = useState(timeoutIncrement);

  const nowPlayingCallback = useCallback(
    (result, playerTime) => {
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
            newPromptInputs[promptInputIndex].transitionCounter =
              result.counter;
          }
        }
        return newPromptInputs;
      });

      // set played state for the result to true
      setInferenceResults((prevResults) => {
        return prevResults.map((r) => {
          if (r.counter == result.counter) {
            r.played = true;
          }
          return r;
        });
      });

      // Extend the timeout if we're transitioning
      if (appState == AppState.TRANSITION) {
        setTimeoutPlayerTime(playerTime + timeoutIncrement);
      }

      // If we've hit the timeout, pause and increment the timeout
      if (playerTime > timeoutPlayerTime) {
        setTimeoutPlayerTime(playerTime + timeoutIncrement);
        setPaused(true);

        setTimeout(() => {
          if (confirm("Are you still riffing?")) {
            setPaused(false);
          }
        }, 100);
      }
    },
    [timeoutPlayerTime, appState]
  );

  // Track from the audio player whether we're behind on having new inference results
  const [playerIsBehind, setPlayerIsBehind] = useState(false);
  const playerIsBehindCallback = (isBehind) => {
    setPlayerIsBehind(isBehind);
  };

  // Reset callback
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
  };

  useEffect(() => {
    unmute(Tone.context.rawContext, true, false);
  }, []);

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
              className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-t from-white/80 to-white/70 z-20 cursor-pointer"
              onClick={() => window.open("/about", "_blank")}
            >
              [RIFFUSION]
            </div>
          </div>
        </div>

        {playerIsBehind ? <FallingBehindWarning /> : null}

        <div className="brightness-50	md:filter-none w-full z-0 md:w-1/3 min-h-screen">
          <ThreeCanvas
            paused={paused}
            getTime={() => Tone.Transport.seconds}
            inferenceResults={inferenceResults}
          />
        </div>

        <ModelInference
          alpha={alpha}
          alphaRollover={alphaRollover}
          seed={seed}
          appState={appState}
          promptInputs={promptInputs}
          nowPlayingResult={nowPlayingResult}
          newResultCallback={newResultCallback}
          useBaseten={process.env.REACT_APP_RIFFUSION_USE_BASETEN == "true"}
          denoising={denoising}
          seedImageId={seedImageId}
        />

        <AudioPlayer
          paused={paused}
          inferenceResults={inferenceResults}
          nowPlayingCallback={nowPlayingCallback}
          playerIsBehindCallback={playerIsBehindCallback}
          useCompressor={true}
        />

        <PromptPanel
          prompts={promptInputs}
          inferenceResults={inferenceResults}
          nowPlayingResult={nowPlayingResult}
          appState={appState}
          changePrompt={(prompt, index) => {
            const newPromptInputs = [...promptInputs];
            newPromptInputs[index].prompt = prompt;
            setPromptInputs(newPromptInputs);
          }}
          setPaused={setPaused}
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