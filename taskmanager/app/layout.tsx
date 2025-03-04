"use client";
import { MantineProvider,DEFAULT_THEME  } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
// import { createMantineTheme } from '@mantine/core';

const theme = {
  ...DEFAULT_THEME,
  normalizeCSS: true,
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider theme={theme}>
          <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
