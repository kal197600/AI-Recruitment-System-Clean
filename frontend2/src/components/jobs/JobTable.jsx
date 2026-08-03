import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Chip, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function JobTable({
  rows,
  loading,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      field: "title",
      headerName: "Job Title",
      flex: 1.4,
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
    },
    {
      field: "employment_type",
      headerName: "Type",
      flex: 1,
    },
    {
      field: "minimum_experience",
      headerName: "Experience",
      width: 130,
      renderCell: (params) =>
        `${params.value ?? 0} yrs`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          size="small"
          color={
            params.value === "Open"
              ? "success"
              : "default"
          }
          label={params.value}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row">
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
        </Stack>
      ),
    },
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      pageSizeOptions={[10, 25, 50]}
      initialState={{
        pagination: {
          paginationModel: {
            page: 0,
            pageSize: 10,
          },
        },
      }}
      autoHeight
      disableRowSelectionOnClick
    />
  );
}