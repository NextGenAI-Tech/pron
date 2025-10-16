// 🧠 프롬프트 문자열에서 {{variable}} 추출
export const extractVariables = (template: string) => {
  const regex = /{{\s*([\w]+)\s*}}/g;
  const matches = [...template.matchAll(regex)];
  return matches.map((m, index) => ({
    name: m[1],
    required: true,
    order: index,
  }));
};

// 🧩 프롬프트 텍스트에 실제 값 대입
export const fillPromptTemplate = (
  template: string,
  values: Record<string, string>,
): string => {
  return template.replace(/{{\s*([\w]+)\s*}}/g, (_, key) => values[key] ?? "");
};
