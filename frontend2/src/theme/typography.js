// frontend2/src/theme/typography.js

const typography = {
  fontFamily: [
    "Inter",
    "Roboto",
    "Helvetica",
    "Arial",
    "sans-serif",
  ].join(","),

  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,

  h1: {
    fontSize: "3rem",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.03em",
    color: "#0F172A",
  },

  h2: {
    fontSize: "2.5rem",
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: "-0.025em",
    color: "#0F172A",
  },

  h3: {
    fontSize: "2rem",
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: "-0.02em",
    color: "#0F172A",
  },

  h4: {
    fontSize: "1.75rem",
    fontWeight: 700,
    lineHeight: 1.35,
    letterSpacing: "-0.015em",
    color: "#0F172A",
  },

  h5: {
    fontSize: "1.5rem",
    fontWeight: 600,
    lineHeight: 1.4,
    color: "#0F172A",
  },

  h6: {
    fontSize: "1.25rem",
    fontWeight: 600,
    lineHeight: 1.45,
    color: "#0F172A",
  },

  subtitle1: {
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: 1.6,
    color: "#334155",
  },

  subtitle2: {
    fontSize: "0.9rem",
    fontWeight: 600,
    lineHeight: 1.6,
    color: "#475569",
  },

  body1: {
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 1.75,
    color: "#334155",
  },

  body2: {
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: 1.7,
    color: "#64748B",
  },

  button: {
    fontSize: "0.95rem",
    fontWeight: 600,
    textTransform: "none",
    letterSpacing: "0.02em",
  },

  caption: {
    fontSize: "0.75rem",
    fontWeight: 500,
    lineHeight: 1.6,
    color: "#94A3B8",
  },

  overline: {
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#64748B",
  },
};

export default typography;