import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { ImStatsBars } from "react-icons/im";
import styled from "styled-components";

import { InferenceResult, PromptInput } from "../types";

interface DebugViewProps {
  promptInputs: PromptInput[];
  inferenceResults: InferenceResult[];
  nowPlayingResult: InferenceResult;
  open: boolean ;
  setOpen: (open: boolean) => void;
}

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

export default function DebugView({
  promptInputs,
  inferenceResults,
  nowPlayingResult,
  open,
  setOpen,
}: DebugViewProps) {
  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        as="div"
        className="fixed inset-0 z-30"
      >
        <ModalContainer>
          <div className="px-4 text-center text-sm whitespace-nowrap h-[40rem] w-[70rem] overflow-x-scroll">
            <div className="my-8 inline-block transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Panel>
                <h2 className="text-xl font-medium leading-6 text-gray-900 pb-2">
                  Prompt Inputs
                </h2>
                <div className="mt-4 font-mono">
                  {promptInputs.map((promptInput) => (
                    <div key={promptInput.prompt}>
                      "{promptInput.prompt}" - {promptInput.transitionCounter}
                    </div>
                  ))}
                </div>
                <h2 className="text-xl font-medium leading-6 text-gray-900 pb-2">
                  Inference Results
                </h2>
                <div className="mt-4 font-mono">
                  <ul>
                    {inferenceResults.map((result) => (
                      <li
                        key={result.counter}
                        className={
                          result.counter === nowPlayingResult?.counter
                            ? "text-red-700"
                            : "text-black"
                        }
                      >
                        <b>#{result.counter}</b> - Alpha{" "}
                        {result.input.alpha.toFixed(2)} from ("
                        {result.input.start.prompt}", {result.input.start.seed})
                        to ("
                        {result.input.end.prompt}", {result.input.end.seed})
                      </li>
                    ))}
                  </ul>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </ModalContainer>
      </Dialog>
    </>
  );
}
