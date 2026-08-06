const components = ({ palette, typography, shadows, shape, spacing, theme }) => {
  const transition = theme.transitions.create(
    ["background-color", "border-color", "box-shadow", "transform", "color"],
    {
      duration: theme.transitions.duration.shortest,
    }
  );

  return {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },

        html: {
          scrollBehavior: "smooth",
        },

        body: {
          margin: 0,
          backgroundColor: palette.background.default,
          color: palette.text.primary,
          fontFamily: typography.fontFamily,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },

        "#root": {
          minHeight: "100vh",
        },

        "::selection": {
          backgroundColor: palette.primary.main,
          color: "#fff",
        },

        "::-webkit-scrollbar": {
          width: 10,
          height: 10,
        },

        "::-webkit-scrollbar-track": {
          background: palette.grey[100],
        },

        "::-webkit-scrollbar-thumb": {
          background: palette.grey[400],
          borderRadius: 20,
        },

        "::-webkit-scrollbar-thumb:hover": {
          background: palette.grey[500],
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          borderRadius: shape.components.button,
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 22px",
          transition,

          "&:hover": {
            transform: "translateY(-1px)",
          },
        },

        contained: {
          boxShadow: shadows.button,

          "&:hover": {
            boxShadow: shadows.button,
          },
        },

        outlined: {
          borderWidth: 1.5,

          "&:hover": {
            borderWidth: 1.5,
          },
        },

        text: {
          "&:hover": {
            backgroundColor: palette.action.hover,
          },
        },
      },
    },

    MuiCard: {
      defaultProps: {
        elevation: 0,
      },

      styleOverrides: {
        root: {
          borderRadius: shape.components.card,
          backgroundColor: palette.background.paper,
          boxShadow: shadows.card,
          transition,

          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: shadows.cardHover,
          },
        },
      },
    },

    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },

      styleOverrides: {
        root: {
          borderRadius: shape.components.paper,
          backgroundImage: "none",
          boxShadow: shadows.sm,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: "outlined",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: shape.components.textField,
          transition,
          ...(ownerState.multiline
            ? {
                alignItems: "flex-start",
              }
            : {
                height: spacing.form.fieldHeight,
              }),

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: palette.divider,
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: palette.primary.main,
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: palette.primary.main,
            borderWidth: 2,
          },
        }),

        input: {
          padding: "12px 14px",
        },

        inputMultiline: {
          padding: "16px 14px",
          lineHeight: 1.5,
          boxSizing: "border-box",
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: palette.text.secondary,

          "&.Mui-focused": {
            color: palette.primary.main,
          },
        },
      },
    },

    MuiSelect: {
      defaultProps: {
        size: "medium",
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: spacing.drawer.width,
          border: "none",
          backgroundColor: palette.background.paper,
          boxShadow: shadows.drawer,
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: palette.background.paper,
          color: palette.text.primary,
          boxShadow: shadows.appBar,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: palette.divider,
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: shape.components.avatar,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: shape.components.tooltip,
        },
      },
    },

    MuiSnackbar: {
      styleOverrides: {
        root: {},
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: shape.components.menu,
          boxShadow: shadows.menu,
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: shape.components.menu,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: shape.components.chip,
          fontWeight: 600,
          height: 30,
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: shape.components.dialog,
          padding: spacing.dialog.padding * spacing.base,
          boxShadow: shadows.dialog,
          margin: 16,
          width: "calc(100% - 32px)",
          maxHeight: "calc(100% - 32px)",
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          paddingBottom: 0,
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          paddingTop: spacing.base * 2,
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: spacing.base * 2,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: spacing.drawer.width,
          border: "none",
          backgroundColor: palette.background.paper,
          boxShadow: shadows.drawer,
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: palette.background.paper,
          color: palette.text.primary,
          boxShadow: shadows.appBar,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: palette.divider,
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: shape.components.avatar,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: shape.components.tooltip,
        },
      },
    },

    MuiSnackbar: {
      styleOverrides: {
        root: {},
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: shape.components.menu,
          boxShadow: shadows.menu,
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: shape.components.menu,
        },
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: shape.components.accordion ?? shape.borderRadius,
          boxShadow: 'none',
          '&:before': { display: 'none' },
        },
      },
    },

    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: spacing?.accordion?.summaryPadding ?? '0 12px',
        },
        content: {
          margin: spacing?.accordion?.summaryContentMargin ?? '8px 0',
        },
      },
    },

    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: spacing?.accordion?.detailsPadding ?? '12px',
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: spacing?.tabs?.minHeight ?? 40,
        },
        flexContainer: {
          gap: spacing?.tabs?.gap ?? 8,
        },
        indicator: {
          backgroundColor: palette.primary.main,
          height: 3,
          borderRadius: 3,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minHeight: spacing?.tabs?.minHeight ?? 40,
          padding: spacing?.tabs?.tabPadding ?? '6px 12px',
          borderRadius: shape.components.tab ?? shape.borderRadius ?? 8,
          '&.Mui-selected': {
            color: palette.primary.main,
          },
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: shape.components.table ?? shape.borderRadius ?? 8,
          overflow: 'hidden',
          background: palette.background.paper,
        },
      },
    },

    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate',
          borderSpacing: 0,
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            background: palette.background.default,
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${palette.divider}`,
          padding: '12px 16px',
        },
        head: {
          fontWeight: 700,
          color: palette.text.primary,
          background: palette.background.default,
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: palette.action.hover,
          },
          '&.Mui-selected': {
            background: palette.action.selected,
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: shape.components.dataGrid ?? shape.borderRadius ?? 8,
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            background: palette.background.default,
            borderBottom: `1px solid ${palette.divider}`,
          },
          '& .MuiDataGrid-columnHeader': {
            background: 'transparent',
          },
          '& .MuiDataGrid-row:hover': {
            background: palette.action.hover,
          },
          '& .MuiDataGrid-row.Mui-selected': {
            background: palette.action.selected,
          },
          '& .MuiDataGrid-toolbarContainer': {
            padding: spacing?.dataGrid?.toolbarPadding ?? '8px',
            gap: 8,
          },
          '& .MuiDataGrid-footerContainer': {
            background: palette.background.paper,
            borderTop: `1px solid ${palette.divider}`,
          },
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
        },
        columnHeaders: {
          borderBottom: 'none',
        },
      },
    },

    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: shape.components.listItem ?? shape.borderRadius ?? 8,
          '&:hover': {
            background: palette.action.hover,
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          color: palette.text.primary,
          '&:hover': {
            background: palette.action.hover,
          },
        },
      },
    },

    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: shape.components.fab ?? 999,
          boxShadow: shadows.button ?? shadows.md,
        },
      },
    },
  };
};

export default components;