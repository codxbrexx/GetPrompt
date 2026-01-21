import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { SearchSection } from "@/components/home/SearchSection";
import { CategoryFilters } from "@/components/home/CategoryFilters";
import { TagFilters } from "@/components/home/TagFilters";
import { PromptsGrid } from "@/components/home/PromptsGrid";
import { ActiveFilters } from "@/components/home/ActiveFilters";
import { usePrompts } from "@/hooks/usePrompts";

const Index = () => {
  const {
    filteredPrompts,
    searchQuery,
    selectedTags,
    selectedCategory,
    isSearching,
    loading,
    stats,
    setSearchQuery,
    setSelectedCategory,
    toggleTag,
    clearFilters,
    handleVote,
  } = usePrompts();

  const hasActiveFilters =
    searchQuery.length > 0 ||
    selectedTags.length > 0 ||
    selectedCategory !== "all";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Stats */}
        <HeroSection stats={stats} isSearching={isSearching} />

        {/* Search Bar */}
        <SearchSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isSearching={isSearching}
        />

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <ActiveFilters
            searchQuery={searchQuery}
            selectedTags={selectedTags}
            selectedCategory={selectedCategory}
            onRemoveSearch={() => setSearchQuery("")}
            onRemoveTag={toggleTag}
            onRemoveCategory={() => setSelectedCategory("all")}
            onClearAll={clearFilters}
          />
        )}

        {/* Category Filters */}
        <CategoryFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Tag Filters - Now visible during search too */}
        <TagFilters
          selectedTags={selectedTags}
          onTagToggle={toggleTag}
          onClearTags={() => {
            // Only clear tags, not all filters
            selectedTags.forEach(toggleTag);
          }}
        />

        {/* Prompts Grid */}
        <PromptsGrid
          filteredPrompts={filteredPrompts}
          isSearching={isSearching}
          searchQuery={searchQuery}
          onClearFilters={clearFilters}
          onVote={handleVote}
          hasActiveFilters={hasActiveFilters}
          loading={loading}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
