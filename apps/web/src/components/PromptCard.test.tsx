import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PromptCard } from './PromptCard';
import { Prompt } from '@/types/prompt';
import * as votesLib from '@/lib/votes';

// Mock the votes library
vi.mock('@/lib/votes', () => ({
    hasVoted: vi.fn(),
    recordVote: vi.fn(),
    getVote: vi.fn(),
}));

// Mock the copy library
vi.mock('@/lib/copy', () => ({
    copyToClipboard: vi.fn().mockResolvedValue(undefined),
}));

const mockPrompt: Prompt = {
    id: 'test-prompt-1',
    title: 'Test Prompt Title',
    description: 'This is a test description for the prompt card component.',
    content: 'This is the full prompt content that would be copied.',
    category: 'image',
    tags: ['ai', 'creative', 'art', 'design'],
    votes: 42,
    author: 'testuser',
    createdAt: '2026-01-20T10:00:00Z',
    isTrending: false,
};

const mockOnVote = vi.fn();

describe('PromptCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(votesLib.hasVoted).mockReturnValue(false);
    });

    describe('Rendering', () => {
        it('renders the prompt title correctly', () => {
            render(<PromptCard prompt={mockPrompt} onVote={mockOnVote} />);

            expect(screen.getByText('Test Prompt Title')).toBeInTheDocument();
        });

        it('renders the prompt description correctly', () => {
            render(<PromptCard prompt={mockPrompt} onVote={mockOnVote} />);

            expect(screen.getByText('This is a test description for the prompt card component.')).toBeInTheDocument();
        });

        it('renders the vote count correctly', () => {
            render(<PromptCard prompt={mockPrompt} onVote={mockOnVote} />);

            expect(screen.getByText('42')).toBeInTheDocument();
        });

        it('renders the category as a tag chip', () => {
            render(<PromptCard prompt={mockPrompt} onVote={mockOnVote} />);

            expect(screen.getByText('image')).toBeInTheDocument();
        });

        it('renders tags as chips (limited to 3)', () => {
            render(<PromptCard prompt={mockPrompt} onVote={mockOnVote} />);

            expect(screen.getByText('ai')).toBeInTheDocument();
            expect(screen.getByText('creative')).toBeInTheDocument();
            expect(screen.getByText('art')).toBeInTheDocument();
            // Fourth tag should not be rendered (limited to 3)
            expect(screen.queryByText('design')).not.toBeInTheDocument();
        });

        it('renders the author name', () => {
            render(<PromptCard prompt={mockPrompt} onVote={mockOnVote} />);

            expect(screen.getByText('by testuser')).toBeInTheDocument();
        });

        it('renders the created date', () => {
            render(<PromptCard prompt={mockPrompt} onVote={mockOnVote} />);

            // Date format depends on locale, just check it contains the date parts
            const dateElement = screen.getByText(/2026/);
            expect(dateElement).toBeInTheDocument();
        });

        it('renders trending badge when isTrending is true', () => {
            const trendingPrompt = { ...mockPrompt, isTrending: true };
            render(<PromptCard prompt={trendingPrompt} onVote={mockOnVote} />);

            expect(screen.getByText('Trending')).toBeInTheDocument();
        });

        it('does not render trending badge when isTrending is false', () => {
            render(<PromptCard prompt={mockPrompt} onVote={mockOnVote} />);

            expect(screen.queryByText('Trending')).not.toBeInTheDocument();
        });

        it('renders upvote and downvote buttons', () => {
            render(<PromptCard prompt={mockPrompt} onVote={mockOnVote} />);

            expect(screen.getByRole('button', { name: /upvote/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /downvote/i })).toBeInTheDocument();
        });

        it('renders copy button', () => {
            render(<PromptCard prompt={mockPrompt} onVote={mockOnVote} />);

            expect(screen.getByRole('button', { name: /copy prompt/i })).toBeInTheDocument();
        });
    });

    describe('Interactions', () => {
        it('calls onVote with "up" direction when upvote button is clicked', () => {
            render(<PromptCard prompt={mockPrompt} onVote={mockOnVote} />);

            const upvoteButton = screen.getByRole('button', { name: /upvote/i });
            fireEvent.click(upvoteButton);

            expect(mockOnVote).toHaveBeenCalledWith('test-prompt-1', 'up');
        });

        it('calls onVote with "down" direction when downvote button is clicked', () => {
            render(<PromptCard prompt={mockPrompt} onVote={mockOnVote} />);

            const downvoteButton = screen.getByRole('button', { name: /downvote/i });
            fireEvent.click(downvoteButton);

            expect(mockOnVote).toHaveBeenCalledWith('test-prompt-1', 'down');
        });

        it('records the vote when upvote button is clicked', () => {
            render(<PromptCard prompt={mockPrompt} onVote={mockOnVote} />);

            const upvoteButton = screen.getByRole('button', { name: /upvote/i });
            fireEvent.click(upvoteButton);

            expect(votesLib.recordVote).toHaveBeenCalledWith('test-prompt-1', 'up');
        });

        it('records the vote when downvote button is clicked', () => {
            render(<PromptCard prompt={mockPrompt} onVote={mockOnVote} />);

            const downvoteButton = screen.getByRole('button', { name: /downvote/i });
            fireEvent.click(downvoteButton);

            expect(votesLib.recordVote).toHaveBeenCalledWith('test-prompt-1', 'down');
        });

        it('prevents voting if user has already voted', () => {
            vi.mocked(votesLib.hasVoted).mockReturnValue(true);

            render(<PromptCard prompt={mockPrompt} onVote={mockOnVote} />);

            const upvoteButton = screen.getByRole('button', { name: /upvote/i });
            fireEvent.click(upvoteButton);

            expect(mockOnVote).not.toHaveBeenCalled();
        });

        it('disables vote buttons after user has voted', () => {
            vi.mocked(votesLib.hasVoted).mockReturnValue(true);

            render(<PromptCard prompt={mockPrompt} onVote={mockOnVote} />);

            const upvoteButton = screen.getByRole('button', { name: /upvote/i });
            const downvoteButton = screen.getByRole('button', { name: /downvote/i });

            expect(upvoteButton).toBeDisabled();
            expect(downvoteButton).toBeDisabled();
        });
    });

    describe('Link behavior', () => {
        it('wraps card in a link to prompt detail page', () => {
            render(<PromptCard prompt={mockPrompt} onVote={mockOnVote} />);

            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('href', '/prompts/test-prompt-1');
        });
    });
});
