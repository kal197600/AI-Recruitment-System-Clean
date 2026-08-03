import { Box, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

export default function EmptyState({
  title = "No data available",
  description = "There is nothing to display.",
}) {
  return (
    <Box
      sx={{
        py: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <InboxOutlinedIcon
        sx={{
          fontSize: 64,
          color: "text.disabled",
          mb: 2,
        }}
      />

      <Typography
        variant="h6"
        sx={{ fontWeight: 600 }}
        gutterBottom
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        {description}
      </Typography>
    </Box>
  );
}