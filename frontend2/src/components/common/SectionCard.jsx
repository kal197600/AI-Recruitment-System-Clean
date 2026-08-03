import { Card, CardContent } from "@mui/material";

export default function SectionCard({
  children,
}) {
  return (
    <Card elevation={0}>
      <CardContent
        sx={{
          p: 3,
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
}