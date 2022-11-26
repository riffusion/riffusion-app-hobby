import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useInterval, useTimeout } from "usehooks-ts";

import ThreeCanvas from "../components/ThreeCanvas";
import PromptPanel from "../components/PromptPanel";
import Info from "../components/Info";
import Pause from "../components/Pause";

import { InferenceResult, PromptInput } from "../types";

import * as Tone from "tone";

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

const urlToBase64 = async (url: string) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

// TODO(hayk): Do this as soon as sample comes back
const timeout = 5000;
const maxLength = 10;
const maxNumInferenceResults = 15;

export default function Home() {
  const [denoising, setDenoising] = useState(0.75);
  const [guidance, setGuidance] = useState(7.0);
  const [numInferenceSteps, setNumInferenceSteps] = useState(50);
  const [seedImageId, setSeedImageId] = useState("og_beat");
  const [maskImageId, setMaskImageId] = useState(null);

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

  const [tonePlayer, setTonePlayer] = useState<Tone.Player>(null);

  const [numClipsPlayed, setNumClipsPlayed] = useState(0);
  const [prevNumClipsPlayed, setPrevNumClipsPlayed] = useState(0);

  const [resultCounter, setResultCounter] = useState(0);

  const [alpha, setAlpha] = useState(0.0);

  const [appState, setAppState] = useState<AppState>(AppState.SamePrompt);

  // On load, populate the first two prompts from checked-in URLs
  useEffect(() => {
    // NOTE(hayk): not currently populating initial prompts.
    if (true) {
      return;
    }

    if (inferenceResults.length > 0) {
      return;
    }

    const populateDefaults = async () => {
      const result1 = {
        input: {
          alpha: 0.0,
          start: defaultPromptInputs[0],
          end: defaultPromptInputs[1],
        },
        image: (await urlToBase64("rap_sample.jpg")) as string,
        audio: (await urlToBase64("rap_sample.mp3")) as string,
        counter: 0,
      };

      const result2 = {
        input: {
          alpha: 0.0,
          start: defaultPromptInputs[0],
          end: defaultPromptInputs[1],
        },
        image: (await urlToBase64("pop_sample.jpg")) as string,
        audio: (await urlToBase64("pop_sample.mp3")) as string,
        counter: 1,
      };

      console.log(result1);
      setInferenceResults([...inferenceResults, result1]);
    };

    populateDefaults();
  }, [inferenceResults]);

  // On load, create a player synced to the tone transport
  useEffect(() => {
    if (tonePlayer) {
      return;
    }

    if (inferenceResults.length === 0) {
      return;
    }

    const audioUrl = inferenceResults[0].audio;

    const player = new Tone.Player(audioUrl, () => {
      console.log("Created player.");

      player.loop = true;
      player.sync().start(0);

      // Set up a callback to increment numClipsPlayed at the edge of each clip
      const bufferLength = player.sampleTime * player.buffer.length;
      Tone.Transport.scheduleRepeat((time) => {
        console.log(
          "Edge of clip, t = ",
          Tone.Transport.getSecondsAtTime(time),
          bufferLength
        );
        setNumClipsPlayed((n) => n + 1);
      }, bufferLength);

      setTonePlayer(player);

      // Make further load callbacks do nothing.
      player.buffer.onload = () => {};
    }).toDestination();
  }, [tonePlayer, inferenceResults]);

  // On play/pause button, play/pause the audio with the tone transport
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

  useEffect(() => {
    if (numClipsPlayed == prevNumClipsPlayed) {
      return;
    }

    const maxResultCounter = Math.max(
      ...inferenceResults.map((r) => r.counter)
    );

    if (maxResultCounter < resultCounter) {
      console.info(
        "not picking a new result, none available",
        resultCounter,
        maxResultCounter
      );
      return;
    }

    const result = inferenceResults.find(
      (r: InferenceResult) => r.counter == resultCounter
    );

    console.log("Incrementing result counter ", resultCounter);
    setResultCounter((c) => c + 1);

    tonePlayer.load(result.audio).then(() => {
      console.log("Loaded new audio");

      // Re-jigger the transport so it stops playing old buffers. It seems like this doesn't
      // introduce a gap, but watch out for that.
      Tone.Transport.pause();
      if (!paused) {
        Tone.Transport.start();
      }
    });

    setPrevNumClipsPlayed(numClipsPlayed);
  }, [
    numClipsPlayed,
    prevNumClipsPlayed,
    resultCounter,
    inferenceResults,
    paused,
    tonePlayer,
  ]);

  // /////////////

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
  }, [promptInputs, alpha]);

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

    setInferenceResults((prevResults) => {
      const maxResultCounter = Math.max(...prevResults.map((r) => r.counter));

      const lastResult = prevResults.find((r) => r.counter == maxResultCounter);

      const newCounter = lastResult ? lastResult.counter + 1 : 0;

      const newResult = {
        input: inferenceInput,
        image: "data:image/jpeg;base64," + data.image,
        audio: "data:audio/mpeg;base64," + data.audio,
        counter: newCounter,
      };

      // TODO(hayk): Fix up
      // if (alpha > 1.0) {
      //   setAlpha(alpha - 0.75);
      //   setSeed(seed + 1);
      // } else {
      //   setAlpha(inferenceInput.alpha + alphaVelocity);
      // }
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
            audioLength={
              tonePlayer ? tonePlayer.sampleTime * tonePlayer.buffer.length : 0
            }
            inferenceResults={inferenceResults}
          />
        </div>

        <PromptPanel
          prompts={promptInputs}
          addPrompt={(prompt: string) => {
            setPromptInputs([...promptInputs, { prompt: prompt }]);
          }}
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
