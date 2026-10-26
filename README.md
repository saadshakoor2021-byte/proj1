# UniPath Pakistan

## AI-Powered University Finder for Pakistani Students

### Product Mission
"Find where you can get in, afford to study, and build your future."

UniPath Pakistan helps Pakistani students discover suitable universities, assess eligibility, calculate educational costs, identify scholarships, and organize their applications - all in one platform.

---

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS v4** - Apple-inspired design system
- **Lucide React** - Icon set
- **Zod** - Schema validation

### Backend & Infrastructure
- Node.js API routes (Google AI Studio Build mode)
- PostgreSQL (for production deployment)
- LocalStorage persistence (for prototype demonstration)

### AI Integration
- **Google Gemini** (default, through Google AI Studio integration)
- **Nebius Token Factory** (optional alternative)
- Grounded responses with source verification

### Build & Development
- Tailwind CSS v4 for styling
- PostCSS for processing
- npm for package management

---

## Local Setup

### Prerequisites
- Node.js v20+
- npm or yarn
- Google AI Studio API key (for live AI counseling)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Add your Google Gemini API key: `GOOGLE_GEMINI_API_KEY=your_key_here`
   - Configure optional services as needed

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Or start the Tailwind watch and React dev server separately.

4. **Open the application:**
   Visit `http://localhost:3000` (or the port indicated in the console)

### Development Commands
- `npm run dev` - Start development server with Tailwind watching
- `npm run build` - Build for production
- `npm test` - Run tests

---

## Project Structure

```
src/
  ├── App.tsx - Main application component with page routing
  ├── main.tsx - Entry point
  ├── index.css - Tailwind directives
  ├── ui/ - Reusable UI components (button, input, card, etc.)
  └── pages/ - Application pages:
      - homepage.tsx - Premium product landing page
      - onboarding.tsx - 6-step student setup flow
      - universities.tsx - University search and matching
      - scholarships.tsx - Scholarship discovery and filtering
      - counselor.tsx - AI University Counselor
      - planner.tsx - Application task manager
      - shortlist.tsx - Saved programs and comparison
      - profile.tsx - Student profile management
      - settings.tsx - AI provider configuration
```

---

## Key Features

### 1. Student Onboarding
Multi-step setup collecting:
- Citizenship and residence information
- Qualification type (FSc, A Levels, IB, etc.) and grades
- Academic goals (degree level, major, preferred destinations)
- Financial information (budget, currency, scholarship needs)
- Tests and documents (SAT, IELTS, transcripts, etc.)
- Profile review and confirmation

### 2. University Search
- Search by university name or program
- Filter by country, degree level, eligibility status
- Sort by relevance, cost, or name
- Sample verified dataset of Pakistani and international programs

### 3. Eligibility Assessment
Four-dimensional matching:
- **Eligibility**: Meets requirements / Partial / Does not meet / Unknown
- **Competitiveness**: Strong / Competitive / Ambitious / Unsuitable
- **Affordability**: Annual cost, full-degree cost, funding gap analysis
- **Application readiness**: Missing tests, documents, deadlines

### 4. Affordability Calculator
- Annual cost: Tuition + Living expenses + Mandatory additional
- Full-degree cost: Sum of annual costs across program duration
- Funding gap: Estimated cost minus confirmed funding
- Currency conversion with configurable exchange rates
- Cost source labeling (official, estimate, user-provided, unknown)

### 5. Scholarship Finder
- HEC Pakistan scholarships
- University-funded aid
- Foreign government programs (DAAD, etc.)
- Merit-based and need-based opportunities
- Filter by coverage type (fully funded, partial, tuition-only)
- Verification status tracking

### 6. AI University Counselor
- Grounded advice based on retrieved evidence
- Source citations with every recommendation
- Distinguishes verified facts from estimates
- Handles uncertainty and missing information
- Configurable AI provider (Gemini / Nebius)

### 7. Application Planning
- Track application status (considering, researching, preparing, submitted, etc.)
- Manage deadlines and required documents
- Scholarship deadline tracking
- Visa preparation tasks

### 8. Shortlist & Comparison
- Save programs to personal shortlist
- Compare up to 4 programs side-by-side
- CSV export functionality
- Verification status display

### 9. Apple-Inspired Design
- Restrained color palette (white, light gray, near-black, muted accent blue)
- Refined typography with system font stack
- Generous whitespace and consistent spacing
- Minimal visual clutter and clear hierarchy
- Subtle transitions and focus states
- Accessible color contrast and keyboard navigation

---

## AI Provider Configuration

### Google Gemini (Default)
1. Get an API key from: https://aistudio.google.com/
2. Add to `.env`: `GOOGLE_GEMINI_API_KEY=your_key_here`
3. The counselor will use grounded retrieval-enhanced generation

### Nebius Token Factory (Optional)
1. Get API key from: https://nebius.ai/
2. Configure in `.env`:
   ```
   NEBIUS_API_KEY=your_nebius_key
   NEBIUS_ENDPOINT=https://api.nebius.ai/v1
   NEBIUS_MODEL=nebius/fast-model
   ```
3. The application interface remains the same; only the backend provider changes

### Without AI Credentials
- The application retains all deterministic features (eligibility, affordability, matching)
- AI counselor shows configuration message and provides grounded sample responses
- No credentials are committed to or exposed in the codebase

---

## Data & Seed Data

The application includes sample verified data for demonstration:

### Universities (Sample)
- University of Punjab - BS Computer Science, BS programs
- NED University of Engineering - BS Software Engineering
- University of Karachi - BS Electrical Engineering, BS Business Administration
- COMSATS University Islamabad - BS Computer Science

### Scholarships (Sample)
- HEC Need-Based Scholarship
- University of Punjab Merit Scholarship
- DAAD Scholarship Germany
- International Need-Based Scholarships
- COMSATS University Merit Scholarship

All sample data is clearly marked and includes source verification metadata. No institution, fee, requirement, or deadline is fabricated without verified source.

---

## Persistence

### Prototype Mode (LocalStorage)
- Shortlist, application tasks, and profile data are stored in browser localStorage
- Data persists across refreshes within the same browser
- Each student's data is isolated (no multi-user authentication in prototype)

### Production Mode
- PostgreSQL database with proper user authentication
- User-level authorization ensures students cannot access other students' records
- API-backed persistence for all data types
- Regular backups and data export capabilities

---

## Testing

The application includes test coverage for:
- Eligibility rules (missing vs required test scores)
- Affordability formulas (annual vs total-degree budgets)
- Scholarship funding classification (confirmed vs competitive)
- Missing exchange rates
- AI timeouts and invalid responses
- Persistence after refresh
- Authorization boundaries

---

## Known Limitations (Prototype Mode)

- Sample data only; no live database connectivity
- AI counselor uses grounded sample responses without API credentials
- LocalStorage persistence (no multi-user support)
- Static filter options (no dynamic database queries)
- Currency conversion uses stored rates (no live API by default)

---

## Deployment

For production deployment:
1. Configure all environment variables
2. Set up PostgreSQL database and run migrations
3. Deploy the Node.js/React application
4. Configure domain and SSL
5. Monitor AI API usage and costs

See the project wiki for detailed deployment instructions.

---

## License

This project is available for educational and non-commercial use. Please attribute appropriately if redistributing.