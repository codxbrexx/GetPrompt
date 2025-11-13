import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/Tag";
import { allTags } from "@/lib/mockData";

interface TagFiltersProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
}

export const TagFilters = ({
  selectedTags,
  onTagToggle,
  onClearTags,
}: TagFiltersProps) => {
  return (
    <section className="border-b bg-muted/2">
      <div className="container py-3 md:py-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs md:text-sm font-medium text-muted-foreground">
              Filter by tags:
            </h3>
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearTags}
                className="text-xs h-7 px-2"
              >
                Clear ({selectedTags.length})
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {allTags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}
              >
                <Tag
                  active={selectedTags.includes(tag)}
                  onClick={() => onTagToggle(tag)}
                >
                  {tag}
                </Tag>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
