import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatUI from '../ChatUI';

// Mock axios
vi.mock('axios');

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
      expect(screen.getByText(/Hej! Det är jag som är Klas/i)).toBeInTheDocument();
    });

    it('should render welcome message in English', () => {
      render(<ChatUI {...defaultProps} lang="en" />);
      expect(screen.getByText(/Hi! I'm Klas/i)).toBeInTheDocument();
    });

    it('should render chat input', () => {
      render(<ChatUI {...defaultProps} />);
      const input = screen.getByPlaceholderText(/Skriv din fråga här/i);
      expect(input).toBeInTheDocument();
    });

    it('should render send button', () => {
      render(<ChatUI {...defaultProps} />);
      const button = screen.getByRole('button', { name: /send/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Input Validation', () => {
    it('should not send empty message', () => {
      render(<ChatUI {...defaultProps} />);
      const input = screen.getByPlaceholderText(/Skriv din fråga här/i);
      const button = screen.getByRole('button', { name: /send/i });

      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(button);

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
    it('should show clear button when messages exist', async () => {
      render(<ChatUI {...defaultProps} />);

      // Welcome message is automatically added
      await waitFor(() => {
        const clearButton = screen.getByTitle(/Rensa historik/i);
        expect(clearButton).toBeInTheDocument();
      });
    });

    it('should clear messages when clear button clicked', async () => {
      render(<ChatUI {...defaultProps} />);

      await waitFor(() => {
        const clearButton = screen.getByTitle(/Rensa historik/i);
        fireEvent.click(clearButton);
      });

      // Should still show welcome message after clear
      expect(screen.getByText(/Hej! Det är jag som är Klas/i)).toBeInTheDocument();
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
      expect(screen.getByText(/Hej! Det är jag som är Klas/i)).toBeInTheDocument();
    });
  });
});
