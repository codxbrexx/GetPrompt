import { motion } from "framer-motion";
import { X, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PromptCategory } from "@/types/prompt";
import { categories } from "@/lib/mockData";

interface ActiveFiltersProps {
    searchQuery: string;
    selectedTags: string[];
    selectedCategory: PromptCategory | "all";
    onRemoveSearch: () => void;
    onRemoveTag: (tag: string) => void;
    onRemoveCategory: () => void;
    onClearAll: () => void;
}

export const ActiveFilters = ({
    searchQuery,
    selectedTags,
    selectedCategory,
    onRemoveSearch,
    onRemoveTag,
    onRemoveCategory,
    onClearAll,
}: ActiveFiltersProps) => {
    const categoryLabel = categories.find((c) => c.value === selectedCategory)?.label;

    const filterCount =
        (searchQuery.length > 0 ? 1 : 0) +
        selectedTags.length +
        (selectedCategory !== "all" ? 1 : 0);

    if (filterCount === 0) return null;

    return (
        <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b bg-muted/30"
        >
            <div className="container py-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Filter className="h-4 w-4" />
                        <span className="font-medium">Active filters ({filterCount}):</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Search Query Badge */}
                        {searchQuery.length > 0 && (
                            <Badge
                                variant="secondary"
                                className="gap-1 pr-1 bg-primary/10 hover:bg-primary/20 transition-colors"
                            >
                                <Search className="h-3 w-3" />
                                <span className="max-w-[150px] truncate">"{searchQuery}"</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 ml-1 hover:bg-destructive/20 rounded-full"
                                    onClick={onRemoveSearch}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}

                        {/* Category Badge */}
                        {selectedCategory !== "all" && (
                            <Badge
                                variant="secondary"
                                className="gap-1 pr-1 bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                            >
                                <span>{categoryLabel}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 ml-1 hover:bg-destructive/20 rounded-full"
                                    onClick={onRemoveCategory}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}

                        {/* Tag Badges */}
                        {selectedTags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="gap-1 pr-1 bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
                            >
                                <span>#{tag}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 ml-1 hover:bg-destructive/20 rounded-full"
                                    onClick={() => onRemoveTag(tag)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        ))}
                    </div>

                    {/* Clear All Button */}
                    {filterCount > 1 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearAll}
                            className="text-xs h-7 text-muted-foreground hover:text-destructive"
                        >
                            Clear all
                        </Button>
                    )}
                </div>
            </div>
        </motion.section>
    );
};
