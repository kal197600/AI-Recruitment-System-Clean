import { useState } from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import GlobalSearch from "./common/GlobalSearch";

export default function TopBar({ onMenuClick }) {
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        px: { xs: 2, sm: 3, lg: 4 },
        pt: { xs: 1.5, sm: 2 },
        bgcolor: "rgba(244, 247, 251, 0.82)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(226, 232, 240, 0.72)",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          width: "100%",
          maxWidth: 1680,
          mx: "auto",
          minHeight: { xs: 62, sm: 70 },
          display: "flex",
          gap: { xs: 1, sm: 2 },
        }}
      >
        <IconButton
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          sx={{
            display: { xs: "inline-flex", md: "none" },
            width: 42,
            height: 42,
            borderRadius: 2.5,
            bgcolor: "#FFFFFF",
            border: "1px solid #E2E8F0",
          }}
        >
          <MenuRoundedIcon />
        </IconButton>

        <Box sx={{ minWidth: 0, display: { xs: "block", sm: "none" }, mr: "auto" }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: "text.primary", lineHeight: 1.2 }}>
            RecruitAI
          </Typography>
          <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>Recruitment workspace</Typography>
        </Box>

        <Box sx={{ display: { xs: "none", sm: "block" }, minWidth: 210 }}>
          <Typography sx={{ fontSize: { sm: 17, lg: 19 }, fontWeight: 800, color: "text.primary" }}>
            {greeting}, Elias
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.2, color: "text.secondary" }}>
            Here is what is happening with your hiring pipeline.
          </Typography>
        </Box>

        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            flex: 1,
            maxWidth: 560,
            mx: "auto",
            "& .MuiInputBase-root": {
              height: 46,
              bgcolor: "#FFFFFF",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
            },
          }}
        >
          <GlobalSearch />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 }, ml: { sm: "auto" } }}>
          <Tooltip title="Notifications">
            <IconButton
              onClick={(event) => setNotificationsAnchorEl(event.currentTarget)}
              aria-label="Open notifications"
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2.5,
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                color: "#475569",
                "&:hover": { bgcolor: "#EFF6FF", color: "primary.main" },
              }}
            >
              <Badge badgeContent={3} color="primary" overlap="circular">
                <NotificationsNoneRoundedIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton
              onClick={(event) => setSettingsAnchorEl(event.currentTarget)}
              aria-label="Open settings"
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                width: 42,
                height: 42,
                borderRadius: 2.5,
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                color: "#475569",
                "&:hover": { bgcolor: "#EFF6FF", color: "primary.main" },
              }}
            >
              <SettingsRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box
            onClick={(event) => setUserAnchorEl(event.currentTarget)}
            role="button"
            tabIndex={0}
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 1.1,
              py: 0.55,
              pl: 0.6,
              pr: 1,
              borderRadius: 3,
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", fontSize: 13, fontWeight: 800 }}>
              ER
            </Avatar>
            <Box sx={{ display: { sm: "none", xl: "block" }, minWidth: 0 }}>
              <Typography noWrap sx={{ fontSize: 13, fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
                Elias Riachi
              </Typography>
              <Typography noWrap sx={{ fontSize: 11, color: "text.secondary", mt: 0.25 }}>
                Administrator
              </Typography>
            </Box>
            <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
          </Box>
        </Box>

        <Menu
          anchorEl={notificationsAnchorEl}
          open={Boolean(notificationsAnchorEl)}
          onClose={() => setNotificationsAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem disabled>
            <ListItemText primary="No new notifications" secondary="You are all caught up" />
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => setNotificationsAnchorEl(null)}>View all notifications</MenuItem>
        </Menu>

        <Menu
          anchorEl={settingsAnchorEl}
          open={Boolean(settingsAnchorEl)}
          onClose={() => setSettingsAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={() => setSettingsAnchorEl(null)}>Profile settings</MenuItem>
          <MenuItem onClick={() => setSettingsAnchorEl(null)}>Appearance</MenuItem>
          <MenuItem onClick={() => setSettingsAnchorEl(null)}>Preferences</MenuItem>
        </Menu>

        <Menu
          anchorEl={userAnchorEl}
          open={Boolean(userAnchorEl)}
          onClose={() => setUserAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem disabled>
            <ListItemText primary="Elias Riachi" secondary="Administrator" />
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => setUserAnchorEl(null)}>My profile</MenuItem>
          <MenuItem onClick={() => setUserAnchorEl(null)}>Account settings</MenuItem>
          <MenuItem onClick={() => setUserAnchorEl(null)}>Log out</MenuItem>
        </Menu>
      </Toolbar>

      <Box
        sx={{
          display: { xs: "block", lg: "none" },
          width: "100%",
          maxWidth: 1680,
          mx: "auto",
          pb: 1.5,
          "& .MuiInputBase-root": {
            height: 44,
            bgcolor: "#FFFFFF",
          },
        }}
      >
        <GlobalSearch />
      </Box>
    </AppBar>
  );
}
