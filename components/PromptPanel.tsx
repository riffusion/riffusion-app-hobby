import PromptEntry from './PromptEntry'

import { PromptInput } from "../types";
import {useRef} from 'react';

interface PromptPanelProps {
    prompts: PromptInput[];
    addPrompt: (prompt: string) => void;
    changeUpNextPrompt: (prompt: string) => void;
}

export default function PromptPanel({
    prompts,
    addPrompt,
    changeUpNextPrompt,
}: PromptPanelProps) {

    const inputPrompt = useRef(null);

    return (
        <>
            <main className="w-2/3 min-h-screen">
                <div className="pl-20">
                    <div className="h-[80vh] flex flex-col justify-around pt-[5vh]">
                        {prompts.slice(-6).map((prompt, index) => (
                            <PromptEntry prompt={index == 5 ? "UP NEXT: " + prompt.prompt : prompt.prompt} className={promptEntryClassNames[index]} key={index} />
                        ))}
                    </div>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const prompt = e.currentTarget.prompt.value;
                        changeUpNextPrompt(prompt);
                        inputPrompt.current.value = '';
                    }}>
                        <input
                            className="fixed z-90 bottom-20 w-1/2 h-12 pl-3 text-xl text-black rounded-lg border-sky-500 border-2"
                            ref={inputPrompt}
                            type="text"
                            id="prompt"
                            name="prompt"
                            placeholder="What do you want to hear next?"
                            autoComplete="off"
                        />
                    </form>
                </div>
            </main>
        </>
    )
}

// WIP manner of passing ideal font of each promptEntry based on where it is in the promptPanel. Could be done better with a map or something.
// need not just order, but some context of where we are in time, and when that prompt will be primary (some global step state)
const promptEntryClassNames = {
    0: "font-light text-sm text-gray-400 text-opacity-40",
    1: "font-normal text-m text-gray-300 text-opacity-60",
    2: "font-medium text-xl text-gray-200 text-opacity-80",
    3: "font-bold text-5xl text-white",  // This is the primary prompt
    4: "font-medium text-2xl text-gray-200 text-opacity-80",
    5: "font-normal text-m text-gray-300 text-opacity-60",
}
