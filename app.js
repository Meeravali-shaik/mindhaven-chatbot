// MindHaven - Mental Health Support Chatbot JavaScript

class MindHaven {
    constructor() {
        this.conversationHistory = [];
        this.currentBreathingExercise = null;
        this.breathingTimer = null;
        this.userEmotionalState = null;
        this.sessionStartTime = new Date();
        
        // Crisis keywords for detection
        this.crisisKeywords = [
            'suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead',
            'self harm', 'hurt myself', 'cut myself', 'hopeless', 'no point',
            'give up', 'can\'t go on'
        ];
        
        // Emotional keywords for context
        this.emotionalKeywords = {
            anxiety: ['anxious', 'worried', 'panic', 'nervous', 'overwhelmed', 'stressed'],
            depression: ['sad', 'depressed', 'empty', 'numb', 'hopeless', 'worthless'],
            stress: ['stressed', 'pressure', 'overwhelmed', 'busy', 'exhausted'],
            anger: ['angry', 'frustrated', 'mad', 'furious', 'annoyed'],
            lonely: ['lonely', 'alone', 'isolated', 'no one understands']
        };
        
        this.therapeuticData = {
            breathingExercises: [
                {
                    name: "4-7-8 Breathing",
                    description: "A calming breath technique that helps reduce anxiety",
                    steps: [
                        "Sit or lie in a comfortable position",
                        "Place your tongue against the roof of your mouth behind your front teeth",
                        "Exhale completely through your mouth",
                        "Close your mouth and inhale through your nose for 4 counts",
                        "Hold your breath for 7 counts",
                        "Exhale through your mouth for 8 counts",
                        "Repeat 3-4 times"
                    ]
                },
                {
                    name: "Box Breathing",
                    description: "A structured breathing technique used by Navy SEALs to stay calm",
                    steps: [
                        "Sit comfortably with your back straight",
                        "Exhale all air from your lungs",
                        "Inhale slowly through your nose for 4 counts",
                        "Hold your breath for 4 counts",
                        "Exhale slowly through your mouth for 4 counts",
                        "Hold empty for 4 counts",
                        "Repeat 4-6 times"
                    ]
                }
            ],
            mindfulnessExercises: [
                {
                    name: "5-4-3-2-1 Grounding",
                    description: "A sensory grounding technique to bring you back to the present",
                    steps: [
                        "Notice 5 things you can see around you",
                        "Notice 4 things you can touch",
                        "Notice 3 things you can hear",
                        "Notice 2 things you can smell",
                        "Notice 1 thing you can taste"
                    ]
                },
                {
                    name: "Mindful Breathing",
                    description: "A simple 5-minute breathing meditation",
                    steps: [
                        "Find a comfortable seated position",
                        "Close your eyes or soften your gaze",
                        "Notice your natural breath without changing it",
                        "When your mind wanders, gently return to your breath",
                        "Continue for 5 minutes, being kind to yourself"
                    ]
                }
            ],
            journalingPrompts: [
                "What am I feeling right now, and what might have triggered this emotion?",
                "What is one thing I'm grateful for today, even if it's small?",
                "What would I tell a friend who was going through what I'm experiencing?",
                "What thoughts keep coming up for me, and are they helpful or unhelpful?",
                "What is one small step I can take today to care for myself?"
            ],
            validationResponses: [
                "That sounds really difficult. It makes complete sense that you'd feel this way.",
                "I can hear how much you're struggling right now. Your feelings are completely valid.",
                "What you're going through sounds overwhelming. Anyone in your situation would feel stressed.",
                "It takes courage to share what you're experiencing. I'm here to listen and support you.",
                "Your emotions are telling you something important. Let's explore this together."
            ],
            supportiveResponses: [
                "You're not alone in feeling this way. Many people struggle with similar challenges.",
                "It's okay to not be okay. Taking things one moment at a time is perfectly fine.",
                "You've shown strength by reaching out today. That's an important step.",
                "Healing isn't linear, and it's normal to have ups and downs.",
                "You deserve compassion and support, especially from yourself."
            ]
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.displayInitialGreeting();
        this.setupTextareaAutoResize();
    }
    
    setupEventListeners() {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            messageInput.addEventListener('input', () => {
                this.updateSendButtonState();
            });
        }
        
        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }
        
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
        
        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal:not(.hidden)');
                if (openModal) {
                    this.closeModal(openModal.id);
                }
            }
        });
    }
    
    setupTextareaAutoResize() {
        const textarea = document.getElementById('messageInput');
        if (textarea) {
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
            });
        }
    }
    
    updateSendButtonState() {
        const input = document.getElementById('messageInput');
        const button = document.getElementById('sendButton');
        if (input && button) {
            button.disabled = !input.value.trim();
        }
    }
    
    displayInitialGreeting() {
        setTimeout(() => {
            const greeting = `Hello there, I'm MindHaven. 🌟 I'm here to provide a safe, supportive space for you to share what's on your mind.

I want you to know that this is a judgment-free zone where your feelings and experiences are completely valid. Whether you're dealing with stress, anxiety, sadness, or just need someone to listen, I'm here for you.

How are you feeling today? You can share as much or as little as you'd like.`;
            
            this.displayBotMessage(greeting);
        }, 1000);
    }
    
    sendMessage() {
        const input = document.getElementById('messageInput');
        if (!input) return;
        
        const message = input.value.trim();
        
        if (!message) return;
        
        // Display user message
        this.displayUserMessage(message);
        input.value = '';
        input.style.height = 'auto';
        this.updateSendButtonState();
        
        // Add to conversation history
        this.conversationHistory.push({
            type: 'user',
            content: message,
            timestamp: new Date()
        });
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Process message and generate response
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.hideTypingIndicator();
            this.displayBotMessage(response);
        }, 1500 + Math.random() * 1000); // Random delay for more natural feel
    }
    
    generateResponse(userMessage) {
        const lowercaseMessage = userMessage.toLowerCase();
        
        // Crisis detection
        if (this.detectCrisis(lowercaseMessage)) {
            return this.generateCrisisResponse();
        }
        
        // Detect emotional state
        const emotionalState = this.detectEmotionalState(lowercaseMessage);
        this.userEmotionalState = emotionalState;
        
        // Generate contextual response
        return this.generateContextualResponse(userMessage, emotionalState);
    }
    
    detectCrisis(message) {
        return this.crisisKeywords.some(keyword => message.includes(keyword));
    }
    
    generateCrisisResponse() {
        return `I'm really concerned about what you're sharing with me, and I want you to know that your life has value and meaning. What you're feeling right now is temporary, even though it might not feel that way.

Please reach out for immediate support:
• Call or text 988 (Suicide & Crisis Lifeline) - available 24/7
• Text HOME to 741741 (Crisis Text Line)
• If you're in immediate danger, please call 911

You don't have to go through this alone. There are people who want to help and support you. Would you like me to provide more professional resources, or is there someone you trust that you could reach out to right now?`;
    }
    
    detectEmotionalState(message) {
        for (const [emotion, keywords] of Object.entries(this.emotionalKeywords)) {
            if (keywords.some(keyword => message.includes(keyword))) {
                return emotion;
            }
        }
        return 'general';
    }
    
    generateContextualResponse(message, emotionalState) {
        const validationResponse = this.getRandomResponse(this.therapeuticData.validationResponses);
        const supportiveResponse = this.getRandomResponse(this.therapeuticData.supportiveResponses);
        
        let specificResponse = '';
        
        switch (emotionalState) {
            case 'anxiety':
                specificResponse = `It sounds like anxiety is making things feel really intense right now. Those worried thoughts can be so consuming and exhausting. 

Would you like to try a quick breathing exercise together? Sometimes focusing on our breath can help create a little space between us and those anxious feelings. Or if you'd prefer, we could explore some grounding techniques to help bring you back to the present moment.`;
                break;
                
            case 'depression':
                specificResponse = `I hear the heaviness in what you're sharing. Depression can make everything feel so much harder, like you're carrying an invisible weight. Please know that what you're experiencing is real and valid.

Sometimes when we're feeling this low, even small acts of self-care can feel overwhelming. Would it help to talk through some gentle ways to care for yourself today? Or perhaps explore some thoughts through journaling?`;
                break;
                
            case 'stress':
                specificResponse = `It sounds like you're juggling a lot right now, and that pressure can feel overwhelming. Stress has a way of making everything feel urgent and impossible to manage.

Let's see if we can find some ways to help you feel a bit more grounded. Would you be interested in trying a brief relaxation exercise, or would you prefer to talk through what's feeling most overwhelming right now?`;
                break;
                
            case 'anger':
                specificResponse = `Those feelings of anger make complete sense given what you're dealing with. Anger often shows up when we feel hurt, frustrated, or when our boundaries have been crossed.

It's important to acknowledge these feelings rather than push them away. Would you like to explore what might be underneath the anger, or would some techniques for managing intense emotions be helpful right now?`;
                break;
                
            case 'lonely':
                specificResponse = `Loneliness can feel so isolating and painful. Even when we're surrounded by people, we can still feel deeply alone and misunderstood. That disconnect is really hard.

I want you to know that reaching out today took courage, and you're not as alone as you might feel. While I can't replace human connection, I'm here to listen and support you. Would it help to explore ways to nurture connection with others, or would you prefer to focus on self-compassion for now?`;
                break;
                
            default:
                specificResponse = `Thank you for sharing that with me. I can sense there's a lot going on for you right now. 

I'm here to listen and support you in whatever way feels most helpful. Would you like to explore some coping strategies, talk more about what you're experiencing, or maybe try a mindfulness exercise together?`;
        }
        
        return `${validationResponse}

${specificResponse}

${supportiveResponse}`;
    }
    
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    displayUserMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    displayBotMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        messageDiv.innerHTML = message.replace(/\n/g, '<br>');
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add to conversation history
        this.conversationHistory.push({
            type: 'bot',
            content: message,
            timestamp: new Date()
        });
    }
    
    showTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.classList.remove('hidden');
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
    }
    
    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.classList.add('hidden');
        }
    }
    
    // Modal functions
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
        
        // Stop any breathing exercises
        if (modalId === 'breathingModal' && this.breathingTimer) {
            clearTimeout(this.breathingTimer);
            this.breathingTimer = null;
        }
    }
    
    // Quick action functions
    startBreathingExercise() {
        this.showModal('breathingModal');
        this.displayBreathingExercise();
    }
    
    displayBreathingExercise() {
        const container = document.getElementById('breathingExercise');
        if (!container) return;
        
        const exercise = this.therapeuticData.breathingExercises[0]; // 4-7-8 breathing
        
        container.innerHTML = `
            <h4>${exercise.name}</h4>
            <p>${exercise.description}</p>
            
            <div class="breathing-circle" id="breathingCircle">
                <div class="breathing-counter" id="breathingCounter">Ready?</div>
            </div>
            
            <div class="breathing-instruction" id="breathingInstruction">
                Click "Start" when you're ready to begin
            </div>
            
            <div class="breathing-controls">
                <button class="btn btn--primary" onclick="window.mindHaven.startBreathingCycle()">Start</button>
                <button class="btn btn--secondary" onclick="window.mindHaven.stopBreathingExercise()">Stop</button>
            </div>
            
            <div style="margin-top: 20px; font-size: 14px; color: var(--color-text-secondary);">
                <strong>Instructions:</strong>
                ${exercise.steps.map(step => `<div>• ${step}</div>`).join('')}
            </div>
        `;
    }
    
    startBreathingCycle() {
        const circle = document.getElementById('breathingCircle');
        const counter = document.getElementById('breathingCounter');
        const instruction = document.getElementById('breathingInstruction');
        
        if (!circle || !counter || !instruction) return;
        
        let phase = 0; // 0: inhale, 1: hold, 2: exhale
        let count = 0;
        const phases = [
            { name: 'Inhale', duration: 4, class: 'inhale' },
            { name: 'Hold', duration: 7, class: 'inhale' },
            { name: 'Exhale', duration: 8, class: 'exhale' }
        ];
        
        const runCycle = () => {
            const currentPhase = phases[phase];
            instruction.textContent = currentPhase.name;
            circle.className = `breathing-circle ${currentPhase.class}`;
            
            const phaseTimer = setInterval(() => {
                count++;
                counter.textContent = count;
                
                if (count >= currentPhase.duration) {
                    clearInterval(phaseTimer);
                    count = 0;
                    phase = (phase + 1) % phases.length;
                    
                    if (phase === 0) {
                        // Complete cycle, continue or stop
                        this.breathingTimer = setTimeout(runCycle, 500);
                    } else {
                        this.breathingTimer = setTimeout(runCycle, 500);
                    }
                }
            }, 1000);
        };
        
        runCycle();
    }
    
    stopBreathingExercise() {
        if (this.breathingTimer) {
            clearTimeout(this.breathingTimer);
            this.breathingTimer = null;
        }
        
        const circle = document.getElementById('breathingCircle');
        const counter = document.getElementById('breathingCounter');
        const instruction = document.getElementById('breathingInstruction');
        
        if (circle) circle.className = 'breathing-circle';
        if (counter) counter.textContent = 'Ready?';
        if (instruction) instruction.textContent = 'Click "Start" when you\'re ready to begin';
    }
    
    showGroundingExercise() {
        const exercise = this.therapeuticData.mindfulnessExercises[0]; // 5-4-3-2-1 grounding
        const response = `Let's try the ${exercise.name} technique together. This can help bring you back to the present moment when you're feeling overwhelmed.

${exercise.description}

Here's how we'll do it:
${exercise.steps.map(step => `• ${step}`).join('\n')}

Take your time with each step. There's no rush. Just notice what comes up for you without judgment. When you're ready, you can share how that felt, or we can try something else.`;
        
        this.displayBotMessage(response);
    }
    
    showJournalingPrompt() {
        const prompts = this.therapeuticData.journalingPrompts;
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        
        const response = `Journaling can be a wonderful way to process our thoughts and feelings. Here's a prompt that might help you explore what you're experiencing:

"${randomPrompt}"

You don't have to share your thoughts with me if you don't want to - sometimes just writing things down for ourselves can be really helpful. But if you'd like to talk through anything that comes up, I'm here to listen.

Take as much time as you need with this. There are no right or wrong answers.`;
        
        this.displayBotMessage(response);
    }
    
    showProfessionalResources() {
        this.showModal('resourcesModal');
    }
    
    showCrisisResources() {
        this.showModal('crisisModal');
    }
}

// Global functions for HTML onclick handlers
function showCrisisResources() {
    if (window.mindHaven) {
        window.mindHaven.showCrisisResources();
    }
}

function showProfessionalResources() {
    if (window.mindHaven) {
        window.mindHaven.showProfessionalResources();
    }
}

function startBreathingExercise() {
    if (window.mindHaven) {
        window.mindHaven.startBreathingExercise();
    }
}

function showGroundingExercise() {
    if (window.mindHaven) {
        window.mindHaven.showGroundingExercise();
    }
}

function showJournalingPrompt() {
    if (window.mindHaven) {
        window.mindHaven.showJournalingPrompt();
    }
}

function closeModal(modalId) {
    if (window.mindHaven) {
        window.mindHaven.closeModal(modalId);
    }
}

function sendMessage() {
    if (window.mindHaven) {
        window.mindHaven.sendMessage();
    }
}

function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Sorry, your browser does not support voice recognition.');
        return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
        document.getElementById('micButton').classList.add('listening');
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('messageInput').value = transcript;
    };

    recognition.onerror = function(event) {
        alert('Voice recognition error: ' + event.error);
    };

    recognition.onend = function() {
        document.getElementById('micButton').classList.remove('listening');
    };

    recognition.start();
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.mindHaven = new MindHaven();
    
    // Auto-focus on message input
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.focus();
    }
});

function addBotMessage(text) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.innerHTML = `
        <span class="bot-icon">🧠</span>
        <span class="bot-text">${text}</span>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}