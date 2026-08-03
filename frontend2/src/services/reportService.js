import api from "../api/api";

const BASE_URL = "/reports/export";

const exportReport = async (type, format, config = {}) => {
  return api.get(`${BASE_URL}?type=${encodeURIComponent(type)}&format=${encodeURIComponent(format)}`, config);
};

export default {
  exportReport,
};
