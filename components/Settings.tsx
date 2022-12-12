import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FiSettings } from "react-icons/fi";
import { ImStatsBars } from "react-icons/im";
import styled, { css } from "styled-components";
import { InferenceResult, PromptInput } from "../types";
import DebugView from "./DebugView";

const ModalContainer = styled.div`
position: absolute;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
background: rgba(0, 0, 0, 0.5);
display: flex;
align-items: center;
justify-content: center;
`;

interface DebugViewProps {
  promptInputs: PromptInput[];
  inferenceResults: InferenceResult[];
  nowPlayingResult: InferenceResult;
}

export default function Settings({
  promptInputs,
  inferenceResults,
  nowPlayingResult,
}: DebugViewProps) {
  const [open, setOpen] = useState(false);

  var classNameCondition = ""
  if (open) {
    classNameCondition = "fixed z-20 top-44 right-4 md:top-48 md:right-8 bg-sky-400 w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-white text-2xl hover:bg-sky-500 hover:drop-shadow-2xl"
  } else {
    classNameCondition = "fixed z-20 top-44 right-4 md:top-48 md:right-8 bg-slate-100 w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-sky-900 text-2xl hover:text-white hover:bg-sky-600 hover:drop-shadow-2xl"
  }

  return (
    <>
      <button
        title="Settings"
        className={classNameCondition}
        onClick={() => setOpen(true)}
      >
        <FiSettings />
      </button>

      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-20 overflow-y-auto"
          onClose={() => setOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <ModalContainer>
                <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h1"
                    className="text-3xl font-medium leading-6 text-gray-900 pb-2"
                  >
                    Settings
                  </Dialog.Title>
                  <div className="mt-1">
                    <p className="label-text-alt">
                      <label className="label">
                        Riffusion generates music from text prompts using a diffusion model. Try typing in your favorite artist or genre, and playing with the settings below to explore the latent space of sound.
                      </label>

                      {/* <input type="range" min="0" max="100" value="40" className="range" /> */}

                      {seedImageSelector()}

                      {denoisingSelector()}

                      {debugButton(
                        promptInputs,
                        inferenceResults,
                        nowPlayingResult
                      )}

                    </p>
                  </div>

                  <div className="mt-6">
                    <button
                      className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-sky-500 group-hover:from-sky-600 group-hover:to-sky-500 hover:text-white"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                        Cancel
                      </span>
                    </button>

                    <button
                      className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-sky-500 group-hover:from-sky-600 group-hover:to-sky-500 hover:text-white"
                      onClick={() => {
                        window.open("/about", "_blank");
                        setOpen(false);
                      }}
                    >
                      <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                        Tell me more
                      </span>
                    </button>

                    <button
                      type="button"
                      className="text-white bg-gradient-to-br from-purple-600 to-sky-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                      onClick={() => setOpen(false)}
                    >
                      Apply changes 🎧
                    </button>

                  </div>
                </div>
              </ModalContainer>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export function seedImageSelector() {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Seed Image</span>
        {/* <span className="label-text-alt">Chose your vibe</span> */}
      </label>
      <select className="select select-bordered select-sm">
        <option disabled selected>Chose your vibe</option>
        <option selected >Og Beat</option>
        <option>Soul</option>
        <option>High Energy</option>
        <option>Spacy</option>
      </select>
      <label className="label">
        <span className="label-text-alt">Used as the base for img2img diffusion. This keeps your riff on beat and impacts melodic patterns.</span>
        {/* <span className="label-text-alt">Alt label</span> */}
      </label>
    </div>
  )
}

export function denoisingSelector() {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Denoising</span>
        {/* <span className="label-text-alt">Chose your vibe</span> */}
      </label>
      <select className="select select-bordered select-sm">
        <option disabled selected>How wild to get</option>
        <option selected >Keep it on beat (0.75)</option>
        <option>Get a little crazy (0.8)</option>
        <option>I'm feeling lucky (0.85)</option>
        <option>What is tempo? (0.95)</option>
      </select>
      <label className="label">
        <span className="label-text-alt">The higher the denoising, the more creative the output, and the more likely you are to get off beat.</span>
        {/* <span className="label-text-alt">Alt label</span> */}
      </label>
    </div>
  )
}

export function debugButton(
  promptInputs,
  inferenceResults,
  nowPlayingResult
) {
  const [debugOpen, debugSetOpen] = useState(false);

  let buttonClassName = "";
  if (debugOpen) {
    buttonClassName =
      "fixed z-20 top-4 right-6 bg-sky-400 w-10 h-10 rounded-full flex justify-center items-center text-white text-xl hover:bg-sky-500 hover:drop-shadow-2xl";
  } else {
    buttonClassName =
      "fixed z-20 top-4 right-6 bg-sky-100 w-10 h-10 rounded-full flex justify-center items-center text-sky-900 text-xl hover:text-white hover:bg-sky-500 hover:drop-shadow-2xl";
  }

  return (
    <>
      <button
        title="Debug"
        className={buttonClassName}
        onClick={() => {
          debugSetOpen(true);
        }}
      >
        <ImStatsBars />
      </button>

      <DebugView
        promptInputs={promptInputs}
        inferenceResults={inferenceResults}
        nowPlayingResult={nowPlayingResult}
        open={debugOpen}
        setOpen={debugSetOpen}
      />
    </>
  );
}