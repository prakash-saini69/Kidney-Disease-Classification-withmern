import { useMemo, useState } from "react";
import { predictKidneyScan } from "../api";

export default function PredictPage() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!file) {
      setError("Please select a CT scan image before submitting.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await predictKidneyScan(file);
      setResult(response);
    } catch (err) {
      setError(err?.response?.data?.error || "Prediction request failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-2">
      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-semibold">Upload & Predict</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="mb-4 block w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
        />
        {previewUrl && <img src={previewUrl} alt="preview" className="mb-4 h-56 w-full rounded-lg object-cover" />}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-teal-500 px-4 py-2 font-semibold text-slate-950 disabled:opacity-60"
        >
          {isLoading ? "Predicting..." : "Submit"}
        </button>
        {error && <p className="mt-4 rounded-lg bg-rose-950 p-3 text-sm text-rose-300">{error}</p>}
      </form>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="mb-4 text-xl font-semibold">Prediction Result</h3>
        {!result && <p className="text-slate-400">No prediction yet. Upload a scan and submit.</p>}
        {result && (
          <div className="space-y-3">
            <p>
              <span className="text-slate-400">Label:</span>{" "}
              <span className="font-semibold text-teal-400">{result.prediction}</span>
            </p>
            <p>
              <span className="text-slate-400">Confidence:</span>{" "}
              <span className="font-semibold">{(result.confidence * 100).toFixed(2)}%</span>
            </p>
            <p className="rounded-lg bg-slate-800 p-3 text-slate-300">{result.explanation}</p>
            <p className="text-xs text-slate-400">Request ID: {result.request_id}</p>
          </div>
        )}
      </div>
    </section>
  );
}
