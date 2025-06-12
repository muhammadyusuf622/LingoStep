
document.addEventListener('DOMContentLoaded', () => {

    const textDisplay = document.getElementById('text-display');
    const typingInput = document.getElementById('typing-input');
    let currentPage = 1;
    let currentText = 'The sun sets slowly behind the hill, casting a warm glow over the calm valley.';

    // Sahifa matnini harflarga bo‘lib ko‘rsatish
    function displayText(text) {
        textDisplay.innerHTML = text.split('').map(char => `<span>${char}</span>`).join('');
    }

    // Yozish jarayonini boshqarish
    typingInput.addEventListener('input', () => {
        const inputText = typingInput.value;
        const spans = textDisplay.querySelectorAll('span');
        let isCorrect = true;

        spans.forEach((span, index) => {
            span.classList.remove('correct', 'incorrect', 'current');
            if (index < inputText.length) {
                if (inputText[index] === currentText[index]) {
                    span.classList.add('correct');
                } else {
                    span.classList.add('incorrect');
                    isCorrect = false;
                }
            } else if (index === inputText.length) {
                span.classList.add('current');
            }
        });

        // Agar to‘g‘ri yozilgan bo‘lsa, backendga saqlash
        if (isCorrect && inputText.length === currentText.length) {
            alert('Sahifa muvaffaqiyatli yozildi! (Backend integratsiyasi kerak)');
        }
    });

    // Dastlabki sahifani ko‘rsatish
    displayText(currentText);
});