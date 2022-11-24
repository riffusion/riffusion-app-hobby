import PromptEntry from './PromptEntry'

import { PromptInput } from "../types";

interface PromptPanelProps {
    prompts: PromptInput[];
    addPrompt: (prompt: string) => void;
}

export default function PromptPanel({
    prompts,
    addPrompt,
}: PromptPanelProps) {

    return (
        <>
            <main className="w-2/3 min-h-screen p-4">
                <div className="pl-20 pt-10">
                    <div className="flex flex-column">
                        {prompts.map((prompt, index) => (
                            <PromptEntry prompt={prompt.prompt} className={promptEntryClassNames[index]} key={index} />
                        ))}
                    </div>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const prompt = e.currentTarget.prompt.value;
                        addPrompt(prompt);
                    }}>
                        <input
                            className="fixed z-90 bottom-20 w-1/2 h-12 pl-3 text-xl text-black rounded-lg border-sky-500 border-2"
                            type="text"
                            id="prompt"
                            name="prompt"
                            placeholder="What do you want to hear?"
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
    0: "pb-12 text-lg text-gray-400",
    1: "pb-1/6 text-xl text-gray-300",
    2: "pb-1/6 text-3xl text-white",
    3: "pb-1/6 text-m text-gray-400",
    4: "pb-1/6 text-m text-gray-300",
    5: "pb-1/6 text-m text-gray-400",
    6: "pb-1/6 text-m text-gray-300",
}
