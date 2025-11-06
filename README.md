# SkillGet - Jeffreys Bay Service Directory

A full-stack web application connecting users with local service providers in Jeffreys Bay, South Africa.

## Project Overview

SkillGet is a location-based service directory featuring:

- **Service Discovery** - Search and filter local services
- **Interactive Maps** - Leaflet integration with clickable markers
- **Service Listings** - Create and manage service listings
- **Persistent Storage** - JSON-based database for cross-session data
- **Responsive Design** - Mobile, tablet, and desktop support

## Quick Start

### Prerequisites

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** (included with Node.js)

### Installation

```bash
# 1. Extract/clone the project
cd iu-web-app-project-Ruben-Cloete

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
http://localhost:3000
```

**That's it!** No database setup or API keys needed.

## Live Demo

**View Live Application**: (https://iu-web-app-project-ruben-cloete.vercel.app/)

**Note**: The live demo is not yet complete. Some features may be limited. local testing is recommended for full functionality.

## Acknowledgments

The visual design and styling approach were inspired by the tutorial:
**"Next.js 15 Crash Course"** by JavaScript Mastery
<https://www.youtube.com/watch?v=Zq5fmkH0T78>

**What I built on top of this foundation:**

- Interactive Leaflet maps with location picking
- Distance calculation and directions integration
- Real-time search and category filtering
- Persistent JSON database
- Service radius and availability features
- View counter
- Responsive map markers and popups
- Advanced form validation with Zod
- Location-based service discovery

**Original contributions:** All map functionality, location services, filtering logic,
and backend persistence were developed independently.

```## Learning Outcomes
Foundation
- Followed "Next.js 15 Crash Course" tutorial for:
  - Next.js 15 setup and structure
  - Basic styling patterns with Tailwind CSS
  - Card-based layout approach

## Key Features

### Frontend
- Server-side rendering (SSR) with Next.js
- Real-time search and filtering
- Interactive Leaflet maps
- Responsive design (mobile/tablet/desktop)
- Form validation with Zod
- TypeScript for type safety

### Backend
- RESTful API with Next.js routes
- File-based JSON database
- Server actions for mutations
- CRUD operations
- Error handling

### Dynamic Interactions
1. **Search & Filter** - Real-time service filtering
2. **Interactive Maps** - Click markers to view details
3. **Service Creation** - Form with map location picker
4. **Authentication** - Simple login system
5. **View Tracking** - Automatic view counter

## Project Structure

```

sgdirectory/
├── src/
│ ├── app/ # Next.js App Router
│ │ ├── api/ # Backend API routes
│ │ ├── create/ # Service creation page
│ │ ├── map/ # Map view page
│ │ ├── service/[id]/ # Service detail page
│ │ └── page.tsx # Home page
│ ├── components/ # React components
│ │ ├── ui/ # Reusable UI components
│ │ ├── LocationPicker.tsx # Map location selector
│ │ ├── ServiceCard.tsx # Service display card
│ │ ├── ServiceMap.tsx # Map component
│ │ └── ...
│ ├── lib/ # Utilities & actions
│ │ ├── actions.ts # Server actions
│ │ ├── validation.ts # Form validation
│ │ └── utils.ts # Helper functions
│ ├── types/ # TypeScript types
│ └── data/ # JSON database
│ └── services.json # Data storage
├── TECHNOLOGY_CHOICES.md # Tech stack justification
├── TESTING.md # Testing documentation
└── README.md # This file

```## Technology Stack

| Layer             | Technology             | Purpose               |
|-------------------|------------------------|-----------------------|
| **Frontend**      | Next.js 16, React 19   | UI framework with SSR |
| **Styling**       | Tailwind CSS v4        | Utility-first CSS     |
| **Language**      | TypeScript 5           | Type safety           |
| **Maps**          | Leaflet, React Leaflet | Interactive maps      |
| **Validation**    | Zod                    | Schema validation     |
| **Backend**       | Next.js API Routes     | RESTful endpoints     |
| **Database**      | JSON file (fs)         | Persistent storage    |
| **UI Components** | Radix UI, Lucide Icons | Accessible components |

**Why this stack?** See [TECHNOLOGY_CHOICES.md]

## Testing the Application

### Pre-loaded Demo Data
5 sample services included:
- Professional Surfing Lessons
- Beachfront Accommodation
- Local Food Tours
- Beach Yoga Classes
- Airport Shuttle Service

### Test Scenarios

**1. Search Services**
```

1. Type "Ruben" in search bar → Press Enter
2. Should show only services created by Ruben

```text

**2. Filter by Category**
```

1. Click "Food" category pill
2. Should show only food services
3. Click "X" to reset

```text

**3. View Service Details**
```

1. Click "View Details" on any service
2. Should show full service page with map

```text

**4. Create New Service**
```

1. Click "Login" (enter test name/email)
2. Click "Add Service"
3. Fill form and click map to set location
4. Submit form
5. Service appears on home page
6. Persists after page refresh

```text

**5. Responsive Design**
```

Desktop: 3-column grid
Tablet: 2-column grid
Mobile: 1-column grid

````text

## API Endpoints

### GET /api/services
Fetch all services with optional filtering

**Query Parameters:**
- `query` - Search term
- `category` - Filter by category

**Example:**
```bash
GET /api/services?query=surf&category=surfing
````

### GET /api/services/[id]

Fetch single service by ID

### POST /api/services/create

Create new service listing

**Request Body:**

```json
{
  "title": "Service Title",
  "description": "Description...",
  "category": "surfing",
  "location": { "lat": -34.0489, "lng": 24.9087 },
  "priceRange": "moderate",
  "contactMethod": "whatsapp",
  "contactDetails": "+27 82 555 1234"
}
```

## Testing

See [TESTING.md] for:

- Manual test cases
- Browser compatibility
- Responsive design testing
- API endpoint testing

## Deployment

### Vercel

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# Deploy on Vercel
# 1. Go to vercel.com
# 2. Import GitHub repo
# 3. Click Deploy
```

### Alternative: Netlify

```bash
npm run build
# Deploy .next folder to Netlify
```

## Additional Documentation

- **Technology Choices**: [TECHNOLOGY_CHOICES.md]
- **Testing Guide**: [TESTING.md]

## Academic Requirements for Project Submission

Frontend: HTML/CSS/JavaScript (React/Next.js)  
Backend: Node.js with Next.js API Routes  
Dynamic Aspects: Search, maps, creation, auth  
Responsive Design: Mobile/tablet/desktop  
Frontend-Backend Communication: Multiple endpoints  
Browser-based: Standard web application  
Code Documentation: JSDoc throughout  
Design Choices: Documented in separate file  
Installation: Complete setup guide

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## Notes

- **Authentication**: Demo system using localStorage (not production-ready)
- **Database**: JSON file (production would use PostgreSQL/MongoDB)
- **Images**: URL-based (production would have file upload)

## License

Academic coursework submission.

## Author

**Ruben Cloete**  
Submitted for IU Project Course: Java and Web development
October 2025

---

**Questions?** See TESTING.md
