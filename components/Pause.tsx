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
    classNameCondition="animate-pulse fixed z-90 top-48 right-8 bg-sky-400 w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-white text-2xl hover:bg-sky-500 focus:ring-4 focus:outline-none focus:ring-sky-600 hover:drop-shadow-2xl"
  } else {
    classNameCondition="fixed z-90 top-48 right-8 bg-slate-100 w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-sky-900 text-2xl hover:text-white hover:bg-sky-600 hover:drop-shadow-2xl"
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
