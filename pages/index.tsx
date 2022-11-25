import Head from "next/head";
import { useEffect, useState, useRef } from "react";

import Image from "next/image";

import ThreeCanvas from "../components/ThreeCanvas";
import PromptPanel from "../components/PromptPanel";
import Info from "../components/Info";
import Pause from "../components/Pause";

import { InferenceResult, PromptInput } from "../types";

import * as Tone from "tone";

const SERVER_URL = "http://129.146.52.68:3013/run_inference/";

const defaultPromptInputs = [
  { prompt: "A jazz pianist playing a classical concerto" },
  { prompt: "Country singer and a techno DJ" },
  { prompt: "A typewriter in they style of K-Pop" },
  { prompt: "Boy band with a tropical beat " },
  { prompt: "" },
  { prompt: "" },
];

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

const defaultInferenceResults = [];

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

  const [numClipsPlayed, setNumClipsPlayed] = useState(0);
  const [prevNumClipsPlayed, setPrevNumClipsPlayed] = useState(0);

  const [resultCounter, setResultCounter] = useState(0);

  // const [randomImgSrc, setRandomImgSrc] = useState("");

  // On load, populate the first two prompts from checked-in URLs
  useEffect(() => {
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
        image: await urlToBase64("rap_sample.jpg") as string,
        audio: await urlToBase64("rap_sample.mp3") as string,
        counter: 0,
      };

      const result2 = {
        input: {
          alpha: 0.0,
          start: defaultPromptInputs[0],
          end: defaultPromptInputs[1],
        },
        image: await urlToBase64("pop_sample.jpg") as string,
        audio: await urlToBase64("pop_sample.mp3") as string,
        counter: 1,
      };

      setInferenceResults([...inferenceResults, result1, result2]);
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
          Tone.Transport.getSecondsAtTime(time)
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
      console.info("not picking a new result, none available", resultCounter, maxResultCounter);
      return;
    }

    const result = inferenceResults.find(
      (r: InferenceResult) => r.counter == resultCounter
    );

    console.log("Incrementing result counter ", resultCounter, result);
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

  // Request a new inference prompt at a regular interval
  // TODO(hayk): Rewrite this to request more frequently and max out
  // useEffect(() => {
  //   console.log("setInterval");
  //   setInterval(() => {
  //     setInferenceResults((prevResults) => {
  //       const lastResult = prevResults[prevResults.length - 2];
  //       const newResult = { ...lastResult, counter: lastResult.counter + 2 };

  //       let results = [...prevResults, newResult];

  //       if (results.length > maxLength) {
  //         results = results.slice(1);
  //       }

  //       console.log(results);

  //       return results;
  //     });
  //   }, timeout);
  // }, []);

  // useEffect(() => {
  //   console.log("FETCHING");
  //   fetch(SERVER_URL, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //     body: JSON.stringify({
  //       alpha: 0.0,
  //       start: {
  //         prompt: "bieber grunge",
  //         seed: 42,
  //       },
  //       end: {
  //         prompt: "eminem violin",
  //         seed: 10,
  //       },
  //     }),
  //   })
  //     .then((response) => {
  //       console.log("Got response!");
  //       response.json().then((data) => {
  //         const imageB64Bytes = data.image;
  //         // const imageBytes = Buffer.from(imageB64Bytes, "base64").toString();
  //         // const image_bytes = new TextDecoder("utf-8").decode(imageB64Bytes);

  //         const audioB64Bytes = data.audio;
  //         var snd = new Audio("data:audio/mp3;base64," + audioB64Bytes);
  //         snd.play();

  //         // const audio_bytes = new TextDecoder("utf-8").decode(audioB64Bytes);

  //         // console.log(imageBytes);
  //         setRandomImgSrc(imageB64Bytes);
  //       });
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

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
              tonePlayer ? tonePlayer.sampleTime * tonePlayer.buffer.length : 5
            }
            inferenceResults={inferenceResults}
          />
        </div>

        {/* TODO(hayk): Kill this, just for testing. */}
        {/* {randomImgSrc && (
          <Image
            unoptimized
            src={`data:image/png;base64,${randomImgSrc}`}
            alt={"random image"}
            width={256}
            height={256}
          />
        )} */}

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
          nextPrompt={() => {
            // if there are no upcoming prompts, don't do anything
            var promptLastIndex = promptInputs.length - 1;
            if (
              promptInputs[promptLastIndex].prompt == "" &&
              promptInputs[promptLastIndex - 1].prompt == ""
            ) {
              return;
            }
            setPromptInputs([...promptInputs, { prompt: "" }]);
          }}
        />

        <Info />

        <Pause paused={paused} setPaused={setPaused} />
      </div>
    </>
  );
}
