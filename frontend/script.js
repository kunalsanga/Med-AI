// State management
let currentChatMode = 'medical';
let isDarkTheme = localStorage.getItem('theme') === 'dark';

// Device connection state
let isScanning = false;
let connectedDevice = null;

// Backend URL - Auto-detect environment
// For local development, use localhost; for production, use Vercel API
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const BACKEND_URL = isLocalhost ? 'http://localhost:3000/chat' : '/api/chat';

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI elements
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const themeToggle = document.getElementById('theme-toggle');
    const medicalButton = document.getElementById('medical-chat');
    const generalButton = document.getElementById('general-chat');
    const clearButton = document.getElementById('clear-chat');
    const clearModal = document.getElementById('clear-modal');
    const confirmClear = document.getElementById('confirm-clear');
    const cancelClear = document.getElementById('cancel-clear');
    const scanButton = document.getElementById('scan-devices');

    // Set initial theme
    updateTheme(isDarkTheme);

    // Send message handlers
    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
        const icon = themeToggle.querySelector('i');
        icon.style.transform = 'rotate(180deg)';
        
        isDarkTheme = !isDarkTheme;
        updateTheme(isDarkTheme);
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        
        setTimeout(() => {
            icon.style.transform = 'rotate(0deg)';
        }, 200);
    });

    // Chat mode toggle handlers
    medicalButton.addEventListener('click', () => {
        currentChatMode = 'medical';
        medicalButton.classList.add('active');
        generalButton.classList.remove('active');
        document.getElementById('chat-mode-indicator').innerHTML = 
            '<i class="fas fa-user-md"></i><span>Medical Consultation Mode</span>';
        addMessage("Switched to Medical Consultation Mode. How can I help with your health concerns?", false);
    });

    generalButton.addEventListener('click', () => {
        currentChatMode = 'general';
        generalButton.classList.add('active');
        medicalButton.classList.remove('active');
        document.getElementById('chat-mode-indicator').innerHTML = 
            '<i class="fas fa-comments"></i><span>General Chat Mode</span>';
        addMessage("Switched to General Chat Mode. Feel free to ask me anything!", false);
    });

    // Clear chat handlers
    clearButton.addEventListener('click', () => {
        clearModal.classList.add('show');
    });

    confirmClear.addEventListener('click', () => {
        clearChat();
        clearModal.classList.remove('show');
    });

    cancelClear.addEventListener('click', () => {
        clearModal.classList.remove('show');
    });

    clearModal.addEventListener('click', (e) => {
        if (e.target === clearModal) {
            clearModal.classList.remove('show');
        }
    });

    // Initial greeting
    setTimeout(() => {
        addMessage("👋 Hello! I'm your AI Health Assistant. How can I help you today?", false);
    }, 500);

    // Device connection features
    scanButton.addEventListener('click', () => {
        if (!isScanning) {
            startDeviceScan();
        }
    });
});

// Handle sending messages
function handleSendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (!message) return;

    // Add user message
    addMessage(message, true);
    userInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Send message to backend
    fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    })
    .then(response => response.json())
    .then(data => {
        hideTypingIndicator();
        if (data.response) {
            addMessage(data.response, false);
        } else {
            addMessage('Sorry, I could not get a response from the AI.', false);
        }
    })
    .catch(error => {
        hideTypingIndicator();
        console.error('Detailed Error:', error);
        console.error('Backend URL:', BACKEND_URL);
        addMessage(`Error contacting the AI backend. URL: ${BACKEND_URL}`, false);
    });
}

// Add message to chat
function addMessage(message, isUser) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    // Render Markdown for AI messages, plain text for user
    if (!isUser && window.marked) {
        messageDiv.innerHTML = marked.parse(message);
    } else {
        messageDiv.innerHTML = message.replace(/\n/g, '<br>');
    }
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    chatMessages.appendChild(messageDiv);
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Typing indicator functions
function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing';
    typingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Clear chat function
function clearChat() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.style.opacity = '0';
    
    setTimeout(() => {
        chatMessages.innerHTML = '';
        chatMessages.style.opacity = '1';
        addMessage("👋 Chat cleared! How can I help you today?", false);
    }, 300);
}

// Theme update function
function updateTheme(isDark) {
    const root = document.documentElement;
    const icon = document.querySelector('#theme-toggle i');
    const header = document.querySelector('header');
    const headerTitle = header.querySelector('h1');
    const headerParagraph = header.querySelector('p');
    const navbar = document.querySelector('.navbar');
    const navLogo = document.querySelector('.logo');
    
    if (isDark) {
        // Dark theme colors
        root.style.setProperty('--bg-primary', '#1a1a2e');
        root.style.setProperty('--bg-secondary', '#242444');
        root.style.setProperty('--text-primary', '#e2e8f0');
        root.style.setProperty('--text-secondary', '#a0aec0');
        root.style.setProperty('--accent-primary', '#60a5fa');
        root.style.setProperty('--accent-secondary', '#3b82f6');
        root.style.setProperty('--border-color', '#2d3748');
        root.style.setProperty('--message-user', '#2d3748');
        root.style.setProperty('--message-ai', '#1a1a2e');
        root.style.setProperty('--shadow-color', 'rgba(0,0,0,0.3)');
        
        // Dark theme specific components
        header.style.background = 'linear-gradient(135deg, #1a1a2e, #2d3748)';
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
        headerTitle.style.color = '#ffffff';
        headerParagraph.style.color = '#a0aec0';

        // Update feature cards for dark theme
        document.querySelectorAll('.feature-card').forEach(card => {
            card.style.background = '#242444';
            card.style.borderColor = '#2d3748';
            card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
        });

        // Update chat container for dark theme
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.style.background = '#242444';
        chatContainer.style.borderColor = '#2d3748';
        
        // Update chat header
        const chatHeader = document.querySelector('.chat-header');
        chatHeader.style.background = 'linear-gradient(135deg, #1a1a2e, #2d3748)';

        // Update chat mode indicator
        const modeIndicator = document.getElementById('chat-mode-indicator');
        modeIndicator.style.background = '#1a1a2e';
        modeIndicator.style.color = '#60a5fa';

        // Update chat toggle buttons
        document.querySelectorAll('.chat-toggle button').forEach(button => {
            if (!button.classList.contains('active')) {
                button.style.borderColor = '#2d3748';
                button.style.color = '#60a5fa';
            }
        });

        // Update input area
        const inputArea = document.querySelector('.input-area');
        inputArea.style.borderColor = '#2d3748';
        
        icon.className = 'fas fa-moon';

        // Dark theme navbar
        navbar.style.background = 'rgba(26, 26, 46, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.borderBottom = '1px solid #2d3748';
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
        
        // Update logo colors for dark theme
        navLogo.style.color = '#60a5fa';
        const logoIcon = navLogo.querySelector('i');
        if (logoIcon) {
            logoIcon.style.background = 'linear-gradient(135deg, #60a5fa, #3b82f6)';
            logoIcon.style.webkitBackgroundClip = 'text';
            logoIcon.style.webkitTextFillColor = 'transparent';
        }
    } else {
        // Light theme colors
        root.style.setProperty('--bg-primary', '#f8fafc');
        root.style.setProperty('--bg-secondary', '#ffffff');
        root.style.setProperty('--text-primary', '#1a365d');
        root.style.setProperty('--text-secondary', '#64748b');
        root.style.setProperty('--accent-primary', '#2563eb');
        root.style.setProperty('--accent-secondary', '#1e40af');
        root.style.setProperty('--border-color', '#e2e8f0');
        root.style.setProperty('--message-user', '#e8f0fe');
        root.style.setProperty('--message-ai', '#f8fafc');
        root.style.setProperty('--shadow-color', 'rgba(0,0,0,0.1)');
        
        // Light theme specific components
        header.style.background = 'linear-gradient(135deg, #2563eb, #1e40af)';
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        headerTitle.style.color = '#ffffff';
        headerParagraph.style.color = '#e2e8f0';

        // Reset feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            card.style.background = '#ffffff';
            card.style.borderColor = '#e2e8f0';
            card.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
        });

        // Reset chat container
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.style.background = '#ffffff';
        chatContainer.style.borderColor = '#e2e8f0';
        
        // Reset chat header
        const chatHeader = document.querySelector('.chat-header');
        chatHeader.style.background = 'linear-gradient(135deg, #1e3a8a, #1e40af)';

        // Reset chat mode indicator
        const modeIndicator = document.getElementById('chat-mode-indicator');
        modeIndicator.style.background = '#e0e7ff';
        modeIndicator.style.color = '#1e40af';

        // Reset chat toggle buttons
        document.querySelectorAll('.chat-toggle button').forEach(button => {
            if (!button.classList.contains('active')) {
                button.style.borderColor = '#2563eb';
                button.style.color = '#2563eb';
            }
        });

        // Reset input area
        const inputArea = document.querySelector('.input-area');
        inputArea.style.borderColor = '#e2e8f0';
        
        icon.className = 'fas fa-sun';

        // Light theme navbar
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.borderBottom = '1px solid #e2e8f0';
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        
        // Update logo colors for light theme
        navLogo.style.color = '#2563eb';
        const logoIcon = navLogo.querySelector('i');
        if (logoIcon) {
            logoIcon.style.background = 'linear-gradient(135deg, #2563eb, #1e40af)';
            logoIcon.style.webkitBackgroundClip = 'text';
            logoIcon.style.webkitTextFillColor = 'transparent';
        }
    }
    
    // Update meta theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.content = isDark ? '#1a1a2e' : '#ffffff';
    }
} 

// Simulate device scanning
function startDeviceScan() {
    const scanButton = document.getElementById('scan-devices');
    const deviceList = document.querySelector('.device-list');
    const scanIcon = scanButton.querySelector('i');
    
    isScanning = true;
    scanIcon.classList.add('scanning');
    scanButton.disabled = true;
    
    // Show scanning message
    deviceList.innerHTML = `
        <div class="scanning-message">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Scanning for nearby devices...</p>
        </div>
    `;
    
    // Simulate finding devices
    setTimeout(() => {
        const mockDevices = [
            { name: 'Fitbit Charge 5', type: 'watch', batteryLevel: '85%' },
            { name: 'Apple Watch Series 7', type: 'watch', batteryLevel: '92%' },
            { name: 'Samsung Galaxy Watch', type: 'watch', batteryLevel: '78%' }
        ];
        
        showFoundDevices(mockDevices);
        isScanning = false;
        scanIcon.classList.remove('scanning');
        scanButton.disabled = false;
    }, 2000);
}

// Display found devices
function showFoundDevices(devices) {
    const deviceList = document.querySelector('.device-list');
    deviceList.innerHTML = '';
    
    devices.forEach(device => {
        const deviceElement = document.createElement('div');
        deviceElement.className = 'device-item';
        deviceElement.innerHTML = `
            <div class="device-info">
                <i class="fas fa-watch"></i>
                <div>
                    <h4>${device.name}</h4>
                    <span>Battery: ${device.batteryLevel}</span>
                </div>
            </div>
            <button class="connect-button" onclick="connectDevice('${device.name}')">
                Connect
            </button>
        `;
        deviceList.appendChild(deviceElement);
    });
}

// Connect to device
function connectDevice(deviceName) {
    const deviceStats = document.querySelector('.device-stats');
    connectedDevice = deviceName;
    
    // Show connection success message
    addMessage(`Successfully connected to ${deviceName}. Starting health monitoring...`, false);
    
    // Show device stats
    deviceStats.classList.remove('hidden');
    
    // Simulate real-time updates
    startHealthMonitoring();
}

// Simulate health monitoring
function startHealthMonitoring() {
    setInterval(() => {
        if (connectedDevice) {
            updateHealthStats({
                heartRate: Math.floor(Math.random() * (100 - 60) + 60),
                steps: Math.floor(Math.random() * 10000),
                sleep: (Math.random() * (8 - 5) + 5).toFixed(1)
            });
        }
    }, 3000);
}

// Update health stats display
function updateHealthStats(stats) {
    const statElements = document.querySelectorAll('.stat-value');
    statElements[0].textContent = `${stats.heartRate} BPM`;
    statElements[1].textContent = `${stats.steps} steps`;
    statElements[2].textContent = `${stats.sleep} hrs`;
} 