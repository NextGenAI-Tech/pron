import { Text } from "@/components/shared/text.shared";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen items-center justify-center relative">
      {children}
      <Text className="absolute bottom-4 right-4 text-9xl font-black text-primary opacity-20">
        PRON
      </Text>
    </div>
  );
}
