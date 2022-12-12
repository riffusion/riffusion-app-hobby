import { useEffect } from "react";
import { FiPause, FiPlay } from "react-icons/fi";

interface PauseProps {
  paused: boolean;
  setPaused: (value: boolean) => void;
}

export default function Pause({
  paused,
  setPaused,
}: PauseProps) {

  // Print the state into the console
  useEffect(() => {
    if (paused) {
      console.log("Pause");
    } else {
      console.log("Play");
    }
  }, [paused]);

  var classNameCondition = ""
  if (paused) {
    classNameCondition="animate-pulse fixed z-20 top-4 right-4 md:top-8 md:right-8 w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-white text-2xl bg-red-500 hover:bg-red-600 ring-4 ring-red-700 focus:outline-none hover:drop-shadow-2xl"
  } else {
    classNameCondition="fixed z-20 top-4 right-4 md:top-8 md:right-8 bg-slate-100 w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-sky-900 text-2xl hover:text-white hover:bg-sky-600 hover:drop-shadow-2xl"
  }

  return (
    <>
      <button
        title="Pause"
        className= {classNameCondition}
        onClick={() => setPaused(!paused)}
      >
        {paused ? <FiPlay /> : <FiPause />}
      </button>
    </>
  );
};
