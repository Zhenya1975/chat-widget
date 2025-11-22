// autobot-chat-widget.js v1.2 - Auto-initialize Version
// Usage: Just include this script and add <div id="autobot-chat-container"></div>

(function() {
    'use strict';
    
    class AutoBotChatInline {
        constructor(options = {}) {
            this.options = {
                apiUrl: options.apiUrl || 'https://kronostech.ru/autopartsbot/api/gigachat/send-message/',
                clearUrl: options.clearUrl || 'https://kronostech.ru/autopartsbot/api/gigachat/clear-context/',
                containerId: options.containerId || 'autobot-chat-container',
                theme: options.theme || 'default',
                ...options
            };
            
            this.sessionId = null;
            this.container = null;
            this.init();
        }
        
        init() {
            this.createChat();
        }
        
        createChat() {
            this.container = document.getElementById(this.options.containerId);
            
            if (!this.container) {
                console.error(`AutoBotChatInline: Container with id '${this.options.containerId}' not found`);
                return;
            }
            
            this.container.innerHTML = this.getChatHTML();
            this.applyStyles();
            this.bindEvents();
            
            setTimeout(() => {
                const input = document.getElementById('autobotChatInput');
                if (input) input.focus();
            }, 500);
        }
        
        getChatHTML() {
            return `
                <div class="autobot-inline-chat">
                    <div class="autobot-chat-header">
                        <div class="autobot-chat-title">
                            <i class="fas fa-robot"></i>
                            <span>AI Консультант</span>
                        </div>
                        <button class="autobot-clear-btn" id="autobotClearButton">
                            <i class="fas fa-trash"></i> Очистить чат
                        </button>
                    </div>
                    
                    <div class="autobot-chat-messages" id="autobotChatMessages">
                        <div class="autobot-message autobot-ai-message">
                            <strong>Консультант:</strong> Привет! Я ваш AI-помощник. Чем могу помочь?
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
                </div>
            `;
        }
        
        applyStyles() {
            if (document.getElementById('autobot-chat-styles')) return;
            
            const styles = `
                <style id="autobot-chat-styles">
                    .autobot-inline-chat {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        max-width: 800px;
                        margin: 20px auto;
                        border: 2px solid #8e44ad;
                        border-radius: 15px;
                        overflow: hidden;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                        background: white;
                    }
                    
                    .autobot-chat-header {
                        background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
                        color: white;
                        padding: 1.5rem 2rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    
                    .autobot-chat-title {
                        display: flex;
                        align-items: center;
                        gap: 0.8rem;
                        font-weight: 600;
                        font-size: 1.3rem;
                    }
                    
                    .autobot-chat-title i {
                        font-size: 1.5rem;
                    }
                    
                    .autobot-clear-btn {
                        background: rgba(255, 255, 255, 0.2);
                        color: white;
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        padding: 0.6rem 1.2rem;
                        border-radius: 25px;
                        cursor: pointer;
                        font-size: 0.9rem;
                        transition: all 0.3s;
                    }
                    
                    .autobot-clear-btn:hover {
                        background: rgba(255, 255, 255, 0.3);
                    }
                    
                    .autobot-chat-messages {
                        height: 400px;
                        padding: 1.5rem;
                        overflow-y: auto;
                        background-color: #f8f9fa;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    .autobot-message {
                        margin-bottom: 1rem;
                        padding: 12px 16px;
                        border-radius: 18px;
                        max-width: 80%;
                        position: relative;
                        animation: autobot-fadeIn 0.3s ease-out;
                        line-height: 1.5;
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
                        border: 1px solid #e9ecef;
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
                        border: 1px solid #e9ecef;
                    }
                    
                    .autobot-chat-input-container {
                        padding: 1.5rem;
                        border-top: 1px solid #e9ecef;
                        background: white;
                    }
                    
                    .autobot-input-group {
                        display: flex;
                        gap: 1rem;
                    }
                    
                    .autobot-chat-input {
                        flex: 1;
                        padding: 1rem 1.5rem;
                        border: 2px solid #e9ecef;
                        border-radius: 25px;
                        outline: none;
                        font-size: 1rem;
                        transition: all 0.3s;
                    }
                    
                    .autobot-chat-input:focus {
                        border-color: #8e44ad;
                        box-shadow: 0 0 0 3px rgba(142, 68, 173, 0.1);
                    }
                    
                    .autobot-send-btn {
                        background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 55px;
                        height: 55px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s;
                        box-shadow: 0 4px 15px rgba(142, 68, 173, 0.3);
                    }
                    
                    .autobot-send-btn:hover {
                        transform: scale(1.05);
                    }
                    
                    .autobot-message-time {
                        font-size: 0.75rem;
                        opacity: 0.7;
                        margin-top: 0.5rem;
                    }
                    
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
                    
                    @media (max-width: 768px) {
                        .autobot-inline-chat {
                            margin: 10px;
                            border-radius: 10px;
                        }
                        
                        .autobot-chat-header {
                            padding: 1rem 1.5rem;
                            flex-direction: column;
                            gap: 1rem;
                            text-align: center;
                        }
                        
                        .autobot-chat-messages {
                            height: 300px;
                            padding: 1rem;
                        }
                        
                        .autobot-message {
                            max-width: 90%;
                        }
                    }
                </style>
            `;
            
            document.head.insertAdjacentHTML('beforeend', styles);
        }
        
        bindEvents() {
            const sendButton = document.getElementById('autobotSendButton');
            const chatInput = document.getElementById('autobotChatInput');
            const clearButton = document.getElementById('autobotClearButton');
            
            sendButton.addEventListener('click', () => this.sendMessage());
            clearButton.addEventListener('click', () => this.clearChat());
            
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
        
        async sendMessage() {
            const messageInput = document.getElementById('autobotChatInput');
            const message = messageInput.value.trim();
            
            if (!message) return;
            
            this.addMessage('user', message);
            messageInput.value = '';
            this.showTyping();
            
            try {
                const response = await fetch(this.options.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': this.getCSRFToken()
                    },
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
                        <strong>Консультант:</strong> Чат очищен. Чем могу помочь?
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
    }
    
    // Автоматическая инициализация при загрузке DOM
    function initializeChat() {
        const container = document.getElementById('autobot-chat-container');
        if (container) {
            new AutoBotChatInline({
                apiUrl: 'https://kronostech.ru/autopartsbot/api/gigachat/send-message/',
                clearUrl: 'https://kronostech.ru/autopartsbot/api/gigachat/clear-context/',
                containerId: 'autobot-chat-container'
            });
        }
    }
    

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChat);
    } else {
        initializeChat();
    }

    window.AutoBotChatInline = AutoBotChatInline;
    
})();
