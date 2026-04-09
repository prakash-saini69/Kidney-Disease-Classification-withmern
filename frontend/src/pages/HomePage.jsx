import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <p className="mb-3 text-sm uppercase tracking-wide text-teal-400">MLflow + DVC + Full Stack</p>
        <h2 className="mb-4 text-4xl font-bold">Kidney Disease Classification Web App</h2>
        <p className="mb-8 max-w-2xl text-slate-300">
          Upload kidney CT scan images and get model predictions with confidence scores, then track results in prediction history.
        </p>
        <div className="flex gap-3">
          <Link to="/predict" className="rounded-lg bg-teal-500 px-4 py-2 font-medium text-slate-950">
            Start Prediction
          </Link>
          <Link to="/history" className="rounded-lg border border-slate-700 px-4 py-2 text-slate-200">
            View History
          </Link>
        </div>
      </div>
    </section>
  );
}
