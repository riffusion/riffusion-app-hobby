import { NextComponentType } from 'next'

interface PromptEntryProps {
    prompt: string
    index: number
    className: string
}

export default function PromptEntry({
    prompt,
    index,
    className,
}: PromptEntryProps) {  

    return (
      <>
        <p className={className}>
            {index + " " + prompt}
            {/* {prompt == "" ? index == 5 ? "UP NEXT: Anything you want" + prompt : "..." : index == 5 ? "UP NEXT: " + prompt : prompt} */}
        </p>
      </>
    )
  }
