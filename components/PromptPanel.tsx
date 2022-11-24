import PromptEntry from './PromptEntry'

import { PromptInput } from "../types";
interface PromptPanelProps {
    prompts: PromptInput[];
    addPrompt: (prompt: string, seed: number) => void;
}

const PromptPanel = (props: PromptPanelProps) => {
    const prompts = props.prompts;
    const addPrompt = props.addPrompt;

    return (
        <>
            <main className="w-2/3 min-h-screen p-4">
                <div className="pl-20 pt-10">
                    <PromptEntry prompt={"yo"}/>
                    <p className="pb-32 text-xl text-gray-300">
                        Taylor Swift singing with a tropical beat
                    </p>
                    <p className="pb-32 text-3xl text-white">Justin Bieber Anger Rap</p>
                    <p className="pb-32 text-m text-gray-400">
                        new york city rap, with a dust storm, cinematic score, dramatic,
                        composition, tons of energy, brutalistic
                    </p>
                </div>
            </main>

            <input
                className="fixed z-90 bottom-20 right-40 w-1/2 h-12 pl-3 text-xl text-black"
                type="text"
                id="prompt"
                name="prompt"
                placeholder="What do you want to hear?"
            />
        </>
    )
}

export default PromptPanel
