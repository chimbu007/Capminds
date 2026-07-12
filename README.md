# Capminds - Responsive Appointment Scheduling System

This repository contains a clean, professional, and fully responsive **Appointment Scheduling System** built using vanilla **HTML**, **CSS**, and **JavaScript**.

No external frameworks or libraries (such as React, Angular, Vue, Tailwind CSS, Bootstrap, jQuery, date libraries, or calendar plugins) have been used. All layouts, routing, states, and icons are custom-implemented from scratch.

## Features

### 1. Multi-Page Architecture (SPA Approach)
- Switch seamlessly between the **Appointment Calendar Page** and the **Practice Dashboard Page** via the sidebar navigation.
- Full sidebar state synchronization: collapsible sidebar drawer that matches the Figma navigation system.
- State-preserving view changes—switching tabs keeps your active filters, selected date, and scroll positions intact.

### 2. Interactive Calendar View
- Render a grid-style calendar showing full months, trailing days from the previous month, and leading days of the next month.
- Display appointment cards directly inside calendar cells, showing:
  - Patient Name
  - Doctor Name
  - Appointment Status & Time
- Sub-header controls to navigate months (prev/next), reset to today, or toggle view modes.
- Context filtering by doctor directly from the calendar header.

### 3. Practice Dashboard (Details View)
- A clean, modern table listing all scheduled appointments.
- Search and filter records instantly by:
  - Patient Name
  - Doctor Name
  - From Date
  - To Date
- Full actions support: click to **Edit** (pre-fills the modal) or **Delete** an appointment, updating the calendar and list instantly.

### 4. Interactive Booking Modal
- Double-column, responsive form overlay.
- Dynamic fields: Patient Name, Doctor Name, Hospital, Specialty, Date, Time, and Reason.
- Custom inline SVG icons inside form fields for a high-end visual design.
- Client-side validation: mandatory fields show explicit inline warning messages, focusing fields with validation errors.

### 5. Fully Responsive Mobile Support
- **Desktop/Laptop**: Full multi-column dashboard, collapsible left sidebar, and a full calendar grid layout.
- **Tablet**: Sidebar automatically collapses to icon-only mode to preserve main content viewport width.
- **Mobile Devices (max-width: 768px)**:
  - The sidebar transitions into a floating **Bottom Navigation Bar** for thumb-friendly mobile ergonomics.
  - The calendar grid collapses to display compact status indicator dots instead of large blocks.
  - Selecting a date on the mobile calendar pops open a dedicated **Day Details Drawer** below it, listing all appointments with full CRUD actions.
  - Form grids stack to single-column layouts for ease of thumb typing.

---

## File Structure

```
capmind/
├── index.html        # Main app template (semantic tags, SVG icons, modal dialog)
├── styles.css        # Clean styling system (CSS variables, flex/grid layouts, responsiveness)
├── app.js            # Core JS (calendar logic, CRUD operations, filters, data store)
└── README.md         # Documentation
```

---

## Getting Started

Since the application uses pure front-end technologies without any build steps or backend servers, running the app is simple:

1. **Locally in Browser**:
   Open [index.html](index.html) directly in any modern web browser (Chrome, Firefox, Safari, Edge).
   
2. **With a Local Server (Recommended)**:
   If you have VS Code, you can use the **Live Server** extension, or run a simple local server using Python or Node.js:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (http-server package)
   npx http-server
   ```
   Then navigate to `http://localhost:8000` (or the port specified).

---

## Technical Highlights

- **CSS Custom Variables**: Centralized color tokens, font sizes, margins, shadow styling, and transition speed to make changes easy.
- **Inline SVGs**: No external network calls for icon libraries (like FontAwesome or Google Icons) are made, ensuring fast load times and offline support.
- **Client State**: Appointments are stored in an in-memory array synchronized with the browser's `localStorage` so changes persist across page reloads.
- **Calendar Logic**: Implemented from scratch using standard JS date arithmetic.
