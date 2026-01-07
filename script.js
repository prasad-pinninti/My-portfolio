// Save and restore theme preference
(function applySavedTheme() {
  try {
    var saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.documentElement.classList.add("theme-light");
    }
  } catch (e) {
    // Ignore if localStorage not available
  }
})();

// Theme toggle button
(function setupThemeToggle() {
  var themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;
  
  themeToggle.addEventListener("click", function () {
    var root = document.documentElement;
    var isLight = root.classList.toggle("theme-light");
    
    // Update button text
    themeToggle.textContent = isLight ? "🌙" : "☀️";
    
    try {
      localStorage.setItem("theme", isLight ? "light" : "dark");
    } catch (e) {
      // Can't save preference, but that's okay
    }
  });
  
  // Set initial button state
  try {
    var saved = localStorage.getItem("theme");
    if (saved === "light") {
      themeToggle.textContent = "🌙";
    } else {
      themeToggle.textContent = "☀️";
    }
  } catch (e) {
    themeToggle.textContent = "☀️";
  }
})();

// Typing animation removed - text displays normally

// Smooth scrolling when clicking navigation links
document.addEventListener("click", function (e) {
  var link = e.target.closest('a[href^="#"]');
  if (!link) return;
  
  var id = link.getAttribute("href").slice(1);
  if (!id) return;
  
  var targetEl = document.getElementById(id);
  if (targetEl) {
    e.preventDefault();
    targetEl.scrollIntoView({ 
      behavior: "smooth", 
      block: "start" 
    });
  }
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Header scroll effect
(function headerScroll() {
  var header = document.querySelector('.site-header');
  if (!header) return;
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
})();

// Floating + View Resume wiring
(function wireResume() {
  var resumeUrl = "resume.pdf";
  var anchors = [document.getElementById("floating-resume"), document.querySelector('#resume a'), document.getElementById("view-resume")];
  anchors.forEach(function (a) {
    if (!a) return;
    a.setAttribute("href", resumeUrl);
    a.setAttribute("download", "Prasad_Pinninti_Resume.pdf");
  });
})();

// Reveal on scroll (normal subtle effects)
(function revealOnScroll(){
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (!items.length) return;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var observer;
  
  if ('IntersectionObserver' in window && !prefersReduced) {
    observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    items.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    function inView(el){
      var rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight - 80 && rect.bottom > 80;
    }
    function update(){
      items.forEach(function(el){
        if (prefersReduced || inView(el)) el.classList.add('is-visible');
      });
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }
})();

// Mobile menu toggle
(function mobileMenu() {
  var toggle = document.getElementById('mobile-menu-toggle');
  var nav = document.getElementById('section-nav');
  if (!toggle || !nav) return;
  
  toggle.addEventListener('click', function() {
    nav.classList.toggle('active');
    var isActive = nav.classList.contains('active');
    toggle.textContent = isActive ? '✕' : '☰';
    toggle.setAttribute('aria-expanded', isActive);
  });
  
  // Close menu when clicking nav links
  var navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 767) {
        nav.classList.remove('active');
        toggle.textContent = '☰';
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();

// Active nav link on scroll
(function activeNavLink() {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');
  
  if (!sections.length || !navLinks.length) return;
  
  function updateActiveLink() {
    var scrollPos = window.scrollY + 150;
    
    sections.forEach(function(section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
})();

// Handle contact form submission and save to Google Sheets
(function contactFormHandler() {
  var form = document.getElementById('contact-form');
  if (!form) return;
  
  // TODO: Replace with your actual Google Apps Script Web App URL
  // How to set it up:
  // 1. Create a new Google Sheet
  // 2. Click Extensions > Apps Script
  // 3. Delete the default code and paste the script from below
  // 4. Click Deploy > New deployment
  // 5. Select "Web app" as type
  // 6. Set "Execute as" to "Me" and "Who has access" to "Anyone"
  // 7. Click Deploy and copy the Web app URL
  // 8. Paste that URL here
  var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxaHtRzM7X0UvImvkvNEVkeuJi_D4m4zPybusVGwBKDDtX1OtsBLUF9agkIIdWSFHPI/exec';
  
  var submitBtn = form.querySelector('.submit-btn');
  var btnText = submitBtn.querySelector('.btn-text');
  var btnLoader = submitBtn.querySelector('.btn-loader');
  var messageDiv = document.getElementById('form-message');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    var formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim(),
      timestamp: new Date().toLocaleString()
    };
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      showMessage('Please fill in all fields.', 'error');
      return;
    }
    
    // Email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }
    
    // Disable submit button and show loading
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    
    // Check if Google Script URL is configured
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
      // Fallback: just show success message (for testing)
      setTimeout(function() {
        showMessage('Form submitted successfully! (Note: Configure Google Sheets URL to save data)', 'success');
        form.reset();
        resetButton();
      }, 1000);
      return;
    }
    
    // Send data to Google Sheets
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then(function() {
      // Since we're using no-cors, we can't read the response
      // But if the request was sent, it likely succeeded
      showMessage('Thank you! Your message has been sent successfully.', 'success');
      form.reset();
      resetButton();
    })
    .catch(function(error) {
      console.error('Error:', error);
      showMessage('Oops! Something went wrong. Please try again later.', 'error');
      resetButton();
    });
  });
  
  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = 'form-message ' + type;
    messageDiv.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(function() {
      messageDiv.style.display = 'none';
    }, 5000);
  }
  
  function resetButton() {
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
  }
})();

/* 
GOOGLE APPS SCRIPT CODE - Copy this to your Google Apps Script editor:

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Message']);
    }
    
    // Append form data
    sheet.appendRow([
      data.timestamp || new Date(),
      data.name,
      data.email,
      data.message
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
*/


