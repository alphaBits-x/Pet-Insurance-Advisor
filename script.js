// Form submission handling
document.getElementById('insurance-quote').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Show success message with animation
    showNotification('Thank you! We will contact you shortly with your quote.', 'success');
    
    // Add a subtle shake animation to the form
    this.classList.add('shake');
    setTimeout(() => {
        this.classList.remove('shake');
    }, 500);
    
    // Reset form with fade effect
    const inputs = this.querySelectorAll('input, select');
    inputs.forEach((input, index) => {
        setTimeout(() => {
            input.style.opacity = '0';
            input.style.transform = 'translateY(-10px)';
        }, index * 100);
    });
    
    setTimeout(() => {
        this.reset();
        inputs.forEach((input, index) => {
            setTimeout(() => {
                input.style.opacity = '1';
                input.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 500);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Add active state to clicked link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
            
            // Smooth scroll to target
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '1rem 2rem';
    notification.style.borderRadius = '5px';
    notification.style.backgroundColor = type === 'success' ? '#2ecc71' : '#3498db';
    notification.style.color = 'white';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    
    // Add entrance animation
    notification.style.animation = 'slideIn 0.5s ease forwards';
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Mobile menu toggle
const mobileMenuButton = document.createElement('button');
mobileMenuButton.className = 'mobile-menu-button';
mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
document.querySelector('nav').appendChild(mobileMenuButton);

mobileMenuButton.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
    
    // Animate menu button
    mobileMenuButton.classList.toggle('active');
    if (mobileMenuButton.classList.contains('active')) {
        mobileMenuButton.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Chatbot Functionality
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotBox = document.getElementById('chatbotBox');
const closeChat = document.getElementById('closeChat');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendMessage = document.getElementById('sendMessage');
const notificationBadge = document.querySelector('.notification-badge');

// Chatbot state
let chatState = {
    currentQuestion: null,
    petInfo: {
        type: null,
        breed: null,
        age: null,
        gender: null,
        spayedNeutered: null,
        preExistingConditions: null
    },
    questionOrder: ['type', 'breed', 'age', 'gender', 'spayedNeutered', 'preExistingConditions']
};

// Add clear chat button to chatbot header
function addClearChatButton() {
    const chatbotHeader = document.querySelector('.chatbot-header');
    const clearChatButton = document.createElement('button');
    clearChatButton.className = 'clear-chat';
    clearChatButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    clearChatButton.title = 'Clear Chat';
    clearChatButton.addEventListener('click', clearChat);
    chatbotHeader.appendChild(clearChatButton);
}

// Clear chat function
function clearChat() {
    // Clear all messages except the first bot message
    while (chatMessages.children.length > 1) {
        chatMessages.removeChild(chatMessages.lastChild);
    }
    
    // Reset chatbot state
    chatState = {
        currentQuestion: null,
        petInfo: {
            type: null,
            breed: null,
            age: null,
            gender: null,
            spayedNeutered: null,
            preExistingConditions: null
        },
        questionOrder: ['type', 'breed', 'age', 'gender', 'spayedNeutered', 'preExistingConditions']
    };
    
    // Add a message confirming the chat was cleared
    addMessage("Chat history cleared. How can I help you today?", 'bot');
    
    // Show typing animation and ask if user wants to start the questionnaire
    setTimeout(() => {
        const typingDiv = addTypingAnimation();
        setTimeout(() => {
            typingDiv.remove();
            addMessage("Would you like to start the pet insurance questionnaire?", 'bot');
        }, 1000);
    }, 1000);
}

// Chatbot responses
const responses = {
    greeting: [
        "Hello! I'm your pet insurance assistant. Let me help you find the perfect insurance plan for your pet. First, I need to ask you a few questions about your pet.",
        "Hi there! I'm here to help you find the right pet insurance. Let's start by learning a bit about your pet.",
        "Welcome! To provide you with the best insurance recommendations, I'll need some information about your pet."
    ],
    type: [
        "What type of pet do you have? (Dog, Cat, Other)",
        "Is your pet a dog, cat, or something else?",
        "First, let's start with the basics. What kind of pet do you have?"
    ],
    breed: [
        "What is your pet's breed?",
        "Could you tell me your pet's breed?",
        "What breed is your pet?"
    ],
    age: [
        "How old is your pet?",
        "What is your pet's age?",
        "How many years old is your pet?"
    ],
    gender: [
        "What is your pet's gender?",
        "Is your pet male or female?",
        "What gender is your pet?"
    ],
    spayedNeutered: [
        "Is your pet spayed or neutered?",
        "Has your pet been spayed or neutered?",
        "Is your pet fixed (spayed or neutered)?"
    ],
    preExistingConditions: [
        "Does your pet have any pre-existing health conditions?",
        "Are there any health conditions your pet already has?",
        "Does your pet have any ongoing health issues?"
    ],
    coverage: [
        "Most pet insurance plans cover accidents, illnesses, surgeries, medications, diagnostics (like X-rays and blood tests), and emergency care. Many providers also offer optional add-ons for wellness care, including vaccinations, dental cleanings, and annual checkups. Coverage can vary based on the plan and provider, so it's important to review what's included, excluded, and any waiting periods.",
        "Our comprehensive pet insurance covers accidents, illnesses, surgeries, medications, diagnostics (like X-rays and blood tests), and emergency care. We also offer optional wellness add-ons for vaccinations, dental cleanings, and annual checkups. Coverage details vary by plan, so it's important to review inclusions, exclusions, and waiting periods."
    ],
    claims: [
        "The claims process is typically simple: 1) Visit any licensed vet, 2) Pay the bill upfront, 3) Submit a claim online or through the insurer's app—usually requires an itemized invoice, 4) Get reimbursed within a few days to a couple of weeks, depending on the provider.",
        "Filing a claim is straightforward: 1) See any licensed veterinarian, 2) Pay for services at the time of visit, 3) Submit your claim with an itemized invoice through our website or app, 4) Receive reimbursement within days to weeks, depending on the provider."
    ],
    vet: [
        "Most pet insurance plans do not restrict you to a network—you can visit any licensed veterinarian, including specialists and emergency clinics. If you're looking for a new vet, many insurance providers offer a vet finder tool on their website. You can also check reviews, ask for local recommendations, or consult your breeder or rescue organization.",
        "With our pet insurance, you have the freedom to visit any licensed veterinarian, including specialists and emergency clinics. We offer a vet finder tool on our website to help you locate qualified veterinarians in your area. You can also check online reviews, ask for local recommendations, or consult your breeder or rescue organization for vet suggestions."
    ],
    default: [
        "I'm here to help! Could you please provide more details about your question?",
        "I'd be happy to assist you. Could you rephrase your question?"
    ],
    summary: [
        "Thank you for providing information about your pet. Based on what you've told me, I can help you find the right insurance plan. Would you like me to explain the coverage options that would be best for your pet?",
        "Great! Now that I know more about your pet, I can give you personalized insurance recommendations. Would you like to learn about the coverage options that would suit your pet's needs?",
        "Perfect! With this information about your pet, I can help you find the most suitable insurance plan. Would you like me to explain the coverage options that would be ideal for your situation?"
    ]
};

// Toggle chatbot
chatbotToggle.addEventListener('click', () => {
    chatbotBox.classList.add('active');
    notificationBadge.style.display = 'none';
    
    // Add clear chat button if it doesn't exist
    if (!document.querySelector('.clear-chat')) {
        addClearChatButton();
    }
    
    // Start the questionnaire if it's the first time
    if (chatMessages.children.length <= 1) {
        setTimeout(() => {
            askNextQuestion();
        }, 1000);
    }
});

closeChat.addEventListener('click', () => {
    chatbotBox.classList.remove('active');
});

// Send message function
function sendUserMessage() {
    const message = userInput.value.trim();
    if (message) {
        // Add user message
        addMessage(message, 'user');
        
        // Process the answer if we're in a questionnaire
        if (chatState.currentQuestion) {
            processAnswer(message);
        } else {
            // Get and add bot response for general questions
            const response = getBotResponse(message);
            setTimeout(() => addMessage(response, 'bot'), 500);
        }
        
        // Clear input with animation
        userInput.style.transform = 'scale(0.95)';
        setTimeout(() => {
            userInput.value = '';
            userInput.style.transform = 'scale(1)';
        }, 100);
    }
}

// Process the user's answer to the current question
function processAnswer(answer) {
    // Store the answer
    chatState.petInfo[chatState.currentQuestion] = answer;
    
    // Move to the next question
    askNextQuestion();
}

// Ask the next question in the sequence
function askNextQuestion() {
    // Find the next question to ask
    const currentIndex = chatState.questionOrder.indexOf(chatState.currentQuestion);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < chatState.questionOrder.length) {
        // There are more questions to ask
        chatState.currentQuestion = chatState.questionOrder[nextIndex];
        const question = getRandomResponse(responses[chatState.currentQuestion]);
        
        // Show typing animation
        const typingDiv = addTypingAnimation();
        
        // Remove typing animation and show the question after a delay
        setTimeout(() => {
            typingDiv.remove();
            addMessage(question, 'bot');
        }, 1000);
    } else {
        // Questionnaire is complete
        chatState.currentQuestion = null;
        
        // Show typing animation
        const typingDiv = addTypingAnimation();
        
        // Remove typing animation and show the summary after a delay
        setTimeout(() => {
            typingDiv.remove();
            addMessage(getRandomResponse(responses.summary), 'bot');
            
            // Add a follow-up message with options
            setTimeout(() => {
                addMessage("You can ask me about:\n- Coverage details\n- Claims process\n- Finding a vet\n- Or any other questions about pet insurance", 'bot');
                
                // Add option to clear chat
                setTimeout(() => {
                    addMessage("You can also click the trash icon at the top to clear our conversation and start over.", 'bot');
                }, 1000);
            }, 1000);
        }, 1500);
    }
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get bot response for general questions
function getBotResponse(message) {
    message = message.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return getRandomResponse(responses.greeting);
    } else if (message.includes('cover') || message.includes('insurance') || message.includes('plan') || message.includes('what') && message.includes('cover')) {
        return getRandomResponse(responses.coverage);
    } else if (message.includes('claim') || message.includes('reimburse') || message.includes('file')) {
        return getRandomResponse(responses.claims);
    } else if (message.includes('vet') || message.includes('doctor') || message.includes('find') && (message.includes('vet') || message.includes('doctor'))) {
        return getRandomResponse(responses.vet);
    } else if (message.includes('pet') || message.includes('dog') || message.includes('cat')) {
        // If user mentions their pet, start the questionnaire
        chatState.currentQuestion = 'type';
        return getRandomResponse(responses.type);
    } else {
        return getRandomResponse(responses.default);
    }
}

// Get random response from array
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Event listeners for sending messages
sendMessage.addEventListener('click', sendUserMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendUserMessage();
    }
});

// Show notification badge after 5 seconds
setTimeout(() => {
    notificationBadge.style.display = 'flex';
}, 5000);

// Add typing animation to bot messages
function addTypingAnimation() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing';
    typingDiv.innerHTML = '<div class="message-content"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
}

// Enhanced scroll animations
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.benefit-card, .coverage-item, .hero-content, .hero-image, .about-text, .feature');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initialize animation styles
document.querySelectorAll('.benefit-card, .coverage-item, .hero-content, .hero-image, .about-text, .feature').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Add scroll event listener
window.addEventListener('scroll', animateOnScroll);
// Initial check for elements in view
animateOnScroll();

// Add staggered animation for features
document.querySelectorAll('.feature').forEach((feature, index) => {
    feature.style.transitionDelay = `${index * 0.1}s`;
});

// Add hover effects to benefit cards
document.querySelectorAll('.benefit-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = 'var(--shadow-md)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'var(--shadow-sm)';
    });
});

// Add hover effects to coverage items
document.querySelectorAll('.coverage-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-5px)';
        item.style.boxShadow = 'var(--shadow-md)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0)';
        item.style.boxShadow = 'var(--shadow-sm)';
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const hero = document.getElementById('hero');
    const scrollPosition = window.scrollY;
    
    if (hero) {
        hero.style.backgroundPosition = `center ${scrollPosition * 0.1}px`;
    }
});

// Add CSS animation for form shake
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .shake {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .nav-links a.active {
        color: var(--primary);
    }
    
    .nav-links a.active::before {
        width: 100%;
    }
    
    .mobile-menu-button.active {
        transform: rotate(90deg);
    }
    
    @keyframes logoEntrance {
        0% { transform: scale(0.8) rotate(-10deg); opacity: 0; }
        100% { transform: scale(1) rotate(0); opacity: 1; }
    }
    
    .logo-image {
        animation: logoEntrance 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
`;
document.head.appendChild(style);

// Team button functionality
const teamButton = document.getElementById('teamButton');
const teamPopup = document.getElementById('teamPopup');
const closeTeamPopup = document.getElementById('closeTeamPopup');

if (teamButton && teamPopup && closeTeamPopup) {
    teamButton.addEventListener('click', () => {
        teamPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
    });

    closeTeamPopup.addEventListener('click', () => {
        teamPopup.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close popup when clicking outside the content
    teamPopup.addEventListener('click', (e) => {
        if (e.target === teamPopup) {
            teamPopup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && teamPopup.classList.contains('active')) {
            teamPopup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
} 