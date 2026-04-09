export default function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-3 text-2xl font-semibold">About The Model</h2>
        <p className="mb-4 text-slate-300">
          This project keeps the original CNN training workflow managed with DVC stages and MLflow experiment tracking. The web stack is layered into a React frontend, Express API backend, and Python inference microservice.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Training pipeline: `ml-pipeline/cnnClassifier` and `dvc.yaml`</li>
          <li>Experiment tracking: MLflow (existing workflow preserved)</li>
          <li>Inference: FastAPI service loading trained `model.h5`</li>
          <li>Persistence: MongoDB prediction records for demo history</li>
        </ul>
      </div>
    </section>
  );
}
