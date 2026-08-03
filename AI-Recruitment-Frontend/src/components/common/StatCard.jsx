import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Chip,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";

function StatCardBody({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
  trendLabel,
  loading,
  action,
}) {
  const hasTrend = typeof trend === "number";
  const positiveTrend = (trend ?? 0) >= 0;
  const trendValue = Math.abs(trend ?? 0).toFixed(1);

  return (
    <Stack
      spacing={2}
      sx={{
        p: 3,
        minHeight: 180,
        height: "100%",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {loading ? (
          <Skeleton variant="rounded" width={56} height={56} />
        ) : (
          <Avatar
            variant="rounded"
            aria-label={title ? `${title} icon` : "Stat icon"}
            sx={(theme) => ({
              width: 56,
              height: 56,
              borderRadius: 2.5,
              bgcolor: theme.palette[color].main + "14",
              color: theme.palette[color].main,
              "& .MuiSvgIcon-root": {
                fontSize: 28,
              },
            })}
          >
            {icon}
          </Avatar>
        )}

        {!loading && action ? <Box>{action}</Box> : null}
      </Stack>

      <Stack spacing={0.75} sx={{ flexGrow: 1 }}>
        {loading ? (
          <>
            <Skeleton variant="text" width="45%" height={24} />
            <Skeleton variant="text" width="60%" height={42} />
            <Skeleton variant="text" width="72%" height={20} />
          </>
        ) : (
          <>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: 30, sm: 34 },
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                wordBreak: "break-word",
              }}
            >
              {value}
            </Typography>

            {subtitle ? (
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.4,
                }}
              >
                {subtitle}
              </Typography>
            ) : null}
          </>
        )}
      </Stack>

      {loading ? (
        <Skeleton variant="rounded" width={132} height={28} />
      ) : hasTrend ? (
        <Tooltip title={trendLabel || "vs last month"}>
          <Chip
            size="small"
            icon={
              positiveTrend ? (
                <TrendingUpRoundedIcon sx={{ fontSize: "16px !important" }} />
              ) : (
                <TrendingDownRoundedIcon sx={{ fontSize: "16px !important" }} />
              )
            }
            label={`${positiveTrend ? "▲" : "▼"} ${trendValue}%`}
            sx={(theme) => ({
              alignSelf: "flex-start",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 12,
              height: 28,
              color: positiveTrend
                ? theme.palette.success.dark
                : theme.palette.error.dark,
              bgcolor: positiveTrend
                ? theme.palette.success.main + "18"
                : theme.palette.error.main + "16",
              "& .MuiChip-icon": {
                color: "inherit",
              },
            })}
          />
        </Tooltip>
      ) : null}
    </Stack>
  );
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
  trend,
  trendLabel,
  loading = false,
  action,
  onClick,
}) {
  const clickable = typeof onClick === "function";

  const content = (
    <StatCardBody
      title={title}
      value={value}
      subtitle={subtitle}
      icon={icon}
      color={color}
      trend={trend}
      trendLabel={trendLabel}
      loading={loading}
      action={action}
    />
  );

  return (
    <Card
      elevation={0}
      aria-label={title ? `${title} statistic card` : "Statistic card"}
      sx={{
        borderRadius: "20px",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
        overflow: "hidden",
        height: "100%",
        cursor: clickable ? "pointer" : "default",
        transition: (theme) =>
          theme.transitions.create(["transform", "box-shadow", "border-color"], {
            duration: theme.transitions.duration.shorter,
          }),
        "&:hover": clickable
          ? {
              transform: "translateY(-2px)",
              boxShadow: "0 14px 34px rgba(15, 23, 42, 0.10)",
              borderColor: "transparent",
            }
          : undefined,
      }}
    >
      {clickable ? (
        <CardActionArea
          onClick={onClick}
          aria-label={title ? `Open ${title}` : "Open statistic"}
          sx={{ height: "100%", alignItems: "stretch" }}
        >
          <Box sx={{ height: "100%" }}>{content}</Box>
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
}
