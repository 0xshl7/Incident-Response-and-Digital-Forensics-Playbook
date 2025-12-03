# Copilot Instructions

## Project Overview

**Incident Response and Digital Forensics Playbook Dashboard**

A 4-week interactive training/simulation project for building and practicing the complete incident response lifecycle. Each week has a dedicated dashboard with tasks, deliverables, and educational content.

- **Technology**: Vanilla HTML5, CSS3, JavaScript (no frameworks)
- **Target**: Modern web browsers (Chrome, Firefox, Edge, Safari)
- **Purpose**: Educational dashboard for cybersecurity IR training

## Architecture

- **Entry point**: `index.html` (Week 1 dashboard)
- **Styling**: `styles.css` - CSS custom properties for theming
- **Logic**: `script.js` - Vanilla JS with localStorage persistence

### Week Structure
- Week 1: Incident Preparation & Team Setup
- Week 2: Incident Simulation & Evidence Collection
- Week 3: Containment, Eradication, and Recovery
- Week 4: Post-Incident Activities

### Data Flow
- User progress stored in `localStorage` (`week1Progress`, `irChecklist`)
- Document generation creates downloadable Markdown files
- Modal dialogs for detailed content views

## Development Workflow

```bash
# Run locally - open index.html in browser or use Live Server
# No build step required (vanilla HTML/CSS/JS)
```

## Conventions

- **CSS**: BEM-like naming, CSS custom properties in `:root`
- **JS**: Vanilla ES6+, no dependencies
- **Colors**: Follow `--primary`, `--danger`, `--success`, `--warning` variables
- **Components**: Modal pattern with `.modal` and `.modal.active` toggle
- **Icons**: Font Awesome 6.x via CDN

## Key Files

- `index.html` - Main dashboard structure and modals
- `styles.css` - Complete styling with responsive breakpoints
- `script.js` - Progress tracking, document generation, notifications
