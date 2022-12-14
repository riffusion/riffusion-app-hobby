import { useEffect, useState } from "react";

import * as Tone from "tone";

import { InferenceResult } from "../types";

interface AudioPlayerProps {
  paused: boolean;
  inferenceResults: InferenceResult[];
  nowPlayingCallback: (result: InferenceResult, playerTime: number) => void;
  playerIsBehindCallback: (isBehind: boolean) => void;
}

/**
 * Audio player with Tone.js
 *
 * TODO(hayk): Look into https://github.com/E-Kuerschner/useAudioPlayer as an alternative.
 */
export default function AudioPlayer({
  paused,
  inferenceResults,
  nowPlayingCallback,
  playerIsBehindCallback,
}: AudioPlayerProps) {
  const [tonePlayer, setTonePlayer] = useState<Tone.Player>(null);

  const [numClipsPlayed, setNumClipsPlayed] = useState(0);
  const [prevNumClipsPlayed, setPrevNumClipsPlayed] = useState(0);

  const [resultCounter, setResultCounter] = useState(0);

  // On load, create a player synced to the tone transport
  useEffect(() => {
    if (tonePlayer) {
      return;
    }

    if (inferenceResults.length === 0) {
      return;
    }

    const result = inferenceResults[0];

    const player = new Tone.Player(result.audio, () => {
      player.loop = true;
      player.sync().start(0);

      // Set up a callback to increment numClipsPlayed at the edge of each clip
      const bufferLength = player.sampleTime * player.buffer.length;

      // TODO(hayk): Set this callback up to vary each time using duration_s
      Tone.Transport.scheduleRepeat((time) => {
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
      if (Tone.context.state == "suspended") {
        Tone.context.resume();
      }

      if (tonePlayer) {
        Tone.Transport.start();
      }
    } else {
      if (tonePlayer) {
        Tone.Transport.pause();
      }
    }
  }, [paused, tonePlayer]);

  // If there is a new clip, switch to it
  useEffect(() => {
    if (numClipsPlayed == prevNumClipsPlayed) {
      return;
    }

    const maxResultCounter = Math.max(
      ...inferenceResults.map((r) => r.counter)
    );

    if (maxResultCounter < resultCounter) {
      console.info(
        "No new result available, looping previous clip",
        resultCounter,
        maxResultCounter
      );
      playerIsBehindCallback(true);
      return;
    }

    playerIsBehindCallback(false);

    const result = inferenceResults.find(
      (r: InferenceResult) => r.counter == resultCounter
    );

    setResultCounter((c) => c + 1);

    tonePlayer.load(result.audio).then(() => {
      // Re-jigger the transport so it stops playing old buffers. It seems like this doesn't
      // introduce a gap, but watch out for that.
      Tone.Transport.pause();
      if (!paused) {
        Tone.Transport.start();
      }

      const playerTime = Tone.Transport.seconds;
      nowPlayingCallback(result, playerTime);
    });

    setPrevNumClipsPlayed(numClipsPlayed);
  }, [
    numClipsPlayed,
    prevNumClipsPlayed,
    resultCounter,
    inferenceResults,
    paused,
    nowPlayingCallback,
    tonePlayer,
  ]);

  return null;
}
