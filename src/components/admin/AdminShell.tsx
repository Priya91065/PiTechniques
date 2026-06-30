"use client";

import { useState, type ElementType, type JSX, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AppBar,
  Avatar,
  Box,
  Breadcrumbs,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import ViewCarouselOutlinedIcon from "@mui/icons-material/ViewCarouselOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DesignServicesOutlinedIcon from "@mui/icons-material/DesignServicesOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import TravelExploreOutlinedIcon from "@mui/icons-material/TravelExploreOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { NAV_GROUPS, type IconKey } from "@/lib/admin/nav";
import { useThemeMode } from "@/lib/admin/ThemeModeProvider";

const DRAWER_WIDTH = 264;

const ICONS: Record<IconKey, ElementType> = {
  dashboard: SpaceDashboardOutlinedIcon,
  analytics: InsightsOutlinedIcon,
  homepage: HomeOutlinedIcon,
  banner: ViewCarouselOutlinedIcon,
  pages: DescriptionOutlinedIcon,
  about: InfoOutlinedIcon,
  services: DesignServicesOutlinedIcon,
  caseStudies: WorkOutlineOutlinedIcon,
  testimonials: FormatQuoteOutlinedIcon,
  team: GroupsOutlinedIcon,
  faqs: QuizOutlinedIcon,
  clients: BusinessOutlinedIcon,
  careers: BadgeOutlinedIcon,
  contactPage: ContactMailOutlinedIcon,
  navigation: AccountTreeOutlinedIcon,
  media: PermMediaOutlinedIcon,
  messages: MailOutlinedIcon,
  seo: TravelExploreOutlinedIcon,
  users: ManageAccountsOutlinedIcon,
  settings: SettingsOutlinedIcon,
};

export interface AdminUser {
  name: string;
  email: string;
  role: string;
}

function titleCase(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminShell({
  user,
  children,
}: {
  user: AdminUser;
  children: ReactNode;
}): JSX.Element {
  const pathname = usePathname() || "/admin";
  const router = useRouter();
  const { mode, toggle } = useThemeMode();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isActive = (href: string): boolean =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  async function handleLogout(): Promise<void> {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const crumbs = pathname.split("/").filter(Boolean); // e.g. ["admin","services"]

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ px: 2 }}>
        <Box
          component={Link}
          href="/admin"
          aria-label="Pi Techniques admin"
          sx={{ display: "inline-flex", alignItems: "center" }}
        >
          <Box
            component="img"
            src="/images/footer-logo.svg"
            alt="Pi Techniques"
            sx={{ height: 34, width: "auto", display: "block" }}
          />
        </Box>
      </Toolbar>
      <Divider />
      <Box sx={{ overflowY: "auto", flexGrow: 1, py: 1 }}>
        {NAV_GROUPS.map((group) => {
          const items = group.items.filter(
            (item) => !item.superAdminOnly || user.role === "SUPER_ADMIN",
          );
          if (items.length === 0) return null;
          return (
            <List
              key={group.heading}
              dense
              subheader={
                <ListSubheader
                  disableSticky
                  sx={{ bgcolor: "transparent", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}
                >
                  {group.heading}
                </ListSubheader>
              }
            >
              {items.map((item) => {
                const Icon = ICONS[item.icon];
                const active = isActive(item.href);
                return (
                  <ListItemButton
                    key={item.href}
                    component={Link}
                    href={item.href}
                    selected={active}
                    onClick={() => setMobileOpen(false)}
                    sx={{ mx: 1, borderRadius: 2 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: active ? "primary.main" : undefined }}>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontWeight: active ? 700 : 500 }}>
                      {item.label}
                    </ListItemText>
                  </ListItemButton>
                );
              })}
            </List>
          );
        })}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ display: { md: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Breadcrumbs sx={{ flexGrow: 1 }}>
            {crumbs.map((seg, i) => {
              const href = "/" + crumbs.slice(0, i + 1).join("/");
              const label = seg === "admin" ? "Dashboard" : titleCase(seg);
              const last = i === crumbs.length - 1;
              return last ? (
                <Typography key={href} color="text.primary" fontWeight={700}>
                  {label}
                </Typography>
              ) : (
                <Typography
                  key={href}
                  component={Link}
                  href={href}
                  sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                >
                  {label}
                </Typography>
              );
            })}
          </Breadcrumbs>

          <Tooltip title={mode === "light" ? "Dark mode" : "Light mode"}>
            <IconButton onClick={toggle} aria-label="Toggle theme">
              {mode === "light" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Account">
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="Account menu">
              <Avatar sx={{ width: 34, height: 34, bgcolor: "primary.main", fontSize: 15 }}>
                {(user.name || user.email).charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography fontWeight={700}>{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Chip size="small" label={user.role} color="primary" sx={{ mt: 1 }} />
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutOutlinedIcon fontSize="small" />
              </ListItemIcon>
              Sign out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar: permanent on desktop, temporary drawer on mobile */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, p: { xs: 2, md: 4 } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
