import { FiPause, FiPlay } from "react-icons/fi";

interface PauseProps {
  paused: boolean;
  setPaused: (value: boolean) => void;
}

export default function Pause({
  paused,
  setPaused,
}: PauseProps) {

  var classNameCondition = ""
  if (paused) {
    classNameCondition="fixed z-90 top-28 right-8 bg-sky-300 w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-sky-900 text-2xl hover:bg-sky-500 hover:drop-shadow-2xl"
  } else {
    classNameCondition="fixed z-90 top-28 right-8 bg-slate-100 w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-sky-900 text-2xl hover:bg-sky-500 hover:drop-shadow-2xl"
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
