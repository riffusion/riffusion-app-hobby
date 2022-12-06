import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FiShare } from "react-icons/fi";
import styled, { css } from "styled-components";

import { InferenceResult } from "../types";

interface ShareProps {
    inferenceResults: InferenceResult[];
    nowPlayingResult: InferenceResult;
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

export default function Share({
    inferenceResults,
    nowPlayingResult,
}: ShareProps) {
    const [open, setOpen] = useState(false);

    var classNameCondition = ""
    if (open) {
        classNameCondition = "fixed z-90 top-28 right-8 bg-sky-400 w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-white text-2xl hover:bg-sky-500 hover:drop-shadow-2xl"
    } else {
        classNameCondition = "fixed z-90 top-28 right-8 bg-slate-100 w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-sky-900 text-2xl hover:text-white hover:bg-sky-600 hover:drop-shadow-2xl"
    }

    // function to copy link to moment in song to the clipboard
    function copyToClipboard(secondsAgo: number) {

        // use generateLink to generate the link
        const link = generateLink(secondsAgo);

        var copyText = window.location.href
        navigator.clipboard.writeText(link);
    }

    // function to generate a link to a the moment in the song based on the played clips, input variable is how many seconds ago
    function generateLink(secondsAgo: number) {

        var prompt
        var seed
        var denoising
        var maskImageId
        var seedImageId
        var guidance
        var numInferenceSteps
        var alphaVelocity

        if (!nowPlayingResult) {
            return window.location.href;
        }
        else {
            var selectedInput: InferenceResult["input"]
            if (secondsAgo == 0) {
                selectedInput = nowPlayingResult.input
            }
            else {
                var selectedCounter = nowPlayingResult.counter - (secondsAgo / 5)
                selectedInput = inferenceResults.find((result) => result.counter == selectedCounter)?.input

                if (!selectedInput) {
                    // TODO: ideally don't show the button in this case...
                    return window.location.href;
                }
            }

            // TODO: Consider start or end here. End is something the the user hasn't actually heard yet. Start is perhaps a previous prompt than where the user is headed

            prompt = selectedInput.start.prompt
            seed = selectedInput.start.seed
            denoising = selectedInput.start.denoising
            maskImageId = selectedInput.mask_image_id

            // TODO, selectively add these based on whether we give user option to change them

            // seedImageId = nowPlayingResult.input.seed_image_id
            // guidance = nowPlayingResult.input.guidance
            // numInferenceSteps = nowPlayingResult.input.num_inference_steps
            // alphaVelocity = nowPlayingResult.input.alpha_velocity
        }

        var baseUrl = "http://localhost:3000/?"

        if (prompt != null) { var promptString = "&prompt=" + prompt } else { promptString = "" }
        if (seed != null) { var seedString = "&seed=" + seed } else { seedString = "" }
        if (denoising != null) { var denoisingString = "&denoising=" + denoising } else { denoisingString = "" }
        if (maskImageId != null) { var maskImageIdString = "&maskImageId=" + maskImageId } else { maskImageIdString = "" }
        if (seedImageId != null) { var seedImageIdString = "&seedImageId=" + seedImageId } else { seedImageIdString = "" }
        if (guidance != null) { var guidanceString = "&guidance=" + guidance } else { guidanceString = "" }
        if (numInferenceSteps != null) { var numInferenceStepsString = "&numInferenceSteps=" + numInferenceSteps } else { numInferenceStepsString = "" }
        if (alphaVelocity != null) { var alphaVelocityString = "&alphaVelocity=" + alphaVelocity } else { alphaVelocityString = "" }

        // Format strings to have + in place of spaces for ease of sharing, note this is only necessary for prompts currently
        promptString = promptString.replace(/ /g, "+");

        // create url string with the variables above combined
        var shareUrl = baseUrl + promptString + seedString + denoisingString + maskImageIdString + seedImageIdString + guidanceString + numInferenceStepsString + alphaVelocityString

        return shareUrl;
    }

    return (
        <>
            <button
                title="Info"
                className={classNameCondition}
                onClick={() => setOpen(true)}
            >
                <FiShare />
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
                                        Riff with a friend
                                    </Dialog.Title>
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500">
                                            Chose a moment from your song to share.
                                        </p>
                                    </div>

                                    <div className="mt-6">

                                        {/* TODO: Seth, add in 10 secondsAgo option */}
                                        {/* <button
                                            className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-sky-500 group-hover:from-sky-600 group-hover:to-sky-500 hover:text-white"
                                            onClick={() => {
                                                copyToClipboard(0)
                                                setOpen(false);
                                            }}
                                        >
                                            <span className="w-64 relative px-5 py-2 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                                                Copy link from 20 seconds ago
                                            </span>
                                        </button> */}

                                        <button
                                            type="button"
                                            className="w-64 text-white bg-gradient-to-br from-purple-600 to-sky-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                                            onClick={() => {
                                                copyToClipboard(0)
                                                setOpen(false)
                                            }}
                                        >
                                            Copy link to current moment 🔗
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