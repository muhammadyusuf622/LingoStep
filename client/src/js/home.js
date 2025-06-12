import customAxios from "./axios";

const languageSelect = document.getElementById("language-select");
const profilImg = document.getElementById('profilImg');
const chatDiv = document.getElementById('chat_click');

function checkToken() {
  customAxios
    .get("/auth/checkToken")
    .then((res) => {
      if (res.data.message == "ok") {
      }
    })
    .catch((err) => {
      if (err.response.data.message == "token_not_found") {
        return (window.location.href = "/index.html");
      }
    });
}
checkToken();

customAxios
  .get("/auth/getUserById")
  .then((res) => {
    profilImg.src = res.data.data.imgUrl
  })
  .catch((err) => {
    console.log(err);
  });

let slideIndex = 0;
const slides = document.querySelectorAll(".slide");

function showSlides() {
  slides.forEach((slide, index) => {
    slide.style.display = index === slideIndex ? "block" : "none";
  });
  slideIndex = (slideIndex + 1) % slides.length;
  setTimeout(showSlides, 3000);
}
showSlides();

const languages = {
  uz: {
    profile: "Profil",
    contact: "Admin",
    "hero-title": "Ingliz tilini oson va qiziqarli o‘rganing!",
    "hero-description":
      "LingoStep bilan o‘z darajangizni tanlang va bugundan boshlang.",
    "level-beginner": "Boshlang‘ich",
    "level-intermediate": "O‘rta",
    "level-advanced": "Yuqori",
    start: "Boshlash",
    "feature-lessons": "📚 Interaktiv Darslar",
    "feature-lessons-desc": "Flashcardlar, videolar va AI yordamida o‘rganing.",
    "feature-tests": "🏆 Viktorina",
    "feature-tests-desc": "Darajangizni aniqlash va bilimlaringizni sinash.",
    "feature-gamification": "✍️ Kitob Yoz",
    "feature-gamification-desc":
      "O'z qo'llaringiz bilan kitob yozing",
    "feature-chat": "💬 Ommaviy Chat",
    "feature-chat-desc":
      "Boshqa o‘quvchilar bilan suhbatlashing va tajriba almashing.",
    "feature-ai": "🤖 AI Tutor",
    "feature-ai-desc":
      "Savollaringizga javob oling va matnlaringizni tuzating.",
    "feature-language": "🎥 Video orqali o'rganish",
    "feature-language-desc": "O‘zbek, rus va ingliz tillarida o‘rganing.",
    "footer-copyright": "© 2025 LingoStep. Barcha huquqlar himoyalangan.",
    "footer-telegram": "Telegram Botga ulanish",
  },
  ru: {
    profile: "Профиль",
    contact: "администратором",
    "hero-title": "Учите английский легко и увлекательно!",
    "hero-description": "Выберите свой уровень с LingoStep и начните сегодня.",
    "level-beginner": "Начинающий",
    "level-intermediate": "Средний",
    "level-advanced": "Продвинутый",
    start: "Начать",
    "feature-lessons": "📚 Интерактивные уроки",
    "feature-lessons-desc": "Учитесь с помощью карточек, видео и ИИ.",
    "feature-tests": "🏆 Контрольный опрос",
    "feature-tests-desc": "Определите свой уровень и проверьте знания.",
    "feature-gamification": "✍️ Написать книгу",
    "feature-gamification-desc":
      "Собирайте баллы, получайте медали и поднимайтесь в таблице лидеров!",
    "feature-chat": "💬 Общий чат",
    "feature-chat-desc":
      "Общайтесь с другими учениками и обменивайтесь опытом.",
    "feature-ai": "🤖 ИИ-репетитор",
    "feature-ai-desc": "Получайте ответы на вопросы и исправляйте тексты.",
    "feature-language": "🎥 Обучение через видео",
    "feature-language-desc": "Учитесь на узбекском, русском или английском.",
    "footer-copyright": "© 2025 LingoStep. Все права защищены.",
    "footer-telegram": "Подключиться к Telegram-боту",
  },
  en: {
    profile: "Profile",
    contact: "Admin",
    "hero-title": "Learn English Easily and Enjoyably!",
    "hero-description": "Choose your level with LingoStep and start today.",
    "level-beginner": "Beginner",
    "level-intermediate": "Intermediate",
    "level-advanced": "Advanced",
    start: "Start",
    "feature-lessons": "📚 Interactive Lessons",
    "feature-lessons-desc": "Learn with flashcards, videos, and AI assistance.",
    "feature-tests": "🏆 Quiz",
    "feature-tests-desc": "Determine your level and test your knowledge.",
    "feature-gamification": "✍️ Write a book",
    "feature-gamification-desc":
      "Earn points, win medals, and climb the leaderboard!",
    "feature-chat": "💬 Community Chat",
    "feature-chat-desc": "Chat with other learners and share experiences.",
    "feature-ai": "🤖 AI Tutor",
    "feature-ai-desc": "Get answers to your questions and improve your texts.",
    "feature-language": "🎥 Learning through video",
    "feature-language-desc": "Learn in Uzbek, Russian, or English.",
    "footer-copyright": "© 2025 LingoStep. All rights reserved.",
    "footer-telegram": "Connect to Telegram Bot",
  },
};

function changeLanguage() {
  const lang = document.getElementById("language-select").value;
  const elements = document.querySelectorAll("[data-lang-key]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-lang-key");
    if (languages[lang][key]) {
      element.textContent = languages[lang][key];
    }
  });
  localStorage.setItem("selectedLanguage", lang);
}

languageSelect.addEventListener('change', () => {
  changeLanguage();
});

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("selectedLanguage") || "uz";
  document.getElementById("language-select").value = savedLang;
  changeLanguage();
});

chatDiv.addEventListener('click', () => {
  return window.location.href = '/pages/chat.html'
})