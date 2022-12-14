import PromptEntry from "./PromptEntry";

import { AppState, PlayingState, InferenceResult, PromptInput } from "../types";
import { useRef } from "react";

interface PromptPanelProps {
  prompts: PromptInput[];
  inferenceResults: InferenceResult[];
  nowPlayingResult: InferenceResult;
  appState: AppState;
  changePrompt: (prompt: string, index: number) => void;
  resetCallback: () => void;
}

export default function PromptPanel({
  prompts,
  inferenceResults,
  nowPlayingResult,
  appState,
  changePrompt,
  resetCallback,
}: PromptPanelProps) {
  const inputPrompt = useRef(null);

  var playingState: PlayingState;

  const getDisplayPrompts = () => {
    var displayPrompts = [];

    if (nowPlayingResult == null) {
      playingState = PlayingState.UNINITIALIZED;
    } else if (
      nowPlayingResult.input.start.prompt == nowPlayingResult.input.end.prompt
    ) {
      playingState = PlayingState.SAME_PROMPT;
    } else {
      playingState = PlayingState.TRANSITION;
    }

    // Add the last 4 prompts from playedResults
    // filter inferenceResults to only include results that have been played
    const playedResults = inferenceResults.filter((r) => r.played);

    // filter playedResults to include only results where alpha is 0.25 (the first alpha of a new transition)
    const playedResultsAlpha = playedResults.filter(
      (r) => r.input.alpha == 0.25
    );

    // filter playedResultsAlpha to include only results where playedResultsAlpha.input.start.prompt is not the same as playedResultsAlpha.input.end.prompt
    const playedResultsAlphaTransition = playedResultsAlpha.filter(
      (r) => r.input.start.prompt != r.input.end.prompt
    );

    // select the last 4 results
    const lastPlayedResultsAlphaTransition =
      playedResultsAlphaTransition.slice(-4);

    // add the most recent end prompts to the displayPrompts
    lastPlayedResultsAlphaTransition.forEach((result) => {
      displayPrompts.push({ prompt: result.input.end.prompt });
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
    if (
      playingState == PlayingState.SAME_PROMPT ||
      playingState == PlayingState.UNINITIALIZED
    ) {
      displayPrompts.shift();
    }

    return displayPrompts;
  };

  const getPromptEntryClassName = (index: number) => {
    switch (playingState) {
      case PlayingState.UNINITIALIZED:
        return promptEntryClassNames_5_0[index];
      case PlayingState.SAME_PROMPT:
        if (appState != AppState.TRANSITION) {
          return promptEntryClassNames_5_0[index];
        } else {
          switch (nowPlayingResult.input.alpha) {
            case 0:
              return promptEntryClassNames_5_0[index];
            case 0.25:
              return promptEntryClassNames_5_25[index];
            case 0.5:
              return promptEntryClassNames_5_50[index];
            case 0.75:
              return promptEntryClassNames_5_75[index];
            case 1:
              return promptEntryClassNames_5_1[index];
          }
        }
      case PlayingState.TRANSITION:
        switch (nowPlayingResult.input.alpha) {
          case 0:
            return promptEntryClassNames_6_0[index];
          case 0.25:
            return promptEntryClassNames_6_25[index];
          case 0.5:
            return promptEntryClassNames_6_50[index];
          case 0.75:
            return promptEntryClassNames_6_75[index];
          case 1:
            return promptEntryClassNames_6_1[index];
        }
      default:
        // These states are reached if alpha is greater than 1 but the new inference is not ready
        if (appState != AppState.TRANSITION) {
          return promptEntryClassNames_5_0[index];
        } else if (playingState == PlayingState.SAME_PROMPT) {
          return promptEntryClassNames_5_1[index];
        } else {
          return promptEntryClassNames_6_1[index];
        }
    }
  };

  return (
    <>
      <main className="z-10 fixed w-full md:static md:w-2/3 md:min-h-screen">
        <div className="pl-10 pr-10 md:pl-20">
          <div className="h-[78vh] landscape:sm:max-[750px]:h-[62vh] md:h-[80vh] flex flex-col justify-around pt-[10vh] pr-5">
            {getDisplayPrompts().map((prompt, index) => (
              <PromptEntry
                prompt={prompt.prompt + " "}
                className={getPromptEntryClassName(index)}
                index={index}
                key={index}
                playingState={playingState}
                resetCallback={resetCallback}
              />
            ))}
          </div>

          {/* // Form trims spaces, and only submits if the remaining prompt is more than 0 characters */}
          <form
            noValidate={true}
            onSubmit={(e) => {
              e.preventDefault();
              const prompt = e.currentTarget.prompt.value;
              const trimmedPrompt = prompt.trimStart();
              if (trimmedPrompt.length > 0) {
                changePrompt(trimmedPrompt, prompts.length - 1);
                inputPrompt.current.value = "";
              } else {
                inputPrompt.current.value = "";
              }
            }}
          >
            <input
              className="flex w-full md:fixed md:w-5/12 h-12 pl-3 pr-3 text-lg text-sky-900 dark:text-sky-100 rounded-lg border-sky-700 border-4 hover:border-sky-600 focus:outline-none focus:border-sky-400"
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

const promptEntryClassNameDict = {
  0: "font-extralight text-xs text-gray-500 text-opacity-20",
  1: "font-extralight text-xs text-gray-400 text-opacity-20",
  2: "font-extralight text-sm text-gray-300 text-opacity-30",
  3: "font-extralight text-sm text-gray-200 text-opacity-30",
  4: "font-light text-sm text-gray-200 text-opacity-40",
  5: "font-light text-base text-gray-200 text-opacity-40",
  6: "font-light text-base text-gray-100 text-opacity-50",
  7: "font-light text-base text-gray-100 text-opacity-50", // starter for 0

  8: "font-light text-base text-gray-100 text-opacity-50",
  9: "font-light text-lg text-gray-100 text-opacity-50",
  10: "font-light text-lg text-gray-100 text-opacity-60",
  11: "font-normal text-lg text-gray-100 text-opacity-60",
  12: "font-normal text-xl text-gray-100 text-opacity-60",
  13: "font-normal text-xl text-gray-100 text-opacity-70",
  14: "font-normal text-xl text-gray-100 text-opacity-70",
  15: "font-normal text-xl text-gray-100 text-opacity-70", // starter for 1

  16: "font-medium text-2xl text-gray-100 text-opacity-80", // 0%
  17: "font-medium text-3xl text-gray-100 text-opacity-90", // 25%
  18: "font-semibold text-4xl text-white", // 50%
  19: "font-bold text-4xl text-white", // 75%
  20: "font-bold text-5xl text-white",
  21: "font-bold text-5xl text-white",
  22: "font-bold text-5xl text-white",
  23: "font-bold text-5xl text-white", // starter for 2 "start"

  24: "font-bold text-5xl text-white",
  25: "font-bold text-4xl text-white", // 75%
  26: "font-semibold text-4xl text-white", // 50%
  27: "font-medium text-3xl text-gray-100 text-opacity-90", // 25%
  28: "font-normal text-2xl text-gray-100 text-opacity-80",
  29: "font-normal text-l text-gray-100 text-opacity-70",
  30: "font-normal text-l text-gray-100 text-opacity-70",
  31: "font-normal text-l text-gray-100 text-opacity-70", // starter for 3 "end"

  32: "font-normal text-base text-gray-100 text-opacity-70",
  33: "font-normal text-base text-gray-100 text-opacity-60",
  34: "font-normal text-base text-gray-100 text-opacity-60",
  35: "font-normal text-base text-gray-100 text-opacity-60", // starter for 4 when "staging"

  36: "font-normal text-base text-gray-100 text-opacity-60", // starter for 4 and 5 "Up Next"
};

// ClassNames below
// Note that 6_0 and 5_25 are never reached in current stucture

const promptEntryClassNames_5_0 = {
  0: promptEntryClassNameDict[7],
  1: promptEntryClassNameDict[15],
  2: promptEntryClassNameDict[23], // This is the start and end prompt
  3: promptEntryClassNameDict[31], // This is the staged prompt
  4: promptEntryClassNameDict[36], // This is the UP NEXT prompt
};

const promptEntryClassNames_5_25 = {
  // This is not reached unless user has poor connection or delayed server response
  0: promptEntryClassNameDict[7],
  1: promptEntryClassNameDict[15],
  2: promptEntryClassNameDict[23], // This is the start and end prompt
  3: promptEntryClassNameDict[31], // This is the staged prompt
  4: promptEntryClassNameDict[36], // This is the UP NEXT prompt
};

const promptEntryClassNames_5_50 = {
  0: promptEntryClassNameDict[6],
  1: promptEntryClassNameDict[14],
  2: promptEntryClassNameDict[22],
  3: promptEntryClassNameDict[30],
  4: promptEntryClassNameDict[36],
};

const promptEntryClassNames_5_75 = {
  0: promptEntryClassNameDict[5],
  1: promptEntryClassNameDict[13],
  2: promptEntryClassNameDict[21],
  3: promptEntryClassNameDict[29],
  4: promptEntryClassNameDict[36],
};

const promptEntryClassNames_5_1 = {
  0: promptEntryClassNameDict[4],
  1: promptEntryClassNameDict[12],
  2: promptEntryClassNameDict[20],
  3: promptEntryClassNameDict[28],
  4: promptEntryClassNameDict[36],
};

const promptEntryClassNames_6_0 = {
  // This is not reached unless user has poor connection or delayed server response
  0: promptEntryClassNameDict[3],
  1: promptEntryClassNameDict[11],
  2: promptEntryClassNameDict[19],
  3: promptEntryClassNameDict[27],
  4: promptEntryClassNameDict[35],
  5: promptEntryClassNameDict[36],
};

const promptEntryClassNames_6_25 = {
  0: promptEntryClassNameDict[3],
  1: promptEntryClassNameDict[11],
  2: promptEntryClassNameDict[19],
  3: promptEntryClassNameDict[27],
  4: promptEntryClassNameDict[35],
  5: promptEntryClassNameDict[36],
};

const promptEntryClassNames_6_50 = {
  0: promptEntryClassNameDict[2],
  1: promptEntryClassNameDict[10],
  2: promptEntryClassNameDict[18],
  3: promptEntryClassNameDict[26],
  4: promptEntryClassNameDict[34],
  5: promptEntryClassNameDict[36],
};

const promptEntryClassNames_6_75 = {
  0: promptEntryClassNameDict[1],
  1: promptEntryClassNameDict[9],
  2: promptEntryClassNameDict[17],
  3: promptEntryClassNameDict[25],
  4: promptEntryClassNameDict[33],
  5: promptEntryClassNameDict[36],
};

const promptEntryClassNames_6_1 = {
  0: promptEntryClassNameDict[0],
  1: promptEntryClassNameDict[8],
  2: promptEntryClassNameDict[16],
  3: promptEntryClassNameDict[24],
  4: promptEntryClassNameDict[32],
  5: promptEntryClassNameDict[36],
};
