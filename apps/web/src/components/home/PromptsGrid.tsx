import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PromptCard } from "@/components/PromptCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Prompt } from "@/types/prompt";
import { Sparkles, SearchX, Loader2 } from "lucide-react";

interface PromptsGridProps {
  filteredPrompts: Prompt[];
  isSearching: boolean;
  searchQuery: string;
  onClearFilters: () => void;
  onVote: (id: string, direction: "up" | "down") => void;
  hasActiveFilters: boolean;
  loading?: boolean;
}

export const PromptsGrid = ({
  filteredPrompts,
  isSearching,
  searchQuery,
  onClearFilters,
  onVote,
  hasActiveFilters,
  loading = false,
}: PromptsGridProps) => {
  const getTitle = () => {
    if (isSearching) return "Search Results";
    if (hasActiveFilters) return "Filtered Results";
    return "Trending Prompts";
  };

  const getDescription = () => {
    if (filteredPrompts.length === 0) {
      return isSearching
        ? `No prompts found for "${searchQuery}"`
        : "No prompts found. Try adjusting your filters.";
    }
    return `Showing ${filteredPrompts.length} prompt${filteredPrompts.length !== 1 ? "s" : ""
      }`;
  };

  return (
    <section className="container py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
              {getTitle()}
              {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
            </h2>
            <p className="text-sm text-muted-foreground">{getDescription()}</p>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Clear {isSearching ? "Search" : "Filters"}
            </Button>
          )}
        </div>

        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && filteredPrompts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <SearchX className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No prompts found</h3>
            <p className="text-muted-foreground mb-6">
              {isSearching
                ? "Try different keywords or browse all prompts"
                : "Try adjusting your filters or browse all prompts"}
            </p>
            {hasActiveFilters && (
              <Button onClick={onClearFilters} variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </motion.div>
        )}

        {!loading && filteredPrompts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrompts.map((prompt, index) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onVote={onVote}
                index={index}
              />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};
