import { useState } from "react";
import { FiShare } from "react-icons/fi";

export default function Info() {
    const [open, setOpen] = useState(false);

    var classNameCondition = ""
    if (open) {
        classNameCondition = "fixed z-90 top-28 right-8 bg-sky-400 w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-white text-2xl hover:bg-sky-500 hover:drop-shadow-2xl"
    } else {
        classNameCondition = "fixed z-90 top-28 right-8 bg-slate-100 w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-sky-900 text-2xl hover:text-white hover:bg-sky-600 hover:drop-shadow-2xl"
    }

    // function that copies the current url to the clipboard and alerts the user
    function copyToClipboard() {
        var copyText = window.location.href
        navigator.clipboard.writeText(copyText);
    }

    return (
        <>
            <button
                title="Info"
                data-tooltip-target="tooltip-click" 
                data-tooltip-trigger="click"
                className={classNameCondition}
                onClick={() => {
                    copyToClipboard()
                }}
            >
                <FiShare />
            </button>
        </>
    );
};