import { Card, CardContent, Typography } from "@mui/material";
import StyledDataGrid from "../common/StyledDataGrid";

const columns = [
  {
    field: "title",
    headerName: "Job",
    flex: 1,
  },
  {
    field: "department",
    headerName: "Department",
    flex: 1,
  },
  {
    field: "applicants",
    headerName: "Applicants",
    width: 130,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
  },
];

export default function RecentJobs({ rows }) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Jobs
        </Typography>

        <StyledDataGrid
          rows={rows ?? []}
          columns={columns}
          autoHeight
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </CardContent>
    </Card>
  );
}
