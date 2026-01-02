import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "https://a236c54a325581f36d3deb87a672c286@o4509518861697024.ingest.de.sentry.io/4509519506309200",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: import.meta.env.MODE,
  release: import.meta.env.VITE_APP_VERSION || 'dev',
});
