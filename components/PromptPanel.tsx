import PromptEntry from "./PromptEntry";

import { InferenceResult, PromptInput } from "../types";
import { useRef } from "react";

interface PromptPanelProps {
  prompts: PromptInput[];
  inferenceResults: InferenceResult[];
  nowPlayingResult: InferenceResult;
  changePrompt: (prompt: string, index: number) => void;
}

enum PlayingState {
  UNINITIALIZED = "UNINITIALIZED",
  SAME_PROMPT = "SAME_PROMPT",
  TRANSITION = "TRANSITION",
}

export default function PromptPanel({
  prompts,
  inferenceResults,
  nowPlayingResult,
  changePrompt,
}: PromptPanelProps) {
  const inputPrompt = useRef(null);

  const getDisplayPrompts = () => {
    var displayPrompts = [];

    var playingState: PlayingState
    if (nowPlayingResult == null) {
      playingState = PlayingState.UNINITIALIZED
    } else if (nowPlayingResult.input.start.prompt == nowPlayingResult.input.end.prompt) {
      playingState = PlayingState.SAME_PROMPT
    } else {
      playingState = PlayingState.TRANSITION
    }

    // Add the last 4 prompts from playedResults
    // filter inferenceResults to only include results that have been played
    const playedResults = inferenceResults.filter((r) => r.played);

    // filter playedResults to include only results where alpha is 0.25 (the first alpha of a new transition)
    const playedResultsAlpha = playedResults.filter((r) => r.input.alpha == 0.25);

    // filter playedResultsAlpha to include only results where playedResultsAlpha.input.start.prompt is not the same as playedResultsAlpha.input.end.prompt
    const playedResultsAlphaTransition = playedResultsAlpha.filter(
      (r) => r.input.start.prompt != r.input.end.prompt
    );

    // select the last 4 results
    const lastPlayedResultsAlphaTransition = playedResultsAlphaTransition.slice(-4);

    // add the most recent end prompts to the displayPrompts
    lastPlayedResultsAlphaTransition.forEach((result) => {
      displayPrompts.push({ prompt: result.input.end.prompt});
    });

    // Handle the case where there are less than 4 played results (i.e. the initial state)
    if (displayPrompts.length < 4) {
      const promptsToAdd = prompts.slice(displayPrompts.length, 4);
      displayPrompts = [...promptsToAdd, ...displayPrompts];
    }

    // Add in the upNext and staged prompts 
    // select the last 2 prompts from prompts
    const lastPrompts = prompts.slice(-2);

    // make a copy of the lastPrompts with new pointers
    const lastPromptsCopy = lastPrompts.map((p) => ({ ...p }));

    // if any of the lastPrompts have a transitionCounter, replace them with "" because they are already represented in the displayPrompts
    lastPromptsCopy.forEach((prompt, index) => {
      if (prompt.transitionCounter != null) {
        lastPromptsCopy[index].prompt = "";
        lastPromptsCopy[index].transitionCounter = null;
      }
    });
    
    // add the prompts to the displayPrompts
    lastPromptsCopy.forEach((p) => {
      displayPrompts.push(p);
    });

    // if playingState == PlayingState.SAME_PROMPT or playingState == PlayingState.UNINITIALIZED, remove the first prompt from displayPrompts
    if (playingState == PlayingState.SAME_PROMPT || playingState == PlayingState.UNINITIALIZED) {
      displayPrompts.shift();
    }

    return displayPrompts;
  }

  return (
    <>
      <main className="w-2/3 min-h-screen">
        <div className="pl-20">
          <div className="h-[80vh] flex flex-col justify-around pt-[5vh] pr-5">
            {getDisplayPrompts().map((prompt, index) => (
              <PromptEntry
                prompt={prompt.prompt + " " + prompt.transitionCounter}
                className={promptEntryClassNames[index]}
                index={index}
                key={index}
              />
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const prompt = e.currentTarget.prompt.value;
              changePrompt(prompt, prompts.length - 1);
              inputPrompt.current.value = "";
            }}
          >
            <input
              className="fixed w-1/2 h-12 pl-3 text-xl text-sky-900 rounded-lg border-sky-300 border-4 focus:outline-none focus:border-sky-500"
              ref={inputPrompt}
              type="text"
              id="prompt"
              name="prompt"
              placeholder="What do you want to hear next?"
              maxLength={150}
              minLength={2}
              required={true}
              autoComplete="off"
            />
          </form>
        </div>
      </main>
    </>
  );
}

const promptEntryClassNames = {
  0: "font-medium text-xl text-gray-200 text-opacity-80",
  1: "font-medium text-xl text-gray-200 text-opacity-80",
  2: "font-medium text-xl text-gray-200 text-opacity-80",
  3: "font-medium text-xl text-gray-200 text-opacity-80",
  4: "font-medium text-xl text-gray-200 text-opacity-80",
  5: "font-medium text-xl text-gray-200 text-opacity-80",
};

// const promptEntryClassNames = {
//   0: "font-light text-sm text-gray-400 text-opacity-40",
//   1: "font-normal text-m text-gray-300 text-opacity-60",
//   2: "font-medium text-xl text-gray-200 text-opacity-80",
//   3: "font-bold text-5xl text-white", // This is the primary prompt
//   4: "font-medium text-3xl text-gray-100 text-opacity-80", // This is prompt it is transitioning to
//   5: "font-normal text-m text-gray-200 text-opacity-60", // This is the UP NEXT prompt
// };
