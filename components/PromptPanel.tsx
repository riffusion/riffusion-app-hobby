import PromptEntry from "./PromptEntry";

import { PromptInput } from "../types";
import { useRef } from "react";

interface PromptPanelProps {
  prompts: PromptInput[];
  changePrompt: (prompt: string, index: number) => void;
}

export default function PromptPanel({
  prompts,
  changePrompt,
}: PromptPanelProps) {
  const inputPrompt = useRef(null);

  return (
    <>
      <main className="w-2/3 min-h-screen">
        <div className="pl-20">
          <div className="h-[80vh] flex flex-col justify-around pt-[5vh] pr-5">
            {prompts.slice(-6).map((prompt, index) => (
              <PromptEntry
                prompt={prompt.prompt}
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
              var promptLastIndex = prompts.length - 1;
              if (prompts[promptLastIndex - 1].prompt == "") {
                changePrompt(prompt, promptLastIndex - 1);
              } else {
                changePrompt(prompt, promptLastIndex);
              }
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
  0: "font-light text-sm text-gray-400 text-opacity-40",
  1: "font-normal text-m text-gray-300 text-opacity-60",
  2: "font-medium text-xl text-gray-200 text-opacity-80",
  3: "font-bold text-5xl text-white", // This is the primary prompt
  4: "font-medium text-3xl text-gray-100 text-opacity-80", // This is prompt it is transitioning to
  5: "font-normal text-m text-gray-200 text-opacity-60", // This is the UP NEXT prompt
};
