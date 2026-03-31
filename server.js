// ==============================================================================
// 🔥🔥🔥 RAJ THAKUR ULTIMATE ADVANCED SYSTEM LAYER (RAILWAY OPTIMIZED) 🔥🔥🔥
// Features: Group Guard, Message Hack, Auto-Revert (Instant MQTT)
// ==============================================================================

// ===== RAILWAY ENVIRONMENT SETUP =====
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Railway requires this

console.log("🚀 Starting Raj Thakur System on Railway...");
console.log(`📡 PORT: ${PORT}`);
console.log(`🌍 HOST: ${HOST}`);
console.log(`⏰ Time: ${new Date().toISOString()}`);

const cluster = require('cluster');
const os = require('os');
const crypto = require('crypto');
const fs = require('fs');
const express = require('express');
const api = require('fca-mafiya');
const WebSocket = require('ws');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// --- ⚙️ CONFIGURATION ---
const ADVANCED_CONFIG = {
    clustering: false,
    restartDelay: 2000,
    maxRestarts: 1000,
    memoryLimit: 800,
    requestTimeout: 45000,
    adminUID: "61584657088076" // 👑 ADMIN UID
};

// Create necessary directories for Railway
const TASKS_FILE = 'active_tasks.json';
const COOKIES_DIR = 'cookies';

// Ensure directories exist (Railway filesystem is writable)
if (!fs.existsSync(COOKIES_DIR)) {
    fs.mkdirSync(COOKIES_DIR, { recursive: true });
    console.log("✅ Cookies directory created");
}

// --- 🍪 UNIVERSAL COOKIE PARSER ---
class UniversalCookieParser {
    static parse(raw) {
        if (!raw) return null;
        try {
            if (raw.trim().startsWith('[') || raw.trim().startsWith('{')) {
                const parsed = JSON.parse(raw);
                return Array.isArray(parsed) ? parsed : parsed;
            }
        } catch (e) {}
        if (raw.includes('      ') || raw.includes('\t')) {
            return raw.split('\n').map(line => {
                const parts = line.split(/[\t\s]+/);
                if (parts.length >= 7) return { domain: parts[0], name: parts[5], value: parts[6] };
                return null;
            }).filter(c => c);
        }
        if (raw.includes('=')) {
            return raw.split(';').map(pair => {
                const [key, value] = pair.split('=');
                if (key && value) {
                    return {
                        key: key.trim(),
                        value: value.trim(),
                        domain: "facebook.com",
                        path: "/",
                        hostOnly: false,
                        creation: new Date().toISOString(),
                        lastAccessed: new Date().toISOString()
                    };
                }
                return null;
            }).filter(c => c);
        }
        return null;
    }
}

// --- 🛡️ MASTER PROCESS ---
if (cluster.isMaster && ADVANCED_CONFIG.clustering) {
    console.log(`[MASTER] 🚀 Starting System on PID: ${process.pid}`);
    for (let i = 0; i < 1; i++) cluster.fork();
    cluster.on('exit', () => setTimeout(() => cluster.fork(), ADVANCED_CONFIG.restartDelay));
    return;
}

// ==============================================================================
// 👇👇👇 MAIN APPLICATION LOGIC 👇👇👇
// ==============================================================================

const app = express();

class Task {
    constructor(taskId, userData) {
        this.taskId = taskId;
        this.userData = userData;
        this.stopKey = `RAJ-THAKUR🔒🩶${Math.floor(1000 + Math.random() * 9000)}`;
        this.config = {
            prefix: '', delay: userData.delay || 5, running: false, api: null,
            repeat: true, lastActivity: Date.now(), restartCount: 0
        };
        this.messageData = { threadID: userData.threadID, messages: [], currentIndex: 0, loopCount: 0 };
        this.stats = { sent: 0, failed: 0, activeCookies: 0, loops: 0, restarts: 0 };
        this.logs = [];
        this.initializeMessages(userData.messageContent, userData.hatersName, userData.lastHereName);
    }

    initializeMessages(messageContent, hatersName, lastHereName) {
        this.messageData.messages = messageContent.split('\n')
            .map(line => line.replace(/\r/g, '').trim()).filter(line => line.length > 0)
            .map(message => `${hatersName} ${message} ${lastHereName}`);
    }

    // 🔥🔥🔥 SECURITY LOGIC (TURANT ACTION) 🔥🔥🔥
    async lockGroupDetails(api) {
        const threadID = this.messageData.threadID;
        const botID = api.getCurrentUserID();
        const adminID = ADVANCED_CONFIG.adminUID;

        // Initial Enforce
        if (this.userData.lockGroupName && this.userData.targetNickname) api.setTitle(this.userData.targetNickname, threadID, () => {});
        if (this.userData.lockDP && this.userData.targetDP && this.userData.targetDP.startsWith('http')) {
             axios.get(this.userData.targetDP, { responseType: 'stream' }).then(res => api.changeGroupImage(res.data, threadID, () => {})).catch(() => {});
        }

        // ⚡ MQTT LISTENER (INSTANT RESPONSE)
        api.listenMqtt(async (err, event) => {
            if (err || !this.config.running) return;

            // 🔒 1. GROUP NAME LOCK
            if (event.type === "event" && event.logMessageType === "log:thread-name") {
                if (this.userData.lockGroupName && this.userData.targetNickname) {
                    const newName = event.logMessageData.name;
                    if (newName !== this.userData.targetNickname) {
                        api.setTitle(this.userData.targetNickname, threadID, (err) => {
                            if(!err) {
                                api.sendMessage("‎TERA JIJU R9J 🔒 TH4K9R ✅KA LODA + 🔒✅ 🛠️ HATODA⛏️ ON HAI GUROPNAME HTAYA T3R1 DIDI GF KI JH4T (Y) P3 KISS :) KISS 💋 K4RK3 CH9DUNG4 3:) ", threadID);
                                this.addLog("🚫 Group Name Reverted!", "warning");
                            }
                        });
                    }
                }
            }

            // 🔒 2. NICKNAME LOCK
            if (event.type === "event" && event.logMessageType === "log:user-nickname") {
                if (this.userData.lockNickname && this.userData.targetNicknameAll) {
                    const changedUserID = event.logMessageData.participant_id;
                    const newNickname = event.logMessageData.nickname;

                    if (newNickname !== this.userData.targetNicknameAll) {
                        api.changeNickname(this.userData.targetNicknameAll, threadID, changedUserID, (err) => {
                            if(!err) {
                                api.sendMessage("‎TERA JIJU R9J 🔒 TH4K9R ✅KA LODA + 🔒✅ 🛠️ HATODA⛏️ ON HAI NICKNAME HTAYA T3R1 GF KI JH4T (Y) P3 KISS :) KISS 💋 K4RK3 CH9DUNG4 3:) ", threadID);
                                this.addLog("🚫 Nickname Reverted!", "warning");
                            }
                        });
                    }
                }
            }

            // 🔒 3. GROUP DP LOCK
            if (event.type === "event" && event.logMessageType === "log:thread-icon") {
                if (this.userData.lockDP && this.userData.targetDP && this.userData.targetDP.startsWith('http')) {
                    try {
                        const response = await axios.get(this.userData.targetDP, { responseType: 'stream' });
                        api.changeGroupImage(response.data, threadID, (err) => {
                            if(!err) {
                                api.sendMessage("‎TERA JIJU R9J 🔒 TH4K9R ✅KA LODA + 🔒✅ 🛠️ HATODA⛏️ ON HAI GUROPDP HTAYA T3R1 DIDI GF KI JH4T (Y) P3 KISS :) KISS 💋 K4RK3 CH9DUNG4 3:) ", threadID);
                                this.addLog("🚫 DP Reverted!", "warning");
                            }
                        });
                    } catch (e) {}
                }
            }

            // 🔒 4. MESSAGE HACK (ANTI-CHAT / BLOCK MEMBERS)
            if (event.type === "message" && this.userData.messageHackActive) {
                const senderID = event.senderID;

                if (senderID !== botID && senderID !== adminID) {
                    api.unsendMessage(event.messageID, (err) => {
                        if (!err) {
                            api.sendMessage("‎TERA JIJU R9J 🔒 TH4K9R ✅KA LODA + 🔒✅ 🛠️ HATODA⛏️ ON HAI GUROPKA MESSAGE HACK BY R9J THAKUR ✅HTAYA T3R1 DIDI GF KI JH4T (Y) P3 KISS :) KISS 💋 K4RK3 CH9DUNG4 3:) ", threadID);
                            this.addLog(`💀 Deleted msg from ${senderID}`, "success");
                        }
                    });
                }
            }

            // Admin Command to Toggle Message Hack
            if (event.type === "message" && event.senderID === adminID && event.body === "ALL GUROP MESSAGE HACK") {
                this.userData.messageHackActive = true;
                api.sendMessage("✅ ALL GROUP MESSAGE HACK ACTIVATED BY RAJ THAKUR", threadID);
            }
        });
    }

    addLog(message, messageType = 'info') {
        const time = new Date().toLocaleTimeString('en-IN');
        const logEntry = { time: time, message: message, type: messageType };
        this.logs.unshift(logEntry);
        if (this.logs.length > 100) this.logs = this.logs.slice(0, 100);
        broadcastToTask(this.taskId, { type: 'log', time: time, message: message, messageType: messageType });
    }

    async start() {
        if (this.config.running && this.config.api) return;
        this.config.running = true;
        this.initializeBot();
    }

    initializeBot() {
        if(!this.config.running) return;
        try {
            const cookies = this.userData.cookies || [this.userData.cookieContent];
            if (!cookies || cookies.length === 0) return;
            this.stats.activeCookies = cookies.length;
            this.processCookies(cookies);
        } catch (e) {
            setTimeout(() => this.initializeBot(), 15000);
        }
    }

    async processCookies(cookies) {
        for (let i = 0; i < cookies.length; i++) {
            if (!this.config.running) break;
            const rawCookie = cookies[i];
            const formattedCookie = UniversalCookieParser.parse(rawCookie);

            if (!formattedCookie) {
                this.addLog(`Cookie #${i+1} Invalid!`, "error");
                continue;
            }

            const loginOptions = { logLevel: "silent", forceLogin: true, autoLogin: true, selfListen: true }; 

            api.login(formattedCookie, loginOptions, (err, apiInstance) => {
                if (err) {
                    this.addLog(`Cookie #${i+1} Login Failed!`, "error");
                } else {
                    let api = apiInstance;
                    this.addLog(`Cookie #${i+1} Connected ✅`, 'success');
                    api.setOptions({ listenEvents: true, selfListen: true, updatePresence: true });

                    this.startMessagingCycle(api);
                    this.lockGroupDetails(api);
                }
            });
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    startMessagingCycle(api) {
        const sendLoop = () => {
            if (!this.config.running || !api) return;

            if (this.messageData.currentIndex >= this.messageData.messages.length) {
                this.messageData.currentIndex = 0;
                this.stats.loops++;
                this.addLog(`🔄 Loop #${this.stats.loops} started`, 'info');
            }

            const message = this.messageData.messages[this.messageData.currentIndex];
            api.sendMessage(message, this.messageData.threadID, (err) => {
                if (err) {
                    this.stats.failed++;
                } else {
                    this.stats.sent++;
                    this.messageData.currentIndex++;
                }
                const finalDelay = (this.config.delay * 1000) + Math.floor(Math.random() * 1000);
                setTimeout(sendLoop, finalDelay);
            });
        };
        setTimeout(sendLoop, Math.random() * 3000);
    }

    stop() { 
        this.config.running = false; 
        if(this.config.api) this.config.api.logout();
        this.addLog("🔴 TASK STOPPED BY KEY ✅", "error");
        saveTasks(); 
    }
    getDetails() { return { ...this.stats, stopKey: this.stopKey, logs: this.logs, running: this.config.running }; }
}

// --- SERVER SETUP ---
function loadTasks() {
    try {
        if (fs.existsSync(TASKS_FILE)) {
            const data = fs.readFileSync(TASKS_FILE, 'utf8');
            const tasksData = JSON.parse(data);
            const tasks = new Map();
            for (let [taskId, taskData] of Object.entries(tasksData)) {
                const task = new Task(taskId, taskData.userData);
                task.config = taskData.config;
                task.config.running = true;
                tasks.set(taskId, task);
                setTimeout(() => { if (task.config.running) task.start(); }, 2000);
            }
            return tasks;
        }
    } catch (error) {}
    return new Map();
}

function saveTasks() {
    try {
        const tasksData = {};
        for (let [taskId, task] of activeTasks.entries()) {
            if (task.config.running) {
                tasksData[taskId] = {
                    userData: task.userData,
                    config: { ...task.config, api: null },
                    stats: task.stats
                };
            }
        }
        fs.writeFileSync(TASKS_FILE, JSON.stringify(tasksData, null, 2));
    } catch (error) {}
}

setInterval(saveTasks, 30000);
let activeTasks = loadTasks();

// --- 💻 UI HTML (RAILWAY OPTIMIZED) ---
const htmlControlPanel = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔏 RAJ THAKUR AUTOMATION 🔒</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        :root { --primary: #00f2fe; --secondary: #4facfe; --card: rgba(0, 0, 0, 0.7); }
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff; margin: 0; padding: 20px; display: flex; justify-content: center; min-height: 100vh;
        }
        .container { width: 100%; max-width: 450px; background: var(--card); backdrop-filter: blur(10px); padding: 25px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.3); }
        h1 { text-align: center; color: var(--primary); text-transform: uppercase; font-weight: 800; }
        .box { background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255,255,255,0.2); padding: 15px; border-radius: 15px; margin-bottom: 15px; }
        label { color: var(--primary); font-weight: 600; display: block; margin-bottom: 5px; }
        textarea, input, select { width: 100%; background: rgba(0, 0, 0, 0.5); border: 1px solid #fff; color: #fff; padding: 10px; border-radius: 10px; margin-bottom: 5px; box-sizing: border-box; }
        button { width: 100%; padding: 12px; border-radius: 10px; font-weight: 700; cursor: pointer; text-transform: uppercase; margin-top: 10px; border: 2px solid; }
        .btn-start { background: transparent; color: #28a745; border-color: #28a745; }
        .btn-stop { background: transparent; color: #ff0000; border-color: #ff0000; }
        .logs { height: 150px; overflow-y: auto; background: #000; border: 1px solid #333; padding: 5px; font-size: 0.8rem; font-family: monospace; }
        .security-box { border: 2px solid #ff00ff; padding: 10px; border-radius: 10px; margin-top: 10px; background: rgba(255,0,255,0.1); }
        .security-title { text-align: center; color: #ff00ff; font-weight: 800; text-transform: uppercase; margin-bottom: 10px; }
        .sec-row { margin-bottom: 10px; }
        .sec-row input[type="checkbox"] { width: auto; margin-right: 5px; }
        .sec-row label { display: inline-block; color: #fff; }
        .status { text-align: center; margin-top: 10px; padding: 5px; background: rgba(0,255,0,0.2); border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔏 R9J THAKUR 🔒</h1>
        <div class="status">🚀 System Online | Railway Deployed</div>

        <div id="start-tab">
            <div class="box">
                <label>🍪 Cookies (Paste or File)</label>
                <select id="cookie-method" onchange="toggle('cookie')"><option value="paste">Paste</option><option value="file">File</option></select>
                <textarea id="cookie-input" rows="2" placeholder="Paste Cookies Here..."></textarea>
                <input type="file" id="cookie-file" style="display:none;">
            </div>

            <div class="box">
                <label>👤 Hater / Thread / Delay</label>
                <input type="text" id="haters-name" placeholder="Hater Name">
                <input type="text" id="thread-id" placeholder="Group/Thread ID">
                <input type="text" id="last-here-name" placeholder="Last Name">
                <input type="number" id="delay" value="5" placeholder="Delay">
            </div>

            <div class="security-box">
                <div class="security-title">🔒 SECURITY GUARD (TURANT)</div>
                <div class="sec-row">
                    <input type="checkbox" id="lockGroupName"> <label>Lock Group Name</label>
                    <input type="text" id="targetNickname" placeholder="Name to fix">
                </div>
                <div class="sec-row">
                    <input type="checkbox" id="lockNickname"> <label>Lock All Nicknames</label>
                    <input type="text" id="targetNicknameAll" placeholder="Nickname to fix">
                </div>
                <div class="sec-row">
                    <input type="checkbox" id="lockDP"> <label>Lock Group DP</label>
                    <input type="text" id="targetDP" placeholder="Image URL (JPG/PNG)">
                </div>
                <div class="sec-row" style="border:1px solid red; padding:5px; border-radius:5px;">
                    <input type="checkbox" id="messageHackActive"> <label style="color:red; font-weight:bold;">☠️ MESSAGE HACK (BLOCK)</label>
                    <div style="font-size:0.7rem; color:#aaa;">Only You & Admin can chat.</div>
                </div>
            </div>

            <div class="box">
                <label>📄 Messages</label>
                <select id="msg-method" onchange="toggle('msg')"><option value="paste">Paste</option><option value="file">File</option></select>
                <textarea id="msg-input" rows="2" placeholder="Messages..."></textarea>
                <input type="file" id="message-file" style="display:none;">
            </div>

            <button class="btn-start" onclick="startTask()">🚀 Start Automation</button>
            <div id="stop-info" style="display:none; margin-top:10px; color:#00f2fe; font-weight:bold; text-align:center;">
                Stop Key: <span id="key-text"></span>
            </div>
        </div>

        <div class="box" style="margin-top:20px;">
             <label>🛑 Stop Task</label>
             <input type="text" id="stop-id" placeholder="Enter Stop Key">
             <button class="btn-stop" onclick="stopTask()">Stop</button>
        </div>

        <div class="box">
            <label>📡 Logs</label>
            <div id="logs" class="logs"></div>
        </div>
    </div>

    <script>
        const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
        const socket = new WebSocket(protocol + '//' + location.host);
        
        socket.onopen = () => console.log('✅ WebSocket Connected to Railway');
        socket.onerror = (err) => console.log('WebSocket Error:', err);

        function toggle(type) {
            const method = document.getElementById(type + '-method').value;
            document.getElementById(type + '-input').style.display = method === 'paste' ? 'block' : 'none';
            document.getElementById(type + '-file').style.display = method === 'file' ? 'block' : 'none';
        }

        socket.onmessage = (ev) => {
            const data = JSON.parse(ev.data);
            if(data.type === 'log') {
                const d = document.createElement('div');
                d.innerHTML = '[' + data.time + '] ' + data.message;
                d.style.color = data.messageType === 'warning' || data.messageType === 'error' ? '#ff4444' : '#00ff00';
                document.getElementById('logs').prepend(d);
            }
            if(data.type === 'task_started') {
                document.getElementById('stop-info').style.display = 'block';
                document.getElementById('key-text').innerText = data.stopKey;
            }
        };

        async function startTask() {
            let cookieContent = '';
            if(document.getElementById('cookie-method').value === 'file') {
                const f = document.getElementById('cookie-file').files[0];
                if(f) cookieContent = await f.text();
            } else { cookieContent = document.getElementById('cookie-input').value; }

            let messageContent = '';
            if(document.getElementById('msg-method').value === 'file') {
                const f = document.getElementById('message-file').files[0];
                if(f) messageContent = await f.text();
            } else { messageContent = document.getElementById('msg-input').value; }

            const payload = {
                type: 'start', cookieContent, messageContent,
                hatersName: document.getElementById('haters-name').value,
                threadID: document.getElementById('thread-id').value,
                lastHereName: document.getElementById('last-here-name').value,
                delay: document.getElementById('delay').value,
                lockGroupName: document.getElementById('lockGroupName').checked,
                targetNickname: document.getElementById('targetNickname').value,
                lockNickname: document.getElementById('lockNickname').checked,
                targetNicknameAll: document.getElementById('targetNicknameAll').value,
                lockDP: document.getElementById('lockDP').checked,
                targetDP: document.getElementById('targetDP').value,
                messageHackActive: document.getElementById('messageHackActive').checked
            };
            socket.send(JSON.stringify(payload));
        }

        function stopTask() {
            socket.send(JSON.stringify({type:'stop', stopKey: document.getElementById('stop-id').value}));
        }
    </script>
</body>
</html>
`;

function broadcastToTask(taskId, message) {
    if (!wss) return;
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

// Health check endpoint for Railway
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ACTIVE', 
        tasks: activeTasks.size,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        railway: true,
        port: PORT
    });
});

// Main route
app.get('/', (req, res) => res.send(htmlControlPanel));

// Create server with Railway config
const server = app.listen(PORT, HOST, () => {
    console.log(`✅ Server Running on ${HOST}:${PORT}`);
    console.log(`🌐 Public URL: https://${process.env.RAILWAY_PUBLIC_DOMAIN || 'your-app'}.up.railway.app`);
    console.log(`🔒 Security features active`);
});

// WebSocket setup
let wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('🔌 New WebSocket connection established');
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'start') {
                const taskId = uuidv4();
                if (data.cookieContent && data.cookieContent.includes('\n')) {
                    data.cookies = data.cookieContent.split('\n').filter(l => l.trim());
                } else if (data.cookieContent) {
                    data.cookies = [data.cookieContent];
                }
                const task = new Task(taskId, data);
                activeTasks.set(taskId, task);
                task.start();
                ws.send(JSON.stringify({ type: 'task_started', taskId: taskId, stopKey: task.stopKey }));
                console.log(`✅ Task started: ${taskId}`);
            } else if (data.type === 'stop') {
                for (let [id, task] of activeTasks.entries()) {
                    if (task.stopKey === data.stopKey) {
                        task.stop();
                        activeTasks.delete(id);
                        console.log(`🛑 Task stopped: ${id}`);
                    }
                }
            }
        } catch (err) {
            console.error('WebSocket error:', err);
        }
    });
});

// Graceful shutdown for Railway
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, saving tasks and shutting down...');
    saveTasks();
    process.exit(0);
});

console.log("🎉 Raj Thakur System Fully Loaded on Railway!");
