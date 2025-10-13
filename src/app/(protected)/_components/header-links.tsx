"use client";

import { Text } from "@/components/shared/text.shared";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type HeaderLinksProps = {
  links: {
    href: string;
    label: string;
  }[];
};

export function HeaderLinks({ links }: HeaderLinksProps) {
  const path = usePathname();
  const isActive = (href: string) => path === href;
  return (
    <ul className="hidden list-none items-center gap-4 md:flex">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            isActive(link.href) ? "text-primary" : "text-muted-foreground",
          )}
        >
          <li>
            <Text size="sm">{link.label}</Text>
          </li>
        </Link>
      ))}
    </ul>
  );
}
