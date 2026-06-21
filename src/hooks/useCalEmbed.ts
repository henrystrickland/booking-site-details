import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import { cal } from "../content/site";

/**
 * Loads and configures the Cal.com popup embed — but only when booking is live
 * (`cal.enabled`). The embed script is fetched lazily after first paint, so it
 * never blocks the initial load; once ready, any element with a `data-cal-link`
 * attribute opens the booking in an on-page modal instead of a new tab.
 *
 * No-op when `cal.enabled` is false, so the disabled state stays zero-cost.
 */
export function useCalEmbed() {
  useEffect(() => {
    if (!cal.enabled) return;
    let cancelled = false;
    (async () => {
      const api = await getCalApi({ namespace: "booking" });
      if (cancelled) return;
      // Brand the popup with the site's copper accent in both themes.
      api("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#b9601a" },
          dark: { "cal-brand": "#dd7a30" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);
}
