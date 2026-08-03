import api from "../api/api";

const BASE_URL = "/applications";

export async function getApplications() {
  const response = await api.get(BASE_URL);
  return response.data;
}

export async function getApplication(id) {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
}

export async function createApplication(data) {
  const response = await api.post(BASE_URL, data);
  return response.data;
}

export async function updateApplication(id, data) {
  const response = await api.put(`${BASE_URL}/${id}`, data);
  return response.data;
}

export async function deleteApplication(id) {
  await api.delete(`${BASE_URL}/${id}`);
}