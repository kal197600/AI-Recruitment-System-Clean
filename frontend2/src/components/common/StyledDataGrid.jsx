import { DataGrid } from "@mui/x-data-grid";

export default function StyledDataGrid({ sx, rowHeight = 64, columnHeaderHeight = 56, ...props }) {
  return (
    <DataGrid
      {...props}
      rowHeight={rowHeight}
      columnHeaderHeight={columnHeaderHeight}
      disableRowSelectionOnClick
      pageSizeOptions={[5, 10, 25]}
      sx={[
        {
          border: "1px solid #E2E8F0",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "#FFFFFF",
          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#F8FAFC",
            borderBottom: "1px solid #E2E8F0",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 800,
            color: "#334155",
          },
          "& .MuiDataGrid-row": {
            transition: "background-color 180ms ease",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#F8FBFF",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #F1F5F9",
            alignItems: "center",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid #E2E8F0",
            minHeight: 60,
            px: { xs: 0.5, sm: 1.5 },
          },
          "& .MuiTablePagination-toolbar": {
            minHeight: 58,
            px: { xs: 0.5, sm: 1 },
          },
          "& .MuiTablePagination-selectLabel": {
            display: { xs: "none", sm: "block" },
          },
          "& .MuiDataGrid-toolbarContainer": {
            p: { xs: 1.25, sm: 2 },
            gap: 1,
            flexWrap: "wrap",
            borderBottom: "1px solid #E2E8F0",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#FFFFFF",
          },
        },
        sx,
      ]}
    />
  );
}
