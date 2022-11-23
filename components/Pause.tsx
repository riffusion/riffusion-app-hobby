import { NextComponentType } from 'next'
import { Fragment, useState } from 'react'
import { FiPause, FiPlay } from "react-icons/fi";

const Modal: NextComponentType = () => {
    const [paused, SetPause] = useState(false)
  
    return (
      <>
        <button
          title="Pause"
          className="fixed z-90 top-28 right-8 bg-slate-100 w-14 h-14 rounded-full drop-shadow-lg
          flex justify-center items-center text-black text-2xl hover:bg-sky-500 hover:drop-shadow-2xl"
          onClick={() => SetPause(!paused)}
        >
          {paused ? <FiPlay /> : <FiPause />}
        </button>
      </>
    )
  }
  
  export default Modal