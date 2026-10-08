import type { SocialLink } from "@/content/types";
import { Icon } from "./Icon";

type Props = {
  profile: SocialLink;
  className?: string;
  onClick?: () => void;
};

// A profile still waiting for its link shows its icon alone, leading nowhere.
export function SocialIcon({ profile, className, onClick }: Props) {
  if (!profile.href) {
    return (
      <span role="img" aria-label={profile.label} className={className}>
        <Icon name={profile.icon} />
      </span>
    );
  }
  return (
    <a
      href={profile.href}
      onClick={onClick}
      aria-label={profile.label}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <Icon name={profile.icon} />
    </a>
  );
}
