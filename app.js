document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // MOBILE NAVIGATION MENU
  // ==========================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const mainHeader = document.querySelector('.main-header');

  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isMenuOpen = navMenu.classList.contains('active');
    mobileToggle.innerHTML = isMenuOpen 
      ? '<i class="fa-solid fa-xmark"></i>' 
      : '<i class="fa-solid fa-bars"></i>';
  });

  // Close mobile menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });

  // Change header styling on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      mainHeader.style.padding = '10px 0';
      mainHeader.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
      mainHeader.style.padding = '0';
      mainHeader.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
    }
  });

  // Active section indicator on scroll
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 120) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================================================
  // CURRICULUM TAB SWITCHER
  // ==========================================================================
  const cvToggleBtns = document.querySelectorAll('.cv-toggle-btn');
  const cvTabContents = document.querySelectorAll('.cv-tab-content');

  cvToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update button classes
      cvToggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update content visibility
      cvTabContents.forEach(content => {
        if (content.getAttribute('id') === `tab-${targetTab}`) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });

  // ==========================================================================
  // BLOG DATA RENDER, FILTER & SEARCH
  // ==========================================================================
  const blogGrid = document.getElementById('blogGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('searchInput');

  let articles = [];
  let currentCategory = 'all';
  let searchQuery = '';

  // Render function
  function renderArticles() {
    blogGrid.innerHTML = '';
    
    // Filter articles based on category and search query
    const filteredArticles = articles.filter(article => {
      const matchesCategory = currentCategory === 'all' || article.category === currentCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            article.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filteredArticles.length === 0) {
      blogGrid.innerHTML = `
        <div class="no-results">
          <i class="fa-solid fa-folder-open"></i>
          <p>No se encontraron artículos con esos criterios. Prueba otra búsqueda.</p>
        </div>
      `;
      return;
    }

    filteredArticles.forEach(article => {
      const card = document.createElement('article');
      card.className = 'blog-card';
      card.setAttribute('data-id', article.id);
      
      card.innerHTML = `
        <div class="blog-card-image-wrapper">
          <img src="${article.image}" alt="${article.title}" class="blog-card-image" loading="lazy">
          <span class="blog-card-category">${article.categoryLabel}</span>
        </div>
        <div class="blog-card-content">
          <div class="blog-card-meta">
            <span><i class="fa-regular fa-calendar"></i> ${article.date}</span>
            <span><i class="fa-regular fa-clock"></i> ${article.readTime}</span>
          </div>
          <h3>${article.title}</h3>
          <p>${article.summary}</p>
          <span class="blog-card-link">Leer artículo <i class="fa-solid fa-arrow-right"></i></span>
        </div>
      `;

      // Open Modal Event
      card.addEventListener('click', () => openArticleModal(article));
      
      blogGrid.appendChild(card);
    });
  }

  // Category Filter Events
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderArticles();
    });
  });

  // Search input events
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderArticles();
  });

  // Fetch articles from JSON database and render
  fetch('articles.json')
    .then(response => response.json())
    .then(data => {
      articles = data.articles;
      renderArticles();
    })
    .catch(error => {
      console.error('Error al cargar los artículos del blog:', error);
      blogGrid.innerHTML = `
        <div class="no-results">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p>Hubo un error al cargar los artículos. Por favor, intenta de nuevo más tarde.</p>
        </div>
      `;
    });

  // ==========================================================================
  // ARTICLE READING MODAL
  // ==========================================================================
  const articleModal = document.getElementById('articleModal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  
  const modalMeta = document.getElementById('modalMeta');
  const modalTitle = document.getElementById('modalTitle');
  const modalDate = document.getElementById('modalDate');
  const modalImage = document.getElementById('modalImage');
  const modalBody = document.getElementById('modalBody');

  function openArticleModal(article) {
    modalMeta.innerHTML = `${article.categoryLabel} • ${article.readTime}`;
    modalTitle.textContent = article.title;
    modalDate.innerHTML = `<i class="fa-regular fa-calendar"></i> Publicado el ${article.date}`;
    modalImage.src = article.image;
    modalImage.alt = article.title;
    modalBody.innerHTML = article.content;

    articleModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function closeArticleModal() {
    articleModal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scroll
  }

  modalClose.addEventListener('click', closeArticleModal);
  modalBackdrop.addEventListener('click', closeArticleModal);

  // Close modal on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && articleModal.classList.contains('active')) {
      closeArticleModal();
    }
  });

  // ==========================================================================
  // CONTACT FORM SIMULATION
  // ==========================================================================
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = contactForm.querySelector('.btn-submit');
  const submitBtnText = submitBtn.querySelector('span');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Visual loading state
    submitBtn.disabled = true;
    submitBtnText.textContent = 'Enviando...';
    submitBtn.querySelector('i').className = 'fa-solid fa-spinner fa-spin';

    // Simulate network delay (1.5 seconds)
    setTimeout(() => {
      // Revert button state
      submitBtn.disabled = false;
      submitBtnText.textContent = 'Enviar Mensaje';
      submitBtn.querySelector('i').className = 'fa-solid fa-paper-plane';

      // Show success message
      formStatus.textContent = '¡Gracias! Tu mensaje ha sido enviado correctamente. Me pondré en contacto contigo a la brevedad.';
      formStatus.className = 'form-status success';
      
      // Reset form fields
      contactForm.reset();

      // Clear success banner after 6 seconds
      setTimeout(() => {
        formStatus.style.display = 'none';
        formStatus.className = 'form-status';
        formStatus.textContent = '';
      }, 6000);

    }, 1500);
  });

  // ==========================================================================
  // FAQ ACCORDION
  // ==========================================================================
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains('active');

      // Close all FAQ items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-icon').className = 'fa-solid fa-chevron-down faq-icon';
      });

      // If the clicked item wasn't active, open it
      if (!isActive) {
        faqItem.classList.add('active');
        question.querySelector('.faq-icon').className = 'fa-solid fa-chevron-up faq-icon';
      }
    });
  });
});
