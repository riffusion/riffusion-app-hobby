import { NextComponentType } from 'next'
import { PlayingState } from '../types'

interface PromptEntryProps {
    prompt: string
    index: number
    className: string
    playingState: PlayingState
}

export default function PromptEntry({
    prompt,
    index,
    className,
    playingState,
}: PromptEntryProps) {

    const getPromptCopy = (prompt: string) => {
        switch (playingState) {
            case PlayingState.UNINITIALIZED:
                switch (index) {
                    case 0:
                        return prompt
                    case 1:
                        return prompt
                    case 2:
                        return prompt
                    case 3:
                        if (prompt == " " || prompt == "") {
                            return "..."
                        }
                        else {
                            return prompt
                        }
                    case 4:
                        if (prompt == " " || prompt == "") {
                            return "UP NEXT: Anything you want"
                        }
                        else {
                            return "UP NEXT: " + prompt
                        }
                    default: {
                        console.log("UNHANDLED default")
                        return prompt
                    }
                }
            case PlayingState.SAME_PROMPT:
                switch (index) {
                    case 0:
                        return prompt
                    case 1:
                        return prompt
                    case 2:
                        return prompt
                    case 3:
                        if (prompt == " " || prompt == "") {
                            return "..."
                        }
                        else {
                            return prompt
                        }
                    case 4:
                        if (prompt == " " || prompt == "") {
                            return "UP NEXT: Anything you want"
                        }
                        else {
                            return "UP NEXT: " + prompt
                        }
                    default: {
                        console.log("UNHANDLED default")
                        return prompt
                    }
                }
            case PlayingState.TRANSITION:
                switch (index) {
                    case 0:
                        return prompt
                    case 1:
                        return prompt
                    case 2:
                        return prompt
                    case 3:
                        return prompt
                    case 4:
                        if (prompt == " " || prompt == "") {
                            return "..."
                        }
                        else {
                            return prompt
                        }
                    case 5:
                        if (prompt == " " || prompt == "") {
                            return "UP NEXT: Anything you want"
                        }
                        else {
                            return "UP NEXT: " + prompt
                        }
                    default: {
                        console.log("UNHANDLED default")
                        return prompt
                    }
                }
        }
    }


    return (
        <>
            <p className={className}>
                {getPromptCopy(prompt)}
            </p>
        </>
    )
}
