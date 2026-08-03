import api from "../api/api";

const BASE_URL = "/import-email";

export async function importEmails() {
  const response = await api.post(BASE_URL);

  return response.data;
}

export default {
  importEmails,
};