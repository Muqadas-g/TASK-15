// Enhanced FAQ data with categories
const faqData = [
    {
        question: "What is the purpose of this website?",
        answer: "This website is designed to provide information about our services and help users find answers to common questions through this FAQ section.",
        category: "General",
        helpful: 0,
        unhelpful: 0
    },
    {
        question: "How do I create an account?",
        answer: "To create an account, click on the 'Sign Up' button in the top right corner of the page and follow the registration process by providing your email address and creating a password.",
        category: "Account",
        helpful: 0,
        unhelpful: 0
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for certain services.",
        category: "Payments",
        helpful: 0,
        unhelpful: 0
    },
    {
        question: "How can I reset my password?",
        answer: "If you've forgotten your password, click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to reset your password.",
        category: "Account",
        helpful: 0,
        unhelpful: 0
    },
    {
        question: "Is there a mobile app available?",
        answer: "Yes, we have a mobile app available for both iOS and Android devices. You can download it from the App Store or Google Play Store.",
        category: "General",
        helpful: 0,
        unhelpful: 0
    },
    {
        question: "What is your refund policy?",
        answer: "We offer a 30-day money-back guarantee for all our premium services. If you're not satisfied, you can request a refund within 30 days of purchase.",
        category: "Payments",
        helpful: 0,
        unhelpful: 0
    }
];

// DOM elements
const faqList = document.getElementById('faqList');
const searchBox = document.getElementById('searchBox');
const themeToggle = document.getElementById('themeToggle');
const expandAllBtn = document.getElementById('expandAll');
const collapseAllBtn = document.getElementById('collapseAll');
const faqCategories = document.getElementById('faqCategories');

// Current category filter
let currentCategory = "All";

// Initialize FAQ section
function initFAQ() {
    // Load theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = 'Light Mode';
    }

    renderCategories();
    renderFAQs();
    loadFeedback();
}

// Render categories
function renderCategories() {
    const categories = ["All", ...new Set(faqData.map(item => item.category))];

    faqCategories.innerHTML = categories.map(category => `
        <button class="category-btn ${category === currentCategory ? 'active' : ''}" 
                data-category="${category}">
            ${category}
        </button>
    `).join('');

    // Add event listeners to category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderFAQs();
        });
    });
}

// Render FAQ items
function renderFAQs(faqs = faqData) {
    // Filter by category
    let filteredFAQs = currentCategory === "All"
        ? faqs
        : faqs.filter(faq => faq.category === currentCategory);

    // Filter by search term if exists
    const searchTerm = searchBox.value.toLowerCase();
    if (searchTerm) {
        filteredFAQs = filteredFAQs.filter(faq =>
            faq.question.toLowerCase().includes(searchTerm) ||
            faq.answer.toLowerCase().includes(searchTerm)
        );
    }

    faqList.innerHTML = '';

    if (filteredFAQs.length === 0) {
        faqList.innerHTML = '<div class="no-results">No questions found matching your search.</div>';
        return;
    }

    filteredFAQs.forEach((faq, index) => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        faqItem.dataset.id = index;
        faqItem.innerHTML = `
            <div class="faq-question">
                <h3>${faq.question}</h3>
                <div class="faq-icon">+</div>
            </div>
            <div class="faq-answer">
                <p>${faq.answer}</p>
                <button class="copy-btn" data-answer="${faq.answer.replace(/"/g, '&quot;')}">Copy</button>
                <div class="feedback-btns">
                    <span>Was this helpful?</span>
                    <button class="feedback-btn" data-helpful="true">👍 ${faq.helpful}</button>
                    <button class="feedback-btn" data-helpful="false">👎 ${faq.unhelpful}</button>
                </div>
            </div>
        `;

        faqItem.addEventListener('click', (e) => {
            // Don't toggle if clicking on buttons inside
            if (e.target.tagName === 'BUTTON') return;

            // Close all other items first
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });

            // Toggle current item
            faqItem.classList.toggle('active');
        });

        faqList.appendChild(faqItem);
    });

    // Add event listeners to new buttons
    addButtonEventListeners();
}

// Add event listeners to dynamic buttons
function addButtonEventListeners() {
    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const answer = btn.dataset.answer;
            navigator.clipboard.writeText(answer.replace(/&quot;/g, '"'));
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.textContent = 'Copy';
            }, 2000);
        });
    });

    // Feedback buttons
    document.querySelectorAll('.feedback-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const faqItem = btn.closest('.faq-item');
            const faqId = parseInt(faqItem.dataset.id);
            const isHelpful = btn.dataset.helpful === 'true';

            if (isHelpful) {
                faqData[faqId].helpful++;
            } else {
                faqData[faqId].unhelpful++;
            }

            saveFeedback();
            renderFAQs();
        });
    });
}

// Save feedback to localStorage
function saveFeedback() {
    localStorage.setItem('faqFeedback', JSON.stringify(faqData));
}

// Load feedback from localStorage
function loadFeedback() {
    const savedFeedback = localStorage.getItem('faqFeedback');
    if (savedFeedback) {
        const parsedFeedback = JSON.parse(savedFeedback);
        faqData.forEach((faq, index) => {
            if (parsedFeedback[index]) {
                faq.helpful = parsedFeedback[index].helpful || 0;
                faq.unhelpful = parsedFeedback[index].unhelpful || 0;
            }
        });
    }
}

// Search functionality
searchBox.addEventListener('input', (e) => {
    renderFAQs();
});

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('darkMode', isDarkMode);
});

// Expand all FAQs
expandAllBtn.addEventListener('click', () => {
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.add('active');
    });
});

// Collapse all FAQs
collapseAllBtn.addEventListener('click', () => {
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const activeElement = document.activeElement;

    // Only handle keyboard events when focus is on FAQ items
    if (activeElement.closest('.faq-item')) {
        const currentItem = activeElement.closest('.faq-item');
        const allItems = Array.from(document.querySelectorAll('.faq-item'));
        const currentIndex = allItems.indexOf(currentItem);

        switch (e.key) {
            case 'Enter':
                currentItem.click();
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (currentIndex < allItems.length - 1) {
                    allItems[currentIndex + 1].focus();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (currentIndex > 0) {
                    allItems[currentIndex - 1].focus();
                }
                break;
            case 'Escape':
                currentItem.classList.remove('active');
                break;
        }
    }
});

// Initialize FAQ section
initFAQ();