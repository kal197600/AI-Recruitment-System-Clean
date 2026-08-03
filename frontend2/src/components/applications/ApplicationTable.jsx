import { DataGrid } from "@mui/x-data-grid";
import {
  Chip,
  IconButton,
  Stack,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function getStatusColor(status) {
  switch (status) {
    case "Applied":
      return "info";

    case "Screening":
      return "warning";

    case "Interview":
      return "secondary";

    case "Offer":
      return "success";

    case "Hired":
      return "success";

    case "Rejected":
      return "error";

    default:
      return "default";
  }
}

export default function ApplicationTable({
  rows,
  loading,
  onEdit,
  onDelete,
  onScreen,
}) {
  const columns = [
    {
      field: "candidate_name",
      headerName: "Candidate",
      flex: 1.4,
    },
    {
      field: "job_title",
      headerName: "Job",
      flex: 1.4,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Chip
          size="small"
          color={getStatusColor(params.value)}
          label={params.value}
        />
      ),
    },
    {
      field: "source",
      headerName: "Source",
      width: 130,
    },
    {
      field: "applied_at",
      headerName: "Applied",
      width: 180,
      valueFormatter: (value) => {
        if (!value) return "";
        return new Date(value).toLocaleDateString();
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      sortable: false,

      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            color="primary"
            onClick={() => onEdit(params.row)}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => onDelete(params.row)}
          >
            <DeleteIcon />
          </IconButton>

          <IconButton
            color="success"
            onClick={() => onScreen(params.row)}
            title="AI Screening"
          >
            🤖
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      autoHeight
      disableRowSelectionOnClick
      pageSizeOptions={[10, 25, 50]}
      initialState={{
        pagination: {
          paginationModel: {
            page: 0,
            pageSize: 10,
          },
        },
      }}
    />
  );
}