const smsBody = encodeURIComponent("Hi Mikael,\n\nLet's unleash our app...");

const emailSubject = encodeURIComponent("Let's unleash our app");
const emailBody = encodeURIComponent("Hi Mikael,\n\n...");

type IconName =
  | "phone"
  | "envelope"
  | "linkedin"
  | "bluesky"
  | "github"
  | "x-twitter";

interface Contact {
  id: string;
  type: "contact" | "social";
  href: string;
  icon: IconName;
  text: string;
  label: string;
  cta: string;
}

export const contact = [
  {
    id: "SMS",
    type: "contact",
    href: `sms:+14153709331?body=${smsBody}`,
    icon: "phone",
    text: "+1 (415) 370-9331",
    label: "Send SMS message to Mikael at +1 (415) 370-9331",
    cta: "Text me",
  },
  {
    id: "Email",
    type: "contact",
    href: `mailto:mikael+lp@lirbank.com?subject=${emailSubject}&body=${emailBody}`,
    icon: "envelope",
    text: "mikael@lirbank.com",
    label: "Send email to Mikael at mikael@lirbank.com",
    cta: "Email me",
  },
  {
    id: "linkedIn",
    type: "social",
    href: "https://www.linkedin.com/in/mikaellirbank",
    icon: "linkedin",
    text: "in/mikaellirbank",
    label: "Visit Mikael's LinkedIn profile",
    cta: "Connect on LinkedIn",
  },
  {
    id: "bluesky",
    type: "social",
    href: "https://bsky.app/profile/lirbank.com",
    icon: "bluesky",
    text: "mikaellirbank",
    label: "Visit Mikael's Bluesky profile",
    cta: "Follow on Bluesky",
  },
  {
    id: "github",
    type: "social",
    href: "https://github.com/lirbank",
    icon: "github",
    text: "lirbank",
    label: "Visit Mikael's GitHub profile",
    cta: "Follow on GitHub",
  },
] as const satisfies Contact[];
