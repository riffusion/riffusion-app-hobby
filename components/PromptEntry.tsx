import { NextComponentType } from 'next'

interface PromptEntryProps {
    prompt: string
    className: string
}

const PromptEntry = (props: PromptEntryProps) => {  
    return (
      <>
        <p className={props.className}>
            {props.prompt}
        </p>
      </>
    )
  }
  
  export default PromptEntry