import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
} from "@mui/material";

export default function StatCard({
  title,
  value,
  icon,
  color = "#2563EB",
}) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        transition: "all .25s ease",

        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 16px 40px rgba(15,23,42,.12)",
        },
      }}
    >
      <CardContent
        sx={{
          p: 3,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {value}
            </Typography>
          </Box>

          <Avatar
            sx={{
              bgcolor: `${color}20`,
              color: color,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}