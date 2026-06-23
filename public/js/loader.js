document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById('preloader');
    const skeleton = document.querySelector('.skeleton-container');

    const isFirstVisit = !localStorage.getItem('visitedOnce');

    if (isFirstVisit) {
        // Mark as visited
        localStorage.setItem('visitedOnce', 'true');

        // Show preloader + lock scroll
        if (preloader) preloader.style.display = 'block';
        if (skeleton) skeleton.style.opacity = 1;
        document.body.classList.add('overflow-hidden');

        // Let CSS run first part, then JS progress
        setTimeout(() => {
            startPreloader();
        }, 5000);
    } else {
        // Second visit → nothing to show
        if (preloader) preloader.remove();
        if (skeleton) skeleton.style.display = 'none';
        document.body.classList.remove('overflow-hidden');
    }
});

function startPreloader() {
    const bar = document.querySelector('.progress-bar');
    const counter = document.querySelector('.count');

    if (bar) bar.classList.add('js-active');
    if (counter) counter.classList.add('js-active');

    let i = 30; // CSS already did 0–30
    updateProgress(i);

    const interval = setInterval(() => {
        i++;
        updateProgress(i);

        if (i >= 100) {
            clearInterval(interval);
            finishPreloader();
        }
    }, 30);

    function updateProgress(value) {
        const bar = document.querySelector('.progress-bar');
        const counter = document.querySelector('.count');
        if (bar) bar.style.width = value + '%';
        if (counter) counter.textContent = value + '%';
    }
}

function finishPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.remove(); // remove permanently
    document.body.classList.remove('overflow-hidden');
}