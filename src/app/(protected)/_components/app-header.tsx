import { HStack } from "@/components/layout/h-stack";
import { Spacer } from "@/components/layout/spacer";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { Text } from "@/components/shared/text.shared";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export function AppHeader() {
  return (
    <HStack
      as="header"
      className="px-4 py-3 border-b shadow-primary/10 shadow-lg"
    >
      <Link href="/prompts" className="flex items-baseline gap-2">
        <Text size="2xl" className="text-primary font-semibold">
          Pron
        </Text>
        <Text as="span" className="text-muted-foreground" size="xs">
          프롬프트 라이브러리 - Powered by NextGenAI
        </Text>
      </Link>
      <Spacer />
      <HStack className="gap-4">
        <Link
          href="https://github.com/NextGenAI-Tech/pron"
          className="flex items-center justify-center"
        >
          <FaGithub size={24} />
        </Link>
        <ModeToggle />
      </HStack>
      <UserButton />
    </HStack>
  );
}
