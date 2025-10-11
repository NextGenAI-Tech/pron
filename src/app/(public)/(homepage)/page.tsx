import { Text } from "@/components/shared/text.shared";
import { Button } from "@/components/ui/button";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import Image from "next/image";
import { handleStart } from "@/actions/handle-start";

export default async function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Image
        src="/logo-gray.png"
        alt="bg"
        fill
        className="relative z-0 scale-80 object-contain opacity-10"
      />
      <HeroGeometric
        title1="업무에 필요한 프롬프트를 공유하고, 자신만의 프롬프트를 만드세요"
        title2="Custom Prompt Library"
        badge="Powered by NextGenAI"
      />
      <div className="flex w-full justify-center">
        <form action={handleStart}>
          <Button size="lg" className="cursor-pointer">
            <Text className="font-semibold">시작하기</Text>
          </Button>
        </form>
      </div>
    </div>
  );
}
