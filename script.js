// --- Job Category Filtering ---
const filterTabs = document.querySelectorAll('.filter-tab');
const jobCards = document.querySelectorAll('.job-card');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs
    filterTabs.forEach(t => t.classList.remove('active'));
    // Add active class to clicked tab
    tab.classList.add('active');

    const selectedCategory = tab.textContent.trim().toLowerCase();

    // Filter jobs
    jobCards.forEach(card => {
      const cardCategories = card.getAttribute('data-category').toLowerCase();
      if (selectedCategory === 'all' || cardCategories.includes(selectedCategory)) {
        card.classList.remove('hidden');
        card.classList.add('visible-animated');
      } else {
        card.classList.add('hidden');
        card.classList.remove('visible-animated');
      }
    });
  });
});

// --- Search Bar Functionality ---
const searchInput = document.querySelector('.search-bar input');
const searchBtn = document.querySelector('.search-bar button');
const jobsSection = document.querySelector('.jobs-section');

function performSearch() {
  const query = searchInput.value.trim().toLowerCase();
  
  if (query) {
    // Scroll to jobs section smoothly
    jobsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Reset category tabs to 'All'
    filterTabs.forEach(t => {
      if (t.textContent.trim().toLowerCase() === 'all') {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    // Filter job cards based on search query matching title, company, or category
    jobCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const company = card.querySelector('.company').textContent.toLowerCase();
      const category = card.getAttribute('data-category').toLowerCase();
      
      if (title.includes(query) || company.includes(query) || category.includes(query)) {
        card.classList.remove('hidden');
        card.classList.add('visible-animated');
      } else {
        card.classList.add('hidden');
        card.classList.remove('visible-animated');
      }
    });
  }
}

if (searchBtn && searchInput) {
  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
}

// --- Dynamic Testimonials Carousel ---
const testimonials = [
  {
    quote: "As a fresher, I'd tried multiple platforms, but none made the process this smooth. WorkNest connected me with my dream company in under 2 weeks. The AI matching is incredibly accurate!",
    avatar: "VK",
    avatarBg: "#1A7A5E",
    name: "Vivek Khanna",
    role: "Frontend Developer, Razorpay"
  },
  {
    quote: "Hiring used to take us months. With WorkNest's AI Recruiter, we shortlisted, interviewed, and offered a Senior Node Developer in just 4 days. The quality of candidates is unmatched.",
    avatar: "SR",
    avatarBg: "#7C3AED",
    name: "Shreya Rao",
    role: "HR Director, Google"
  },
  {
    quote: "The interface is so clean and easy to navigate compared to older job portals. I love how I can see exact salaries and verified tags on companies immediately. Highly recommended!",
    avatar: "AM",
    avatarBg: "#FF9900",
    name: "Amit Mishra",
    role: "Product Manager, Flipkart"
  }
];

const testimonialCard = document.querySelector('.testimonial-card');
const dots = document.querySelectorAll('.dot-nav span');
let currentTestimonialIndex = 0;
let carouselInterval;

function showTestimonial(index) {
  if (!testimonialCard) return;
  
  const t = testimonials[index];
  
  // Apply fade-out class or reduce opacity
  testimonialCard.style.opacity = '0';
  testimonialCard.style.transform = 'translateY(10px)';
  testimonialCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

  setTimeout(() => {
    testimonialCard.querySelector('blockquote').textContent = `"${t.quote}"`;
    const avatar = testimonialCard.querySelector('.author-avatar');
    avatar.textContent = t.avatar;
    avatar.style.background = t.avatarBg;
    testimonialCard.querySelector('.author-name').textContent = t.name;
    testimonialCard.querySelector('.author-role').textContent = t.role;
    
    // Fade in
    testimonialCard.style.opacity = '1';
    testimonialCard.style.transform = 'translateY(0)';
    
    // Update dots
    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }, 300);
  
  currentTestimonialIndex = index;
}

function startCarouselTimer() {
  clearInterval(carouselInterval);
  carouselInterval = setInterval(() => {
    let nextIndex = (currentTestimonialIndex + 1) % testimonials.length;
    showTestimonial(nextIndex);
  }, 5000);
}

if (dots.length > 0) {
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showTestimonial(index);
      startCarouselTimer(); // Reset timer on click
    });
  });
  
  // Start auto-play
  startCarouselTimer();
}
