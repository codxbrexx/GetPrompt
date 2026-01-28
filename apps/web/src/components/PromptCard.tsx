import { memo, useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, TrendingUp, Copy, Check } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "./Tag";
import { Prompt } from "@/types/prompt";
import { copyToClipboard } from "@/lib/copy";
import { hasVoted, recordVote, getVote } from "@/lib/votes";
import { cn } from "@/lib/utils";

// ============================================================================
// Types & Constants
// ============================================================================

/** Vote direction type */
export type VoteDirection = "up" | "down";

/** Props for the PromptCard component */
export interface PromptCardProps {
  /** The prompt data to display */
  prompt: Prompt;
  /** Callback fired when user votes on the prompt */
  onVote: (id: string, direction: VoteDirection) => void;
  /** Animation stagger index for entrance animation */
  index?: number;
  /** Additional CSS classes to apply to the card wrapper */
  className?: string;
}

/** Maximum number of tags to display before truncating */
const MAX_VISIBLE_TAGS = 3;

/** Duration to show the "copied" checkmark (ms) */
const COPY_FEEDBACK_DURATION = 1500;

/** Category color mappings for visual distinction */
const CATEGORY_COLORS: Record<string, string> = {
  image: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  video: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  text: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20",
  code: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
  automation: "bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20",
} as const;

// ============================================================================
// Subcomponents
// ============================================================================

interface VoteButtonsProps {
  promptId: string;
  votes: number;
  hasUserVoted: boolean;
  userVoteDirection?: VoteDirection;
  onVote: (id: string, direction: VoteDirection) => void;
  onLocalVote: () => void;
}

/**
 * VoteButtons - Handles upvote/downvote UI and interactions
 * Extracted for better readability and potential reuse
 */
const VoteButtons = memo(function VoteButtons({
  promptId,
  votes,
  hasUserVoted,
  userVoteDirection,
  onVote,
  onLocalVote,
}: VoteButtonsProps) {
  const handleVote = useCallback(
    (e: React.MouseEvent, direction: VoteDirection) => {
      e.preventDefault();
      e.stopPropagation();

      if (hasUserVoted) {
        toast.error("You have already voted on this prompt");
        return;
      }

      onVote(promptId, direction);
      recordVote(promptId, direction);
      onLocalVote();
    },
    [promptId, hasUserVoted, onVote, onLocalVote]
  );

  return (
    <div className="flex flex-col items-center gap-1" role="group" aria-label="Vote controls">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-7 w-7 p-0 transition-all duration-200",
          hasUserVoted
            ? "opacity-60 cursor-not-allowed"
            : "hover:bg-primary/10 hover:text-primary hover:scale-110",
          userVoteDirection === "up" && "text-primary"
        )}
        onClick={(e) => handleVote(e, "up")}
        aria-label="Upvote"
        aria-pressed={userVoteDirection === "up"}
        disabled={hasUserVoted}
      >
        <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>

      <span
        className="text-sm font-semibold tabular-nums"
        aria-label={`${votes} votes`}
      >
        {votes}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-7 w-7 p-0 transition-all duration-200",
          hasUserVoted
            ? "opacity-60 cursor-not-allowed"
            : "hover:bg-destructive/10 hover:text-destructive hover:scale-110",
          userVoteDirection === "down" && "text-destructive"
        )}
        onClick={(e) => handleVote(e, "down")}
        aria-label="Downvote"
        aria-pressed={userVoteDirection === "down"}
        disabled={hasUserVoted}
      >
        <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
    </div>
  );
});

interface CopyButtonProps {
  content: string;
}

/**
 * CopyButton - Handles prompt content copying with visual feedback
 */
const CopyButton = memo(function CopyButton({ content }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        await copyToClipboard(content);
        setCopied(true);
        toast.success("Prompt copied to clipboard");
        setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION);
      } catch {
        toast.error("Failed to copy prompt");
      }
    },
    [content]
  );

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-7 w-7 p-0 mt-1 transition-all duration-200",
        copied
          ? "text-green-600"
          : "text-muted-foreground hover:bg-muted/20 hover:scale-110"
      )}
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : "Copy prompt to clipboard"}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
    </Button>
  );
});

interface TagListProps {
  category: string;
  tags: string[];
}

/**
 * TagList - Renders category and tag chips
 */
const TagList = memo(function TagList({ category, tags }: TagListProps) {
  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenCount = tags.length - MAX_VISIBLE_TAGS;

  return (
    <div className="flex flex-wrap gap-2" role="list" aria-label="Tags">
      <Tag
        className={cn(
          CATEGORY_COLORS[category] || CATEGORY_COLORS.text,
          "font-medium"
        )}
      >
        {category}
      </Tag>
      {visibleTags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
      {hiddenCount > 0 && (
        <Tag className="bg-muted/50 text-muted-foreground">
          +{hiddenCount} more
        </Tag>
      )}
    </div>
  );
});

// ============================================================================
// Main Component
// ============================================================================

/**
 * PromptCard Component
 *
 * A reusable card component for displaying AI prompts in a grid or list layout.
 * Features include:
 * - Title and description display
 * - Category and tag chips with overflow handling
 * - Voting system with localStorage persistence
 * - Copy-to-clipboard functionality
 * - Trending indicator
 * - Smooth entrance animations
 * - Full accessibility support
 *
 * @example
 * ```tsx
 * <PromptCard
 *   prompt={promptData}
 *   onVote={(id, direction) => handleVote(id, direction)}
 *   index={0}
 * />
 * ```
 */
export const PromptCard = memo(function PromptCard({
  prompt,
  onVote,
  index = 0,
  className,
}: PromptCardProps) {
  // Track local voted state for immediate UI feedback
  const [hasVotedLocal, setHasVotedLocal] = useState(() => hasVoted(prompt.id));

  // Get previous vote direction for visual indication
  const userVoteDirection = useMemo(() => getVote(prompt.id), [prompt.id]);

  // Format date for display
  const formattedDate = useMemo(
    () => new Date(prompt.createdAt).toLocaleDateString(),
    [prompt.createdAt]
  );

  const handleLocalVote = useCallback(() => {
    setHasVotedLocal(true);
  }, []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      className={cn("hover-lift", className)}
    >
      <Link
        to={`/prompts/${prompt.id}`}
        aria-label={`View prompt: ${prompt.title}`}
      >
        <Card
          className={cn(
            // Base styles
            "glass-card shadow-card h-full cursor-pointer group relative overflow-hidden",
            // Hover effects
            "hover:shadow-card-hover hover:glow-purple",
            // Transitions
            "transition-smooth"
          )}
        >
          {/* Shimmer effect on hover */}
          <div
            className={cn(
              "absolute inset-0 pointer-events-none",
              "bg-gradient-to-r from-transparent via-purple-500/5 to-transparent",
              "-translate-x-full group-hover:translate-x-full",
              "transition-transform duration-1000"
            )}
            aria-hidden="true"
          />

          <CardHeader className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              {/* Title & Description */}
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-xl group-hover:text-primary transition-smooth truncate">
                    {prompt.title}
                  </CardTitle>
                  {prompt.isTrending && (
                    <div
                      className="flex items-center gap-1 text-xs font-medium text-primary shrink-0"
                      aria-label="Trending prompt"
                    >
                      <TrendingUp className="h-3 w-3" aria-hidden="true" />
                      <span>Trending</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {prompt.description}
                </p>
              </div>

              {/* Voting & Actions */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <VoteButtons
                  promptId={prompt.id}
                  votes={prompt.votes}
                  hasUserVoted={hasVotedLocal}
                  userVoteDirection={userVoteDirection}
                  onVote={onVote}
                  onLocalVote={handleLocalVote}
                />
                <CopyButton content={prompt.content} />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Tags */}
            <TagList category={prompt.category} tags={prompt.tags} />

            {/* Metadata */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>by {prompt.author}</span>
              <time dateTime={prompt.createdAt}>{formattedDate}</time>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.article>
  );
});

export default PromptCard;
