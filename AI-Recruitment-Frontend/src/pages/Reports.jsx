import { Box, Button, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import TableViewRoundedIcon from "@mui/icons-material/TableViewRounded";

import PageHeader from "../components/common/PageHeader";
import reportService from "../services/reportService";

const reportTypes = [
  { label: "Dashboard", value: "dashboard", description: "Overview metrics and hiring activity.", icon: <DashboardRoundedIcon /> },
  { label: "Candidates", value: "candidates", description: "Candidate profiles, status, and scores.", icon: <PeopleAltRoundedIcon /> },
  { label: "Jobs", value: "jobs", description: "Openings, departments, and job status.", icon: <WorkRoundedIcon /> },
  { label: "Applications", value: "applications", description: "Application pipeline and decisions.", icon: <AssignmentRoundedIcon /> },
  { label: "AI Screening", value: "screening", description: "AI scores and recommendation results.", icon: <PsychologyRoundedIcon /> },
];

export default function Reports() {
  const handleExport = async (type, format) => {
    try {
      const response = await reportService.exportReport(type, format, { responseType: "blob" });
      const blob = new Blob([response.data], {
        type: format === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report-${type}.${format === "pdf" ? "pdf" : "xlsx"}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  return (
    <Box>
      <PageHeader title="Reports" subtitle="Generate clean, shareable recruitment reports in PDF or Excel." />

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {reportTypes.map((report) => (
          <Grid item xs={12} md={6} xl={4} key={report.value} sx={{ display: "flex" }}>
            <Card sx={{ width: "100%", border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: { xs: 2.25, sm: 3 }, "&:last-child": { pb: { xs: 2.25, sm: 3 } } }}>
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 3,
                    color: "primary.main",
                    bgcolor: "#EFF6FF",
                    mb: 2,
                  }}
                >
                  {report.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{report.label}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, mb: 2.5 }}>
                  {report.description}
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                  <Button fullWidth variant="contained" startIcon={<PictureAsPdfRoundedIcon />} onClick={() => handleExport(report.value, "pdf")}>
                    Export PDF
                  </Button>
                  <Button fullWidth variant="outlined" startIcon={<TableViewRoundedIcon />} onClick={() => handleExport(report.value, "excel")}>
                    Export Excel
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
