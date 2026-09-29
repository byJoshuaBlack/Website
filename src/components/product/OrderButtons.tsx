import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { TextLink } from "@/components/ui/TextLink";
import type { OrderChannel } from "@/lib/order";

export function OrderButtons({ channels }: { channels: OrderChannel[] }) {
  const [primary, ...rest] = channels;
  if (!primary) return null;

  return (
    <div className="space-y-4">
      <Button href={primary.href} external>
        <Icon name={primary.kind} size={18} />
        {primary.label}
      </Button>
      {rest.map((channel) => (
        <p key={channel.kind} className="text-center text-label">
          <TextLink href={channel.href} external>
            {channel.label}
          </TextLink>
        </p>
      ))}
    </div>
  );
}
