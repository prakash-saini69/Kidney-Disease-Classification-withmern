const axios = require("axios");
const FormData = require("form-data");

async function requestPredictionFromMLService(file, requestId, mlServiceUrl) {
  const form = new FormData();
  form.append("file", file.buffer, {
    filename: file.originalname,
    contentType: file.mimetype
  });
  form.append("request_id", requestId);

  const response = await axios.post(`${mlServiceUrl}/predict`, form, {
    headers: form.getHeaders(),
    timeout: 120000
  });

  return response.data;
}

module.exports = { requestPredictionFromMLService };
