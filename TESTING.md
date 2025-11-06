# Testing Documentation

## Overview

This document outlines all testing performed on SGDirectory to ensure functionality, usability, and responsiveness meet project requirements.

---

## Test Environment

### Hardware & Software

- **Browsers**: Chrome, Firefox, Edge, Arc
- **Operating Systems**: Windows 11 (Untested on macOS or Linux)
- **Screen Sizes**: Desktop (1920x1080, 1366x768), Tablet (768x1024), Mobile (412x914)
- **Development**: Node.js v24.4.0, Next.js v16.0.1

### Test Data

- 5 pre-loaded demo services
- 30+ Test services created during testing
- User accounts created via simple auth
- Location data for Jeffreys Bay (-34.0489, 24.9087)

---

## Functional Testing

### TC-001: View All Services

**Objective**: Verify home page displays all services correctly

**Steps**:

1. Navigate to `http://localhost:3000`
2. Observe service grid

**Expected Result**:

- All services displayed in responsive grid
- Each card shows: title, category, description, image, author, price
- Services load without errors

**Status**: **PASS**

---

### TC-002: Search Functionality

**Objective**: Verify search filters services by keyword

**Steps**:

1. Enter "surf" in search bar
2. Press Enter or click search icon

**Expected Result**:

- URL updates to `/?query=surf`
- Only services matching "surf" displayed in title
- Header shows "Search results for 'surf'"

**Status**: **PASS**

**Test Variations**:

| Search Term | Expected Count | Actual Count | Status |
| ----------- | -------------- | ------------ | ------ |
| "surf"      | 3              | 3            | Pass   |
| "food"      | 1              | 1            | Pass   |
| "mike"      | 1              | 1            | Pass   |
| "xyz123"    | 0              | 0            | Pass   |

---

### TC-003: Category Filtering

**Objective**: Verify category pills filter services correctly

**Steps**:

1. Click "Surfing" category pill
2. Observe filtered results

**Expected Result**:

- URL updates to `/?category=surfing`
- Only surfing services displayed
- Category pill highlighted
- "Clear Filters" button appears

**Status**: **PASS**

---

### TC-004: View Service Details

**Objective**: Verify service detail page loads correctly

**Steps**:

1. Click "View Details" on any service card
2. Observe detail page

**Expected Result**:

- Navigate to `/service/[id]`
- Display: title, description, image, map, author, contact info
- Map shows correct location marker
- View counter increments

**Status**: **PASS**

---

### TC-005: Interactive Map View

**Objective**: Verify map displays all services with markers

**Steps**:

1. Click "View Map" in navigation
2. Observe map page
3. Click on a marker

**Expected Result**:

- Map loads centered on Jeffreys Bay
- All services with locations shown as markers
- Clicking marker shows popup with service details
- Popup includes link to service detail page

**Status**: **PASS**

---

### TC-006: User Login

**Objective**: Verify simple authentication system

**Steps**:

1. Click "Login" button in navigation
2. Enter name: "Test User"
3. Enter email: "<test@example.com>"
4. Click "Login"

**Expected Result**:

- Login form closes
- Avatar displayed
- User data stored in localStorage
- "Add Service" link becomes active

**Status**: **PASS**

---

### TC-007: Create New Service

**Objective**: Verify service creation flow and persistence

**Steps**:

1. Login as test user
2. Navigate to `/create`
3. Fill out form:
   - Title: "Test Service"
   - Category: "surfing"
   - Description: "This is a test service description"
   - Click map to set location
   - Set days of the week
   - Price: "range"
   - Contact: "whatsapp" / "+27 82 555 0000"
4. Submit form

**Expected Result**:

- Success toast appears
- Redirect to home page
- New service visible in service list
- Service persists after page refresh
- Service appears for all users
- Service stored in `src/data/services.json`

**Status**: **PASS**

---

### TC-008: Location Picker

**Objective**: Verify interactive map location selection

**Steps**:

1. Navigate to `/Add Service`
2. Click on the location picker map

**Expected Result**:

- Map loads centered on Jeffreys Bay
- Clicking map places marker
- Coordinates displayed below map
- Selected coordinates saved with service

**Status**: **PASS**

---

### TC-009: Service Persistence

**Objective**: Verify services persist across sessions

**Steps**:

1. Create a new service (TC-008)
2. Note service ID
3. Close browser completely
4. Reopen browser and navigate to home page
5. Search for created service

**Expected Result**:

- Service still visible
- All data intact
- View counter works
- Service accessible via direct URL

**Status**: **PASS**

---

### TC-010: Create New Service (Not Logged In)

**Objective**: Verify service creation does not complete when not logged in

**Steps**:

1. Do not log in
2. Navigate to `/create`
3. Fill out form:
   - Title: "Test Service"
   - Category: "surfing"
   - Description: "This is a test service description"
   - Click map to set location
   - Price: "moderate"
   - Contact: "whatsapp" / "+27 82 555 0000"
4. Submit form

**Expected Result**:

- Please log in toast appears
- Stays on creation page
- No service created

**Status**: **PASS**

---

### TC-011: Approximate Distance Calculation

**Objective**: Verify distance calculation from user location to services

**Steps**:

1. Log in as test user
2. Ensure browser location permission is granted or set to ask.
3. If on ask, allow location access when prompted

**Expected Result**:

- Home page shows distances next to each service (e.g., "5.2 km away")
- Distances are accurate based on user location and service coordinates
- Distances update if user location changes
- Service pages also show distance

**Status**: **PASS**

---

## Responsive Design Testing

### Desktop View (1920x1080)

**Steps**:

1. Open application in full browser window
2. Navigate through all pages

**Expected Result**:

- Services display in 3-column grid
- Map shows full size
- Navigation fully visible
- Forms are well-spaced
- No horizontal scrolling

**Status**: **PASS**

---

### Tablet View (768x1024)

**Steps**:

1. Resize browser to 768px width
2. Or use Chrome DevTools > iPad

**Expected Result**:

- Services display in 2-column grid
- Navigation responsive
- Map remains interactive
- Forms stack appropriately
- Text remains readable

**Status**: **PASS**

---

### Mobile View (412x914)

**Steps**:

1. Use Chrome DevTools > Samsung A51
2. Test all interactions

**Expected Result**:

- Services display in single column
- Navigation collapses appropriately
- Touch-friendly buttons
- Map remains interactive
- Forms easy to fill
- No content cutoff

**Status**: **PASS**

---

## API Endpoint Testing

### API-001: GET /api/services

**Test**: Fetch all services

```bash
curl http://localhost:3000/api/services
```

**Expected**: JSON array of all services  
**Status**: **PASS**

---

### API-002: GET /api/services?query=surf

**Test**: Search services

```bash
curl http://localhost:3000/api/services?query=surf
```

**Expected**: Filtered JSON array  
**Status**: **PASS**

---

### API-003: GET /api/services/[id]

**Test**: Fetch single service

```bash
curl http://localhost:3000/api/services/1
```

**Expected**: Single service JSON object  
**Status**: **PASS**

---

### API-004: POST /api/services/create

**Test**: Create new service

```bash
Invoke-RestMethod -Uri "http://localhost:3000/api/services/create" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"title":"API Test Service","description":"Created via API","category":"tours"}'
```

**Expected**: Created service JSON  
**Status**: **PASS**

### API-005: GET /api/services with location filtering

**Test**: Fetch services with computed distances

```bash
curl "http://localhost:3000/api/services?lat=-34.0489&lng=24.9087&maxDistance=10&sortBy=distance"
```

Expected: JSON array of services with an added numeric `distance` field (km) where applicable; results filtered/sorted by distance when params provided.

Status: MANUAL

**Status**: **PASS**

---

## Browser Compatibility

| Browser | Version | Home | Search | Map | Create | Status   |
| ------- | ------- | ---- | ------ | --- | ------ | -------- |
| Chrome  | 120+    | yes  | yes    | yes | yes    | **PASS** |
| Firefox | 121+    | yes  | yes    | yes | yes    | **PASS** |
| Edge    | 120+    | yes  | yes    | yes | yes    | **PASS** |

---

## Accessibility Testing

### Keyboard Navigation

- Tab through all interactive elements
- Enter/Space activate buttons
- Escape closes modals
- Focus indicators visible

### Color Contrast

- Text contrast meets WCAG AA
- Interactive elements distinguishable
- Error messages clearly visible

---

## Edge Cases & Error Handling

### EC-001: Empty Search

**Test**: Submit search with no query  
**Result**: Shows all services

### EC-002: Invalid Service ID

**Test**: Navigate to `/service/invalid-id`  
**Result**: 404 page displayed

### EC-003: Duplicate Service Creation

**Test**: Create service with same title  
**Result**: Allowed (different IDs)

### EC-004: Missing Form Fields

**Test**: Submit form with empty required fields  
**Result**: Validation errors shown

### EC-005: Invalid Image URL

**Test**: Submit form with broken image link  
**Result**: Form accepts, service shows no image

### EC-006: No Services Match Filter

**Test**: Filter with no results  
**Result**: "No services found" message

---

## Security Testing

### Input Validation

- XSS prevention via React escaping
- SQL injection N/A (no SQL database)
- Form validation with Zod
- TypeScript type checking

### Authentication

- **Note**: Simple demo auth (not production-ready)
- User data stored in localStorage only
- No sensitive data transmitted

---

## Data Persistence Testing

### DP-001: Service Creation Persistence

**Test**: Create service → Restart server → Check service exists  
**Result**: Service persists in JSON file

### DP-002: View Counter Persistence

**Test**: View service → Refresh page → Check view count  
**Result**: Count increases

### DP-003: Multi-User Service Visibility

**Test**: Create service on one browser → Open another browser  
**Result**: Service visible to all users

---

## Known Limitations

1. **Authentication**: Demo system only (not production-ready)
2. **Concurrent Writes**: No file locking (acceptable for portfolio)
3. **Image Upload**: URL-only (no file upload implemented)
4. **Database**: JSON file (production would use PostgreSQL/MongoDB)

---

## Test Summary

| Category   | Total Tests | Passed | Failed | Success Rate |
| ---------- | ----------- | ------ | ------ | ------------ |
| Functional | 10          | 10     | 0      | 100%         |
| Responsive | 3           | 3      | 0      | 100%         |
| API        | 5           | 5      | 0      | 100%         |
| Browser    | 4           | 4      | 0      | 100%         |
| Edge Cases | 6           | 6      | 0      | 100%         |
| **TOTAL**  | **28**      | **28** | **0**  | **100%**     |

---

## Recommendations for Production

1. **Replace localStorage auth** with NextAuth.js or similar
2. **Migrate to PostgreSQL/MongoDB** for scalability
3. **Add file upload** for images (Cloudinary/S3)
4. **Implement rate limiting** on API routes
5. **Add automated tests** (Jest/Playwright)
6. **Set up CI/CD** with GitHub Actions
7. **Add monitoring** (Sentry for errors, Vercel Analytics)

---

## Conclusion

The application successfully meets all academic requirements and passes comprehensive testing across:

- Functional requirements
- Responsive design
- API functionality
- Cross-browser compatibility
- Data persistence
- Error handling

---

_Last Updated: October 16, 2025_  
_Test Lead: Ruben Cloete_
