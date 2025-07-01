'use strict';

// PENTING: Dalam JavaScript, bulan dihitung dari 0-11. Jadi bulan 6 adalah Juli.
const BIRTHDAY = new Date(2025, 6, 2); 

const preBirthdayContainer = document.getElementById('pre-birthday-container');
const mainContent = document.getElementById('main-content');
const countdownElement = document.getElementById('countdown');
const smallCountdownElement = document.getElementById('small-countdown');

// --- FUNGSI TRANSISI BARU ---
function handleBirthdayTransition() {
    // 1. Tambahkan kelas fade-out ke halaman countdown
    preBirthdayContainer.classList.add('fade-out');

    // 2. Tunggu animasi fade-out selesai (1.5 detik)
    setTimeout(() => {
        // 3. Sembunyikan halaman countdown secara permanen
        preBirthdayContainer.style.display = 'none';

        // 4. Tampilkan halaman utama dan jalankan semua fiturnya
        mainContent.style.display = 'block';
        mainContent.classList.add('visible'); // Memicu animasi fade-in
        triggerBirthdaySurprise();
        initInteractiveFeatures();
        startSmallCountdown();

    }, 1500); // Sesuaikan waktu ini dengan durasi animasi di CSS (1.5s)
}

function showCountdown() {
    preBirthdayContainer.style.display = 'flex';
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = BIRTHDAY - now;

        // --- INI BAGIAN YANG DIUBAH ---
        if (distance < 1000) { // Berubah dari < 0 menjadi < 1000
            clearInterval(countdownInterval);
            // Panggil fungsi transisi baru, bukan reload halaman
            handleBirthdayTransition(); 
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
}

function showMainContent() {
    mainContent.style.display = 'block';
    mainContent.classList.add('visible'); // Tambahkan juga fade-in di sini
}

function triggerBirthdaySurprise() {
    // Fungsi ini tidak perlu mengubah display lagi, karena sudah diatur
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const pixelShape = confetti.shapeFromPath({ path: 'M0,0 L10,0 L10,10 L0,10 Z' });
    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({ particleCount, startVelocity: 30, spread: 60, origin: { x: 0, y: 0.7 }, shapes: [pixelShape], scalar: 1.2, colors: ['#f0a5d9', '#82a6f5', '#e0e0fc'] });
        confetti({ particleCount, startVelocity: 30, spread: 60, origin: { x: 1, y: 0.7 }, shapes: [pixelShape], scalar: 1.2, colors: ['#f0a5d9', '#82a6f5', '#e0e0fc'] });
    }, 250);
}

function startSmallCountdown() {
    const nextBirthday = new Date(BIRTHDAY);
    nextBirthday.setFullYear(BIRTHDAY.getFullYear() + 1);
    setInterval(() => {
        const current = new Date().getTime();
        const distance = nextBirthday - current;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        smallCountdownElement.innerHTML = `Next special day: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
}

function handlePageLoad() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const birthdayDay = new Date(BIRTHDAY.getFullYear(), BIRTHDAY.getMonth(), BIRTHDAY.getDate());
    
    preBirthdayContainer.style.display = 'none';
    mainContent.style.display = 'none';

    if (today < birthdayDay) {
        showCountdown();
    } else {
        // Jika halaman dibuka saat hari H atau setelahnya
        showMainContent(); // Langsung tampilkan konten utama dengan fade-in
        triggerBirthdaySurprise();
        initInteractiveFeatures();
        startSmallCountdown();
    }
}

function initInteractiveFeatures() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const photoItems = document.querySelectorAll('.photo-item');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterValue = button.getAttribute('data-filter');
            photoItems.forEach(item => {
                item.style.display = (filterValue === 'all' || item.getAttribute('data-category') === filterValue) ? 'block' : 'none';
            });
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    
    const snoopyPlane = document.getElementById('flying-snoopy');
    if (snoopyPlane) {
        function startFlight() {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            let startX, startY, endX, endY;
            const buffer = 150;
            switch (Math.floor(Math.random() * 4)) {
                case 0: startX = Math.random() * screenWidth; startY = -buffer; endX = Math.random() * screenWidth; endY = screenHeight + buffer; break;
                case 1: startX = screenWidth + buffer; startY = Math.random() * screenHeight; endX = -buffer; endY = Math.random() * screenHeight; break;
                case 2: startX = Math.random() * screenWidth; startY = screenHeight + buffer; endX = Math.random() * screenWidth; endY = -buffer; break;
                case 3: startX = -buffer; startY = Math.random() * screenHeight; endX = screenWidth + buffer; endY = Math.random() * screenHeight; break;
            }
            snoopyPlane.style.left = startX + 'px';
            snoopyPlane.style.top = startY + 'px';
            const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
            snoopyPlane.style.transform = `rotate(${angle}deg)`;
            const flightDuration = 8000 + Math.random() * 4000;
            snoopyPlane.animate([{ left: startX + 'px', top: startY + 'px' }, { left: endX + 'px', top: endY + 'px' }], { duration: flightDuration, easing: 'linear' });
            setTimeout(startFlight, flightDuration);
        }
        startFlight();
    }
}

function initMusicPlayer() {
    const musicPlayer = document.getElementById('music-player');
    const audio = document.getElementById('background-audio');
    const playPauseBtn = document.getElementById('play-pause-btn');
    
    if (!musicPlayer || !audio || !playPauseBtn) return;
    
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    let isPlaying = false;

    function togglePlay() {
        if (isPlaying) { audio.pause(); } 
        else { audio.play().catch(error => console.log("Autoplay ditolak oleh browser:", error)); }
    }

    playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });

    musicPlayer.addEventListener('click', () => {
        musicPlayer.classList.toggle('expanded');
    });

    audio.onplay = () => {
        isPlaying = true;
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    };

    audio.onpause = () => {
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    };
}

document.addEventListener('DOMContentLoaded', () => {
    handlePageLoad();
    initMusicPlayer();
});
