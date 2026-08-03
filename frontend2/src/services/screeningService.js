import api from "../api/api";

/**
 * Run AI screening for a specific application.
 *
 * @param {number|string} applicationId
 * @returns {Promise<Object>}
 */
export const runScreening = async (applicationId) => {
  const response = await api.post(`/screening/run/${applicationId}`);
  return response.data;
};

export default {
  runScreening,
};