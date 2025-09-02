// iPS Consulting Interactive Customer Service Team Agent
class iPSChatbot {
    constructor() {
        this.isOpen = false;
        this.userData = {};
        this.conversationStep = 'greeting';
        this.sessionId = this.generateSessionId();
        this.emailjsReady = false;
        
        // Initialize EmailJS for chatbot with retry logic
        this.initEmailJS();
        
        this.init();
    }
    
    initEmailJS() {
        // Try to initialize EmailJS immediately
        if (typeof emailjs !== 'undefined') {
            try {
                emailjs.init("JvnKL8PuiWCmeCLpE");
                this.emailjsReady = true;
                console.log('Chatbot EmailJS initialized successfully');
            } catch (error) {
                console.error('Error initializing EmailJS:', error);
            }
        } else {
            // If EmailJS not ready, wait a bit and try again
            console.log('EmailJS not ready, will retry...');
            setTimeout(() => this.initEmailJS(), 1000);
        }
    }

    generateSessionId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `session_${timestamp}_${random}`;
    }

    init() {
        // Check if user has dismissed the chat in the last 24 hours
        const dismissedTime = localStorage.getItem('ips-chat-dismissed');
        if (dismissedTime && (Date.now() - parseInt(dismissedTime)) < 24 * 60 * 60 * 1000) {
            return; // Don't show chat if dismissed recently
        }

        this.createChatElements();
        this.bindEvents();
        
        // Show chat button after 30 seconds
        setTimeout(() => {
            this.showChatButton();
        }, 30000);
    }

    createChatElements() {
        // Chat button
        const chatButton = document.createElement('div');
        chatButton.id = 'ips-chat-button';
        chatButton.innerHTML = `
            <div class="chat-button-content">
                <i class="fas fa-comments"></i>
                <span>Chat with us</span>
                <div class="notification-dot"></div>
            </div>
        `;
        document.body.appendChild(chatButton);

        // Chat window
        const chatWindow = document.createElement('div');
        chatWindow.id = 'ips-chat-window';
        chatWindow.innerHTML = `
            <div class="chat-header">
                <div class="chat-header-info">
                    <div class="chat-avatar">
                        <span>iPS</span>
                    </div>
                    <div>
                        <h4>Customer Service Team</h4>
                        <span class="status">Online & Ready to Help</span>
                    </div>
                </div>
                <button id="ips-chat-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chat-messages" id="ips-chat-messages"></div>
            <div class="chat-input-area" id="ips-chat-input-area">
                <div class="typing-indicator" id="ips-typing" style="display: none;">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        document.body.appendChild(chatWindow);

        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #ips-chat-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                display: none;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            #ips-chat-button:hover {
                transform: scale(1.05);
            }

            .chat-button-content {
                background: linear-gradient(135deg, #1E3A8A 0%, #059669 100%);
                color: white;
                padding: 16px 24px;
                border-radius: 50px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: 'Inter', sans-serif;
                font-weight: 500;
                position: relative;
            }

            .chat-button-content i {
                font-size: 18px;
            }

            .notification-dot {
                position: absolute;
                top: -2px;
                right: -2px;
                width: 12px;
                height: 12px;
                background: #EA580C;
                border-radius: 50%;
                border: 2px solid white;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            #ips-chat-window {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 384px;
                height: 500px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                z-index: 1001;
                display: none;
                flex-direction: column;
                font-family: 'Inter', sans-serif;
                overflow: hidden;
            }

            @media (max-width: 480px) {
                #ips-chat-window {
                    width: 90vw;
                    height: 80vh;
                    bottom: 10px;
                    right: 5vw;
                }
            }

            .chat-header {
                background: linear-gradient(135deg, #1E3A8A 0%, #059669 100%);
                color: white;
                padding: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .chat-header-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .chat-avatar {
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 14px;
            }

            .chat-header h4 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .status {
                font-size: 12px;
                opacity: 0.9;
            }

            #ips-chat-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: background-color 0.2s;
            }

            #ips-chat-close:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .chat-messages {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .message {
                max-width: 80%;
                padding: 12px 16px;
                border-radius: 18px;
                font-size: 14px;
                line-height: 1.4;
            }

            .message.bot {
                background: #F3F4F6;
                color: #374151;
                align-self: flex-start;
                border-bottom-left-radius: 6px;
            }

            .message.user {
                background: linear-gradient(135deg, #1E3A8A 0%, #059669 100%);
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 6px;
            }

            .quick-actions {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-top: 12px;
            }

            .quick-action-btn {
                padding: 10px 16px;
                background: white;
                border: 2px solid #1E3A8A;
                color: #1E3A8A;
                border-radius: 12px;
                cursor: pointer;
                font-size: 13px;
                transition: all 0.2s;
                text-align: left;
            }

            .quick-action-btn:hover {
                background: #1E3A8A;
                color: white;
            }

            .chat-input-area {
                padding: 16px;
                border-top: 1px solid #E5E7EB;
            }

            .chat-input {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #E5E7EB;
                border-radius: 12px;
                font-size: 14px;
                font-family: 'Inter', sans-serif;
                resize: none;
                outline: none;
                transition: border-color 0.2s;
            }

            .chat-input:focus {
                border-color: #1E3A8A;
            }

            .chat-send-btn {
                background: linear-gradient(135deg, #1E3A8A 0%, #059669 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 500;
                margin-top: 8px;
                width: 100%;
                transition: opacity 0.2s;
            }

            .chat-send-btn:hover {
                opacity: 0.9;
            }

            .typing-indicator {
                display: flex;
                gap: 4px;
                padding: 12px 16px;
                align-items: center;
            }

            .typing-indicator span {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #9CA3AF;
                animation: typing 1.4s infinite ease-in-out;
            }

            .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
            .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

            @keyframes typing {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    showChatButton() {
        const button = document.getElementById('ips-chat-button');
        if (button) {
            button.style.display = 'block';
            setTimeout(() => {
                button.style.animation = 'slideInUp 0.5s ease-out';
            }, 100);
        }
    }

    bindEvents() {
        // Chat button click
        document.addEventListener('click', (e) => {
            if (e.target.closest('#ips-chat-button')) {
                this.openChat();
            }
            
            if (e.target.closest('#ips-chat-close')) {
                this.closeChat();
            }

            if (e.target.closest('.quick-action-btn')) {
                const action = e.target.closest('.quick-action-btn').dataset.action;
                const type = e.target.closest('.quick-action-btn').dataset.type;
                this.handleQuickAction(action, type);
            }
        });

        // Submit button clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.chat-send-btn')) {
                this.handleInput();
            }
        });

        // Enter key in input
        document.addEventListener('keypress', (e) => {
            if (e.target.closest('.chat-input') && e.key === 'Enter') {
                e.preventDefault();
                this.handleInput();
            }
        });
    }

    openChat() {
        const button = document.getElementById('ips-chat-button');
        const window = document.getElementById('ips-chat-window');
        
        button.style.display = 'none';
        window.style.display = 'flex';
        this.isOpen = true;

        // Start conversation
        this.startConversation();
    }

    closeChat() {
        const button = document.getElementById('ips-chat-button');
        const window = document.getElementById('ips-chat-window');
        
        window.style.display = 'none';
        button.style.display = 'block';
        this.isOpen = false;

        // Mark as dismissed for 24 hours
        localStorage.setItem('ips-chat-dismissed', Date.now().toString());
    }

    startConversation() {
        this.addMessage("Hi! I'm with the iPS Customer Service Team. We help organizations transform their risk management and compliance programs. What's your name?", 'bot');
        this.showTextInput('Enter your name...');
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('ips-chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTyping() {
        document.getElementById('ips-typing').style.display = 'flex';
    }

    hideTyping() {
        document.getElementById('ips-typing').style.display = 'none';
    }

    showTextInput(placeholder) {
        const inputArea = document.getElementById('ips-chat-input-area');
        inputArea.innerHTML = `
            <div class="typing-indicator" id="ips-typing" style="display: none;">
                <span></span><span></span><span></span>
            </div>
            <textarea class="chat-input" placeholder="${placeholder}" rows="1"></textarea>
            <button class="chat-send-btn">Send Message</button>
        `;
    }

    showQuickActions(actions, type) {
        const inputArea = document.getElementById('ips-chat-input-area');
        const actionsHtml = actions.map(action => 
            `<button class="quick-action-btn" data-action="${action}" data-type="${type}">${action}</button>`
        ).join('');
        
        inputArea.innerHTML = `
            <div class="typing-indicator" id="ips-typing" style="display: none;">
                <span></span><span></span><span></span>
            </div>
            <div class="quick-actions">${actionsHtml}</div>
        `;
    }

    handleInput() {
        const input = document.querySelector('.chat-input');
        if (!input) return;
        
        const value = input.value.trim();
        if (!value) return;

        this.addMessage(value, 'user');
        this.processUserInput(value);
        input.value = '';
    }

    handleQuickAction(action, type) {
        this.addMessage(action, 'user');
        
        if (type === 'services') {
            this.userData.serviceInterest = action;
            this.askForEmail();
        } else if (type === 'contact') {
            this.userData.contactPreference = action;
            this.finalizeContact();
        }
    }

    processUserInput(input) {
        this.showTyping();
        
        setTimeout(() => {
            this.hideTyping();
            
            switch (this.conversationStep) {
                case 'greeting':
                    this.userData.name = input;
                    this.conversationStep = 'services';
                    this.askAboutInterest();
                    break;
                    
                case 'email':
                    if (this.isValidEmail(input)) {
                        this.userData.email = input;
                        this.conversationStep = 'company';
                        this.askForCompany();
                    } else {
                        this.addMessage("That doesn't look like a valid email address. Could you please enter it again?", 'bot');
                        this.showTextInput('Enter your email address...');
                    }
                    break;
                    
                case 'company':
                    this.userData.company = input;
                    this.conversationStep = 'message';
                    this.askForMessage();
                    break;
                    
                case 'message':
                    this.userData.message = input;
                    this.conversationStep = 'complete';
                    this.sendToEmail();
                    break;
            }
        }, 1500);
    }

    askAboutInterest() {
        this.addMessage(`Nice to meet you, ${this.userData.name}! Which area interests you most?`, 'bot');
        this.showQuickActions([
            'GRC Maturity & Compliance',
            'Third-Party Risk Management', 
            'Technology Risk & Audit',
            'AI Governance & Ethics',
            'Training & Learning Platforms',
            'Language Services',
            'General Consultation'
        ], 'services');
    }

    askForEmail() {
        this.conversationStep = 'email';
        this.addMessage(`Great choice! ${this.userData.serviceInterest} is one of our core specialties. What's the best email to reach you?`, 'bot');
        this.showTextInput('Enter your email address...');
    }

    askForCompany() {
        this.addMessage(`Perfect! What organization are you with?`, 'bot');
        this.showTextInput('Enter your company/organization...');
    }

    askForMessage() {
        this.addMessage(`Thanks! Can you tell me a bit about what you're looking to accomplish or any specific challenges you're facing?`, 'bot');
        this.showTextInput('Describe your needs or questions...');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async sendToEmail() {
        this.addMessage(`Thank you, ${this.userData.name}! I'm preparing your information for our team. They'll reach out to you within 24 hours to discuss how we can help with ${this.userData.serviceInterest}.`, 'bot');
        
        setTimeout(() => {
            this.addMessage("Your inquiry is being sent now...", 'bot');
            
            setTimeout(async () => {
                try {
                    // Check if EmailJS is ready
                    if (!this.emailjsReady && typeof emailjs !== 'undefined') {
                        emailjs.init("JvnKL8PuiWCmeCLpE");
                        this.emailjsReady = true;
                    }
                    
                    if (typeof emailjs === 'undefined') {
                        throw new Error('EmailJS library not loaded');
                    }
                    
                    // Prepare EmailJS template parameters
                    const templateParams = {
                        from_name: this.userData.name,
                        from_email: this.userData.email,
                        company: this.userData.company || 'Not provided',
                        service: this.userData.serviceInterest,
                        message: `${this.userData.message}

[AI Chatbot Submission Details]
Source: AI Chatbot Conversation
Session ID: ${this.sessionId}
Timestamp: ${new Date().toLocaleString()}
User Agent: ${navigator.userAgent}
Page URL: ${window.location.href}`,
                        to_email: 'info@ipsglobalconsulting.com',
                        timestamp: new Date().toLocaleString(),
                        source: 'AI Chatbot'
                    };
                    
                    console.log('Sending chatbot email with params:', templateParams);
                    
                    // Send email using EmailJS
                    const result = await emailjs.send('service_nd74rr8', 'template_co99cdj', templateParams);
                    
                    if (result.status === 200) {
                        this.addMessage(`✅ Perfect! Your information has been successfully sent to our team at info@ipsglobalconsulting.com. We'll be in touch within 24 hours!`, 'bot');
                        
                        setTimeout(() => {
                            this.addMessage("Feel free to browse our services while you wait, or close this chat anytime.", 'bot');
                            
                            // Show final options
                            const inputArea = document.getElementById('ips-chat-input-area');
                            inputArea.innerHTML = `
                                <div class="quick-actions">
                                    <button class="quick-action-btn" onclick="window.location.href='#services'">Browse Our Services</button>
                                    <button class="quick-action-btn" onclick="window.location.href='#clients-served'">See Our Clients</button>
                                    <button class="quick-action-btn" onclick="document.getElementById('ips-chat-close').click()">Close Chat</button>
                                </div>
                            `;
                        }, 1500);
                    } else {
                        throw new Error('EmailJS returned non-200 status: ' + result.status);
                    }
                    
                } catch (error) {
                    console.error('Error sending chatbot email:', error);
                    this.addMessage(`I apologize, but there was an issue sending your information. Please try using our contact form on the website, or email us directly at info@ipsglobalconsulting.com`, 'bot');
                    
                    // Show fallback options
                    const inputArea = document.getElementById('ips-chat-input-area');
                    inputArea.innerHTML = `
                        <div class="quick-actions">
                            <button class="quick-action-btn" onclick="window.location.href='#contact'">Contact Form</button>
                            <button class="quick-action-btn" onclick="window.location.href='mailto:info@ipsglobalconsulting.com'">Send Email</button>
                            <button class="quick-action-btn" onclick="document.getElementById('ips-chat-close').click()">Close Chat</button>
                        </div>
                    `;
                }
            }, 2000);
        }, 1000);
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new iPSChatbot();
});