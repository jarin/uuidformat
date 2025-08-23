# UUID Converter

Simple tool for adding/removing hyphens when copying RAW(16) UUIDs from Oracle to proper UUID format, as I got quickly bored doing it manually.

Built with vanilla JavaScript - no framework needed! Single HTML file with embedded CSS and JavaScript.

Currently hosted on https://uuid.tafl.no

## Features

- Convert hex strings to RFC-4122 UUID format
- Convert UUIDs back to hex format  
- Generate random v4 UUIDs
- Copy values to clipboard
- Visual validation (green for valid, red for invalid)
- Responsive design for mobile and desktop
- No data leaves your browser

## Development

```bash
# Install test dependencies
npm install

# Run tests
npm test

# Serve locally
npm run serve
# or
npm run serve:node
```

## Deployment

This is a static site that can be deployed anywhere:

- **DigitalOcean App Platform**: Uses `.do/app.yaml` config
- **GitHub Pages**: Just serve the `index.html` file
- **Netlify**: Drag and drop deployment ready
- **Any static host**: Single `index.html` file contains everything

