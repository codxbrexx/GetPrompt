import { useState, useMemo, useEffect, useCallback } from "react";
import { mockPrompts, allTags } from "@/lib/mockData";
import { Prompt, PromptCategory } from "@/types/prompt";
import { useDebounce } from "./useDebounce";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const usePrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | "all">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query (300ms)
  const debouncedSearch = useDebounce(searchQuery, 300);

  const isSearching = searchQuery.trim().length > 0;

  // Fetch prompts from API
  const fetchPrompts = useCallback(async (search: string, tags: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (search.trim()) {
        params.set("search", search.trim());
      }
      if (tags.length > 0) {
        params.set("tags", tags.join(","));
      }

      const url = `${API_BASE}/api/prompts${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch prompts");
      }

      const data = await response.json();
      setPrompts(data);
    } catch (err) {
      console.error("Failed to fetch prompts:", err);
      setError("Failed to load prompts. Using local data.");
      // Fallback to mock data with local filtering
      const filtered = mockPrompts.filter((prompt) => {
        const matchesSearch =
          !search.trim() ||
          prompt.title.toLowerCase().includes(search.toLowerCase()) ||
          prompt.description.toLowerCase().includes(search.toLowerCase()) ||
          prompt.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));

        const matchesTags =
          tags.length === 0 ||
          tags.some((tag) => prompt.tags.includes(tag));

        return matchesSearch && matchesTags;
      });
      setPrompts(filtered);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch prompts when debounced search or tags change
  useEffect(() => {
    fetchPrompts(debouncedSearch, selectedTags);
  }, [debouncedSearch, selectedTags, fetchPrompts]);

  // Filter by category locally (API doesn't support category filter yet)
  const filteredPrompts = useMemo(() => {
    if (selectedCategory === "all") {
      return prompts;
    }
    return prompts.filter((prompt) => prompt.category === selectedCategory);
  }, [prompts, selectedCategory]);

  const stats = useMemo(() => {
    const totalVotes = prompts.reduce((sum, p) => sum + p.votes, 0);
    const trendingCount = prompts.filter((p) => p.isTrending).length;
    return {
      total: prompts.length,
      trending: trendingCount,
      totalVotes,
      categories: 5,
    };
  }, [prompts]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSelectedCategory("all");
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleVote = async (id: string, direction: "up" | "down") => {
    const delta = direction === "up" ? 1 : -1;

    // Optimistic update
    setPrompts((prevPrompts) =>
      prevPrompts.map((prompt) =>
        prompt.id === id
          ? { ...prompt, votes: prompt.votes + delta }
          : prompt
      )
    );

    try {
      const response = await fetch(`${API_BASE}/api/prompts/${id}/vote`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta }),
      });

      if (!response.ok) {
        throw new Error("Vote failed");
      }
    } catch (err) {
      console.error("Failed to vote:", err);
      // Revert optimistic update on error
      setPrompts((prevPrompts) =>
        prevPrompts.map((prompt) =>
          prompt.id === id
            ? { ...prompt, votes: prompt.votes - delta }
            : prompt
        )
      );
    }
  };

  // Get available tags from current prompts or use all tags
  const availableTags = useMemo(() => {
    return allTags;
  }, []);

  return {
    prompts,
    filteredPrompts,
    searchQuery,
    selectedTags,
    selectedCategory,
    loading,
    error,
    isSearching,
    stats,
    availableTags,
    setSearchQuery: handleSearchChange,
    setSelectedCategory,
    toggleTag,
    clearFilters,
    handleVote,
  };
};
