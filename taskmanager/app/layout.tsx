// app/layout.tsx
import { MantineProvider, AppShell } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import 'normalize.css/normalize.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>
          <AppShell>
            {children}
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}