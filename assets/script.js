let lastScrollY = window.scrollY;

document.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  document.querySelectorAll(".navbar").forEach(navbar => {
    // Hide saat scroll down, show saat scroll up
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      navbar.style.transform = "translateY(-100%)";
    } else {
      navbar.style.transform = "translateY(0)";
    }

    // Glass effect tetap jalan
    if (currentScrollY > 50) {
      navbar.classList.add(
        "bg-white",
        "border-white/20",
        "shadow-md"
      );
      navbar.classList.remove(
        "bg-transparent",
        "border-transparent",
        "shadow-none"
      );
    } else {
      navbar.classList.remove(
        "bg-white",
        "border-white/20",
        "shadow-md"
      );
      navbar.classList.add(
        "bg-transparent",
        "border-transparent",
        "shadow-none"
      );
    }
  });

  lastScrollY = currentScrollY;
});

function toggleMenu() {
  const menu = document.getElementById('menu-items');
  const navContainer = document.getElementById('nav-container');
  const menuBtn = document.getElementById('hamburger');

  const menuIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>`;
  const closeIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`;

  const isOpen = !menu.classList.contains('hidden');

  menu.classList.toggle('hidden');
  navContainer.classList.toggle('bg-white');

  // Rotate animation
  menuBtn.classList.toggle('rotate-180');
  menuBtn.classList.toggle('-rotate-180');

  setTimeout(() => {
    menuBtn.innerHTML = isOpen ? menuIcon : closeIcon;
  }, 150);
}


// Tambahan: Menutup menu otomatis saat link diklik (untuk Single Page Application)
document.querySelectorAll('#menu-items a').forEach(link => {
  link.addEventListener('click', () => {
    const menu = document.getElementById('menu-items');
    if (!menu.classList.contains('hidden')) {
      toggleMenu();
    }
  });
});


// Galeri Header 
const images = document.querySelectorAll('.slide-img');
let currentIndex = 0;

function showNextImage() {
  // Remove opacity from current image
  images[currentIndex].classList.replace('opacity-100', 'opacity-0');

  // Increment index (loop back to 0 at the end)
  currentIndex = (currentIndex + 1) % images.length;

  // Add opacity to next image
  images[currentIndex].classList.replace('opacity-0', 'opacity-100');
}

// Run every 5000ms (5 seconds)
setInterval(showNextImage, 5000);

// Scroll Reveal Observer
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

reveals.forEach(el => observer.observe(el));

// AI CHATBOT INTEGRATION
const toggleChat = document.getElementById("toggleChat");
const chatWindow = document.getElementById("chatWindow");
const closeChat = document.getElementById("closeChat");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const chips = document.querySelectorAll(".chat-chip");
// AUTO HIDE CHATBOT SAAT FOOTER TERLIHAT
const chatWidget = document.getElementById("toggleChat");
const footer = document.getElementById("footer");

if (chatWidget && footer) {
  const footerObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        // Footer muncul → sembunyikan chatbot
        chatWidget.classList.add("chat-hidden");

        // Optional: tutup chat window kalau lagi terbuka
        if (isChatOpen) {
          toggleChatWidget();
        }
      } else {
        // Footer hilang → tampilkan chatbot lagi
        chatWidget.classList.remove("chat-hidden");
      }
    },
    {
      threshold: 0.15, // 15% footer terlihat
    }
  );

  footerObserver.observe(footer);
}


let isChatOpen = false;

// Toggle Chat
function toggleChatWidget() {
  isChatOpen = !isChatOpen;
  if (isChatOpen) {
    chatWindow.style.display = "flex";
    // Small delay to allow display:flex to apply before opacity transition
    setTimeout(() => {
      chatWindow.classList.remove("opacity-0", "translate-y-10", "scale-95");
      chatWindow.classList.add("opacity-100", "translate-y-0", "scale-100");
      chatInput.focus();
    }, 10);
    toggleChat.classList.add("scale-0", "opacity-0");
  } else {
    chatWindow.classList.remove("opacity-100", "translate-y-0", "scale-100");
    chatWindow.classList.add("opacity-0", "translate-y-10", "scale-95");
    setTimeout(() => {
      chatWindow.style.display = "none";
    }, 300);
    toggleChat.classList.remove("scale-0", "opacity-0");
  }
}

toggleChat.addEventListener("click", toggleChatWidget);
closeChat.addEventListener("click", toggleChatWidget);

// Manual Chat Logic (Offline/Rule-Based)

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = "flex gap-3 " + (sender === "user" ? "flex-row-reverse" : "");

  const avatar = sender === "ai"
    ? `<div class="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0"><img src="./assets/image/logo.png" alt="Smilebox Logo AI" class="w-6 h-6" /></div>`
    : `<div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold shrink-0">U</div>`;

  const bubbleStyle = sender === "ai"
    ? "bg-white/10 border border-white/10 text-gray-800 backdrop-blur-sm rounded-tl-none"
    : "bg-sky-400 text-white rounded-tr-none shadow-md";

  div.innerHTML = `
            ${avatar}
            <div class="${bubbleStyle} p-3 rounded-2xl text-sm max-w-[85%] self-start leading-relaxed">
                ${text}
            </div>
        `;

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const div = document.createElement("div");
  div.id = "typingIndicator";
  div.className = "flex gap-3";
  div.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0"><img src="./assets/image/logo.png" alt="Smilebox Logo AI" class="w-6 h-6" /></div>
            <div class="bg-white/10 border border-white/10 p-3 rounded-2xl rounded-tl-none backdrop-blur-sm flex gap-1 items-center h-10">
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </div>
        `;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typingIndicator");
  if (typing) typing.remove();
}

const KNOWLEDGE_BASE = {
  "halo": "Halo! Selamat datang di Smilebox. Siap membantu kamu menemukan perawatan terbaik untuk senyumanmu.? 👋",
  "hai": "Hai! Ada yang bisa saya bantu?",
  "behel gigi": "Behel gigi membantu merapikan susunan gigi dan memperbaiki fungsi gigitan. Di Smilebox, perawatan behel disesuaikan dengan kondisi gigimu agar hasilnya rapi, nyaman, dan optimal.",
  "tips menjaga gigi": "Menjaga gigi tetap sehat itu penting, lho! Beberapa tips sederhana yang bisa kamu lakukan: Sikat gigi 2× sehari dengan pasta gigi berfluoride, Gunakan benang gigi (dental floss), Kurangi makanan dan minuman manis, Periksa gigi secara rutin setiap 6 bulan Kalau mau tips sesuai kondisi gigimu, aku siap bantu.",
  "jadwal klinik": "Untuk jadwal praktik dokter di Smilebox, kamu bisa bertanya langsung di sini...",
  "layanan smilebox": "Smilebox menyediakan berbagai layanan kesehatan gigi, antara lain: pelayanan umum, perawatan gigi, ortodontik / behel gigi, estetika & kosmetik, bedah mulut, dan pelayanan lain-lainnya. kamu cukup menuliskan kata kuncinya saja 😁 nanti saya akan menjelaskan lebih detailnya ✨.",
  "pelayanan umum": "Smilebox menyediakan pelayanan umum mulai dari konsultasi ringan sampai perawatan rutin. Kami melayani scaling (pembersihan karang gigi), rontgen gigi, hingga perawatan gigi anak dengan pendekatan yang ramah dan nyaman, supaya ke dokter gigi tidak lagi terasa menakutkan.",
  "perawatan gigi": "Gigi bermasalah? Tenang 😊 Kami menangani tambal gigi, perawatan saluran akar, crown, hingga veneer dengan teknik yang aman dan hasil yang tahan lama, agar gigimu kembali berfungsi dengan baik dan tetap nyaman digunakan.",
  "ortodontik": "Layanan ortodontik di Smilebox berfokus pada perawatan kawat gigi (behel) untuk merapikan susunan gigi. Perawatan dilakukan secara bertahap dan disesuaikan dengan kebutuhanmu, agar hasilnya rapi dan senyuman tetap sehat.",
  "estetika & kosmetik gigi": "Senyum cerah bisa meningkatkan rasa percaya diri ✨ Smilebox menyediakan layanan estetika seperti bleaching, gigi palsu, hingga implan gigi. Semua dirancang agar senyummu terlihat lebih sehat, alami, dan menawan.",
  "bedah mulut": "Untuk tindakan lanjutan, Smilebox juga melayani pencabutan gigi dan bedah mulut minor. Prosedur dilakukan secara aman, minim rasa tidak nyaman, dan ditangani oleh tenaga medis berpengalaman.",
  "layanan lainnya": "Selain layanan di klinik, kami juga menangani berbagai masalah penyakit mulut dan menyediakan layanan teledentistry. Kamu bisa berkonsultasi dengan lebih praktis tanpa harus datang langsung ke klinik.",
  "terima kasih": "Sama-sama! Semoga harimu menyenangkan. Jangan ragu bertanya lagi ya! 😊",
  "karang gigi": "Karang gigi adalah plak yang mengeras akibat sisa makanan dan bakteri. Untuk membersihkannya diperlukan tindakan scaling oleh dokter gigi. Di Smilebox, scaling dilakukan dengan aman dan nyaman agar gusi tetap sehat.",
  "scaling": "Scaling adalah prosedur pembersihan karang gigi menggunakan alat khusus. Perawatan ini membantu mencegah bau mulut, radang gusi, dan gigi goyang. Scaling di Smilebox dilakukan secara profesional dan minim rasa tidak nyaman.",
  "pembersihan gigi": "Pembersihan gigi secara rutin penting untuk menjaga kesehatan gusi dan gigi. Smilebox menyediakan layanan pembersihan gigi (scaling) dengan pendekatan yang nyaman dan aman.",
  "bau mulut": "Bau mulut bisa disebabkan oleh karang gigi, sisa makanan, atau masalah gusi. Dengan pembersihan gigi dan perawatan yang tepat di Smilebox, masalah bau mulut bisa ditangani dengan baik.",
  "sakit gigi": "Sakit gigi bisa disebabkan oleh gigi berlubang, infeksi, atau masalah gusi. Di Smilebox, dokter akan melakukan pemeriksaan terlebih dahulu untuk menentukan perawatan yang paling tepat dan nyaman.",
  "gigi berlubang": "Gigi berlubang terjadi akibat bakteri yang merusak lapisan gigi. Smilebox menyediakan perawatan tambal gigi yang rapi, kuat, dan disesuaikan dengan kondisi gigimu.",
  "tambal gigi": "Tambal gigi berfungsi untuk menutup gigi berlubang dan mencegah kerusakan lebih lanjut. Di Smilebox, tambal gigi dilakukan dengan bahan berkualitas agar nyaman dan tahan lama.",
  "rontgen gigi": "Rontgen gigi membantu dokter melihat kondisi gigi dan akar yang tidak terlihat secara langsung. Layanan rontgen di Smilebox digunakan untuk diagnosis yang lebih akurat.",
  "gusi berdarah": "Gusi berdarah bisa menjadi tanda adanya peradangan atau penumpukan karang gigi. Dengan perawatan yang tepat di Smilebox, kesehatan gusi dapat kembali terjaga.",
  "kontrol gigi": "Kontrol gigi secara rutin setiap 6 bulan penting untuk mencegah masalah gigi dan mulut. Smilebox siap membantu menjaga senyummu tetap sehat."
};

async function generateResponse(prompt) {
  // Simulate thinking delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const lowerPrompt = prompt.toLowerCase();

  // Simple keyword matching
  for (const [key, answer] of Object.entries(KNOWLEDGE_BASE)) {
    if (lowerPrompt.includes(key)) {
      return answer;
    }
  }

  // Default Fallback
  return "Maaf, saya masih belajar. Coba tanya tentang 'Behel gigi', 'estetika & kosmetik gigi', 'perawatan gigi', atau 'bedah mulut'. 😊";
}

async function handleSend(e) {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  // User Message
  addMessage(text, "user");
  chatInput.value = "";

  // AI Response
  showTyping();
  const aiResponse = await generateResponse(text);
  removeTyping();
  addMessage(aiResponse, "ai");
}

chatForm.addEventListener("submit", handleSend);

// Quick Chips Logic
chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chatInput.value = chip.innerText;
    handleSend({ preventDefault: () => { } });
  });
});

// Modal Sertifikat
const openModalBtn = document.getElementById("openCertificateModal");
const closeModalBtn = document.getElementById("closeCertificateModal");
const modal1 = document.getElementById("certificateModal");

function closeCertificateModal() {
  modal1.classList.add("hidden");
  modal1.classList.remove("flex");
}

openModalBtn.addEventListener("click", () => {
  modal1.classList.remove("hidden");
  modal1.classList.add("flex");
});

closeModalBtn.addEventListener("click", closeCertificateModal);

// klik area gelap
modal1.addEventListener("click", (e) => {
  if (e.target === modal1) {
    closeCertificateModal();
  }
});

// Modal Dokter
const modal = document.getElementById("doctorModal");
const closeBtn = document.getElementById("closeDoctorModal");
const closeFooterBtn = document.getElementById("closeDoctorModalFooter");

const nameEl = document.getElementById("doctorName");
const roleEl = document.getElementById("doctorRole");
const eduEl = document.getElementById("doctorEdu");
const expEl = document.getElementById("doctorExp");
const descEl = document.getElementById("doctorDesc");
const imgEl = document.getElementById("doctorImg");

function closeDoctorModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

document.querySelectorAll(".openDoctorModal").forEach(btn => {
  btn.addEventListener("click", () => {

    // Nama dengan span
    nameEl.innerHTML = `
      <span class="text-white mulish">${btn.dataset.prefix}</span>
      ${btn.dataset.name}
      <span class="bg-white text-sky-400 px-1 rounded-md inline-block whitespace-nowrap ml-2 mulish">
        ${btn.dataset.spesialis}
      </span>
    `;

    // Role biasa
    roleEl.textContent = btn.dataset.role;
    eduEl.textContent = btn.dataset.edu;
    expEl.textContent = btn.dataset.exp;
    descEl.textContent = btn.dataset.desc;
    imgEl.src = btn.dataset.img;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  });
});


closeBtn.addEventListener("click", closeDoctorModal);
closeFooterBtn.addEventListener("click", closeDoctorModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeDoctorModal();
  }
});


// Modal Booking
const bookingModal = document.getElementById("bookingModal");
const closeBookingModal = document.getElementById("closeBookingModal");

const layananInput = document.getElementById("formLayanan");
const jadwalInput = document.getElementById("formJadwal");
const waktuInput = document.getElementById("formWaktu");

function closeBookingModalFn() {
  bookingModal.classList.add("hidden");
  bookingModal.classList.remove("flex");
}

document.querySelectorAll(".openBookingModal").forEach(btn => {
  btn.addEventListener("click", () => {
    layananInput.value = btn.dataset.layanan;
    jadwalInput.value = btn.dataset.jadwal;
    waktuInput.value = btn.dataset.waktu;

    bookingModal.classList.remove("hidden");
    bookingModal.classList.add("flex");
  });
});

closeBookingModal.addEventListener("click", closeBookingModalFn);

bookingModal.addEventListener("click", (e) => {
  if (e.target === bookingModal) {
    closeBookingModalFn();
  }
});

// Booking form
const bookingForm = document.getElementById("bookingForm");
const whatsappInput = document.getElementById("formWhatsapp");

// Success modal
const successModal = document.getElementById("successModal");
const closeSuccessModal = document.getElementById("closeSuccessModal");

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Validasi sederhana nomor WA
  if (whatsappInput.value.length < 10) {
    alert("Nomor WhatsApp tidak valid");
    return;
  }

  // Tutup modal booking
  closeBookingModalFn();

  // Reset form
  bookingForm.reset();

  // Tampilkan modal sukses
  successModal.classList.remove("hidden");
  successModal.classList.add("flex");
});

// Tutup modal sukses
closeSuccessModal.addEventListener("click", () => {
  successModal.classList.add("hidden");
  successModal.classList.remove("flex");
});

// Klik area gelap
successModal.addEventListener("click", (e) => {
  if (e.target === successModal) {
    successModal.classList.add("hidden");
    successModal.classList.remove("flex");
  }
});


const swiper = new Swiper(".mySwiper", {
  grabCursor: true,

  // Konfigurasi Navigasi
  navigation: {
    nextEl: ".swiper-button-next-custom",
    prevEl: ".swiper-button-prev-custom",
  },

  // Konfigurasi Grid & Gap
  breakpoints: {
    320: {
      slidesPerView: 1.2,
      spaceBetween: 15
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 30
    }
  }
});

// animasi carousel layanan umum & lainnya
let currentSlide = 0;
function moveSlide(direction) {
  const track = document.getElementById('service-track');
  const slides = track.children.length;
  currentSlide = (currentSlide + direction + slides) % slides;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

let startX = 0;
let endX = 0;
const track = document.getElementById("service-track");

track.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

track.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipe() {
  const threshold = 50;

  if (startX - endX > threshold) {
    moveSlide(1); // swipe kiri
  } else if (endX - startX > threshold) {
    moveSlide(-1); // swipe kanan
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") moveSlide(1);
  if (e.key === "ArrowLeft") moveSlide(-1);
});
