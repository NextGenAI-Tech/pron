"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check } from "lucide-react";

import dict from "@/constants/keyword-dict.json";
import { Grid, GridItem } from "@/components/layout/grid";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type KeywordDictItem = {
  id: string;
  category: string; // top-level key (e.g., emotions, jobs, personas, ...)
  label: string; // short title to show
  content: string; // full text to copy / expand
  subcategory?: string; // optional (e.g., personas group name)
};

type KeywordDictListsProps = Record<string, never>;

type PromptGroup = { category_name: string; prompts: string[] };
type PersonasGroups = Record<string, Record<string, string>>;
type KeywordDictJson = {
  emotions: string[];
  jobs: string[];
  output_formats: string[];
  tone_and_style: string[];
  personas: PersonasGroups;
  language_and_complexity: PromptGroup;
  content_and_scope: PromptGroup;
  format_and_length: PromptGroup;
  ethics_and_safety: PromptGroup;
  behavior_and_interaction: PromptGroup;
};

function buildItems(): KeywordDictItem[] {
  const items: KeywordDictItem[] = [];
  const D = dict as KeywordDictJson;

  const pushArray = (category: string, arr: string[]) => {
    for (const v of arr) {
      if (typeof v === "string") {
        items.push({ id: `${category}:${v}`, category, label: v, content: v });
      }
    }
  };

  // arrays
  if (Array.isArray(D.emotions)) pushArray("emotions", D.emotions);
  if (Array.isArray(D.jobs)) pushArray("jobs", D.jobs);
  if (Array.isArray(D.output_formats))
    pushArray("output_formats", D.output_formats);
  if (Array.isArray(D.tone_and_style))
    pushArray("tone_and_style", D.tone_and_style);

  // grouped prompts objects (category_name + prompts[])
  const promptGroups: Array<
    keyof Pick<
      KeywordDictJson,
      | "language_and_complexity"
      | "content_and_scope"
      | "format_and_length"
      | "ethics_and_safety"
      | "behavior_and_interaction"
    >
  > = [
    "language_and_complexity",
    "content_and_scope",
    "format_and_length",
    "ethics_and_safety",
    "behavior_and_interaction",
  ] as const;
  for (const key of promptGroups) {
    const group = D[key];
    if (group && Array.isArray(group.prompts)) {
      for (const p of group.prompts) {
        if (typeof p === "string") {
          items.push({
            id: `${key}:${p}`,
            category: key,
            label: p,
            content: p,
            subcategory: group.category_name,
          });
        }
      }
    }
  }

  // personas: nested object -> group -> { name: description }
  const personas = D.personas;
  for (const groupName of Object.keys(personas)) {
    const group = personas[groupName];
    for (const name of Object.keys(group)) {
      const desc = group[name];
      items.push({
        id: `personas:${groupName}:${name}`,
        category: "personas",
        label: name,
        content: desc,
        subcategory: groupName,
      });
    }
  }

  return items;
}

const ALL_ITEMS = buildItems();
const ALL_CATEGORIES: string[] = Array.from(
  new Set(ALL_ITEMS.map((i) => i.category)),
).sort();

export function KeywordDictLists({}: KeywordDictListsProps) {
  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  );
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = React.useMemo(() => {
    const byQuery = (it: KeywordDictItem) => {
      if (!normalizedQuery) return true;
      const hay =
        `${it.label}\n${it.content}\n${it.category}\n${it.subcategory ?? ""}`.toLowerCase();
      return hay.includes(normalizedQuery);
    };
    const byCategory = (it: KeywordDictItem) =>
      selectedCategory == null ? true : it.category === selectedCategory;

    return ALL_ITEMS.filter((it) => byQuery(it) && byCategory(it));
  }, [normalizedQuery, selectedCategory]);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.03 } },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, x: -12 },
    show: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 8 },
  } as const;

  const onCopy = async (it: KeywordDictItem) => {
    try {
      await navigator.clipboard.writeText(it.content);
      setCopiedId(it.id);
      setTimeout(
        () => setCopiedId((prev) => (prev === it.id ? null : prev)),
        1500,
      );
    } catch {}
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="값 검색"
            className="max-w-xl"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={selectedCategory == null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="cursor-pointer select-none"
          >
            All
          </Badge>
          {ALL_CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className="cursor-pointer select-none"
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="contents"
      >
        <Grid className="grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((it) => {
              const expanded = expandedId === it.id;
              return (
                <motion.div
                  key={it.id}
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <GridItem
                    className={
                      expanded ? "col-span-2 lg:col-span-4" : undefined
                    }
                  >
                    <Card
                      className="hover:border-primary/50 relative h-full overflow-hidden transition-[colors,height]"
                      onClick={(e) => {
                        // avoid toggling when clicking copy button
                        const target = e.target as HTMLElement;
                        if (target.closest("[data-copy-btn]") != null) return;
                        setExpandedId((prev) =>
                          prev === it.id ? null : it.id,
                        );
                      }}
                    >
                      <CardHeader className="pr-12">
                        <CardTitle className={expanded ? "" : "line-clamp-1"}>
                          {it.label}
                        </CardTitle>
                        {it.subcategory ? (
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">
                              {it.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {it.subcategory}
                            </Badge>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">
                              {it.category}
                            </Badge>
                          </div>
                        )}
                      </CardHeader>
                      <Button
                        data-copy-btn
                        size="icon"
                        variant="ghost"
                        className="absolute top-1.5 right-1.5 h-8 w-8"
                        onClick={() => onCopy(it)}
                        aria-label="copy-value"
                      >
                        {copiedId === it.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <CardContent className="flex flex-col gap-3">
                        {it.content && it.content !== it.label ? (
                          <CardDescription
                            className={
                              expanded ? "whitespace-pre-wrap" : "line-clamp-2"
                            }
                          >
                            {it.content}
                          </CardDescription>
                        ) : (
                          <CardDescription
                            className={expanded ? "" : "line-clamp-1"}
                          >
                            {it.content}
                          </CardDescription>
                        )}
                      </CardContent>
                    </Card>
                  </GridItem>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Grid>
      </motion.div>
    </div>
  );
}
