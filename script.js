'use strict';

// PENTING: Dalam JavaScript, bulan dihitung dari 0-11. Jadi bulan 6 adalah Juli.
const BIRTHDAY = new Date(2025, 6, 2); 

const preBirthdayContainer = document.getElementById('pre-birthday-container');
const mainContent = document.getElementById('main-content');
const countdownElement = document.getElementById('countdown');
const smallCountdownElement = document.getElementById('small-countdown');

function showCountdown() {
    preBirthdayContainer.style.display = 'flex';
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = BIRTHDAY - now;
        if (distance < 0) {
            clearInterval(countdownInterval);
            window.location.reload();
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
}

function triggerBirthdaySurprise() {
    mainContent.style.display = 'block';
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

// --- FUNGSI BARU UNTUK HITUNG MUNDUR KECIL ---
// Fungsi ini akan menghitung mundur ke ulang tahun di tahun berikutnya.
function startSmallCountdown() {
    const nextBirthday = new Date(BIRTHDAY);
    // Karena fungsi ini hanya dipanggil pada atau setelah hari H,
    // kita bisa langsung set target ke tahun depan.
    nextBirthday.setFullYear(BIRTHDAY.getFullYear() + 1);

    setInterval(() => {
        const current = new Date().getTime();
        const distance = nextBirthday - current;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Menampilkan countdown lengkap di header
        smallCountdownElement.innerHTML = `Next special day: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000); // Update setiap detik
}


// === FUNGSI UTAMA YANG MENGATUR TAMPILAN HALAMAN (DIPERBARUI) ===
function handlePageLoad() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const birthdayDay = new Date(BIRTHDAY.getFullYear(), BIRTHDAY.getMonth(), BIRTHDAY.getDate());
    
    preBirthdayContainer.style.display = 'none';
    mainContent.style.display = 'none';

    if (today < birthdayDay) {
        showCountdown();
    } else {
        // Jika hari ini adalah hari H atau sudah lewat
        if (today.getTime() === birthdayDay.getTime()) {
            triggerBirthdaySurprise();
        } else {
            showMainContent();
        }
        // Jalankan fitur interaktif dan countdown kecil
        initInteractiveFeatures();
        startSmallCountdown(); // <-- FUNGSI BARU DIPANGGIL DI SINI
    }
}

// === KUMPULAN FITUR INTERAKTIF (FILTER, ANIMASI, DLL) - TIDAK BERUBAH ===
function initInteractiveFeatures() {
    // 1. Logika untuk Filter Galeri
    const filterButtons = document.querySelectorAll('.filter-btn');
    const photoItems = document.querySelectorAll('.photo-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterValue = button.getAttribute('data-filter');
            photoItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 2. Logika untuk Animasi Saat Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 }); 

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => observer.observe(el));
    
    // 3. Logika untuk Animasi Snoopy Terbang
    const snoopyPlane = document.getElementById('flying-snoopy');
    if (snoopyPlane) {
        function startFlight() {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const startEdge = Math.floor(Math.random() * 4);
            let startX, startY, endX, endY;
            const buffer = 150;

            switch (startEdge) {
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
            snoopyPlane.animate([
                { left: startX + 'px', top: startY + 'px' },
                { left: endX + 'px', top: endY + 'px' }
            ], { duration: flightDuration, easing: 'linear' });

            setTimeout(startFlight, flightDuration);
        }
        startFlight();
    }

    // Letakkan kode ini di dalam fungsi initInteractiveFeatures() atau di akhir file

const musicPlayer = document.getElementById('music-player');
const audio = document.getElementById('background-audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = playPauseBtn.querySelector('.play-icon');
const pauseIcon = playPauseBtn.querySelector('.pause-icon');

let isPlaying = false;

// Fungsi untuk Play/Pause musik
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    } else {
        // Browser modern butuh interaksi user untuk memutar audio pertama kali
        audio.play().catch(error => console.log("Autoplay ditolak:", error));
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }
    isPlaying = !isPlaying;
}

// Event listener untuk tombol Play/Pause
playPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Mencegah klik menyebar ke #music-player
    togglePlay();
});

// Event listener untuk melebarkan/mengecilkan
musicPlayer.addEventListener('click', () => {
    musicPlayer.classList.toggle('expanded');
});

// Event listener untuk saat audio benar-benar mulai/berhenti
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

// Jalankan fungsi utama saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', handlePageLoad);