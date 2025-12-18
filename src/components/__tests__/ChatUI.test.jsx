import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatUI from '../ChatUI';

// Mock apiClient to prevent axios interceptor errors
vi.mock('../../lib/api/client', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: { response: 'Test response' } })),
    get: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

describe('ChatUI Component', () => {
  const defaultProps = {
    lang: 'sv',
    isDark: true,
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('should render welcome message in Swedish', () => {
      render(<ChatUI {...defaultProps} />);
      expect(screen.getByText(/Tjena! Hur är läget\?/i)).toBeInTheDocument();
    });

    it('should render welcome message in English', () => {
      render(<ChatUI {...defaultProps} lang="en" />);
      expect(screen.getByText(/Hey! What's up\?/i)).toBeInTheDocument();
    });

    it('should render chat input', () => {
      render(<ChatUI {...defaultProps} />);
      const input = screen.getByPlaceholderText(/Skriv din fråga här/i);
      expect(input).toBeInTheDocument();
    });

    it('should render send button', () => {
      render(<ChatUI {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      const submitButton = buttons.find(btn => btn.type === 'submit');
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Input Validation', () => {
    it('should not send empty message', () => {
      render(<ChatUI {...defaultProps} />);
      const input = screen.getByPlaceholderText(/Skriv din fråga här/i);
      const buttons = screen.getAllByRole('button');
      const submitButton = buttons.find(btn => btn.type === 'submit');

      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(submitButton);

      // Input should still be empty (trimmed)
      expect(input.value).toBe('   ');
    });

    it('should accept valid message', () => {
      render(<ChatUI {...defaultProps} />);
      const input = screen.getByPlaceholderText(/Skriv din fråga här/i);

      fireEvent.change(input, { target: { value: 'Test message' } });
      expect(input.value).toBe('Test message');
    });
  });

  describe('Clear History', () => {
    it('should show clear button when multiple messages exist', async () => {
      render(<ChatUI {...defaultProps} />);

      // Add a user message to make messages.length > 1
      const input = screen.getByPlaceholderText(/Skriv din fråga här/i);
      const buttons = screen.getAllByRole('button');
      const submitButton = buttons.find(btn => btn.type === 'submit');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(submitButton);

      // Clear button should appear when messages.length > 1
      await waitFor(() => {
        const clearButton = screen.getByTitle(/Rensa historik/i);
        expect(clearButton).toBeInTheDocument();
      });
    });

    it('should clear messages when clear button clicked', async () => {
      render(<ChatUI {...defaultProps} />);

      // Add a user message first
      const input = screen.getByPlaceholderText(/Skriv din fråga här/i);
      const buttons = screen.getAllByRole('button');
      const submitButton = buttons.find(btn => btn.type === 'submit');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(submitButton);

      // Wait for clear button and click it
      await waitFor(() => {
        const clearButton = screen.getByTitle(/Rensa historik/i);
        fireEvent.click(clearButton);
      });

      // Should still show welcome message after clear
      await waitFor(() => {
        expect(screen.getByText(/Tjena! Hur är läget\?/i)).toBeInTheDocument();
      });
    });
  });

  describe('Theme Support', () => {
    it('should apply dark theme classes', () => {
      const { container } = render(<ChatUI {...defaultProps} isDark={true} />);
      const chatContainer = container.firstChild;
      expect(chatContainer.className).toContain('bg-black/40');
    });

    it('should apply light theme classes', () => {
      const { container } = render(<ChatUI {...defaultProps} isDark={false} />);
      const chatContainer = container.firstChild;
      expect(chatContainer.className).toContain('bg-white/30');
    });
  });

  describe('localStorage Integration', () => {
    it('should load messages from localStorage on mount', () => {
      const savedMessages = [
        { role: 'assistant', content: 'Hej!' },
        { role: 'user', content: 'Hej tillbaka!' },
      ];
      localStorage.setItem('klasPortfolio_chatHistory', JSON.stringify(savedMessages));

      render(<ChatUI {...defaultProps} />);

      expect(screen.getByText('Hej!')).toBeInTheDocument();
      expect(screen.getByText('Hej tillbaka!')).toBeInTheDocument();
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('klasPortfolio_chatHistory', 'invalid-json');

      render(<ChatUI {...defaultProps} />);

      // Should show welcome message as fallback
      expect(screen.getByText(/Tjena! Hur är läget\?/i)).toBeInTheDocument();
    });
  });
});
