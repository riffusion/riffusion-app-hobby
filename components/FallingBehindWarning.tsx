export default function FallingBehindWarning() {
  return (
    <div
      className="fixed z-20 bottom-8 md:bottom-8 left-12 md:left-12 bg-yellow-50 border border-yellow-600 text-yellow-700 px-4 py-3 rounded"
      role="alert"
    >
      <span className="block sm:inline mr-8">
        <b>Uh oh!</b> The GPU server is behind.
      </span>
    </div>
  );
}
