import {
  LinkedInIcon,
  SquareXTwitterIcon,
  SquareGitHubIcon,
  SquareEnvelopeIcon,
  SquarePhoneIcon,
} from "./icons";

const smsBody = encodeURIComponent("Hi Mikael,\n\nLet's unleash our app...");

const emailSubject = encodeURIComponent("Let's unleash our app");
const emailBody = encodeURIComponent("Hi Mikael,\n\n...");

interface Contact {
  id: string;
  type: "contact" | "social";
  href: string;
  icon: React.ElementType;
  text: string;
  label: string;
  cta: string;
}

export const contact = [
  {
    id: "SMS",
    type: "contact",
    href: `sms:+14153709331?body=${smsBody}`,
    icon: SquarePhoneIcon,
    text: "+1 (415) 370-9331",
    label: "Send SMS message to Mikael at +1 (415) 370-9331",
    cta: "Text me",
  },
  {
    id: "Email",
    type: "contact",
    href: `mailto:mikael+lp@airlab.io?subject=${emailSubject}&body=${emailBody}`,
    icon: SquareEnvelopeIcon,
    text: "mikael@airlab.io",
    label: "Send email to Mikael at mikael@airlab.io",
    cta: "Email me",
  },
  {
    id: "linkedIn",
    type: "social",
    href: "https://www.linkedin.com/in/mikaellirbank",
    icon: LinkedInIcon,
    text: "in/mikaellirbank",
    label: "Visit Mikael's LinkedIn profile",
    cta: "Connect on LinkedIn",
  },
  {
    id: "x",
    type: "social",
    href: "https://x.com/mikaellirbank",
    icon: SquareXTwitterIcon,
    text: "mikaellirbank",
    label: "Visit Mikael's X (formerly Twitter) profile",
    cta: "Follow on X",
  },
  {
    id: "github",
    type: "social",
    href: "https://github.com/lirbank",
    icon: SquareGitHubIcon,
    text: "lirbank",
    label: "Visit Mikael's GitHub profile",
    cta: "Follow on GitHub",
  },
] as const satisfies Contact[];