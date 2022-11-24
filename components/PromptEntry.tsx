import { NextComponentType } from 'next'

interface PromptEntryProps {
    prompt: string
    className: string
}

export default function PromptEntry({
    prompt,
    className,
}: PromptEntryProps) {  

    return (
      <>
        <p className={className}>
            {prompt}
        </p>
      </>
    )
  }
