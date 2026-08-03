import { Github, Linkedin, Mail } from "lucide-react";

export const socials = [
  {
    label: "GitHub",
    href: "https://github.com/GregB712",
    eventName: "github_profile_click",
    icon: Github
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/gbarmpas/",
    eventName: "linkedin_click",
    icon: Linkedin
  },
  {
    label: "Email",
    href: "mailto:gregorybarbas@gmail.com",
    eventName: "email_click",
    icon: Mail
  }
] as const;
