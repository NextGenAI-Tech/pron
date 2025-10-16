"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

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
import type { FullPrompt, Category } from "@/types/pron-types";

type PromptsListsProps = {
  initialPrompts: FullPrompt[];
  categories: Category[];
};

export function PromptsLists({
  initialPrompts,
  categories,
}: PromptsListsProps) {
  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(
    null,
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = React.useMemo(() => {
    const byQuery = (p: FullPrompt) => {
      if (!normalizedQuery) return true;
      const hay =
        `${p.title}\n${p.description ?? ""}\n${p.template}`.toLowerCase();
      return hay.includes(normalizedQuery);
    };
    const byCategory = (p: FullPrompt) =>
      selectedCategory == null
        ? true
        : p.categories?.some((c) => c.id === selectedCategory);

    return initialPrompts.filter((p) => byQuery(p) && byCategory(p));
  }, [initialPrompts, normalizedQuery, selectedCategory]);

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.03,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, x: -12 },
    show: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 8 },
  } as const;

  const getProviderLogo = (id?: number | null) => {
    switch (id) {
      case 2:
        return "/chatgpt-logo.png";
      case 3:
        return "/claude-logo.png";
      case 1:
        return "/gemini-logo.png";
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목/설명/내용 검색"
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
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
              className="cursor-pointer select-none"
            >
              {cat.name}
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
            {filtered.map((p) => (
              <motion.div
                key={p.id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <GridItem>
                  <Link href={`/prompts/${p.id}`} className="block">
                    <Card className="hover:border-primary/50 relative h-full overflow-hidden transition-colors">
                      <CardHeader>
                        <CardTitle className="line-clamp-1">
                          {p.title}
                        </CardTitle>
                        {p.description ? (
                          <CardDescription className="line-clamp-1">
                            {p.description}
                          </CardDescription>
                        ) : null}
                      </CardHeader>
                      <CardContent className="flex flex-col gap-3">
                        {p.categories?.length ? (
                          <div className="flex flex-wrap gap-1.5">
                            {p.categories.slice(0, 3).map((c) => (
                              <Badge
                                key={c.id}
                                variant="outline"
                                className="text-xs"
                              >
                                {c.name}
                              </Badge>
                            ))}
                            {p.categories.length > 3 ? (
                              <Badge variant="outline">
                                +{p.categories.length - 3}
                              </Badge>
                            ) : null}
                          </div>
                        ) : null}
                        {p.examplePrompt ? (
                          <p className="text-muted-foreground line-clamp-1 text-xs">
                            {p.examplePrompt}
                          </p>
                        ) : null}
                      </CardContent>
                      {(() => {
                        const logo = getProviderLogo(p.recommended_ai);
                        return logo ? (
                          <Image
                            src={logo}
                            alt="Recommended AI"
                            width={56}
                            height={56}
                            className="pointer-events-none absolute right-2 bottom-2 opacity-20 select-none dark:opacity-10"
                          />
                        ) : null;
                      })()}
                    </Card>
                  </Link>
                </GridItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </Grid>
      </motion.div>
    </div>
  );
}
