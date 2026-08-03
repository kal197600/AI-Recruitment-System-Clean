// frontend2/src/theme/shadows.js

const shadows = {
  none: "none",

  xs: "0px 1px 2px rgba(15,23,42,0.04)",

  sm: [
    "0px 2px 4px rgba(15,23,42,0.04)",
    "0px 1px 2px rgba(15,23,42,0.06)",
  ].join(","),

  md: [
    "0px 4px 12px rgba(15,23,42,0.06)",
    "0px 2px 4px rgba(15,23,42,0.04)",
  ].join(","),

  lg: [
    "0px 10px 24px rgba(15,23,42,0.08)",
    "0px 4px 8px rgba(15,23,42,0.05)",
  ].join(","),

  xl: [
    "0px 20px 40px rgba(15,23,42,0.10)",
    "0px 8px 16px rgba(15,23,42,0.06)",
  ].join(","),

  button: "0px 4px 10px rgba(37,99,235,0.18)",

  card: [
    "0px 4px 20px rgba(15,23,42,0.06)",
    "0px 2px 6px rgba(15,23,42,0.03)",
  ].join(","),

  cardHover: [
    "0px 10px 30px rgba(15,23,42,0.10)",
    "0px 4px 12px rgba(15,23,42,0.05)",
  ].join(","),

  dialog: [
    "0px 24px 48px rgba(15,23,42,0.16)",
    "0px 8px 16px rgba(15,23,42,0.08)",
  ].join(","),

  menu: [
    "0px 12px 32px rgba(15,23,42,0.10)",
    "0px 4px 10px rgba(15,23,42,0.05)",
  ].join(","),

  drawer: "4px 0px 24px rgba(15,23,42,0.08)",

  appBar: "0px 1px 4px rgba(15,23,42,0.06)",

  fab: [
    "0px 12px 24px rgba(37,99,235,0.24)",
    "0px 4px 8px rgba(37,99,235,0.18)",
  ].join(","),
};

export default shadows;