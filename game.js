// ==================== 咖啡大師專業版 ====================
// 遊戲狀態
const gameState = {
    isBrewing: false,
    currentPhase: 'idle',
    lastResult: null,
    stats: {
        highScore: 0,
        totalBrews: 0,
        perfectBrews: 0
    }
};

// 咖啡豆資料庫
const coffeeBeans = {
    ethiopia: {
        name: '衣索比亞 耶加雪菲',
        process: '水洗',
        roast: '中淺焙',
        flavors: ['花香', '柑橘', '莓果', '茉莉花', '檸檬'],
        idealTemp: 92,
        idealGrind: 600,
        idealRatio: 15
    },
    colombia: {
        name: '哥倫比亞 薇拉',
        process: '水洗',
        roast: '中焙',
        flavors: ['焦糖', '堅果', '巧克力', '柑橘', '蜂蜜'],
        idealTemp: 93,
        idealGrind: 650,
        idealRatio: 16
    },
    kenya: {
        name: '肯亞 AA',
        process: '水洗',
        roast: '中焙',
        flavors: ['黑醋栗', '番茄', '葡萄柚', '紅酒', '莓果'],
        idealTemp: 94,
        idealGrind: 600,
        idealRatio: 15
    },
    brazil: {
        name: '巴西 聖保羅',
        process: '日曬',
        roast: '中深焙',
        flavors: ['巧克力', '堅果', '焦糖', '奶油', '可可'],
        idealTemp: 90,
        idealGrind: 700,
        idealRatio: 17
    },
    guatemala: {
        name: '瓜地馬拉 安提瓜',
        process: '水洗',
        roast: '中焙',
        flavors: ['巧克力', '花香', '柑橘', '杏仁', '蜂蜜'],
        idealTemp: 92,
        idealGrind: 650,
        idealRatio: 16
    }
};

// DOM 元素快取
const elements = {};

// 初始化
function init() {
    cacheElements();
    setupEventListeners();
    initParticles();
    updateBeanInfo();
    randomizeParameters(); // 隨機初始參數
    loadStats();
}

// 快取 DOM 元素
function cacheElements() {
    // 控制元素
    elements.beanSelect = document.getElementById('beanSelect');
    elements.grindSlider = document.getElementById('grindSlider');
    elements.tempSlider = document.getElementById('tempSlider');
    elements.coffeeSlider = document.getElementById('coffeeSlider');
    elements.waterSlider = document.getElementById('waterSlider');
    elements.bloomSlider = document.getElementById('bloomSlider');
    elements.totalSlider = document.getElementById('totalSlider');
    
    // 顯示元素
    elements.grindValue = document.getElementById('grindValue');
    elements.tempBadge = document.getElementById('tempBadge');
    elements.coffeeValue = document.getElementById('coffeeValue');
    elements.waterValue = document.getElementById('waterValue');
    elements.bloomValue = document.getElementById('bloomValue');
    elements.totalValue = document.getElementById('totalValue');
    elements.ratioIndicator = document.getElementById('ratioIndicator');
    
    // 咖啡豆資訊
    elements.beanName = document.getElementById('beanName');
    elements.beanProcess = document.getElementById('beanProcess');
    elements.beanRoast = document.getElementById('beanRoast');
    elements.flavorTags = document.getElementById('flavorTags');
    
    // 視覺效果
    elements.coffeeBed = document.getElementById('coffeeBed');
    elements.waterStream = document.getElementById('waterStream');
    elements.bloomAnim = document.getElementById('bloomAnim');
    elements.coffeeFill = document.getElementById('coffeeFill');
    elements.steamParticles = document.getElementById('steamParticles');
    
    // 進度
    elements.brewStatus = document.getElementById('brewStatus');
    elements.progressBar = document.getElementById('progressBar');
    elements.progressFill = document.getElementById('progressFill');
    elements.progressStage = document.getElementById('progressStage');
    elements.progressTime = document.getElementById('progressTime');
    
    // 即時數據
    elements.waterVolume = document.getElementById('waterVolume');
    elements.extractVolume = document.getElementById('extractVolume');
    elements.tempValue = document.getElementById('tempValue');
    elements.tdsValue = document.getElementById('tdsValue');
    
    // 按鈕
    elements.brewStartBtn = document.getElementById('brewStartBtn');
    
    // 結果
    elements.resultCard = document.getElementById('resultCard');
    elements.scoreNumber = document.getElementById('scoreNumber');
    elements.gradeBadge = document.getElementById('gradeBadge');
    elements.resultFeedback = document.getElementById('resultFeedback');
    elements.resultFlavors = document.getElementById('resultFlavors');
    
    // 模態框
    elements.tastingModal = document.getElementById('tastingModal');
    elements.tastingMessage = document.getElementById('tastingMessage');
    elements.verdictDisplay = document.getElementById('verdictDisplay');
    elements.leaderboardModal = document.getElementById('leaderboardModal');
    elements.leaderboardList = document.getElementById('leaderboardList');
    elements.nameModal = document.getElementById('nameModal');
    elements.nameInput = document.getElementById('nameInput');
    elements.nameHint = document.getElementById('nameHint');
    elements.submitNameBtn = document.getElementById('submitNameBtn');
    elements.showcaseScore = document.getElementById('showcaseScore');
    elements.showcaseGrade = document.getElementById('showcaseGrade');
}

// 設置事件監聽器
function setupEventListeners() {
    // 控制變更
    elements.beanSelect.addEventListener('change', updateBeanInfo);
    elements.grindSlider.addEventListener('input', updateGrindDisplay);
    elements.tempSlider.addEventListener('input', updateTempDisplay);
    elements.coffeeSlider.addEventListener('input', updateRatio);
    elements.waterSlider.addEventListener('input', updateRatio);
    elements.bloomSlider.addEventListener('input', updateBloomDisplay);
    elements.totalSlider.addEventListener('input', updateTotalDisplay);
    
    // 開始沖煮
    elements.brewStartBtn.addEventListener('click', startBrewing);
    
    // 名字輸入
    elements.nameInput.addEventListener('input', validateName);
    elements.nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !elements.submitNameBtn.disabled) {
            submitToLeaderboard();
        }
    });
    elements.submitNameBtn.addEventListener('click', submitToLeaderboard);
    
    // 排行榜分頁
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchLeaderboardTab(tab);
        });
    });
}

// 更新咖啡豆資訊
function updateBeanInfo() {
    const bean = coffeeBeans[elements.beanSelect.value];
    elements.beanName.textContent = bean.name;
    elements.beanProcess.textContent = bean.process;
    elements.beanRoast.textContent = bean.roast;
    elements.flavorTags.innerHTML = bean.flavors.map(f => 
        `<span class="flavor-tag">${f}</span>`
    ).join('');
}

// 更新顯示
function updateGrindDisplay() {
    const value = elements.grindSlider.value;
    elements.grindValue.textContent = `${value}μm`;
}

function updateTempDisplay() {
    const value = elements.tempSlider.value;
    elements.tempBadge.textContent = `${value}°C`;
}

function updateBloomDisplay() {
    const value = elements.bloomSlider.value;
    elements.bloomValue.textContent = `${value}s`;
}

function updateTotalDisplay() {
    const value = parseInt(elements.totalSlider.value);
    const min = Math.floor(value / 60);
    const sec = value % 60;
    elements.totalValue.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
}

function updateRatio() {
    const coffee = parseInt(elements.coffeeSlider.value);
    const water = parseInt(elements.waterSlider.value);
    const ratio = (water / coffee).toFixed(1);
    
    elements.coffeeValue.textContent = `${coffee}g`;
    elements.waterValue.textContent = `${water}ml`;
    elements.ratioIndicator.textContent = `粉水比 1:${ratio}`;
}

function updateAllDisplays() {
    updateGrindDisplay();
    updateTempDisplay();
    updateBloomDisplay();
    updateTotalDisplay();
    updateRatio();
}

// 粒子系統
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 80;
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 開始沖煮
async function startBrewing() {
    if (gameState.isBrewing) return;
    
    gameState.isBrewing = true;
    elements.brewStartBtn.disabled = true;
    elements.resultCard.classList.remove('show');
    
    // 更新狀態
    updateBrewStatus('brewing', '沖煮中');
    elements.progressBar.classList.add('active');
    
    // 重置視覺效果
    elements.coffeeBed.style.height = '0';
    elements.coffeeFill.style.height = '0%';
    elements.waterStream.style.opacity = '0';
    elements.bloomAnim.style.opacity = '0';
    
    const params = getBrewingParameters();
    const timeScale = 0.2; // 5倍速
    
    // 階段 1: 準備咖啡粉
    await animatePhase('準備咖啡粉', 1500, 0, 10, async () => {
        elements.coffeeBed.style.height = '50px';
        await sleep(500);
    });
    
    // 階段 2: 悶蒸
    const bloomTime = params.bloomTime * 1000;
    await animatePhase('悶蒸中', bloomTime, 10, 30, async () => {
        elements.waterStream.style.height = '70px';
        elements.waterStream.style.opacity = '1';
        elements.waterVolume.textContent = `${Math.floor(params.coffeeAmount * 2)}ml`;
        
        await sleep(300);
        elements.bloomAnim.style.opacity = '1';
        elements.bloomAnim.style.animation = 'bloom 3s ease-out';
        createSteamParticles(5);
        
        await sleep(bloomTime * 0.4 - 300);
        elements.waterStream.style.opacity = '0';
        elements.bloomAnim.style.opacity = '0';
    });
    
    // 階段 3: 主要注水
    const mainTime = (params.totalTime - params.bloomTime) * 1000;
    await animatePhase('注水沖煮中', mainTime, 30, 80, async () => {
        elements.waterStream.style.height = '90px';
        elements.waterStream.style.opacity = '1';
        
        const startWater = Math.floor(params.coffeeAmount * 2);
        const targetWater = params.waterAmount;
        const targetExtract = Math.floor(params.waterAmount * 0.85);
        
        const interval = setInterval(() => {
            if (!gameState.isBrewing) {
                clearInterval(interval);
                return;
            }
            
            const currentHeight = parseFloat(elements.coffeeFill.style.height) || 0;
            if (currentHeight < 75) {
                elements.coffeeFill.style.height = (currentHeight + 1.5) + '%';
                const extractAmount = Math.floor((currentHeight / 75) * targetExtract);
                elements.extractVolume.textContent = `${extractAmount}ml`;
            }
            
            if (Math.random() > 0.5) {
                createSteamParticles(2);
            }
        }, 50);
        
        await sleep(mainTime * timeScale);
        clearInterval(interval);
        elements.waterStream.style.opacity = '0';
        elements.waterVolume.textContent = `${targetWater}ml`;
        elements.extractVolume.textContent = `${targetExtract}ml`;
    });
    
    // 階段 4: 完成
    await animatePhase('沖煮完成', 1500, 80, 100, async () => {
        createSteamParticles(10);
        await sleep(1000);
    });
    
    // 計算結果
    const result = calculateScore(params);
    gameState.lastResult = result;
    
    // 顯示品嘗動畫
    await showTastingAnimation(result);
    
    gameState.isBrewing = false;
    elements.brewStartBtn.disabled = false;
    updateBrewStatus('ready', '就緒');
    
    setTimeout(() => {
        elements.progressBar.classList.remove('active');
    }, 1000);
    
    // 沖煮完成後重置參數
    randomizeParameters();
}

// 動畫階段
let phaseStartTime = 0;

async function animatePhase(stageName, displayDuration, startProgress, endProgress, callback) {
    elements.progressStage.textContent = stageName;
    
    phaseStartTime = Date.now();
    const actualDuration = displayDuration * 0.2; // 5倍速
    const progressRange = endProgress - startProgress;
    
    const updateProgress = () => {
        const elapsed = Date.now() - phaseStartTime;
        const progress = Math.min(elapsed / actualDuration, 1);
        const currentProgress = startProgress + (progressRange * progress);
        
        elements.progressFill.style.width = currentProgress + '%';
        
        const displayElapsed = (elapsed / actualDuration) * displayDuration;
        const seconds = Math.floor(displayElapsed / 1000);
        const ms = Math.floor((displayElapsed % 1000) / 100);
        elements.progressTime.textContent = `${seconds}.${ms}s`;
        
        if (progress < 1) {
            requestAnimationFrame(updateProgress);
        }
    };
    
    updateProgress();
    await callback();
    await sleep(actualDuration);
}

// 更新沖煮狀態
function updateBrewStatus(status, text) {
    const statusDot = elements.brewStatus.querySelector('.status-dot');
    const statusText = elements.brewStatus.querySelector('.status-text');
    
    statusText.textContent = text;
    
    if (status === 'brewing') {
        statusDot.style.background = '#ff9800';
        elements.brewStatus.style.background = 'rgba(255, 152, 0, 0.1)';
        elements.brewStatus.style.borderColor = 'rgba(255, 152, 0, 0.3)';
        statusText.style.color = '#ff9800';
    } else {
        statusDot.style.background = '#4caf50';
        elements.brewStatus.style.background = 'rgba(76, 175, 80, 0.1)';
        elements.brewStatus.style.borderColor = 'rgba(76, 175, 80, 0.3)';
        statusText.style.color = '#4caf50';
    }
}

// 獲取沖煮參數
function getBrewingParameters() {
    return {
        bean: elements.beanSelect.value,
        grindSize: parseInt(elements.grindSlider.value),
        waterTemp: parseInt(elements.tempSlider.value),
        coffeeAmount: parseInt(elements.coffeeSlider.value),
        waterAmount: parseInt(elements.waterSlider.value),
        bloomTime: parseInt(elements.bloomSlider.value),
        totalTime: parseInt(elements.totalSlider.value)
    };
}

// 計算分數
function calculateScore(params) {
    const bean = coffeeBeans[params.bean];
    let score = 100;
    let feedback = [];
    
    const ratio = params.waterAmount / params.coffeeAmount;
    
    // 水溫評分
    const tempDiff = Math.abs(params.waterTemp - bean.idealTemp);
    if (tempDiff === 0) {
        score += 10;
        feedback.push('✓ 水溫完美！');
    } else if (tempDiff <= 2) {
        score += 5;
        feedback.push('✓ 水溫很好');
    } else if (tempDiff <= 4) {
        score -= 5;
        feedback.push('⚠ 水溫稍有偏差');
    } else {
        score -= 15;
        feedback.push(params.waterTemp < bean.idealTemp ? '✗ 水溫過低' : '✗ 水溫過高');
    }
    
    // 研磨度評分
    const grindDiff = Math.abs(params.grindSize - bean.idealGrind);
    if (grindDiff === 0) {
        score += 10;
        feedback.push('✓ 研磨度完美！');
    } else if (grindDiff <= 50) {
        score += 5;
        feedback.push('✓ 研磨度良好');
    } else if (grindDiff <= 100) {
        score -= 5;
        feedback.push('⚠ 研磨度需調整');
    } else {
        score -= 15;
        feedback.push(params.grindSize < bean.idealGrind ? '✗ 研磨過細' : '✗ 研磨過粗');
    }
    
    // 粉水比評分
    const ratioDiff = Math.abs(ratio - bean.idealRatio);
    if (ratioDiff <= 0.1) {
        score += 10;
        feedback.push('✓ 粉水比完美！');
    } else if (ratioDiff <= 1) {
        score += 5;
        feedback.push('✓ 粉水比良好');
    } else if (ratioDiff <= 2) {
        score -= 5;
        feedback.push('⚠ 粉水比需調整');
    } else {
        score -= 10;
        feedback.push('✗ 粉水比不理想');
    }
    
    // 悶蒸時間評分
    if (params.bloomTime >= 28 && params.bloomTime <= 32) {
        score += 5;
        feedback.push('✓ 悶蒸時間完美');
    } else if (params.bloomTime >= 25 && params.bloomTime <= 35) {
        score += 2;
        feedback.push('✓ 悶蒸時間適當');
    } else {
        score -= 5;
        feedback.push('⚠ 悶蒸時間需調整');
    }
    
    // 總時間評分
    if (params.totalTime >= 145 && params.totalTime <= 155) {
        score += 5;
        feedback.push('✓ 沖煮時間完美');
    } else if (params.totalTime >= 140 && params.totalTime <= 160) {
        score += 2;
        feedback.push('✓ 沖煮時間良好');
    } else {
        score -= 5;
        feedback.push('⚠ 沖煮時間需調整');
    }
    
    // 檢查 SSS 等級
    const isSSS = tempDiff === 0 &&
                  grindDiff === 0 &&
                  ratioDiff <= 0.1 &&
                  params.bloomTime >= 28 && params.bloomTime <= 32 &&
                  params.totalTime >= 145 && params.totalTime <= 155;
    
    if (isSSS) {
        score = 200;
        feedback = [
            '🌟 水溫：神級掌控！',
            '🌟 研磨度：完美無瑕！',
            '🌟 粉水比：黃金比例！',
            '🌟 悶蒸：藝術級表現！',
            '🌟 時間：精準到秒！',
            '✨ 你已超越完美，達到傳說境界！'
        ];
    }
    
    score = Math.max(0, Math.min(200, score));
    
    const flavorCount = isSSS ? 5 : Math.min(5, Math.floor(score / 20) + 1);
    const flavors = bean.flavors.slice(0, flavorCount);
    
    return {
        score,
        feedback,
        flavors,
        params,
        isSSS
    };
}

// 品嘗動畫
async function showTastingAnimation(result) {
    elements.tastingModal.classList.add('active');
    
    if (result.isSSS) {
        // SSS 特殊動畫
        elements.tastingModal.style.background = 'radial-gradient(circle, rgba(212, 175, 55, 0.3), rgba(0, 0, 0, 0.95))';
        
        const sssStages = [
            '大師震驚地看著這杯咖啡...',
            '這...這是什麼香氣！？',
            '大師小心翼翼地品嘗...',
            '不可能...這是...！'
        ];
        
        for (const stage of sssStages) {
            elements.tastingMessage.textContent = stage;
            await sleep(2000);
        }
        
        elements.tastingMessage.innerHTML = '<span style="font-size: 1.5em; background: linear-gradient(135deg, #d4af37, #f4e5b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900;">你是咖啡之神！</span>';
        await sleep(3000);
    } else {
        // 一般品嘗
        const stages = [
            '大師正在觀察咖啡色澤...',
            '大師正在聞香...',
            '大師正在品嘗...',
            '大師正在評估風味...'
        ];
        
        for (const stage of stages) {
            elements.tastingMessage.textContent = stage;
            await sleep(2000);
        }
        
        elements.tastingMessage.textContent = '大師正在給出評價...';
        await sleep(1500);
    }
    
    // 顯示評價
    showVerdict(result);
}

// 顯示評價
function showVerdict(result) {
    const grade = getGrade(result.score);
    const gradeColor = getGradeColor(grade);
    
    let title, comment;
    if (result.isSSS) {
        title = '👑 咖啡之神降臨！';
        comment = '這已經超越了完美的境界！每一個參數都達到了神級的精準度。你不僅掌握了咖啡的精髓，更創造了奇蹟！';
    } else if (result.score >= 140) {
        title = '🏆 完美之作！';
        comment = '這是一杯無可挑剔的咖啡！每個參數都恰到好處，風味層次豐富而平衡。';
    } else if (result.score >= 120) {
        title = '⭐ 優秀表現！';
        comment = '這是一杯非常出色的咖啡！風味清晰明亮，只需微調就能達到完美。';
    } else if (result.score >= 100) {
        title = '👍 表現良好！';
        comment = '這是一杯不錯的咖啡，有著令人愉悅的風味。還有進步的空間。';
    } else if (result.score >= 80) {
        title = '😊 還不錯！';
        comment = '這杯咖啡可以喝，但還有明顯的改進空間。';
    } else {
        title = '💪 繼續努力！';
        comment = '這杯咖啡需要改進。別氣餒，多練習幾次，你一定能做出更好的咖啡！';
    }
    
    const verdictHTML = `
        <div class="verdict-content" style="animation: verdictAppear 1s ease-out;">
            <div style="font-size: 2.5em; font-weight: 700; margin-bottom: 20px;">${title}</div>
            <div style="font-size: 4em; font-weight: 800; background: linear-gradient(135deg, #d4af37, #f4e5b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 20px 0;">${result.score}</div>
            <div style="font-size: 3em; font-weight: 800; padding: 15px 40px; background: ${gradeColor}; border-radius: 16px; display: inline-block; margin: 20px 0;">${grade}</div>
            <div style="font-size: 1.3em; color: #ccc; margin: 20px 0; line-height: 1.6;">${comment}</div>
            <button onclick="closeTastingModal()" style="margin-top: 30px; padding: 15px 40px; background: linear-gradient(135deg, #d4af37, #f4e5b8); border: none; border-radius: 12px; font-size: 1.2em; font-weight: 700; color: #1a0f0a; cursor: pointer; transition: all 0.3s;">
                進入排行榜 →
            </button>
        </div>
    `;
    
    elements.verdictDisplay.innerHTML = verdictHTML;
    elements.verdictDisplay.classList.add('show');
}

// 關閉品嘗模態框
window.closeTastingModal = function() {
    elements.tastingModal.classList.remove('active');
    elements.tastingModal.style.background = '';
    
    setTimeout(() => {
        elements.verdictDisplay.innerHTML = '';
        elements.verdictDisplay.classList.remove('show');
        elements.tastingMessage.textContent = '品嘗中...';
    }, 500);
    
    // 顯示名字輸入
    showNameInput();
};

// 顯示名字輸入
function showNameInput() {
    const result = gameState.lastResult;
    if (!result) return;
    
    const grade = getGrade(result.score);
    const gradeColor = getGradeColor(grade);
    
    elements.showcaseScore.textContent = result.score;
    elements.showcaseGrade.textContent = grade;
    elements.showcaseGrade.style.background = gradeColor;
    
    elements.nameModal.classList.add('active');
    elements.nameInput.focus();
}

// 驗證名字
function validateName() {
    const name = elements.nameInput.value.trim();
    
    if (name.length === 0) {
        elements.nameHint.textContent = '請輸入 2-20 個字元';
        elements.nameHint.className = 'name-hint';
        elements.submitNameBtn.disabled = true;
    } else if (name.length < 2) {
        elements.nameHint.textContent = '名字太短，至少需要 2 個字元';
        elements.nameHint.className = 'name-hint error';
        elements.submitNameBtn.disabled = true;
    } else if (name.length > 20) {
        elements.nameHint.textContent = '名字太長，最多 20 個字元';
        elements.nameHint.className = 'name-hint error';
        elements.submitNameBtn.disabled = true;
    } else {
        elements.nameHint.textContent = '✓ 名字符合要求';
        elements.nameHint.className = 'name-hint success';
        elements.submitNameBtn.disabled = false;
    }
}

// 提交到排行榜
function submitToLeaderboard() {
    const name = elements.nameInput.value.trim();
    if (name.length < 2 || name.length > 20) return;
    
    const result = gameState.lastResult;
    if (!result) return;
    
    const entry = {
        name,
        score: result.score,
        grade: getGrade(result.score),
        bean: coffeeBeans[result.params.bean].name,
        timestamp: Date.now(),
        date: new Date().toLocaleDateString('zh-TW')
    };
    
    saveToLeaderboard(entry);
    
    elements.nameModal.classList.remove('active');
    elements.nameInput.value = '';
    
    setTimeout(() => {
        showLeaderboard();
    }, 500);
}

// 儲存到排行榜
function saveToLeaderboard(entry) {
    let leaderboard = JSON.parse(localStorage.getItem('coffeeLeaderboard') || '[]');
    leaderboard.push(entry);
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 100);
    localStorage.setItem('coffeeLeaderboard', JSON.stringify(leaderboard));
    
    // 更新統計
    gameState.stats.totalBrews++;
    if (entry.score >= 140) {
        gameState.stats.perfectBrews++;
    }
    if (entry.score > gameState.stats.highScore) {
        gameState.stats.highScore = entry.score;
    }
    saveStats();
}

// 查看排行榜
let currentLeaderboardTab = 'all';

window.viewLeaderboard = function() {
    showLeaderboard('all');
};

function switchLeaderboardTab(tab) {
    currentLeaderboardTab = tab;
    
    // 更新分頁按鈕樣式
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    showLeaderboard(tab);
}

function showLeaderboard(tab = 'all') {
    let leaderboard = JSON.parse(localStorage.getItem('coffeeLeaderboard') || '[]');
    
    // 根據分頁篩選
    if (tab === 'today') {
        const today = new Date().toLocaleDateString('zh-TW');
        leaderboard = leaderboard.filter(entry => entry.date === today);
    } else if (tab === 'week') {
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        leaderboard = leaderboard.filter(entry => entry.timestamp >= weekAgo);
    }
    
    if (leaderboard.length === 0) {
        elements.leaderboardList.innerHTML = '<div style="text-align: center; padding: 40px; color: #666; font-size: 1em;">還沒有任何記錄</div>';
    } else {
        elements.leaderboardList.innerHTML = leaderboard.map((entry, index) => {
            const gradeColor = getGradeColor(entry.grade);
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            
            return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; margin-bottom: 10px; ${index < 3 ? 'border-color: rgba(212, 175, 55, 0.3);' : ''}">
                    <div style="display: flex; align-items: center; gap: 15px; flex: 1; min-width: 0;">
                        <div style="font-size: 1.5em; font-weight: 700; color: #666; min-width: 40px; flex-shrink: 0;">${medal || (index + 1)}</div>
                        <div style="flex: 1; min-width: 0; overflow: hidden;">
                            <div style="font-size: 1.1em; font-weight: 600; color: #fff; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${entry.name}</div>
                            <div style="font-size: 0.85em; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${entry.bean} • ${entry.date}</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px; flex-shrink: 0;">
                        <div style="font-size: 1.8em; font-weight: 700; color: #d4af37;">${entry.score}</div>
                        <div style="padding: 8px 20px; background: ${gradeColor}; border-radius: 10px; font-weight: 700; font-size: 1.2em;">${entry.grade}</div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    elements.leaderboardModal.classList.add('active');
}

window.closeLeaderboard = function() {
    elements.leaderboardModal.classList.remove('active');
};

// 獲取等級
function getGrade(score) {
    if (score >= 200) return 'SSS';
    if (score >= 140) return 'S';
    if (score >= 120) return 'A';
    if (score >= 100) return 'B';
    if (score >= 80) return 'C';
    return 'D';
}

// 獲取等級顏色
function getGradeColor(grade) {
    const colors = {
        'SSS': 'linear-gradient(135deg, #ff0080, #ff8c00, #ffd700, #00ff00, #00bfff, #8a2be2)',
        'S': 'linear-gradient(135deg, #ffd700, #ffed4e)',
        'A': 'linear-gradient(135deg, #4fc3f7, #29b6f6)',
        'B': 'linear-gradient(135deg, #81c784, #66bb6a)',
        'C': 'linear-gradient(135deg, #ffb74d, #ffa726)',
        'D': 'linear-gradient(135deg, #e57373, #ef5350)'
    };
    return colors[grade] || colors['D'];
}

// 創建蒸氣粒子
function createSteamParticles(count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                left: ${Math.random() * 60 + 20}%;
                bottom: 0;
                animation: steamRise 3s ease-out forwards;
                pointer-events: none;
            `;
            elements.steamParticles.appendChild(particle);
            
            setTimeout(() => particle.remove(), 3000);
        }, i * 100);
    }
}

// 載入統計
function loadStats() {
    const saved = localStorage.getItem('coffeeStats');
    if (saved) {
        gameState.stats = JSON.parse(saved);
    }
}

// 儲存統計
function saveStats() {
    localStorage.setItem('coffeeStats', JSON.stringify(gameState.stats));
}

// 工具函數
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 隨機化參數（每次重置）
function randomizeParameters() {
    const bean = coffeeBeans[elements.beanSelect.value];
    
    // 在理想值附近隨機
    elements.grindSlider.value = bean.idealGrind + Math.floor(Math.random() * 200 - 100);
    elements.tempSlider.value = bean.idealTemp + Math.floor(Math.random() * 8 - 4);
    elements.coffeeSlider.value = 18 + Math.floor(Math.random() * 7); // 18-24g
    elements.waterSlider.value = 250 + Math.floor(Math.random() * 100); // 250-350ml
    elements.bloomSlider.value = 25 + Math.floor(Math.random() * 15); // 25-40s
    elements.totalSlider.value = 130 + Math.floor(Math.random() * 60); // 130-190s
    
    updateAllDisplays();
}

// GM 功能：載入完美預設（需要密碼）
window.loadPreset = function() {
    const password = prompt('🔒 此為 GM 功能，請輸入密碼：');
    
    // 密碼：coffee2026
    if (password !== 'coffee2026') {
        alert('❌ 密碼錯誤！');
        return;
    }
    
    const bean = coffeeBeans[elements.beanSelect.value];
    elements.grindSlider.value = bean.idealGrind;
    elements.tempSlider.value = bean.idealTemp;
    elements.coffeeSlider.value = 20;
    elements.waterSlider.value = 20 * bean.idealRatio;
    elements.bloomSlider.value = 30;
    elements.totalSlider.value = 150;
    updateAllDisplays();
    
    alert('✅ 已載入完美參數！');
};

// 統計
window.showStats = function() {
    const stats = gameState.stats;
    
    // 創建統計模態框
    const statsHTML = `
        <div class="modal-overlay active" id="statsModal" style="z-index: 10000;">
            <div class="modal-content" style="max-width: 500px; padding: 40px; text-align: center;">
                <h2 style="font-size: 2em; margin-bottom: 30px; color: #d4af37;">📊 統計資訊</h2>
                
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <div style="font-size: 0.9em; color: #888; margin-bottom: 8px;">最高分數</div>
                        <div style="font-size: 3em; font-weight: 800; color: #d4af37;">${stats.highScore}</div>
                    </div>
                    
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <div style="font-size: 0.9em; color: #888; margin-bottom: 8px;">完美沖煮</div>
                        <div style="font-size: 3em; font-weight: 800; color: #4caf50;">${stats.perfectBrews}</div>
                    </div>
                    
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <div style="font-size: 0.9em; color: #888; margin-bottom: 8px;">總沖煮次數</div>
                        <div style="font-size: 3em; font-weight: 800; color: #fff;">${stats.totalBrews}</div>
                    </div>
                </div>
                
                <button onclick="closeStatsModal()" style="margin-top: 30px; padding: 15px 40px; background: linear-gradient(135deg, #d4af37, #f4e5b8); border: none; border-radius: 12px; font-size: 1.1em; font-weight: 700; color: #1a0f0a; cursor: pointer;">
                    關閉
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', statsHTML);
};

window.closeStatsModal = function() {
    const modal = document.getElementById('statsModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 400);
    }
};

// 初始化遊戲
document.addEventListener('DOMContentLoaded', init);
