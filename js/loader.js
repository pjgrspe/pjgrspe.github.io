function showLoader() {
    const loaders = document.querySelectorAll('.full-screen-loader');
    loaders.forEach(loader => loader.classList.remove('hidden'));

    const wrapper = document.getElementById('wrapper');
    wrapper.style.marginTop = document.getElementById('loader-wrapper').offsetHeight + 'px';

}

function hideLoader() {
    const loaders = document.querySelectorAll('.full-screen-loader');
    loaders.forEach(loader => loader.classList.add('hidden'));
    document.getElementById('wrapper').style.marginTop = '0';

    startAnimation();
}

// Example Usage (integrate with your page load logic)
showLoader(); // Show on initial page load

// ... Later, when content is ready ...
hideLoader(); 

function preventScroll(event) {
    event.preventDefault();
}

// Disable scrolling
document.body.classList.add('disable-scroll');

// Enable scrolling after 4 seconds
setTimeout(() => {
    document.body.classList.remove('disable-scroll');
}, 4000); // 4000 milliseconds = 4 seconds