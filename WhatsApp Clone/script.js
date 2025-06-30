const chats = [
    {
        id: 1,
        name: "Nilesh Bachute",
        avatar: "Nilesh.jpeg",
        lastMessage: "Hey, how are you?",
        time: "10:30 AM",
        messages: [
            { text: "Hey there!", time: "10:20 AM", incoming: false },
            { text: "Hi! How are you?", time: "10:22 AM", incoming: true },
            { text: "I'm good, thanks for asking!", time: "10:25 AM", incoming: false },
            { text: "Hey, how are you?", time: "10:30 AM", incoming: true }
        ]
    },
    {
        id: 2,
        name: "Shaklen Shaikh",
        avatar: "shaklen.jpeg",
        lastMessage: "Meeting at 3 PM",
        time: "9:45 AM",
        messages: [
            { text: "Don't forget our meeting", time: "9:40 AM", incoming: true },
            { text: "I'll be there", time: "9:42 AM", incoming: false },
            { text: "Meeting at 3 PM", time: "9:45 AM", incoming: true }
        ]
    },
    {
        id: 3,
        name: "Yash Dhawre",
        avatar: "yash.jpeg",
        lastMessage: "I'll send the files",
        time: "Yesterday",
        messages: [
            { text: "When is the deadline?", time: "Yesterday", incoming: false },
            { text: "End of this week", time: "Yesterday", incoming: true },
            { text: "I'll send the files", time: "Yesterday", incoming: true }
        ]
    }
];

// DOM elements
const chatList = document.getElementById('chatList');
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const activeChatDP = document.getElementById('activeChatDP');
const activeChatName = document.getElementById('activeChatName');
let activeChat = null;

function renderChatList() {
    chatList.innerHTML = '';
    chats.forEach(chat => {
        const chatElement = document.createElement('div');
        chatElement.className = 'chat-item';
        chatElement.dataset.id = chat.id;
        chatElement.innerHTML = `
            <div class="chat-avatar">
                <img src="${chat.avatar}" alt="${chat.name}">
            </div>
            <div class="chat-preview">
                <div class="chat-name">${chat.name}</div>
                <div class="chat-last-message">${chat.lastMessage}</div>
            </div>
            <div class="chat-time">${chat.time}</div>
        `;
        chatElement.addEventListener('click', () => loadChat(chat.id));
        chatList.appendChild(chatElement);
    });
}

function loadChat(chatId) {
    activeChat = chats.find(chat => chat.id === chatId);

        document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.id) === chatId) {
            item.classList.add('active');
        }
    });
    
    activeChatDP.src = activeChat.avatar;
    activeChatName.textContent = activeChat.name;
    
    messagesContainer.innerHTML = '';
    activeChat.messages.forEach(message => {
        const messageContainer = document.createElement('div');
        messageContainer.className = `message-container ${message.incoming ? 'incoming' : 'outgoing'}`;
        
        if (message.incoming) {
            messageContainer.innerHTML = `
                <img src="${activeChat.avatar}" class="message-dp" alt="DP">
                <div class="message message-incoming">
                    <div class="message-text">${message.text}</div>
                    <div class="message-time">${message.time}</div>
                </div>
            `;
        } else {
            messageContainer.innerHTML = `
                <div class="message message-outgoing">
                    <div class="message-text">${message.text}</div>
                    <div class="message-time">${message.time}</div>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageContainer);
    });
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
    const text = messageInput.value.trim();
    if (text && activeChat) {
        const newMessage = {
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            incoming: false
        };
        
        activeChat.messages.push(newMessage);
        activeChat.lastMessage = text;
        activeChat.time = 'Just now';
        
        renderChatList();
        loadChat(activeChat.id);
        messageInput.value = '';
    }
}

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

renderChatList();