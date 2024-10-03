$(document).ready(function() {

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

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800);
        }
    });

    // Add active class to navigation links on scroll
    $(window).on('scroll', function() {
        var scrollDistance = $(window).scrollTop();

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