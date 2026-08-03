import { Card, CardContent, Typography } from "@mui/material";
import StyledDataGrid from "../common/StyledDataGrid";

const columns = [
  {
    field: "name",
    headerName: "Candidate",
    flex: 1,
  },
  {
    field: "position",
    headerName: "Position",
    flex: 1,
  },
  {
    field: "score",
    headerName: "AI Score",
    width: 120,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
  },
];

export default function RecentCandidates({ rows }) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Candidates
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
