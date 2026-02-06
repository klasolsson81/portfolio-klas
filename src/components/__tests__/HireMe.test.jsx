import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HireMe from '../HireMe';

// Mock apiClient
vi.mock('../../lib/api/client', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({
      data: { approved: true, feedback: 'Looks good!', estimatedHours: 10, status: 'approved', verificationToken: 'test-token' }
    })),
  },
}));

// Mock react-google-recaptcha — must use vi.fn inline (no external refs in hoisted mocks)
vi.mock('react-google-recaptcha', () => {
  const React = require('react');
  return {
    default: React.forwardRef(function MockReCAPTCHA(props, ref) {
      React.useImperativeHandle(ref, () => ({
        executeAsync: () => Promise.resolve('test-recaptcha-token'),
        reset: () => {},
      }));
      return null;
    }),
  };
});

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('HireMe Component', () => {
  const defaultProps = {
    lang: 'sv',
    isDark: true,
  };

  describe('Rendering', () => {
    it('should render the title in Swedish', () => {
      render(<HireMe {...defaultProps} />);
      expect(screen.getByText('Anlita mig')).toBeInTheDocument();
    });

    it('should render the title in English', () => {
      render(<HireMe {...defaultProps} lang="en" />);
      expect(screen.getByText('Hire Me')).toBeInTheDocument();
    });

    it('should render disclaimer text', () => {
      render(<HireMe {...defaultProps} />);
      expect(screen.getByText(/OBSERVERA/i)).toBeInTheDocument();
    });

    it('should render name and email fields', () => {
      render(<HireMe {...defaultProps} />);
      expect(screen.getByPlaceholderText('Förnamn Efternamn')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('namn@exempel.se')).toBeInTheDocument();
    });

    it('should render the analyze button', () => {
      render(<HireMe {...defaultProps} />);
      expect(screen.getByText('Analysera med AI')).toBeInTheDocument();
    });
  });

  describe('Budget Type Selector', () => {
    it('should show budget fields when "Betalt" is selected', () => {
      render(<HireMe {...defaultProps} />);
      // "Betalt" is the default payment type
      expect(screen.getByText('BUDGETTYP')).toBeInTheDocument();
      expect(screen.getByText('BELOPP')).toBeInTheDocument();
    });

    it('should hide budget fields when "Pro Bono" is selected', () => {
      render(<HireMe {...defaultProps} />);

      // Find the payment select and change to Pro Bono
      const selects = screen.getAllByRole('combobox');
      const paymentSelect = selects.find(s => {
        const options = Array.from(s.options);
        return options.some(o => o.text.includes('Pro Bono'));
      });

      fireEvent.change(paymentSelect, { target: { value: 'Pro Bono (Gratis/Erfarenhet)' } });

      // Budget type and amount should disappear
      expect(screen.queryByText('BUDGETTYP')).not.toBeInTheDocument();
      expect(screen.queryByText('BELOPP')).not.toBeInTheDocument();
    });

    it('should have "Totalbudget" as default budget type', () => {
      render(<HireMe {...defaultProps} />);
      const selects = screen.getAllByRole('combobox');
      const budgetTypeSelect = selects.find(s => {
        const options = Array.from(s.options);
        return options.some(o => o.text.includes('Totalbudget'));
      });
      expect(budgetTypeSelect).toBeTruthy();
      expect(budgetTypeSelect.value).toContain('Totalbudget');
    });

    it('should show total budget placeholder by default', () => {
      render(<HireMe {...defaultProps} />);
      expect(screen.getByPlaceholderText('t.ex. 50 000')).toBeInTheDocument();
    });

    it('should switch to hourly placeholder when timpris selected', () => {
      render(<HireMe {...defaultProps} />);

      const selects = screen.getAllByRole('combobox');
      const budgetTypeSelect = selects.find(s => {
        const options = Array.from(s.options);
        return options.some(o => o.text.includes('Timpris'));
      });

      fireEvent.change(budgetTypeSelect, { target: { value: 'Timpris (kr/h)' } });

      expect(screen.getByPlaceholderText('t.ex. 500')).toBeInTheDocument();
    });

    it('should have budget type options in English', () => {
      render(<HireMe {...defaultProps} lang="en" />);
      const selects = screen.getAllByRole('combobox');
      const budgetTypeSelect = selects.find(s => {
        const options = Array.from(s.options);
        return options.some(o => o.text.includes('Total budget'));
      });
      expect(budgetTypeSelect).toBeTruthy();

      const options = Array.from(budgetTypeSelect.options);
      expect(options.some(o => o.text.includes('Total budget'))).toBe(true);
      expect(options.some(o => o.text.includes('Hourly rate'))).toBe(true);
    });
  });

  describe('Project Type Options', () => {
    it('should render all project type options in Swedish', () => {
      render(<HireMe {...defaultProps} />);
      const selects = screen.getAllByRole('combobox');
      const projectSelect = selects.find(s => {
        const options = Array.from(s.options);
        return options.some(o => o.text.includes('Hemsida'));
      });

      const options = Array.from(projectSelect.options).map(o => o.text);
      expect(options).toContain('Hemsida (Enkel)');
      expect(options).toContain('Hemsida (Avancerad)');
      expect(options).toContain('Systemutveckling / Backend');
      expect(options).toContain('AI Integration / Automation');
      expect(options).toContain('Annat');
    });
  });

  describe('Org Type Radio Buttons', () => {
    it('should render all organization types', () => {
      render(<HireMe {...defaultProps} />);
      expect(screen.getByLabelText('Privatperson')).toBeInTheDocument();
      expect(screen.getByLabelText('Företag')).toBeInTheDocument();
      expect(screen.getByLabelText('Rekryterare')).toBeInTheDocument();
    });

    it('should default to Privatperson', () => {
      render(<HireMe {...defaultProps} />);
      const radio = screen.getByLabelText('Privatperson');
      expect(radio.checked).toBe(true);
    });
  });

  describe('Theme Support', () => {
    it('should apply dark theme styling to title', () => {
      render(<HireMe {...defaultProps} isDark={true} />);
      const title = screen.getByText('Anlita mig');
      expect(title.className).toContain('text-neon-purple');
    });

    it('should apply light theme styling to title', () => {
      render(<HireMe {...defaultProps} isDark={false} />);
      const title = screen.getByText('Anlita mig');
      expect(title.className).toContain('text-warm-accent');
    });
  });

  describe('Form Validation', () => {
    it('should have required name field', () => {
      render(<HireMe {...defaultProps} />);
      const nameInput = screen.getByPlaceholderText('Förnamn Efternamn');
      expect(nameInput).toBeRequired();
    });

    it('should have required email field', () => {
      render(<HireMe {...defaultProps} />);
      const emailInput = screen.getByPlaceholderText('namn@exempel.se');
      expect(emailInput).toBeRequired();
    });

    it('should have required description field', () => {
      render(<HireMe {...defaultProps} />);
      const descInput = screen.getByPlaceholderText(/Vad behöver du hjälp med/i);
      expect(descInput).toBeRequired();
    });

    it('should accept input in the budget field', () => {
      render(<HireMe {...defaultProps} />);
      const budgetInput = screen.getByPlaceholderText('t.ex. 50 000');
      fireEvent.change(budgetInput, { target: { value: '150000' } });
      expect(budgetInput.value).toBe('150000');
    });
  });
});
