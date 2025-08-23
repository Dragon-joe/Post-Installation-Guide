# Post-Installation Guide for Operating Systems Website

## 📋 Overview

This is a responsive web application that displays a comprehensive post-installation guide for Windows operating systems. It includes all the essential tools, applications, and utilities you need after installing Windows, organized in an intuitive interface with filtering capabilities and dark/light mode support.

## ✨ Features

- **Dark/Light Mode Toggle** - Switch between themes with persistent user preference
- **Advanced Filtering System** - Filter content by:
  - All items
  - Essential tools
  - Optional applications
  - Developer tools
- **Search Functionality** - Find specific applications quickly
- **Download Links** - Direct download links for all applications
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Visual Feedback** - Hover effects, animations, and visual indicators

## 🛠️ Technologies Used

- HTML5
- CSS3 with CSS Variables for theming
- JavaScript (ES6)
- Font Awesome Icons
- Google Fonts (Poppins)
- SVG background patterns

## 📁 Project Structure

```
post-installation-guide/
├── index.html          # Main HTML file
├── README.md           # Project documentation
└── (no external dependencies)
```

## 🚀 How to Use

1. Simply open the `index.html` file in any modern web browser
2. Use the filter buttons to view specific categories of applications
3. Use the search box to find specific tools
4. Toggle between dark and light mode using the theme switch
5. Click the download buttons to get the applications

## 🎨 Design Features

- **Card-based layout** for easy content organization
- **Smooth animations** and transitions
- **Custom SVG backgrounds** that change with the theme
- **Visual feedback** for interactive elements
- **Clean, modern interface** with attention to detail

## 🔧 Browser Compatibility

This website works on all modern browsers including:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📝 Content Categories

The guide includes the following sections:

1. **Essential Updates & Tools** - Critical software and drivers
2. **Recommended Applications** - Useful programs for daily use
3. **Programming & Development** - Tools for developers
4. **Windows Customization** - Apps to personalize your OS
5. **Developer Tweaks** - Advanced utilities for power users
6. **System Utilities** - Maintenance and optimization tools
7. **Windows ISO Download Guide** - How to get official Windows ISOs

## 🌟 Key JavaScript Features

- Dynamic content rendering based on filters
- Search functionality with highlight matching
- Theme persistence using localStorage
- Responsive event handling
- SVG background switching based on theme

## 📱 Responsive Design

The website is fully responsive and adapts to:
- Desktop screens (1200px+)
- Tablets (768px - 1199px)
- Mobile devices (< 768px)

## 🎯 Accessibility Features

- Proper semantic HTML structure
- Keyboard navigation support
- Sufficient color contrast in both themes
- Clear visual feedback for interactions

## 🔄 Theme System

The website uses CSS custom properties (variables) to manage theming, allowing for easy customization of colors and styles for both light and dark modes.

## 📊 Data Organization

All content is stored in a JavaScript array with the following structure:
```javascript
{
  title: "Category Name",
  icon: "Font Awesome icon class",
  items: [
    { 
      name: "Item Name", 
      type: "item-type", 
      link: "download-url" 
    }
  ]
}
```

## 💡 Customization

To customize the website:
1. Modify the CSS variables in the `:root` and `.dark-mode` selectors to change colors
2. Edit the `data` array in JavaScript to add, remove, or modify content
3. Adjust the breakpoints in the media queries for different responsive behavior

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Youssef Mahmoud** - [Post-Installation Guide for Operating Systems]


