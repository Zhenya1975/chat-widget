// autobot-chat-widget.js v1.0
// AutoPartsPro AI Chat Widget - CDN compatible
// Usage: Include this script and add <div id="autobot-chat-widget"></div> to your page

(function() {
    'use strict';

    class AutoBotChatWidget {
        constructor(options = {}) {
            this.options = {
                apiUrl: options.apiUrl || 'https://kronostech.ru/autopartsbot/api/gigachat/send-message/',
                clearUrl: options.clearUrl || 'https://kronostech.ru/autopartsbot/api/gigachat/clear-context/',
                position: options.position || 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
                theme: options.theme || 'default', // 'default', 'dark', 'light'
                autoOpen: options.autoOpen !== false, // true by default
                ...options
            };

            this.sessionId = null;
            this.isOpen = false;
            this.widget = null;
            this.init();
        }


        validateUrls() {
            // Ensure URLs are absolute
            if (!this.options.apiUrl.startsWith('http')) {
                console.warn('AutoBotChatWidget: apiUrl should be an absolute URL for CDN usage');
            }
            if (!this.options.clearUrl.startsWith('http')) {
                console.warn('AutoBotChatWidget: clearUrl should be an absolute URL for CDN usage');
            }
        }

        init() {
            this.createWidget();
            this.bindEvents();

            if (this.options.autoOpen) {
                setTimeout(() => this.openChat(), 1500);
            }
        }

        createWidget() {
            // Create widget container
            this.widget = document.createElement('div');
            this.widget.id = 'autobot-chat-widget';
            this.widget.innerHTML = this.getWidgetHTML();
            document.body.appendChild(this.widget);

            // Apply styles
            this.applyStyles();
        }

        getWidgetHTML() {
            return `
                <!-- Chat Button -->
                <div class="autobot-chat-button" id="autobotChatButton">
                    <i class="fas fa-robot"></i>
                </div>
                
                <!-- Chat Container -->
                <div class="autobot-chat-container" id="autobotChatContainer">
                    <div class="autobot-chat-header">
                        <div class="autobot-chat-title">
                            <i class="fas fa-robot"></i>
                            <span>AI Консультант</span>
                        </div>
                        <div class="autobot-chat-close" id="autobotChatClose">
                            <i class="fas fa-times"></i>
                        </div>
                    </div>
                    
                    <div class="autobot-chat-messages" id="autobotChatMessages">
                        <div class="autobot-message autobot-ai-message">
                            <strong>Консультант:</strong> Привет!
                            Я могу помочь вам с различными вопросами, связанными с AI-помощниками.
                            О чём хотите поговорить?
                            <div class="autobot-message-time">${this.getCurrentTime()}</div>
                        </div>
                    </div>
                    
                    <div class="autobot-typing-indicator" id="autobotTypingIndicator">
                        <i class="fas fa-spinner fa-spin"></i> Консультант печатает...
                    </div>
                    
                    <div class="autobot-chat-input-container">
                        <div class="autobot-input-group">
                            <input type="text" 
                                   class="autobot-chat-input" 
                                   id="autobotChatInput" 
                                   placeholder="Введите ваше сообщение..."
                                   autocomplete="off">
                            <button class="autobot-send-btn" id="autobotSendButton">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="autobot-chat-actions">
                        <button class="autobot-clear-btn" id="autobotClearButton">
                            <i class="fas fa-trash"></i> Очистить чат
                        </button>
                    </div>
                </div>
            `;
        }

        applyStyles() {
            const styles = `
                <style>
                    .autobot-chat-widget {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    }
                    
                    .autobot-chat-button {
                        position: fixed;
                        ${this.getPosition()}
                        width: 70px;
                        height: 70px;
                        background: linear-gradient(135deg, #8e44ad 0%, #3498db 100%);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 1.8rem;
                        cursor: pointer;
                        box-shadow: 0 10px 25px rgba(142, 68, 173, 0.3);
                        transition: all 0.3s;
                        z-index: 10000;
                        animation: autobot-pulse 2s infinite;
                    }
                    
                    .autobot-chat-button:hover {
                        transform: scale(1.1);
                        animation: none;
                    }
                    
                    @keyframes autobot-pulse {
                        0% { box-shadow: 0 0 0 0 rgba(142, 68, 173, 0.7); }
                        70% { box-shadow: 0 0 0 15px rgba(142, 68, 173, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(142, 68, 173, 0); }
                    }
                    
                    .autobot-chat-container {
                        position: fixed;
                        ${this.getPosition(true)}
                        width: 380px;
                        height: 550px;
                        background: white;
                        border-radius: 20px;
                        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
                        display: none;
                        flex-direction: column;
                        overflow: hidden;
                        animation: autobot-slideInUp 0.5s ease-out;
                        border: 2px solid #8e44ad;
                        z-index: 10001;
                    }
                    
                    @keyframes autobot-slideInUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    .autobot-chat-header {
                        background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
                        color: white;
                        padding: 1.2rem 1.5rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    
                    .autobot-chat-title {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        font-weight: 600;
                        font-size: 1.1rem;
                    }
                    
                    .autobot-chat-close {
                        cursor: pointer;
                        font-size: 1.2rem;
                        transition: transform 0.3s;
                    }
                    
                    .autobot-chat-close:hover {
                        transform: scale(1.2);
                    }
                    
                    .autobot-chat-messages {
                        flex: 1;
                        padding: 1.5rem;
                        overflow-y: auto;
                        background-color: #fef9f7;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    .autobot-message {
                        margin-bottom: 1rem;
                        padding: 12px 16px;
                        border-radius: 18px;
                        max-width: 85%;
                        position: relative;
                        animation: autobot-fadeIn 0.3s ease-out;
                        line-height: 1.4;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                    }
                    
                    @keyframes autobot-fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    .autobot-user-message {
                        background: linear-gradient(135deg, #e67e22 0%, #f39c12 100%);
                        color: white;
                        align-self: flex-end;
                        border-bottom-right-radius: 5px;
                    }
                    
                    .autobot-ai-message {
                        background: white;
                        color: #2c3e50;
                        align-self: flex-start;
                        border-bottom-left-radius: 5px;
                        border: 1px solid #fadbd8;
                    }
                    
                    .autobot-typing-indicator {
                        display: none;
                        color: #8e44ad;
                        font-style: italic;
                        align-self: flex-start;
                        background: white;
                        padding: 12px 16px;
                        border-radius: 18px;
                        margin-bottom: 1rem;
                        border: 1px solid #fadbd8;
                    }
                    
                    .autobot-chat-input-container {
                        padding: 1.2rem;
                        border-top: 1px solid #fadbd8;
                        background: white;
                    }
                    
                    .autobot-input-group {
                        display: flex;
                        gap: 0.8rem;
                    }
                    
                    .autobot-chat-input {
                        flex: 1;
                        padding: 0.9rem 1.2rem;
                        border: 1px solid #fadbd8;
                        border-radius: 25px;
                        outline: none;
                        font-size: 1rem;
                        transition: border-color 0.3s, box-shadow 0.3s;
                    }
                    
                    .autobot-chat-input:focus {
                        border-color: #8e44ad;
                        box-shadow: 0 0 0 2px rgba(142, 68, 173, 0.2);
                    }
                    
                    .autobot-send-btn {
                        background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 45px;
                        height: 45px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s;
                        box-shadow: 0 4px 10px rgba(142, 68, 173, 0.3);
                    }
                    
                    .autobot-send-btn:hover {
                        transform: scale(1.05);
                    }
                    
                    .autobot-chat-actions {
                        padding: 0.8rem 1.2rem;
                        border-top: 1px solid #fadbd8;
                        background: #fef9f7;
                        display: flex;
                        justify-content: center;
                    }
                    
                    .autobot-clear-btn {
                        background: #e74c3c;
                        color: white;
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 20px;
                        cursor: pointer;
                        font-size: 0.9rem;
                        transition: all 0.3s;
                    }
                    
                    .autobot-clear-btn:hover {
                        background: #c0392b;
                    }
                    
                    .autobot-message-time {
                        font-size: 0.75rem;
                        opacity: 0.7;
                        margin-top: 0.5rem;
                    }
                    
                    /* Scrollbar styling */
                    .autobot-chat-messages::-webkit-scrollbar {
                        width: 6px;
                    }
                    
                    .autobot-chat-messages::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 3px;
                    }
                    
                    .autobot-chat-messages::-webkit-scrollbar-thumb {
                        background: #8e44ad;
                        border-radius: 3px;
                    }
                    
                    .autobot-chat-messages::-webkit-scrollbar-thumb:hover {
                        background: #9b59b6;
                    }
                    
                    /* Responsive */
                    @media (max-width: 480px) {
                        .autobot-chat-container {
                            width: 100vw;
                            height: 100vh;
                            border-radius: 0;
                            bottom: 0;
                            right: 0;
                        }
                    }
                </style>
            `;

            document.head.insertAdjacentHTML('beforeend', styles);
        }

        getPosition(forContainer = false) {
            const positions = {
                'bottom-right': forContainer ? 'bottom: 85px; right: 30px;' : 'bottom: 30px; right: 30px;',
                'bottom-left': forContainer ? 'bottom: 85px; left: 30px;' : 'bottom: 30px; left: 30px;',
                'top-right': forContainer ? 'top: 85px; right: 30px;' : 'top: 30px; right: 30px;',
                'top-left': forContainer ? 'top: 85px; left: 30px;' : 'top: 30px; left: 30px;'
            };

            return positions[this.options.position] || positions['bottom-right'];
        }

        bindEvents() {
            const chatButton = document.getElementById('autobotChatButton');
            const chatClose = document.getElementById('autobotChatClose');
            const sendButton = document.getElementById('autobotSendButton');
            const chatInput = document.getElementById('autobotChatInput');
            const clearButton = document.getElementById('autobotClearButton');
            const chatContainer = document.getElementById('autobotChatContainer');

            chatButton.addEventListener('click', () => this.openChat());
            chatClose.addEventListener('click', () => this.closeChat());
            sendButton.addEventListener('click', () => this.sendMessage());
            clearButton.addEventListener('click', () => this.clearChat());

            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });

            // Close chat when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isOpen &&
                    !chatContainer.contains(e.target) &&
                    !chatButton.contains(e.target)) {
                    this.closeChat();
                }
            });
        }

        openChat() {
            const chatContainer = document.getElementById('autobotChatContainer');
            const chatButton = document.getElementById('autobotChatButton');

            chatContainer.style.display = 'flex';
            chatButton.style.animation = 'none';
            this.isOpen = true;

            // Focus input
            setTimeout(() => {
                document.getElementById('autobotChatInput').focus();
            }, 300);
        }

        closeChat() {
            const chatContainer = document.getElementById('autobotChatContainer');
            chatContainer.style.display = 'none';
            this.isOpen = false;
        }

        async sendMessage() {
            const messageInput = document.getElementById('autobotChatInput');
            const message = messageInput.value.trim();

            if (!message) return;

            this.addMessage('user', message);
            messageInput.value = '';
            this.showTyping();

            try {
                console.log(`Sending message to: ${this.options.apiUrl}`);

                const response = await fetch(this.options.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': this.getCSRFToken()
                    },
                    credentials: 'include', // Important for cross-domain cookies
                    body: JSON.stringify({
                        message: message,
                        session_id: this.sessionId
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    this.sessionId = data.session_id;
                    this.addMessage('ai', data.response);
                } else {
                    this.addMessage('ai', 'Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.');
                }
            } catch (error) {
                console.error('Chat error:', error);
                this.addMessage('ai', 'Ошибка соединения. Проверьте интернет и попробуйте снова.');
            } finally {
                this.hideTyping();
            }
        }

        addMessage(role, content) {
            const chatMessages = document.getElementById('autobotChatMessages');
            const messageClass = role === 'user' ? 'autobot-user-message' : 'autobot-ai-message';
            const sender = role === 'user' ? 'Вы' : 'Консультант';
            const time = this.getCurrentTime();

            const messageDiv = document.createElement('div');
            messageDiv.className = `autobot-message ${messageClass}`;
            messageDiv.innerHTML = `
                <strong>${sender}:</strong> ${content}
                <div class="autobot-message-time">${time}</div>
            `;

            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        showTyping() {
            const typingIndicator = document.getElementById('autobotTypingIndicator');
            const chatMessages = document.getElementById('autobotChatMessages');

            typingIndicator.style.display = 'block';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        hideTyping() {
            const typingIndicator = document.getElementById('autobotTypingIndicator');
            typingIndicator.style.display = 'none';
        }

        async clearChat() {
            if (confirm('Очистить всю историю чата?')) {
                if (this.sessionId) {
                    try {
                        await fetch(`${this.options.clearUrl}${this.sessionId}/`, {
                            method: 'POST',
                            headers: {
                                'X-CSRFToken': this.getCSRFToken()
                            }
                        });
                    } catch (error) {
                        console.error('Error clearing context:', error);
                    }
                }

                const chatMessages = document.getElementById('autobotChatMessages');
                chatMessages.innerHTML = `
                    <div class="autobot-message autobot-ai-message">
                        <strong>Консультант:</strong> Привет!
                        Я могу помочь вам с различными вопросами, связанными с AI-помощниками.
                        О чём хотите поговорить?
                        <div class="autobot-message-time">${this.getCurrentTime()}</div>
                    </div>
                `;

                this.sessionId = null;
            }
        }

        getCurrentTime() {
            return new Date().toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        getCSRFToken() {
            const name = 'csrftoken';
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

        // Public methods
        open() {
            this.openChat();
        }

        close() {
            this.closeChat();
        }

        destroy() {
            if (this.widget) {
                this.widget.remove();
                this.widget = null;
            }
        }
    }

    // Global initialization
    window.AutoBotChatWidget = AutoBotChatWidget;

    // Auto-initialize if data-autobot attribute is present
    document.addEventListener('DOMContentLoaded', function() {
        const autobotElement = document.querySelector('[data-autobot]');
        if (autobotElement) {
            const options = JSON.parse(autobotElement.getAttribute('data-autobot-options') || '{}');
            window.autobotChat = new AutoBotChatWidget(options);
        }
    });

})();
