import { NextComponentType } from 'next'

interface PromptEntryProps {
    prompt: string
}

const PromptEntry = (props: PromptEntryProps) => {  
    return (
      <>
        <p className="pb-32 text-lg text-gray-400">
            {props.prompt}
        </p>
      </>
    )
  }
  
  export default PromptEntry