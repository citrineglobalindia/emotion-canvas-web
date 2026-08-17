/**
 * Global studio details (email, phone, address, Instagram).
 *
 * These appear in the header, footer, contact section and Instagram strip, so
 * they live in one admin-editable block — `site` / `contact-details` — rather
 * than being repeated per component. The constants in `siteContact.ts` remain
 * the compiled-in fallback, so the site is correct before an admin ever opens
 * the panel.
 */
import { metaString, useSection } from "@/lib/siteContent";
import {
  SITE_ADDRESS_FULL,
  SITE_EMAIL,
  SITE_INSTAGRAM_HANDLE,
  SITE_INSTAGRAM_URL,
  SITE_LOCATION_LABEL,
  SITE_MAPS_URL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
} from "@/lib/siteContact";

export type SiteSettings = {
  email: string;
  emailHref: string;
  phoneDisplay: string;
  phoneHref: string;
  locationLabel: string;
  addressFull: string;
  mapsUrl: string;
  instagramUrl: string;
  instagramHandle: string;
};

export const useSiteSettings = (): SiteSettings => {
  const block = useSection("site", "contact-details");

  const email = metaString(block, "email", SITE_EMAIL)!;
  const phoneDisplay = metaString(block, "phone_display", SITE_PHONE_DISPLAY)!;

  return {
    email,
    emailHref: `mailto:${email}`,
    phoneDisplay,
    // If an admin changes the displayed number but not the dial link, derive
    // the link from the number rather than dialling the old one.
    phoneHref:
      metaString(block, "phone_href") ??
      (phoneDisplay === SITE_PHONE_DISPLAY
        ? SITE_PHONE_HREF
        : `tel:${phoneDisplay.replace(/[^\d+]/g, "")}`),
    locationLabel: metaString(block, "location_label", SITE_LOCATION_LABEL)!,
    addressFull: metaString(block, "address_full", SITE_ADDRESS_FULL)!,
    mapsUrl: metaString(block, "maps_url", SITE_MAPS_URL)!,
    instagramUrl: metaString(block, "instagram_url", SITE_INSTAGRAM_URL)!,
    instagramHandle: metaString(block, "instagram_handle", SITE_INSTAGRAM_HANDLE)!,
  };
};
