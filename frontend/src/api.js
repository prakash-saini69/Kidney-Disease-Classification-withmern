import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 60000
});

export async function predictKidneyScan(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/predict", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

export async function fetchPredictionHistory() {
  const { data } = await api.get("/history");
  return data;
}

export async function healthCheck() {
  const { data } = await api.get("/health");
  return data;
}
