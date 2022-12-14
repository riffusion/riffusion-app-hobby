import { InferenceInput, InferenceResult, PlayingState } from "../types";
import { IoMdClose } from "react-icons/io";
import Pause from "./Pause";

interface PromptEntryProps {
  prompt: string;
  index: number;
  className: string;
  playingState: PlayingState;
  resetCallback: () => void;
  inferenceResults: InferenceResult[];
  nowPlayingResult: InferenceResult;
  setPaused: (value: boolean) => void;
}

export default function PromptEntry({
  prompt,
  index,
  className,
  playingState,
  resetCallback,
  inferenceResults,
  nowPlayingResult,
  setPaused
}: PromptEntryProps) {

  const getPromptCopy = (prompt: string) => {
    switch (playingState) {
      case PlayingState.UNINITIALIZED:
      case PlayingState.SAME_PROMPT:
        switch (index) {
          case 0:
            return (
              <div className="tooltip text-left" data-tip="⏪ Jump to previous prompt?" onClick={() => { jumpToPrompt(prompt, inferenceResults, setPaused, nowPlayingResult) }} >
                <p className={className}>{prompt}</p>
              </div>
              // <div className="tooltip cursor-pointer" data-tip="hello">
              //   <p className={className}>{prompt}</p>
              // </div>
            );
          case 1:
            return (
              <div className="tooltip text-left" data-tip="⏪ Jump to previous prompt?" onClick={() => { jumpToPrompt(prompt, inferenceResults, setPaused, nowPlayingResult) }} >
                <p className={className}>{prompt}</p>
              </div>
            );
          case 2:
            // active prompt
            if (prompt == " " || prompt == "") {
              return <span className="text-slate-600">{"<enter prompt>"}</span>;
            } else {
              return (
                <div className="tooltip text-left" data-tip="🔁 Restart current prompt?" onClick={() => { jumpToPrompt(prompt, inferenceResults, setPaused, nowPlayingResult) }} >
                  <p className={className}>{prompt}</p>
                </div>
              )
            }
          case 3:
            if (prompt == " " || prompt == "") {
              return <p className={className}>...</p>
            } else {
              return (
                <div className="tooltip text-left" data-tip="🚀 Jump to upcoming prompt?" onClick={() => { jumpToPrompt(prompt, inferenceResults, setPaused, nowPlayingResult) }} >
                  <p className={className}>{prompt}</p>
                </div>
              )
            }
          case 4:
            if (prompt == " " || prompt == "") {
              return <p className={className}>UP NEXT: Anything you want</p>;
            } else {
              return (
                <div className="tooltip text-left" data-tip="🚀 Jump to upcoming prompt?" onClick={() => { jumpToPrompt(prompt, inferenceResults, setPaused, nowPlayingResult) }} >
                  <p className={className}>UP NEXT: {prompt}</p>
                </div>
              )
            }
          default: {
            console.log("UNHANDLED default");
            return <p className={className}>{prompt}</p>;
          }
        }
      case PlayingState.TRANSITION:
        switch (index) {
          case 0:
            return (
              <div className="tooltip text-left" data-tip="⏪ Jump to previous prompt?" onClick={() => { jumpToPrompt(prompt, inferenceResults, setPaused, nowPlayingResult) }} >
                <p className={className}>{prompt}</p>
              </div>
            );
          case 1:
            return (
              <div className="tooltip text-left" data-tip="⏪ Jump to previous prompt?" onClick={() => { jumpToPrompt(prompt, inferenceResults, setPaused, nowPlayingResult) }} >
                <p className={className}>{prompt}</p>
              </div>
            );
          case 2:
            return (
              <div className="tooltip text-left" data-tip="🔁 Restart outgoing prompt?" onClick={() => { jumpToPrompt(prompt, inferenceResults, setPaused, nowPlayingResult) }} >
                <p className={className}>{prompt}</p>
              </div>
            )
          case 3:
            if (prompt == " " || prompt == "") {
              return <p className={className}> -enter prompt- </p>;
            } else {
              return (
                <div className="tooltip text-left" data-tip="🚀 Jump to incoming prompt?" onClick={() => { jumpToPrompt(prompt, inferenceResults, setPaused, nowPlayingResult) }} >
                  <p className={className}>{prompt}</p>
                </div>
              )
            }
          case 4:
            if (prompt == " " || prompt == "") {
              return <p className={className}>...</p>;
            } else {
              return (
                <div className="tooltip text-left" data-tip="🚀 Jump to upcoming prompt?" onClick={() => { jumpToPrompt(prompt, inferenceResults, setPaused, nowPlayingResult) }} >
                  <p className={className}>UP NEXT: {prompt}</p>
                </div>
              )
            }
          case 5:
            if (prompt == " " || prompt == "") {
              return <p className={className}>UP NEXT: Anything you want</p>;
            } else {
              return (
                <div className="tooltip text-left" data-tip="🚀 Jump to upcoming prompt?" onClick={() => { jumpToPrompt(prompt, inferenceResults, setPaused, nowPlayingResult) }} >
                  <p className={className}>UP NEXT: {prompt}</p>
                </div>
              )
            }
          default: {
            console.log("UNHANDLED default");
            return <p className={className}>{prompt}</p>;
          }
        }
    }
  };

  return (
    <div className="flex cursor-pointer">
      {getPromptCopy(prompt)}

      {/* TODO(hayk): Re-enable this when it's working. */}
      {/* {index == 2 ? (
        <IoMdClose
          className="w-6 h-6 ml-2 text-gray-400"
          onClick={() => {
            resetCallback();
          }}
        />
      ) : null} */}
    </div >
  );
}

export function jumpToPrompt(prompt: String, inferenceResults: InferenceResult[], setPaused: (value: boolean) => void, nowPlayingResult?: InferenceResult) {

  // Pause player since this function will open new tab that user will interact with
  setPaused(true)

  let firstTimePromptAppears = -1;
  for (let i = 0; i < inferenceResults.length; i++) {
    if (inferenceResults[i].input.start.prompt === prompt) {
      firstTimePromptAppears = i;
      break;
    }
  }
  if (firstTimePromptAppears == -1) {
    let url = generateLinkToUpcomingPrompt(prompt, nowPlayingResult)
    window.location.href = url;
  }
  else {
    let url = generateLinkToPreviousInput(inferenceResults[firstTimePromptAppears].input)
    window.location.href = url;
  }
}

export function generateLinkToUpcomingPrompt(prompt, nowPlayingResult?: InferenceResult) {

  var promptString = "&prompt=" + prompt;
  promptString = promptString.replace(/ /g, "+");

  if (nowPlayingResult != null) {
    var denoisingString = "&denoising=" + nowPlayingResult.input.start.denoising;
    var seedImageIdString = "&seedImageId=" + nowPlayingResult.input.seed_image_id;
  } else {
    denoisingString = "";
    seedImageIdString = "";
  }

  var baseUrl = window.location.origin + "/?";
  var url = baseUrl + promptString + denoisingString + seedImageIdString;
  return url;
}

// Todo: DRY this and share functions
export function generateLinkToPreviousInput(selectedInput: InferenceInput) {
  var prompt;
  var seed;
  var denoising;
  var maskImageId;
  var seedImageId;
  var guidance;
  var numInferenceSteps;
  var alphaVelocity;

  prompt = selectedInput.start.prompt;
  seed = selectedInput.start.seed;
  denoising = selectedInput.start.denoising;
  maskImageId = selectedInput.mask_image_id;
  seedImageId = selectedInput.seed_image_id;

  var baseUrl = window.location.origin + "/?";

  if (prompt != null) {
    var promptString = "&prompt=" + prompt;
  } else {
    promptString = "";
  }
  if (seed != null) {
    var seedString = "&seed=" + seed;
  } else {
    seedString = "";
  }
  if (denoising != null) {
    var denoisingString = "&denoising=" + denoising;
  } else {
    denoisingString = "";
  }
  if (maskImageId != null) {
    var maskImageIdString = "&maskImageId=" + maskImageId;
  } else {
    maskImageIdString = "";
  }
  if (seedImageId != null) {
    var seedImageIdString = "&seedImageId=" + seedImageId;
  } else {
    seedImageIdString = "";
  }
  if (guidance != null) {
    var guidanceString = "&guidance=" + guidance;
  } else {
    guidanceString = "";
  }
  if (numInferenceSteps != null) {
    var numInferenceStepsString = "&numInferenceSteps=" + numInferenceSteps;
  } else {
    numInferenceStepsString = "";
  }
  if (alphaVelocity != null) {
    var alphaVelocityString = "&alphaVelocity=" + alphaVelocity;
  } else {
    alphaVelocityString = "";
  }

  // Format strings to have + in place of spaces for ease of sharing, note this is only necessary for prompts currently
  promptString = promptString.replace(/ /g, "+");

  // create url string with the variables above combined
  var shareUrl =
    baseUrl +
    promptString +
    seedString +
    denoisingString +
    maskImageIdString +
    seedImageIdString +
    guidanceString +
    numInferenceStepsString +
    alphaVelocityString;

  return shareUrl;
}