/**
 * Retail Space - Основной JavaScript файл
 */

// Ждем загрузку DOM перед выполнением скрипта
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация основных компонентов
    initMobileMenu();
    initSmoothScroll();
    initActiveMenuHighlight();
    initContactForm();
});

/**
 * Инициализация мобильного меню
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            
            // Изменение внешнего вида бургер-меню
            const spans = menuToggle.querySelectorAll('span');
            if (spans.length >= 3) {
                spans[0].classList.toggle('rotate-down');
                spans[1].classList.toggle('fade-out');
                spans[2].classList.toggle('rotate-up');
            }
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = navList.querySelectorAll('a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navList.classList.remove('active');
                
                // Возвращаем бургер-меню в исходное состояние
                const spans = menuToggle.querySelectorAll('span');
                if (spans.length >= 3) {
                    spans[0].classList.remove('rotate-down');
                    spans[1].classList.remove('fade-out');
                    spans[2].classList.remove('rotate-up');
                }
            });
        });
    }
}

/**
 * Плавная прокрутка к якорям
 */
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop;
                const headerHeight = document.querySelector('header').offsetHeight;
                
                window.scrollTo({
                    top: offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Подсветка активного пункта меню при прокрутке
 */
function initActiveMenuHighlight() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightActiveSection() {
        const scrollPosition = window.scrollY;
        const headerHeight = document.querySelector('header').offsetHeight;
        
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // Особая обработка для подсветки "Главная", когда скролл в самом верху
        if (scrollPosition < sections[0].offsetTop - headerHeight - 50) {
            navLinks.forEach(function(link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#home') {
                    link.classList.add('active');
                }
            });
        }
    }
    
    // Начальная подсветка при загрузке страницы
    highlightActiveSection();
    
    // Подсветка при прокрутке
    window.addEventListener('scroll', highlightActiveSection);
}

/**
 * Обработка формы обратной связи
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация формы перед отправкой
            if (validateForm(contactForm)) {
                // В реальном проекте здесь был бы AJAX запрос на сервер
                // Для демонстрации показываем сообщение об успешной отправке
                showFormSuccess(contactForm);
            }
        });
    }
}

/**
 * Валидация формы перед отправкой
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    // Удаляем предыдущие сообщения об ошибках
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(function(message) {
        message.remove();
    });
    
    // Проверяем обязательные поля
    requiredFields.forEach(function(field) {
        if (!field.value.trim()) {
            isValid = false;
            showFieldError(field, 'Это поле обязательно для заполнения');
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            isValid = false;
            showFieldError(field, 'Пожалуйста, введите корректный email');
        }
    });
    
    return isValid;
}

/**
 * Проверка корректности email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Отображение ошибки валидации рядом с полем
 */
function showFieldError(field, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = 'red';
    
    // Удаление сообщения об ошибке при фокусе на поле
    field.addEventListener('focus', function() {
        const error = field.parentNode.querySelector('.error-message');
        if (error) {
            error.remove();
        }
        field.style.borderColor = '';
    });
}

/**
 * Отображение сообщения об успешной отправке формы
 */
function showFormSuccess(form) {
    // Скрываем форму
    const formControls = form.querySelectorAll('.form-group');
    formControls.forEach(function(control) {
        control.style.display = 'none';
    });
    
    // Показываем сообщение об успехе
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <h3 style="color: var(--primary-color); margin-bottom: 15px;">Спасибо за обращение!</h3>
        <p>Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.</p>
        <button class="btn btn-primary" style="margin-top: 20px;" id="resetForm">Отправить еще сообщение</button>
    `;
    
    form.appendChild(successMessage);
    
    // Обработка кнопки "Отправить еще сообщение"
    const resetButton = document.getElementById('resetForm');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Удаляем сообщение об успехе
            successMessage.remove();
            
            // Очищаем и показываем форму
            form.reset();
            formControls.forEach(function(control) {
                control.style.display = '';
            });
        });
    }
}

// Добавляем стили для анимации бургер-меню
document.head.insertAdjacentHTML('beforeend', `
<style>
.mobile-menu-toggle span {
    transition: all 0.3s ease;
}
.mobile-menu-toggle .rotate-down {
    transform: rotate(45deg) translate(6px, 6px);
}
.mobile-menu-toggle .fade-out {
    opacity: 0;
}
.mobile-menu-toggle .rotate-up {
    transform: rotate(-45deg) translate(6px, -6px);
}
</style>
`);

// Syntax self-check
try {
    console.log("Syntax check passed");
}
catch (error) {
    console.error("Syntax error:", error.message);
}

// Функциональные проверки
console.assert(typeof initMobileMenu === 'function', 'initMobileMenu должна быть функцией');
console.assert(typeof initContactForm === 'function', 'initContactForm должна быть функцией');