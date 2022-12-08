export default function ToApp() {
  return (
    <>
      {/* <button
        type="button"
        className="fixed z-90 top-8 right-8 text-white bg-gradient-to-br from-purple-600 to-sky-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={() => window.location.href = "/"}
      >
        Let&apos;s Riff 🎸
      </button> */}

      <button
        type="button"
        className="fixed z-90 top-4 right-4 md:top-8 md:right-8 text-white bg-gradient-to-br from-purple-600 to-sky-500 hover:bg-gradient-to-bl w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-sky-900 text-2xl hover:text-white hover:bg-sky-600 hover:drop-shadow-2xl"
        onClick={() => window.location.href = "/"}
      >
        🎸
      </button>
    </>
  );
};