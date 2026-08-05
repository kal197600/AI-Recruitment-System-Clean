import api from "../api/api";

const BASE_URL = "/candidates";

/**
 * Get all candidates
 */
export async function getCandidates() {
  const response = await api.get(BASE_URL);
  return response.data;
}

/**
 * Get one candidate
 */
export async function getCandidate(id) {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
}

/**
 * Create candidate
 */
export async function createCandidate(candidate) {
  console.group("POST /candidates");
  console.log("Request:", candidate);

  try {
    const response = await api.post(BASE_URL, candidate);

    console.log("Status:", response.status);
    console.log("Response:", response);
    console.log("Response Data:", response.data);

    console.groupEnd();

    return response.data;
  } catch (err) {
    console.error("Axios Error:", err);
    console.log("Status:", err.response?.status);
    console.log("Response:", err.response?.data);

    console.groupEnd();

    throw err;
  }
}

/**
 * Update candidate
 */
export async function updateCandidate(id, candidate) {
  const response = await api.put(`${BASE_URL}/${id}`, candidate);
  return response.data;
}

/**
 * Delete candidate
 */
export async function deleteCandidate(id) {
  await api.delete(`${BASE_URL}/${id}`);
}

export async function uploadCandidateCV(candidateId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    `/candidate-files/upload/${candidateId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function runCandidateJobMatching(candidateId) {
  const response = await api.post(`/job-matching/run/${candidateId}`);
  return response.data;
}