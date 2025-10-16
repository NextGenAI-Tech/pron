"use client";
import { GridItem } from "@/components/layout/grid";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FullPrompt } from "@/types/pron-types";
import { Fragment, useMemo } from "react";
import type { ReactNode } from "react";
import { extractVariables, fillPromptTemplate } from "@/lib/prompt-templates";
import { useQueryStates, parseAsString } from "nuqs";
import { format } from "date-fns";
import { Copy } from "lucide-react";
import { Text } from "@/components/shared/text.shared";
import { HStack } from "@/components/layout/h-stack";
import { toast } from "sonner";

type PromptBuilderProps = {
  prompt: FullPrompt;
};

export function PromptBuilder({ prompt }: PromptBuilderProps) {
  const variableDefs = useMemo(
    () => extractVariables(prompt.template),
    [prompt.template],
  );

  const queryConfig = useMemo(
    () =>
      Object.fromEntries(
        variableDefs.map((v) => [v.name, parseAsString.withDefault("")]),
      ),
    [variableDefs],
  );

  const [queryVars, setQueryVars] = useQueryStates(queryConfig, {
    history: "push",
  });

  const preview = useMemo(
    () =>
      fillPromptTemplate(prompt.template, queryVars as Record<string, string>),
    [prompt.template, queryVars],
  );

  const previewNodes = useMemo(() => {
    const template = prompt.template;
    const pattern = /{{\s*([\w]+)\s*}}/g;
    const nodes: ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(template)) !== null) {
      const [raw, name] = match;
      const start = match.index;
      if (start > lastIndex) {
        nodes.push(template.slice(lastIndex, start));
      }

      const value = (queryVars as Record<string, string>)[name];
      if (value && value.length > 0) {
        nodes.push(<span key={`v-${start}-${name}`}>{value}</span>);
      } else {
        nodes.push(
          <span key={`p-${start}-${name}`} className="text-primary">
            {`{{${name}}}`}
          </span>,
        );
      }

      lastIndex = start + raw.length;
    }

    if (lastIndex < template.length) {
      nodes.push(template.slice(lastIndex));
    }

    return nodes;
  }, [prompt.template, queryVars]);

  const providerName = (id?: number | null) => {
    switch (id) {
      case 2:
        return "ChatGPT";
      case 3:
        return "Claude";
      case 1:
        return "Gemini";
      default:
        return "-";
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("클립보드에 복사되었습니다.");
    } catch {
      toast.error("클립보드에 복사 실패");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(queryVars);
  };

  return (
    <Fragment>
      <GridItem className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>
              <Text className="text-base font-semibold">
                프롬프트 제목: {prompt.title}
              </Text>
            </CardTitle>
            <CardDescription>
              {prompt.description ? (
                <Text className="text-sm leading-relaxed">
                  {prompt.description}
                </Text>
              ) : null}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative rounded-md border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-medium">프롬프트 예제</div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copyToClipboard(prompt.examplePrompt ?? "")}
                    aria-label="Copy example"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <pre className="text-muted-foreground text-xs break-words whitespace-pre-wrap">
                  {prompt.examplePrompt || "-"}
                </pre>
              </div>
              <div className="relative rounded-md border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-medium">템플릿 미리보기</div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copyToClipboard(preview)}
                    aria-label="Copy preview"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <pre className="text-muted-foreground text-xs break-words whitespace-pre-wrap">
                  {previewNodes}
                </pre>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <HStack className="w-full justify-between">
              <HStack>
                <Text className="text-muted-foreground text-sm">
                  사용하면 좋은 AI
                </Text>
                <Text className="text-sm">
                  {providerName(prompt.recommended_ai)}
                </Text>
              </HStack>
              <div>
                <Text className="text-sm">
                  {prompt.created_at
                    ? format(new Date(prompt.created_at), "yyyy-MM-dd HH:mm")
                    : "-"}
                </Text>
              </div>
            </HStack>
          </CardFooter>
        </Card>
      </GridItem>
      <GridItem className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>
              <Text className="text-base font-semibold">
                프롬프트 변수 입력
              </Text>
            </CardTitle>
            <CardDescription>
              <Text className="text-sm leading-relaxed">
                프롬프트 변수를 입력하세요.
              </Text>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {variableDefs.length === 0 ? (
              <div className="text-muted-foreground text-sm">
                템플릿에 변수 없음
              </div>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {variableDefs.map((v) => (
                  <div key={v.name} className="grid gap-2">
                    <Label htmlFor={`var-${v.name}`}>{v.name}</Label>
                    <Input
                      id={`var-${v.name}`}
                      value={
                        (queryVars as Record<string, string>)[v.name] ?? ""
                      }
                      onChange={(e) =>
                        setQueryVars({ [v.name]: e.target.value })
                      }
                      placeholder={v.name}
                    />
                  </div>
                ))}
              </form>
            )}
          </CardContent>
        </Card>
      </GridItem>
    </Fragment>
  );
}
