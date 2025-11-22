console.log('=== MINIMAL TEST START ===');

(function() {
    'use strict';
    
    console.log('IIFE executing...');
    
    class AutoBotChatInline {
        constructor() {
            console.log('AutoBotChatInline constructor called');
            this.init();
        }
        
        init() {
            console.log('AutoBotChatInline init called');
            const container = document.getElementById('autobot-chat-container');
            if (container) {
                console.log('Container found, creating chat...');
                container.innerHTML = '<div style="padding: 20px; background: green; color: white;">✅ Chat Widget Loaded!</div>';
            } else {
                console.log('❌ Container not found');
            }
        }
    }
    
    // Auto-initialize
    function initializeChat() {
        console.log('initializeChat called');
        const container = document.getElementById('autobot-chat-container');
        if (container) {
            console.log('Creating new AutoBotChatInline instance...');
            new AutoBotChatInline();
        } else {
            console.log('Container not found during initialization');
        }
    }
    
    // Initialize when DOM ready
    if (document.readyState === 'loading') {
        console.log('DOM loading, adding event listener');
        document.addEventListener('DOMContentLoaded', initializeChat);
    } else {
        console.log('DOM already ready, calling initializeChat directly');
        initializeChat();
    }
    
    // Export for manual use
    window.AutoBotChatInline = AutoBotChatInline;
    
    console.log('=== MINIMAL TEST END ===');
})();
