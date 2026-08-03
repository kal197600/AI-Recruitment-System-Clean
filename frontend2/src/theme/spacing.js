// frontend2/src/theme/spacing.js

const spacing = {
  /**
   * Base spacing unit (8px grid)
   * Usage:
   * theme.spacing(1) = 8px
   * theme.spacing(2) = 16px
   */
  base: 8,

  page: {
    x: 4,          // 32px
    y: 4,          // 32px
    maxWidth: 1600,
  },

  section: {
    gap: 4,        // 32px
    marginTop: 4,
    marginBottom: 4,
  },

  card: {
    padding: 3,    // 24px
    gap: 2.5,      // 20px
    headerGap: 2,
    borderRadius: 18,
  },

  form: {
    gap: 2.5,
    fieldHeight: 48,
    sectionGap: 4,
    actionsGap: 2,
  },

  table: {
    toolbarPadding: 2,
    rowHeight: 56,
    headerHeight: 56,
    cellPadding: 2,
  },

  dialog: {
    padding: 3,
    gap: 3,
    actionsPadding: 2,
    borderRadius: 20,
  },

  drawer: {
    width: 280,
    collapsedWidth: 84,
    itemHeight: 48,
    itemGap: 0.5,
    padding: 2,
  },

  topBar: {
    height: 72,
    paddingX: 3,
    paddingY: 2,
  },

  dashboard: {
    statCardHeight: 140,
    chartHeight: 360,
    gridGap: 3,
  },

  transitions: {
    fast: 150,
    normal: 250,
    slow: 350,
  },

  zIndex: {
    appBar: 1200,
    drawer: 1100,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
};

export default spacing;