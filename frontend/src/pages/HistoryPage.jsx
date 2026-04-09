import { useEffect, useState } from "react";
import { fetchPredictionHistory } from "../api";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetchPredictionHistory();
        setHistory(response.data || []);
      } catch (_err) {
        setError("Failed to load prediction history.");
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-semibold">Prediction History</h2>
        {isLoading && <p className="text-slate-400">Loading history...</p>}
        {error && <p className="rounded-lg bg-rose-950 p-3 text-rose-300">{error}</p>}
        {!isLoading && !error && history.length === 0 && <p className="text-slate-400">No records found yet.</p>}
        {!isLoading && history.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">File</th>
                  <th className="pb-3">Prediction</th>
                  <th className="pb-3">Confidence</th>
                  <th className="pb-3">Request ID</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.request_id} className="border-t border-slate-800">
                    <td className="py-3">{new Date(item.timestamp).toLocaleString()}</td>
                    <td className="py-3">{item.file.name}</td>
                    <td className="py-3 text-teal-400">{item.prediction}</td>
                    <td className="py-3">{(item.confidence * 100).toFixed(2)}%</td>
                    <td className="py-3 text-xs">{item.request_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
