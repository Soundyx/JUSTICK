// Chat context to maintain conversation state
let chatContext = {
    currentTopic: null,
    bookingRef: null,
    userName: null,
    conversationStage: 'greeting',
    lastResponse: null
};

// Support responses with more natural conversation flow
const responses = {
    greeting: [
        "Hi there! I'm JUSTICK Assistant. What's your name?",
        "Hello! I'm your JUSTICK support assistant. Could you tell me your name?",
        "Welcome to JUSTICK support! I'm here to help. What's your name?"
    ],
    nameResponse: (name) => [
        `Great to meet you, ${name}! How can I help you today?`,
        `Hi ${name}! I'm here to assist you with any questions or issues you might have.`,
        "Here are some topics I can help with:",
        "• Booking Issues",
        "• Payment Problems",
        "• Refund Status",
        "• Technical Support"
    ],
    'Booking Issues': {
        initial: [
            "I can help you with booking issues. What type of booking are you having trouble with?",
            "1. Movie ticket booking",
            "2. Event ticket booking",
            "3. Seat selection issues",
            "4. Booking confirmation"
        ],
        movie: {
            seatSelection: [
                "I understand you're having trouble selecting seats. Let me help:",
                "1. Make sure you're not selecting already booked seats (shown in red)",
                "2. Check if you've exceeded the maximum tickets per booking (6 tickets)",
                "3. Try clearing your browser cache and refreshing the page",
                "Which of these seems closest to your issue?"
            ],
            payment: [
                "For movie ticket payment issues, I can help you troubleshoot:",
                "1. Check if your card has sufficient balance",
                "2. Ensure you're using a supported payment method",
                "3. Verify if your card details are entered correctly",
                "4. Check if your bank is blocking the transaction",
                "Would you like me to guide you through any of these steps?"
            ],
            confirmation: [
                "If you haven't received your booking confirmation:",
                "1. Check your email spam folder",
                "2. Verify the email address you provided",
                "3. Wait a few minutes as emails can be delayed",
                "4. Check your booking history in your account",
                "Have you tried any of these steps?"
            ]
        },
        event: {
            ticketCategory: [
                "For ticket category selection issues:",
                "1. Verify if the category is still available (some may be sold out)",
                "2. Check if you've selected the correct event date",
                "3. Ensure you're within the maximum ticket limit",
                "Which aspect is giving you trouble?"
            ],
            payment: [
                "I can help with event ticket payment issues:",
                "1. Confirm the total amount matches your selected tickets",
                "2. Check if your payment method is accepted",
                "3. Verify your billing address matches your card",
                "Let me know which part you need help with."
            ],
            confirmation: [
                "For missing event booking confirmations:",
                "1. Look for an email from tickets@justick.com",
                "2. Check your booking history",
                "3. Verify your transaction was completed",
                "Would you like me to help you check any of these?"
            ]
        },
        followUp: (type) => [
            `Could you share your booking reference number for the ${type}? You can find it in your confirmation email or booking history.`,
            "This will help me assist you better and check the exact status of your booking."
        ]
    },
    'Payment Problems': {
        initial: [
            "I understand you're having payment issues. What specific problem are you facing?",
            "1. Payment failed",
            "2. Double charged",
            "3. Payment showing as pending",
            "4. Refund not received"
        ],
        followUp: {
            failed: [
                "I see your payment failed. Let's troubleshoot:",
                "1. Error code received (if any)",
                "2. Payment method used",
                "3. Time of the attempted payment",
                "Could you provide these details?"
            ],
            double: [
                "I'll help you with the double charge. Please provide:",
                "1. Both transaction reference numbers",
                "2. Date and time of the charges",
                "3. Your booking reference number",
                "I'll make sure this gets resolved quickly."
            ],
            pending: [
                "For pending payments, I'll need to know:",
                "1. When did you initiate the payment?",
                "2. Which payment method did you use?",
                "3. Have you received any confirmation emails?",
                "This will help me track your payment status."
            ]
        },
        resolution: {
            failed: [
                "Based on the error, here's what you can try:",
                "1. Use a different payment method",
                "2. Contact your bank to authorize the transaction",
                "3. Clear your browser cache and try again",
                "Would you like to try any of these solutions?"
            ],
            double: [
                "I've located both transactions. Here's what we'll do:",
                "1. Confirm the duplicate charge",
                "2. Initiate an immediate refund",
                "3. Send you a confirmation email",
                "The refund should appear in 3-5 business days."
            ],
            pending: [
                "For your pending payment, I recommend:",
                "1. Wait for 30 minutes as it might still process",
                "2. Check your bank statement for the charge",
                "3. Try booking again if no charge appears",
                "Let me know if you need help with any of these steps."
            ]
        }
    },
    'Refund Status': {
        initial: [
            "I'll help you check your refund status. I'll need:",
            "1. Your booking reference number",
            "2. Date of cancellation",
            "Please provide the booking reference number first."
        ],
        followUp: (ref) => [
            `Thanks! I've found your booking with reference ${ref}.`,
            "Could you confirm when you requested the cancellation?",
            "This will help me provide accurate refund timing information."
        ],
        status: {
            processing: (days) => [
                `Your refund is being processed and should be credited within ${days} business days.`,
                "The money will be returned to the original payment method.",
                "You'll receive an email confirmation once it's completed."
            ],
            completed: (date) => [
                `Good news! Your refund was processed on ${date}.`,
                "The amount should already be reflected in your account.",
                "Please check your bank statement for the credit."
            ],
            delayed: [
                "I notice your refund is taking longer than usual.",
                "I'll escalate this to our finance team for immediate review.",
                "You'll receive an update email within 24 hours.",
                "Is there anything else you need help with?"
            ]
        }
    },
    'Technical Support': {
        initial: [
            "I can help with technical issues. What problem are you experiencing?",
            "1. Website not loading properly",
            "2. Seat selection not working",
            "3. Payment page errors",
            "4. Other technical issue"
        ],
        troubleshoot: {
            loading: [
                "Let's fix the loading issue. Try these steps:",
                "1. Clear your browser cache (I can guide you)",
                "2. Try refreshing the page (Ctrl + F5)",
                "3. Use a different browser",
                "4. Check your internet connection",
                "Which would you like to try first?"
            ],
            seats: [
                "For seat selection issues:",
                "1. Check if seats are already booked (marked in red)",
                "2. Make sure you're within the ticket limit",
                "3. Try a different browser",
                "4. Clear your browser cookies",
                "Let me know which step you'd like help with."
            ],
            payment: [
                "For payment page issues:",
                "1. Verify your card details are correct",
                "2. Check if your browser blocks pop-ups",
                "3. Try a different payment method",
                "4. Clear browser cache and cookies",
                "I can guide you through any of these steps."
            ]
        },
        browserHelp: {
            cache: [
                "To clear your browser cache:",
                "1. Press Ctrl + Shift + Delete",
                "2. Select 'Cached images and files'",
                "3. Click 'Clear data'",
                "Let me know when you've completed these steps."
            ],
            cookies: [
                "To manage cookies for JUSTICK:",
                "1. Go to browser settings",
                "2. Find 'Privacy and security'",
                "3. Click 'Clear browsing data'",
                "4. Select 'Cookies and site data'",
                "Need help with any of these steps?"
            ]
        }
    },
    fallback: [
        "I'm not quite sure I understood that. Could you please:",
        "1. Rephrase your question",
        "2. Choose from the main topics",
        "3. Provide more details",
        "I'm here to help!"
    ]
};

// Add typing animation
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
}

// Remove typing indicator
function removeTypingIndicator(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

// Add message to chat
function addMessage(message, isUser = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    if (!isUser) {
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        const icon = document.createElement('i');
        icon.className = 'fas fa-robot';
        avatar.appendChild(icon);
        messageDiv.appendChild(avatar);
    }
    
    if (Array.isArray(message)) {
        message.forEach((line, index) => {
            if (typeof line === 'string') {
                const p = document.createElement('p');
                p.textContent = line;
                messageContent.appendChild(p);
            }
        });
    } else {
        const p = document.createElement('p');
        p.textContent = message;
        messageContent.appendChild(p);
    }
    
    // Add quick replies if available and not a user message
    if (!isUser && chatContext.conversationStage === 'main') {
        const quickReplies = document.createElement('div');
        quickReplies.className = 'quick-replies';
        ['Booking Issues', 'Payment Problems', 'Refund Status', 'Technical Support'].forEach(reply => {
            const button = document.createElement('button');
            button.textContent = reply;
            button.onclick = () => sendQuickReply(reply);
            quickReplies.appendChild(button);
        });
        messageContent.appendChild(quickReplies);
    }
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Process user message and generate response
async function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Show typing indicator
    const typingIndicator = showTypingIndicator();
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Handle different conversation stages
    if (chatContext.conversationStage === 'greeting') {
        chatContext.userName = message;
        chatContext.conversationStage = 'main';
        removeTypingIndicator(typingIndicator);
        addMessage(responses.nameResponse(chatContext.userName));
        return;
    }
    
    let response;
    if (chatContext.currentTopic) {
        // Handle topic-specific follow-up
        switch (chatContext.currentTopic) {
            case 'Booking Issues':
                if (lowerMessage.includes('movie')) {
                    if (lowerMessage.includes('seat')) {
                        response = responses['Booking Issues'].movie.seatSelection;
                    } else if (lowerMessage.includes('pay')) {
                        response = responses['Booking Issues'].movie.payment;
                    } else if (lowerMessage.includes('confirm')) {
                        response = responses['Booking Issues'].movie.confirmation;
                    } else {
                        response = responses['Booking Issues'].movie;
                    }
                } else if (lowerMessage.includes('event')) {
                    if (lowerMessage.includes('category') || lowerMessage.includes('ticket')) {
                        response = responses['Booking Issues'].event.ticketCategory;
                    } else if (lowerMessage.includes('pay')) {
                        response = responses['Booking Issues'].event.payment;
                    } else if (lowerMessage.includes('confirm')) {
                        response = responses['Booking Issues'].event.confirmation;
                    } else {
                        response = responses['Booking Issues'].event;
                    }
                } else if (lowerMessage.match(/^[A-Z0-9]{6,}$/)) {
                    chatContext.bookingRef = message;
                    response = responses['Booking Issues'].followUp(chatContext.lastResponse || 'booking');
                } else {
                    response = responses['Booking Issues'].initial;
                }
                break;
                
            case 'Payment Problems':
                if (lowerMessage.includes('fail')) {
                    if (chatContext.lastResponse === 'failed') {
                        response = responses['Payment Problems'].resolution.failed;
                    } else {
                        chatContext.lastResponse = 'failed';
                        response = responses['Payment Problems'].followUp.failed;
                    }
                } else if (lowerMessage.includes('double')) {
                    if (chatContext.lastResponse === 'double') {
                        response = responses['Payment Problems'].resolution.double;
                    } else {
                        chatContext.lastResponse = 'double';
                        response = responses['Payment Problems'].followUp.double;
                    }
                } else if (lowerMessage.includes('pending')) {
                    if (chatContext.lastResponse === 'pending') {
                        response = responses['Payment Problems'].resolution.pending;
                    } else {
                        chatContext.lastResponse = 'pending';
                        response = responses['Payment Problems'].followUp.pending;
                    }
                } else {
                    response = responses['Payment Problems'].initial;
                }
                break;
                
            case 'Refund Status':
                if (lowerMessage.match(/^[A-Z0-9]{6,}$/)) {
                    chatContext.bookingRef = message;
                    response = responses['Refund Status'].followUp(message);
                } else if (chatContext.bookingRef) {
                    if (lowerMessage.includes('week') || lowerMessage.includes('long')) {
                        response = responses['Refund Status'].status.delayed;
                    } else {
                        const randomDate = new Date();
                        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 5));
                        response = responses['Refund Status'].status.completed(randomDate.toLocaleDateString());
                    }
                } else {
                    response = responses['Refund Status'].initial;
                }
                break;
                
            case 'Technical Support':
                if (lowerMessage.includes('load')) {
                    if (lowerMessage.includes('cache') || lowerMessage.includes('clear')) {
                        response = responses['Technical Support'].browserHelp.cache;
                    } else {
                        response = responses['Technical Support'].troubleshoot.loading;
                    }
                } else if (lowerMessage.includes('seat')) {
                    if (lowerMessage.includes('cookie')) {
                        response = responses['Technical Support'].browserHelp.cookies;
                    } else {
                        response = responses['Technical Support'].troubleshoot.seats;
                    }
                } else if (lowerMessage.includes('payment')) {
                    response = responses['Technical Support'].troubleshoot.payment;
                } else {
                    response = responses['Technical Support'].initial;
                }
                break;
        }
    } else {
        // Handle initial topic selection
        if (lowerMessage.includes('book')) {
            chatContext.currentTopic = 'Booking Issues';
            response = responses['Booking Issues'].initial;
        } else if (lowerMessage.includes('pay')) {
            chatContext.currentTopic = 'Payment Problems';
            response = responses['Payment Problems'].initial;
        } else if (lowerMessage.includes('refund')) {
            chatContext.currentTopic = 'Refund Status';
            response = responses['Refund Status'].initial;
        } else if (lowerMessage.includes('tech') || lowerMessage.includes('error')) {
            chatContext.currentTopic = 'Technical Support';
            response = responses['Technical Support'].initial;
        } else {
            response = responses.fallback;
        }
    }
    
    removeTypingIndicator(typingIndicator);
    addMessage(response);
}

// Send message function
function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, true);
        input.value = '';
        processMessage(message);
    }
}

// Handle enter key press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Handle quick reply buttons
function sendQuickReply(category) {
    chatContext.currentTopic = category;
    addMessage(category, true);
    processMessage(category);
}

// Initialize chat
document.addEventListener('DOMContentLoaded', () => {
    addMessage(responses.greeting[Math.floor(Math.random() * responses.greeting.length)]);
});
