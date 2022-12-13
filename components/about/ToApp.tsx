import { useState, useEffect } from "react";

export default function ToApp() {
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 2) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
    
  return (
    <>
      <button
        type="button"
        className="fixed z-10 top-8 right-8 md:top-12 md:right-12 text-white bg-gradient-to-br from-purple-600 to-sky-500 hover:bg-gradient-to-bl w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-2xl hover:text-white hover:bg-sky-600 hover:drop-shadow-2xl"
        onClick={() => window.location.href = "/"}
      >
        🎸
      </button>

      {showButton && (
        <div className="fixed z-20 top-12 right-8 md:top-16 md:right-12 text-white bg-gradient-to-br w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-2xl">
          <span className="absolute bottom-0 -right-2 bg-white text-black rounded-full p-1 pr-2 pl-2 text-xs">Try it!</span>
          <button
            type="button"
            className="z-30 w-16 h-16 rounded-full"
            onClick={() => window.location.href = "/"}
          >
          </button>
        </div>
      )} 


    </>
  );
};
