# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a vanilla JavaScript application that converts between hexadecimal UUID representations (typically Oracle RAW(16)) and standard RFC-4122 formatted UUIDs. It's a simple utility web app hosted at https://uuid.tafl.no.

## Common Development Commands

### Development
- `npm run serve` - Start Python HTTP server on port 8080
- `npm run serve:node` - Start Node.js HTTP server on port 8080
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode

### Testing
The project uses Jest with jsdom environment for testing DOM interactions. Tests are located in the `test/` directory and follow the pattern `*.test.js`.

## Architecture & Structure

### Application Structure
The app is built as a single HTML file with embedded CSS and JavaScript:

- **index.html** - Complete single-page application with embedded styles and scripts
- **test/vanilla.test.js** - Comprehensive test suite covering all functionality

### Key Functions
- `hexToUuid(hex)` - Converts 32-character hex string to RFC-4122 UUID format
- `uuidToHex(uuid)` - Removes hyphens from UUID to get hex representation  
- `isValidUUID(uuid)` - Validates UUID format using regex pattern
- `generateUUID()` - Creates random v4 UUID using crypto.getRandomValues()
- `handleHexChange()` - Event handler for hex input field changes
- `handleUuidChange()` - Event handler for UUID input field changes
- `updateDisplay(uuid)` - Updates UI display and validation styling
- `copyHex()` / `copyUuid()` - Copy values to clipboard with success feedback

### State Management
State is managed through direct DOM manipulation:
- Input field values are the source of truth
- Display updates triggered by input events
- CSS classes applied directly to DOM elements for validation styling
- No external state management needed

### Technology Stack
- Pure HTML5, CSS3, and vanilla JavaScript (ES6+)
- Native Web APIs: Clipboard API, Crypto API
- Jest for testing with jsdom environment
- No build process required - single HTML file can run directly

### Styling
Embedded CSS with classes for UUID validation:
- `.valid` class for properly formatted UUIDs (appears blue)  
- `.invalid` class for malformed input
- `.floating-box` for copy success notifications

### Deployment
No build step required. Simply serve the `index.html` file from any static web server.