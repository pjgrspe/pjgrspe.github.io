$(document).ready(function() {

    let lastScrollTop = 0; // Variable to store the last scroll position
    const header = document.querySelector('.main-header'); // Select the header

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop; // Get current scroll position

        if (scrollTop > lastScrollTop) {
            // Scrolling down
            header.classList.add('header-hidden'); // Hide the header
        } else {
            // Scrolling up
            header.classList.remove('header-hidden'); // Show the header
        }

        lastScrollTop = scrollTop; // Update the last scroll position
    });

    // Initialize animations
    $('.greeting').addClass('animate');
    $('.subtitle').addClass('animate');
    $('.splash-nav').addClass('animate');

    // Handle scroll indicator click
    $('.scroll-indicator').on('click', function() {
        $('html, body').animate({
            scrollTop: $('#about').offset().top
        }, 800);
    });

    // Function to show toast notifications
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        
        // Create a new toast element
        const toast = document.createElement('div');
        toast.classList.add('toast', type);

        // Add icon based on the type of toast
        let iconClass;
        switch (type) {
            case 'success':
                iconClass = 'fas fa-check-circle';
                break;
            case 'error':
                iconClass = 'fas fa-times-circle';
                break;
            case 'warning':
                iconClass = 'fas fa-exclamation-circle';
                break;
            default:
                iconClass = 'fas fa-info-circle';
        }

        toast.innerHTML = `<i class="${iconClass}"></i> ${message}`;
        
        // Append the toast to the container
        toastContainer.appendChild(toast);
    
        // Show the toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
    
        // Automatically remove the toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }
    
    // Smooth scrolling for navigation links
    $('nav ul li a').on('click', function(e) {
        if (this.hash !== '') {
            e.preventDefault();

            const hash = this.hash;
            const headerHeight = $('.main-header').outerHeight(); // Get the height of the header

            // Calculate the target position, accounting for the header height
            const targetPosition = $(hash).offset().top - headerHeight;

            // Animate the scroll to the adjusted position
            $('html, body').animate({
                scrollTop: targetPosition
            }, 800);
        }
    });

    // Add active class to navigation links on scroll
    $(window).on('scroll', function() {
        const headerHeight = $('.main-header').outerHeight(); // Get the height of the header
        const scrollDistance = $(window).scrollTop() + headerHeight; // Adjust scroll distance

        $('section').each(function(i) {
            if ($(this).position().top <= scrollDistance) {
                $('nav ul li a.active').removeClass('active');
                $('nav ul li a').eq(i).addClass('active');
            }
        });
    }).scroll();

    // Prevent multiple form submissions
    var isSubmitting = false;

    // Contact form submission
    $('#contact-form').on('submit', function(e) {
        e.preventDefault();

        // If already submitting, do nothing
        if (isSubmitting) return;

        var name = $('#name').val();
        var email = $('#email').val();
        var message = $('#message').val();

        if (name && email && message) {
            isSubmitting = true; // Prevent further submissions
            $('#submit-btn').prop('disabled', true).text('Sending...'); // Disable button and show loading text

            $.ajax({
                url: 'https://docs.google.com/forms/d/1IRNXN8P8bP-lH3eH8cSQa-SNwbeCjqzKsHbMIVpNRhY/formResponse',
                data: {
                    'entry.915683784': name,
                    'entry.486445772': email,
                    'entry.30802087': message
                },
                type: 'POST',
                dataType: 'xml',  // Expect an XML response from Google Forms
                complete: function(xhr, status) {
                    // Always assume success since Google Forms does not return proper status
                    if (status === 'success' || xhr.status === 0) {
                        showToast('Message sent successfully!', 'success');
                        $('#contact-form')[0].reset();
                    } else {
                        showToast('There was an error, but your message might have been sent.', 'error');
                    }

                    // Re-enable the form and button
                    isSubmitting = false;
                    $('#submit-btn').prop('disabled', false).text('Send Message');
                }
            });
        } else {
            showToast('Please fill out all fields.', 'warning');
        }
    });
      
    // Search and Filter Functionality
    $('#search-input').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        filterProjects(searchTerm, $('#filter-select').val());
    });

    $('#filter-select').on('change', function() {
        const filterTerm = $(this).val();
        filterProjects($('#search-input').val().toLowerCase(), filterTerm);
    });

    function filterProjects(searchTerm, filterTerm) {
        $('#projects article').each(function() {
            const projectTitle = $(this).find('h3').text().toLowerCase();
            const projectCategory = $(this).data('category');

            if ((projectTitle.includes(searchTerm) || searchTerm === '') &&
                (projectCategory === filterTerm || filterTerm === 'all')) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
});

$(document).ready(function() {
    // Toggle navigation menu on hamburger menu click
    $('.hamburger-menu').on('click', function() {
        $('.main-nav').toggleClass('active');
    });

    // Close the menu when a link is clicked
    $('.main-nav ul li a').on('click', function() {
        $('.main-nav').removeClass('active');
    });
});

// Add this to your scripts.js file
function createProjectModal() {
    // Create modal HTML structure if it doesn't exist
    if (!document.getElementById('project-modal')) {
        const modalHTML = `
            <div id="project-modal" class="project-modal">
                <div class="modal-content">
                    <span class="close-modal">
                        <i class="fas fa-times"></i>
                    </span>
                    <div class="modal-header">
                        <h2></h2>
                        <div class="project-meta-info"></div>
                    </div>
                    <div class="carousel-container">
                        <div class="carousel-track"></div>
                        <button class="carousel-button prev">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="carousel-button next">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <div class="carousel-dots"></div>
                    </div>
                    <div class="modal-body">
                        <div class="project-description"></div>
                        <div class="project-details">
                            <div class="technologies-used"></div>
                            <div class="project-links"></div>
                        </div>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Get modal elements
    const modal = document.getElementById('project-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const carousel = modal.querySelector('.carousel-track');
    const prevBtn = modal.querySelector('.carousel-button.prev');
    const nextBtn = modal.querySelector('.carousel-button.next');
    const dotsContainer = modal.querySelector('.carousel-dots');

    let currentSlide = 0;

    // Close modal when clicking close button or outside
    closeBtn.onclick = () => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    };

    // Carousel navigation
    function updateCarousel() {
        const slides = carousel.children;
        const dots = dotsContainer.children;
        
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        Array.from(dots).forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });

        // Show/hide navigation buttons
        prevBtn.style.display = currentSlide === 0 ? 'none' : 'flex';
        nextBtn.style.display = currentSlide === slides.length - 1 ? 'none' : 'flex';
    }

    prevBtn.onclick = () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    };

    nextBtn.onclick = () => {
        const slides = carousel.children;
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            updateCarousel();
        }
    };

    // Initialize modal with project data
    function showProjectModal(projectData) {
        const modalTitle = modal.querySelector('.modal-header h2');
        const metaInfo = modal.querySelector('.project-meta-info');
        const description = modal.querySelector('.project-description');
        const technologies = modal.querySelector('.technologies-used');
        const links = modal.querySelector('.project-links');
        
        // Clear previous content
        carousel.innerHTML = '';
        dotsContainer.innerHTML = '';
        
        // Set content
        modalTitle.textContent = projectData.title;
        metaInfo.textContent = projectData.date;
        description.innerHTML = projectData.description;
        
        // Add images to carousel
        projectData.images.forEach((img, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `<img src="${img}" alt="${projectData.title} slide ${index + 1}">`;
            carousel.appendChild(slide);

            // Create dot for this slide
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
            dot.onclick = () => {
                currentSlide = index;
                updateCarousel();
            };
            dotsContainer.appendChild(dot);
        });

        // Add technologies
        technologies.innerHTML = `
            <h3>Technologies Used</h3>
            <div class="tech-pills">
                ${projectData.technologies.map(tech => `<span class="pill">${tech}</span>`).join('')}
            </div>`;

        // Add links
        links.innerHTML = `
            <div class="project-buttons">
                ${projectData.github ? `
                    <a href="${projectData.github}" class="btn" target="_blank">
                        <i class="fab fa-github"></i> View in GitHub    
                    </a>` : ''}
            </div>`;

        // Show modal
        currentSlide = 0;
        updateCarousel();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    return showProjectModal;
}

// Initialize modal system
const showProjectModal = createProjectModal();

// Update the project click handler
document.querySelectorAll('#projects article').forEach(article => {
    article.addEventListener('click', () => {
      const getData = (attr) => article.dataset[attr] ? JSON.parse(article.dataset[attr]) : [];
      
      const projectData = {
        title: article.querySelector('h3').textContent,
        date: article.querySelector('.project-meta').textContent,
        description: article.querySelector('p').textContent,
        images: getData('images'),
        technologies: getData('technologies'),
        github: article.dataset.github || '#',
        demo: article.dataset.demo || '#'
      };
      
      showProjectModal(projectData);
    });
  });