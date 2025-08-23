import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { hexToUuid, uuidToHex, isValidUUID } from './utils';

// Mock clipboard API
const mockWriteText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('Utils Functions', () => {
  describe('hexToUuid', () => {
    test('converts 32-character hex to UUID format', () => {
      const hex = '550e8400e29b41d4a716446655440000';
      const expected = '550e8400-e29b-41d4-a716-446655440000';
      expect(hexToUuid(hex)).toBe(expected);
    });

    test('handles partial hex strings', () => {
      const hex = '550e8400';
      const expected = '550e8400----';
      expect(hexToUuid(hex)).toBe(expected);
    });

    test('handles empty string', () => {
      expect(hexToUuid('')).toBe('----');
    });
  });

  describe('uuidToHex', () => {
    test('removes hyphens from UUID', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const expected = '550e8400e29b41d4a716446655440000';
      expect(uuidToHex(uuid)).toBe(expected);
    });

    test('handles string without hyphens', () => {
      const uuid = '550e8400e29b41d4a716446655440000';
      expect(uuidToHex(uuid)).toBe(uuid);
    });
  });

  describe('isValidUUID', () => {
    test('validates correct UUID format', () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';
      expect(isValidUUID(validUuid)).toBe(true);
    });

    test('rejects invalid UUID format', () => {
      expect(isValidUUID('invalid')).toBe(false);
      expect(isValidUUID('550e8400-e29b-41d4-a716')).toBe(false);
      expect(isValidUUID('550e8400-e29b-41d4-a716-44665544000g')).toBe(false);
    });

    test('rejects empty string', () => {
      expect(isValidUUID('')).toBe(false);
    });
  });
});

describe('App Component', () => {
  beforeEach(() => {
    mockWriteText.mockClear();
    mockWriteText.mockResolvedValue(undefined);
  });

  test('renders input fields and labels', () => {
    render(<App />);
    
    expect(screen.getByLabelText(/hex value from your favourite uuid provider/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/uuid value in the proper format/i)).toBeInTheDocument();
  });

  test('renders generate random uuid button', () => {
    render(<App />);
    
    expect(screen.getByText(/generate random uuid/i)).toBeInTheDocument();
  });

  test('renders copy buttons', () => {
    render(<App />);
    
    const copyButtons = screen.getAllByRole('button');
    // Should have 2 copy buttons + 1 generate button = 3 total
    expect(copyButtons).toHaveLength(3);
  });

  test('hex input updates uuid display', async () => {
    render(<App />);
    
    const hexInput = screen.getByLabelText(/hex value from your favourite uuid provider/i);
    await userEvent.type(hexInput, '550e8400e29b41d4a716446655440000');
    
    const uuidInput = screen.getByLabelText(/uuid value in the proper format/i);
    expect(uuidInput).toHaveValue('550e8400-e29b-41d4-a716-446655440000');
  });

  test('uuid input updates hex display', async () => {
    render(<App />);
    
    const uuidInput = screen.getByLabelText(/uuid value in the proper format/i);
    await userEvent.type(uuidInput, '550e8400-e29b-41d4-a716-446655440000');
    
    const hexInput = screen.getByLabelText(/hex value from your favourite uuid provider/i);
    expect(hexInput).toHaveValue('550e8400e29b41d4a716446655440000');
  });

  test('handles partial hex input', async () => {
    render(<App />);
    
    const hexInput = screen.getByLabelText(/hex value from your favourite uuid provider/i);
    await userEvent.type(hexInput, '550e8400');
    
    const uuidInput = screen.getByLabelText(/uuid value in the proper format/i);
    expect(uuidInput).toHaveValue('550e8400----');
  });

  test('truncates hex input to 32 characters', async () => {
    render(<App />);
    
    const hexInput = screen.getByLabelText(/hex value from your favourite uuid provider/i);
    const longHex = '550e8400e29b41d4a716446655440000extracharacters';
    await userEvent.type(hexInput, longHex);
    
    const uuidInput = screen.getByLabelText(/uuid value in the proper format/i);
    expect(uuidInput).toHaveValue('550e8400-e29b-41d4-a716-446655440000');
  });

  test('generate random uuid button creates valid uuid', async () => {
    render(<App />);
    
    const generateButton = screen.getByText(/generate random uuid/i);
    await userEvent.click(generateButton);
    
    const uuidInput = screen.getByLabelText(/uuid value in the proper format/i) as HTMLInputElement;
    const hexInput = screen.getByLabelText(/hex value from your favourite uuid provider/i) as HTMLInputElement;
    
    expect(uuidInput.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    expect(hexInput.value).toMatch(/^[0-9a-f]{32}$/i);
  });

  test('copy hex button copies to clipboard', async () => {
    render(<App />);
    
    const hexInput = screen.getByLabelText(/hex value from your favourite uuid provider/i);
    await userEvent.type(hexInput, '550e8400e29b41d4a716446655440000');
    
    const copyButtons = screen.getAllByRole('button');
    const hexCopyButton = copyButtons[0]; // First copy button is for hex
    
    await userEvent.click(hexCopyButton);
    
    expect(mockWriteText).toHaveBeenCalledWith('550e8400e29b41d4a716446655440000');
  });

  test('copy uuid button copies to clipboard', async () => {
    render(<App />);
    
    const uuidInput = screen.getByLabelText(/uuid value in the proper format/i);
    await userEvent.type(uuidInput, '550e8400-e29b-41d4-a716-446655440000');
    
    const copyButtons = screen.getAllByRole('button');
    const uuidCopyButton = copyButtons[1]; // Second copy button is for uuid
    
    await userEvent.click(uuidCopyButton);
    
    expect(mockWriteText).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000');
  });

  test('displays copy success message after successful copy', async () => {
    render(<App />);
    
    const hexInput = screen.getByLabelText(/hex value from your favourite uuid provider/i);
    await userEvent.type(hexInput, '550e8400e29b41d4a716446655440000');
    
    const copyButtons = screen.getAllByRole('button');
    const hexCopyButton = copyButtons[0];
    
    await userEvent.click(hexCopyButton);
    
    // Wait for the success message to appear
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
    
    // Wait for message to disappear
    await waitFor(() => {
      expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('handles copy failure gracefully', async () => {
    mockWriteText.mockRejectedValue(new Error('Copy failed'));
    
    render(<App />);
    
    const hexInput = screen.getByLabelText(/hex value from your favourite uuid provider/i);
    await userEvent.type(hexInput, '550e8400e29b41d4a716446655440000');
    
    const copyButtons = screen.getAllByRole('button');
    const hexCopyButton = copyButtons[0];
    
    await userEvent.click(hexCopyButton);
    
    expect(mockWriteText).toHaveBeenCalled();
    expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
  });

  test('renders info section with explanation', () => {
    render(<App />);
    
    expect(screen.getByText("What's this?")).toBeInTheDocument();
    expect(screen.getByText(/copy a uuid from the database/i)).toBeInTheDocument();
  });

  test('renders github repo link', () => {
    render(<App />);
    
    const githubLink = screen.getByText('Github repo');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink.closest('a')).toHaveAttribute('href', 'https://github.com/jarin/uuidformat');
  });

  test('uuid display has valid class for valid uuid', async () => {
    render(<App />);
    
    const uuidInput = screen.getByLabelText(/uuid value in the proper format/i);
    await userEvent.type(uuidInput, '550e8400-e29b-41d4-a716-446655440000');
    
    // Check that the result div has the valid class
    const resultDiv = screen.getByText('550e8400-e29b-41d4-a716-446655440000').closest('.result');
    expect(resultDiv).toHaveClass('valid');
  });

  test('uuid display has invalid class for invalid uuid', async () => {
    render(<App />);
    
    const uuidInput = screen.getByLabelText(/uuid value in the proper format/i);
    await userEvent.type(uuidInput, 'invalid-uuid');
    
    // Check that the result div has the invalid class
    const resultDiv = screen.getByText('invalid-uuid').closest('.result');
    expect(resultDiv).toHaveClass('invalid');
  });
});