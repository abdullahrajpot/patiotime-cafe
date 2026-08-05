# Admin Panel Mobile Navigation

## Overview
The admin panel now includes a mobile-friendly hamburger menu for accessing all tabs on small screens.

## Features

### Desktop View (> 900px)
- Fixed sidebar on the left (260px wide)
- Always visible navigation
- All tabs accessible via sidebar buttons

### Mobile/Tablet View (≤ 900px)
- **Fixed Header**: Black header bar at the top with logo and hamburger icon
- **Hamburger Menu**: Three-line icon (☰) in top-right corner
- **Slide-down Menu**: Taps open a full-width overlay menu
- **Easy Navigation**: Large touch-friendly buttons for each tab

## Mobile Menu Components

### 1. Header Bar
- **Position**: Fixed at top of screen
- **Height**: 60px (55px on very small screens)
- **Background**: Black (#111111)
- **Content**: 
  - Left: "Pt." logo with "Admin" label
  - Right: Hamburger icon (☰)

### 2. Hamburger Button
- **Icon**: ☰ (closed) / ✕ (open)
- **Size**: 44x44px (touch-friendly)
- **Action**: Toggles menu overlay

### 3. Menu Overlay
- **Background**: Semi-transparent black overlay
- **Effect**: Dims the content behind
- **Action**: Tap outside menu to close

### 4. Navigation Menu
- **Background**: White
- **Animation**: Slides down from top
- **Buttons**: 5 large navigation buttons
  - 📊 Dashboard
  - 📦 Orders
  - 🍽️ Menu Items
  - 📅 Reservations
  - ✉️ Contacts
- **Active State**: Gold background with white text
- **Back to Site**: Link at bottom to return to main website

## User Experience

### Opening the Menu
1. User taps hamburger icon (☰)
2. Menu slides down from top
3. Overlay appears behind menu
4. Icon changes to close (✕)

### Selecting a Tab
1. User taps any navigation button
2. Content switches to selected tab
3. Menu automatically closes
4. User sees the selected tab content

### Closing the Menu
- Tap the close icon (✕)
- Tap anywhere outside the menu
- Select any navigation item

## Technical Details

### State Management
```javascript
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
```

### Responsive Behavior
- **> 900px**: Mobile header hidden, sidebar shown
- **≤ 900px**: Sidebar hidden, mobile header shown
- **≤ 600px**: Smaller mobile header (55px)

### CSS Classes
- `.admin-mobile-header` - Fixed header bar
- `.mobile-menu-toggle` - Hamburger button
- `.admin-mobile-nav-overlay` - Dark overlay background
- `.admin-mobile-nav` - White menu container
- `.admin-mobile-nav-item` - Individual navigation buttons

### Animations
- **fadeIn**: 0.2s ease for overlay
- **slideDown**: 0.3s ease for menu panel

## Accessibility
- ✅ Touch targets minimum 44x44px
- ✅ ARIA label on hamburger button
- ✅ Clear visual feedback for active state
- ✅ Keyboard accessible (button elements)
- ✅ Tap outside to close

## Styling

### Navigation Buttons
- **Default**: White background, gray border
- **Hover**: Light gray background, gold border
- **Active**: Gold background, white text
- **Size**: Full width with 16px padding
- **Font**: 15px on tablet, 14px on mobile
- **Icons**: 20px on tablet, 18px on mobile

### Colors
- Header Background: #111111 (black)
- Menu Background: #ffffff (white)
- Active Button: #c5a059 (gold)
- Overlay: rgba(0, 0, 0, 0.5) (50% black)

## Testing

Test the mobile menu at these breakpoints:
- **900px**: Menu appears
- **600px**: Smaller mobile version
- **400px**: Ultra-compact version

### Test Actions
1. ✅ Open menu with hamburger
2. ✅ Close menu with X
3. ✅ Close menu by tapping overlay
4. ✅ Switch between tabs
5. ✅ Verify active state updates
6. ✅ Check "Back to Site" link works

## Browser Support
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari (iOS)
- ✅ Mobile browsers

## Future Enhancements
- [ ] Swipe gestures to open/close
- [ ] Badge indicators for new orders/reservations
- [ ] Quick actions in menu
- [ ] Settings/profile option

---

**Implementation Date**: January 2025  
**Responsive Breakpoint**: 900px  
**Mobile Header Height**: 60px (55px on small mobile)
