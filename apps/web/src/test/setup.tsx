import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) =>
            React.createElement('div', props, children),
        article: ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
            React.createElement('article', props, children),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
}));

// Mock react-router-dom Link
vi.mock('react-router-dom', () => ({
    Link: ({ children, to, ...props }: { children: React.ReactNode; to: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
        React.createElement('a', { href: to, ...props }, children),
}));

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
    value: {
        writeText: vi.fn().mockResolvedValue(undefined),
    },
    writable: true,
});

// Mock sonner toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));
