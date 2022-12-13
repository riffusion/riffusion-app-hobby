import { PlayingState } from "../types";
import { IoMdClose } from "react-icons/io";

interface PromptEntryProps {
  prompt: string;
  index: number;
  className: string;
  playingState: PlayingState;
  resetCallback: () => void;
}

export default function PromptEntry({
  prompt,
  index,
  className,
  playingState,
  resetCallback,
}: PromptEntryProps) {
  const getPromptCopy = (prompt: string) => {
    switch (playingState) {
      case PlayingState.UNINITIALIZED:
      case PlayingState.SAME_PROMPT:
        switch (index) {
          case 0:
            return prompt;
          case 1:
            return prompt;
          case 2:
            if (prompt == " " || prompt == "") {
              return <span className="text-slate-600">{"<enter prompt>"}</span>;
            } else {
              return prompt;
            }
          case 3:
            if (prompt == " " || prompt == "") {
              return "...";
            } else {
              return prompt;
            }
          case 4:
            if (prompt == " " || prompt == "") {
              return "UP NEXT: Anything you want";
            } else {
              return "UP NEXT: " + prompt;
            }
          default: {
            console.log("UNHANDLED default");
            return prompt;
          }
        }
      case PlayingState.TRANSITION:
        switch (index) {
          case 0:
            return prompt;
          case 1:
            return prompt;
          case 2:
            return prompt;
          case 3:
            if (prompt == " " || prompt == "") {
              return "< enter prompt >";
            } else {
              return prompt;
            }
          case 4:
            if (prompt == " " || prompt == "") {
              return "...";
            } else {
              return prompt;
            }
          case 5:
            if (prompt == " " || prompt == "") {
              return "UP NEXT: Anything you want";
            } else {
              return "UP NEXT: " + prompt;
            }
          default: {
            console.log("UNHANDLED default");
            return prompt;
          }
        }
    }
  };

  return (
    <div className="flex">
      <p className={className}>{getPromptCopy(prompt)}</p>
      {/* TODO(hayk): Re-enable this when it's working. */}
      {/* {index == 2 ? (
        <IoMdClose
          className="w-6 h-6 ml-2 text-gray-400"
          onClick={() => {
            resetCallback();
          }}
        />
      ) : null} */}
    </div>
  );
}
