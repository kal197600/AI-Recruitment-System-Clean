import api from "../api/api";

async function getSummary() {
  try {
    const response = await api.get("/dashboard/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dashboard summary", error);
    throw error;
  }
}

async function getApplications(limit = 20) {
  try {
    const response = await api.get("/dashboard/applications", {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dashboard applications", error);
    throw error;
  }
}

async function getApplication(applicationId) {
  try {
    const response = await api.get(`/dashboard/applications/${applicationId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch application ${applicationId}`,
      error
    );
    throw error;
  }
}

async function updateApplicationStatus(applicationId, status) {
  try {
    const response = await api.patch(
      `/applications/${applicationId}`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Failed to update application ${applicationId} status to ${status}`,
      error
    );
    throw error;
  }
}

const dashboardService = {
  getSummary,
  getApplications,
  getApplication,
  updateApplicationStatus,
};

export default dashboardService;
