import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FiInfo } from "react-icons/fi";
import styled, { css } from "styled-components";

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

export default function Info() {
  const [open, setOpen] = useState(false);

  var classNameCondition = ""
  if (open) {
    classNameCondition = "fixed z-90 top-44 right-4 md:top-48 md:right-8 top-48 right-8 bg-sky-400 w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-white text-2xl hover:bg-sky-500 hover:drop-shadow-2xl"
  } else {
    classNameCondition = "fixed z-90 top-44 right-4 md:top-48 md:right-8 bg-slate-100 w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-sky-900 text-2xl hover:text-white hover:bg-sky-600 hover:drop-shadow-2xl"
  }

  return (
    <>
      <button
        title="Info"
        className={classNameCondition}
        onClick={() => setOpen(true)}
      >
        <FiInfo />
      </button>

      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
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
                    Welcome to Riffusion
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Riffusion generates endless new jams from any text prompt. Try typing in your favorite artist or genre, and you'll hear the music gradually transform.<br></br>
                      <br></br>
                      The diffusion model first creates images from your prompt, and then converts them into music. Learn more about surfing the latent space of sound below.<br></br>
                    </p>
                  </div>

                  <div className="mt-6">

                    <button
                      className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-sky-500 group-hover:from-sky-600 group-hover:to-sky-500 hover:text-white"
                      onClick={() => {
                        window.open("/about", "_blank");
                        setOpen(false);
                      }}
                    >
                      <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                        Surfing the what?
                      </span>
                    </button>

                    <button
                      type="button"
                      className="text-white bg-gradient-to-br from-purple-600 to-sky-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                      onClick={() => setOpen(false)}
                    >
                      Let&apos;s Riff 🎸
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