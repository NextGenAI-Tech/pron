import { VStack } from "@/components/layout/v-stack";
import { Text } from "@/components/shared/text.shared";
import { Button } from "@/components/ui/button";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { BookOpen, Variable, Share2, Save } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { nanoid } from "nanoid";
import { Grid } from "@/components/layout/grid";
import { handleStart } from "@/actions/handle-start";

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "프롬프트 라이브러리",
    description: "프롬프트를 쉽게 관리하고 공유할 수 있습니다",
  },
  {
    icon: <Variable className="h-6 w-6" />,
    title: "변수 관리",
    description: "상황에 맞게 바꾸어 자신만의 프롬프트를 만드세요.",
  },
  {
    icon: <Share2 className="h-6 w-6" />,
    title: "공유하기",
    description: "프롬프트를 쉽게 공유할 수 있습니다",
  },
  {
    icon: <Save className="h-6 w-6" />,
    title: "저장하기",
    description: "프롬프트를 내보내고 쉽게 저장할 수 있습니다",
  },
];

export default async function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Image
        src="/logo-gray.png"
        alt="bg"
        fill
        className="relative z-0 scale-80 object-contain opacity-10"
      />
      <div className="absolute inset-0 z-10 opacity-5 blur-2xl dark:opacity-30 dark:blur-xl">
        <ShaderAnimation />
      </div>
      <VStack className="absolute inset-0 z-20 container mx-auto flex flex-col items-center justify-center gap-10 px-4">
        <VStack className="items-center gap-2">
          <Text
            className="text-primary text-4xl font-bold md:text-6xl lg:text-8xl"
            as="h1"
            lang="en"
          >
            PRON
          </Text>
          <Text
            size="base"
            className="text-foreground/80 text-center"
            lang="ko"
          >
            업무에 필요한 프롬프트 라이브러리 - Powered by NextGenAI
          </Text>
        </VStack>
        <div className="flex w-full justify-center">
          <form action={handleStart}>
            <Button size="lg" className="cursor-pointer">
              <Text className="font-semibold">시작하기</Text>
            </Button>
          </form>
        </div>

        <Grid className="mt-10 w-full gap-4 md:mt-20 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={nanoid()}
              className="border-white/20 bg-white/10 shadow-lg backdrop-blur-md transition-colors hover:bg-white/15 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <CardHeader className="flex items-center gap-2">
                <div className="text-primary">{feature.icon}</div>
                <CardTitle className="text-foreground font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-foreground/80 text-sm">
                {feature.description}
              </CardContent>
            </Card>
          ))}
        </Grid>
      </VStack>
    </div>
  );
}
