/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Read the HTML file
const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// Mock clipboard API
const mockWriteText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

// Mock crypto API for UUID generation
const mockGetRandomValues = jest.fn((buffer) => {
  // Fill with predictable values for testing
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = i * 16 + 5; // Predictable pattern
  }
  return buffer;
});

Object.assign(window, {
  crypto: {
    getRandomValues: mockGetRandomValues,
  },
});

// Define the functions manually (copied from the HTML script)
function hexToUuid(hex) {
  const group1 = hex.substring(0, 8);
  const group2 = hex.substring(8, 12);
  const group3 = hex.substring(12, 16);
  const group4 = hex.substring(16, 20);
  const group5 = hex.substring(20);
  
  return `${group1}-${group2}-${group3}-${group4}-${group5}`;
}

function uuidToHex(uuid) {
  return uuid.replace(/-/g, '');
}

function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

function generateUUID() {
  const crypto = window.crypto || window.msCrypto;
  if (crypto && crypto.getRandomValues) {
    const buffer = new Uint8Array(16);
    crypto.getRandomValues(buffer);
    
    buffer[6] = (buffer[6] & 0x0f) | 0x40; // Version 4
    buffer[8] = (buffer[8] & 0x3f) | 0x80; // Variant 10
    
    const hex = Array.from(buffer, byte => byte.toString(16).padStart(2, '0')).join('');
    return hexToUuid(hex);
  } else {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// Global DOM elements (will be set in beforeEach)
let hexInput, uuidInput, uuidOutput, uuidDisplay, copyMessage;

function handleHexChange() {
  const newHex = hexInput.value;
  const newUuid = hexToUuid(newHex.substring(0, 32));
  uuidInput.value = newUuid;
  updateDisplay(newUuid);
}

function handleUuidChange() {
  const newUuid = uuidInput.value;
  hexInput.value = uuidToHex(newUuid);
  updateDisplay(newUuid);
}

function updateDisplay(uuid) {
  uuidOutput.textContent = uuid;
  const isValid = isValidUUID(uuid);
  uuidOutput.className = `result ${isValid ? 'valid' : 'invalid'}`;
  uuidDisplay.className = `result ${isValid ? 'valid' : 'invalid'}`;
}

function generateRandomUuid() {
  const newUuid = generateUUID();
  uuidInput.value = newUuid;
  hexInput.value = uuidToHex(newUuid);
  updateDisplay(newUuid);
}

function showCopyMessage() {
  copyMessage.innerHTML = '<div class="floating-box">Copied!</div>';
  setTimeout(() => {
    copyMessage.innerHTML = '';
  }, 2000);
}

function copyHex() {
  const hexValue = hexInput.value;
  navigator.clipboard.writeText(hexValue)
    .then(() => {
      showCopyMessage();
    })
    .catch(() => {
      // Copy failed - do nothing
    });
}

function copyUuid() {
  const uuidValue = uuidInput.value;
  navigator.clipboard.writeText(uuidValue)
    .then(() => {
      showCopyMessage();
    })
    .catch(() => {
      // Copy failed - do nothing
    });
}

describe('Vanilla JavaScript Utils Functions', () => {
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

  describe('generateUUID', () => {
    test('generates a valid UUID format', () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    test('generates different UUIDs on subsequent calls', () => {
      let callCount = 0;
      mockGetRandomValues.mockImplementation((buffer) => {
        for (let i = 0; i < buffer.length; i++) {
          buffer[i] = (i + callCount * 16) % 256;
        }
        callCount++;
        return buffer;
      });

      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });
});

describe('Vanilla JavaScript App Functionality', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = htmlContent.match(/<body>([\s\S]*?)<\/body>/)[1];
    
    // Set up DOM element references
    hexInput = document.getElementById('hex-input');
    uuidInput = document.getElementById('uuid-input');
    uuidOutput = document.getElementById('uuid-output');
    uuidDisplay = document.getElementById('uuid-display');
    copyMessage = document.getElementById('copyMessage');
    
    // Make functions available globally for onclick handlers
    global.generateRandomUuid = generateRandomUuid;
    global.copyHex = copyHex;
    global.copyUuid = copyUuid;
    
    // Set up event listeners
    if (hexInput) hexInput.addEventListener('input', handleHexChange);
    if (uuidInput) uuidInput.addEventListener('input', handleUuidChange);
    
    // Initialize display
    updateDisplay('');
    
    mockWriteText.mockClear();
    mockWriteText.mockResolvedValue(undefined);
  });

  test('renders input fields with correct attributes', () => {
    expect(hexInput).toBeTruthy();
    expect(uuidInput).toBeTruthy();
    expect(hexInput.type).toBe('text');
    expect(uuidInput.type).toBe('text');
  });

  test('renders generate random uuid button', () => {
    const button = document.querySelector('button[onclick="generateRandomUuid()"]');
    expect(button).toBeTruthy();
    expect(button.textContent.trim()).toBe('Generate Random UUID');
  });

  test('renders copy buttons', () => {
    const copyButtons = document.querySelectorAll('button[onclick^="copy"]');
    expect(copyButtons).toHaveLength(2);
  });

  test('hex input updates uuid display', () => {
    // Simulate typing in hex input
    hexInput.value = '550e8400e29b41d4a716446655440000';
    hexInput.dispatchEvent(new Event('input'));
    
    expect(uuidInput.value).toBe('550e8400-e29b-41d4-a716-446655440000');
    expect(uuidOutput.textContent).toBe('550e8400-e29b-41d4-a716-446655440000');
  });

  test('uuid input updates hex display', () => {
    // Simulate typing in uuid input
    uuidInput.value = '550e8400-e29b-41d4-a716-446655440000';
    uuidInput.dispatchEvent(new Event('input'));
    
    expect(hexInput.value).toBe('550e8400e29b41d4a716446655440000');
    expect(uuidOutput.textContent).toBe('550e8400-e29b-41d4-a716-446655440000');
  });

  test('handles partial hex input', () => {
    hexInput.value = '550e8400';
    hexInput.dispatchEvent(new Event('input'));
    
    expect(uuidInput.value).toBe('550e8400----');
  });

  test('truncates hex input to 32 characters', () => {
    const longHex = '550e8400e29b41d4a716446655440000extracharacters';
    hexInput.value = longHex;
    hexInput.dispatchEvent(new Event('input'));
    
    expect(uuidInput.value).toBe('550e8400-e29b-41d4-a716-446655440000');
  });

  test('generate random uuid button creates valid uuid', () => {
    const generateButton = document.querySelector('button[onclick="generateRandomUuid()"]');
    
    generateButton.click();
    
    expect(uuidInput.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    expect(hexInput.value).toMatch(/^[0-9a-f]{32}$/i);
  });

  test('copy hex button copies to clipboard', async () => {
    const copyHexButton = document.querySelector('button[onclick="copyHex()"]');
    
    hexInput.value = '550e8400e29b41d4a716446655440000';
    copyHexButton.click();
    
    expect(mockWriteText).toHaveBeenCalledWith('550e8400e29b41d4a716446655440000');
  });

  test('copy uuid button copies to clipboard', async () => {
    const copyUuidButton = document.querySelector('button[onclick="copyUuid()"]');
    
    uuidInput.value = '550e8400-e29b-41d4-a716-446655440000';
    copyUuidButton.click();
    
    expect(mockWriteText).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000');
  });

  test('displays copy success message after successful copy', async () => {
    const copyHexButton = document.querySelector('button[onclick="copyHex()"]');
    
    hexInput.value = '550e8400e29b41d4a716446655440000';
    copyHexButton.click();
    
    // Wait for message to appear
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(copyMessage.innerHTML).toContain('Copied!');
    expect(copyMessage.innerHTML).toContain('floating-box');
  });

  test('handles copy failure gracefully', async () => {
    mockWriteText.mockRejectedValue(new Error('Copy failed'));
    
    const copyHexButton = document.querySelector('button[onclick="copyHex()"]');
    
    hexInput.value = '550e8400e29b41d4a716446655440000';
    copyHexButton.click();
    
    expect(mockWriteText).toHaveBeenCalled();
    expect(copyMessage.innerHTML).toBe('');
  });

  test('renders info section with explanation', () => {
    expect(document.querySelector('.infobox h1').textContent).toBe("What's this?");
    expect(document.querySelector('.infobox p').textContent).toMatch(/copy a uuid from the database/i);
  });

  test('renders github repo link', () => {
    const githubLink = document.querySelector('a[href="https://github.com/jarin/uuidformat"]');
    expect(githubLink).toBeTruthy();
    expect(githubLink.textContent).toBe('View on GitHub');
  });

  test('uuid display has valid class for valid uuid', () => {
    uuidInput.value = '550e8400-e29b-41d4-a716-446655440000';
    uuidInput.dispatchEvent(new Event('input'));
    
    expect(uuidOutput.className).toContain('valid');
    expect(uuidOutput.className).not.toContain('invalid');
  });

  test('uuid display has invalid class for invalid uuid', () => {
    uuidInput.value = 'invalid-uuid';
    uuidInput.dispatchEvent(new Event('input'));
    
    expect(uuidOutput.className).toBe('result invalid');
    expect(uuidOutput.className).toContain('invalid');
  });
});