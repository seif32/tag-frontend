function AgeVerificationModal({ onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4">Age Verification</h2>
        <p className="mb-6">
          You must be 18+ to use this site. Please confirm your age.
        </p>
        <button
          onClick={onConfirm}
          className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-700"
        >
          I am 18 or older
        </button>
      </div>
    </div>
  );
}

export default AgeVerificationModal;
