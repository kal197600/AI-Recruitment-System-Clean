import { Box, Typography } from "@mui/material";

export default function PageHeader({ title, subtitle, action, actions }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", sm: "flex-end" },
        gap: 2,
        mb: { xs: 2.5, md: 3.5 },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 26, sm: 30, lg: 34 },
            lineHeight: 1.15,
            letterSpacing: "-0.035em",
            fontWeight: 800,
            color: "text.primary",
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            color="text.secondary"
            sx={{ mt: 0.75, fontSize: { xs: 13.5, sm: 14.5 }, lineHeight: 1.6 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {(actions ?? action) && (
        <Box
          sx={{
            ml: { sm: "auto" },
            width: { xs: "100%", sm: "auto" },
            "& .MuiButton-root": { width: { xs: "100%", sm: "auto" } },
          }}
        >
          {actions ?? action}
        </Box>
      )}
    </Box>
  );
}
