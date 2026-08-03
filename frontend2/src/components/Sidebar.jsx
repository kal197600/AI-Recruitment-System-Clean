import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/DashboardRounded";
import PeopleIcon from "@mui/icons-material/PeopleAltRounded";
import WorkIcon from "@mui/icons-material/WorkRounded";
import AssignmentIcon from "@mui/icons-material/AssignmentRounded";
import MailIcon from "@mui/icons-material/MarkEmailUnreadRounded";
import PsychologyIcon from "@mui/icons-material/PsychologyRounded";
import AssessmentIcon from "@mui/icons-material/AssessmentRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesomeRounded";
import LogoutIcon from "@mui/icons-material/LogoutRounded";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 280;

const sections = [
  {
    title: "Workspace",
    items: [
      { text: "Dashboard", path: "/", icon: <DashboardIcon /> },
      { text: "Candidates", path: "/candidates", icon: <PeopleIcon /> },
      { text: "Jobs", path: "/jobs", icon: <WorkIcon /> },
    ],
  },
  {
    title: "Recruitment",
    items: [
      { text: "Applications", path: "/applications", icon: <AssignmentIcon /> },
      { text: "Email Import", path: "/email-import", icon: <MailIcon /> },
      { text: "AI Screening", path: "/ai-screening", icon: <PsychologyIcon /> },
    ],
  },
  {
    title: "Insights",
    items: [{ text: "Reports", path: "/reports", icon: <AssessmentIcon /> }],
  },
];

function SidebarContent({ onNavigate }) {
  const location = useLocation();

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        color: "#E2E8F0",
      }}
    >
      <Box sx={{ px: 2.5, pt: 3, pb: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              color: "#FFFFFF",
              background: "linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)",
              boxShadow: "0 12px 28px rgba(59, 130, 246, 0.35)",
            }}
          >
            <AutoAwesomeIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              RecruitAI
            </Typography>
            <Typography sx={{ color: "#94A3B8", fontSize: 12.5, mt: 0.35 }}>
              Talent intelligence platform
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 2, pb: 2 }}>
        {sections.map((section) => (
          <List
            key={section.title}
            subheader={
              <ListSubheader
                component="div"
                disableSticky
                sx={{
                  bgcolor: "transparent",
                  color: "#64748B",
                  fontSize: 11,
                  lineHeight: 1,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  px: 1.5,
                  pt: 2.25,
                  pb: 1.25,
                }}
              >
                {section.title}
              </ListSubheader>
            }
            sx={{ p: 0 }}
          >
            {section.items.map((item) => {
              const active =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              return (
                <ListItemButton
                  key={item.text}
                  component={Link}
                  to={item.path}
                  onClick={onNavigate}
                  selected={active}
                  sx={{
                    minHeight: 48,
                    borderRadius: 3,
                    mb: 0.75,
                    px: 1.25,
                    color: active ? "#FFFFFF" : "#CBD5E1",
                    transition: "all 180ms ease",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 10,
                      bottom: 10,
                      width: 3,
                      borderRadius: "0 8px 8px 0",
                      bgcolor: active ? "#60A5FA" : "transparent",
                    },
                    "&.Mui-selected": {
                      bgcolor: "rgba(59, 130, 246, 0.18)",
                    },
                    "&.Mui-selected:hover": {
                      bgcolor: "rgba(59, 130, 246, 0.24)",
                    },
                    "&:hover": {
                      bgcolor: "rgba(148, 163, 184, 0.10)",
                      transform: "translateX(2px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      mr: 1.25,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 2.5,
                      bgcolor: active ? "rgba(96, 165, 250, 0.18)" : "transparent",
                      "& .MuiSvgIcon-root": {
                        fontSize: 21,
                        color: active ? "#93C5FD" : "#94A3B8",
                      },
                    }}
                  >
                    {item.icon}
                  </Box>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: active ? 700 : 600,
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        ))}
      </Box>

      <Box sx={{ p: 2 }}>
        <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.15)", mb: 2 }} />
        <Box
          sx={{
            p: 1.25,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            borderRadius: 3,
            bgcolor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(148, 163, 184, 0.10)",
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#2563EB",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: 15,
            }}
          >
            ER
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography noWrap sx={{ color: "#F8FAFC", fontSize: 13.5, fontWeight: 700 }}>
              Elias Riachi
            </Typography>
            <Typography noWrap sx={{ color: "#94A3B8", fontSize: 11.5 }}>
              Administrator
            </Typography>
          </Box>
          <Box
            component="button"
            type="button"
            aria-label="Log out"
            sx={{
              border: 0,
              p: 0.75,
              display: "grid",
              placeItems: "center",
              borderRadius: 2,
              color: "#94A3B8",
              bgcolor: "transparent",
              cursor: "pointer",
              "&:hover": { color: "#FFFFFF", bgcolor: "rgba(255,255,255,0.08)" },
            }}
          >
            <LogoutIcon sx={{ fontSize: 19 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const paperSx = {
    width: drawerWidth,
    boxSizing: "border-box",
    borderRight: 0,
    background: "linear-gradient(180deg, #0F172A 0%, #111C33 100%)",
    boxShadow: "18px 0 48px rgba(15, 23, 42, 0.16)",
  };

  return (
    <Box component="nav" aria-label="Main navigation" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": paperSx,
        }}
      >
        <SidebarContent onNavigate={onMobileClose} />
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": paperSx,
        }}
      >
        <SidebarContent />
      </Drawer>
    </Box>
  );
}
