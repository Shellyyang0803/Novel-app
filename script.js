let isAdmin = false;  // 标识管理员身份

function setLanguage(language) {
    const translations = {
        en: {
            title: "Moliu's Study Room",
            upload: "Upload Novel",
            read: "Read Novel",
            listen: "Listen to Novel",
            checkIn: "Daily Check-In",
            freeReading: "Free Reading",
            points: "Points",
            redeem: "Redeem Points",
            share: "Share for Free Chapter",
        },
        zh: {
            title: "陌柳拂影的书房",
            upload: "上传小说",
            read: "阅读小说",
            listen: "听书",
            checkIn: "每日打卡",
            freeReading: "免费阅读",
            points: "积分",
            redeem: "使用积分兑换",
            share: "分享获取免费章节",
        }
    };

    document.getElementById('title').textContent = translations[language].title;
    document.getElementById('uploadButton').textContent = translations[language].upload;
    // 继续将其他需要切换的文本进行替换...
}

function adminLogin() {
    const adminPassword = document.getElementById('admin-password').value;
    const correctPassword = 'your_admin_password';  // 设定一个固定的管理员密码

    if (adminPassword === correctPassword) {
        isAdmin = true;
        document.getElementById('novel-upload').style.display = 'block';
        document.getElementById('admin-login').style.display = 'none';
        alert("管理员登录成功！你现在可以上传小说。");
    } else {
        alert("密码错误，无法登录。");
    }
}

function uploadNovel() {
    if (!isAdmin) {
        alert("只有管理员可以上传小说。");
        return;
    }

    const title = document.getElementById('novel-title').value;
    const content = document.getElementById('novel-content').value;
    const category = document.getElementById('novel-category').value;

    if (title && content && category) {
        const novels = JSON.parse(localStorage.getItem('novels')) || [];
        novels.push({ title, content, category });
        localStorage.setItem('novels', JSON.stringify(novels));
        alert("小说上传成功！");
        document.getElementById('novel-upload-form').reset();
        displayCategories();
    } else {
        alert("请填写所有字段！");
    }
}

function displayCategories() {
    const categories = {};
    const novels = JSON.parse(localStorage.getItem('novels')) || [];

    novels.forEach(novel => {
        if (!categories[novel.category]) {
            categories[novel.category] = [];
        }
        categories[novel.category].push(novel);
    });

    const categoryList = document.getElementById('categories');
    categoryList.innerHTML = '';

    for (let category in categories) {
        categoryList.innerHTML += `
            <li onclick="displayNovelsByCategory('${category}')">
                ${translateCategoryName(category)} (${categories[category].length})
            </li>
        `;
    }
}

function translateCategoryName(category) {
    const categoryNames = {
        'fantasy': '奇幻类',
        'romance': '言情类',
        'time-travel': '穿越类',
        'children': '儿童读物',
    };
    return categoryNames[category] || category;
}

function displayNovelsByCategory(category) {
    const novelList = document.getElementById('novel-list');
    const novels = JSON.parse(localStorage.getItem('novels')) || [];
    const filteredNovels = novels.filter(novel => novel.category === category);

      novelList.innerHTML = filteredNovels.map((novel, index) => `
        <div class="novel-item" onclick="readNovel(${index})">
            <h3>${novel.title}</h3>
        </div>
    `).join('');
}

function readNovel(index) {
    const novels = JSON.parse(localStorage.getItem('novels'));
    const novel = novels[index];

    document.getElementById('novel-title').textContent = novel.title;
    document.getElementById('novel-content-display').textContent = novel.content;

    document.getElementById('novel-list').style.display = 'none';
    document.getElementById('novel-reader').style.display = 'block';
}

function backToList() {
    document.getElementById('novel-reader').style.display = 'none';
    document.getElementById('novel-list').style.display = 'block';
}

function listenToNovel() {
    const content = document.getElementById('novel-content-display').textContent;
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = 'zh-CN'; // 设置语言为中文，如果需要英文，改为 'en-US'
    speechSynthesis.speak(utterance);
}

function dailyCheckIn() {
    const lastCheckIn = localStorage.getItem('lastCheckIn');
    const today = new Date().toDateString();

    if (lastCheckIn !== today) {
        let points = parseInt(localStorage.getItem('points')) || 0;
        points += 10; // 每次打卡增加10积分
        localStorage.setItem('points', points);
        localStorage.setItem('lastCheckIn', today);
        alert("打卡成功！获得10积分。");
        updatePointsDisplay();
    } else {
        alert("今天已打卡，请明天再来。");
    }
}

function updatePointsDisplay() {
    const points = localStorage.getItem('points') || 0;
    document.getElementById('points-display').textContent = `积分: ${points}`;
}

function redeemPointsForReading() {
    let points = parseInt(localStorage.getItem('points')) || 0;
    if (points >= 100) { // 假设100积分兑换一个章节
        points -= 100;
        localStorage.setItem('points', points);
        alert("成功兑换一个章节！");
        updatePointsDisplay();
    } else {
        alert("积分不足，无法兑换章节。");
    }
}

function shareForFreeChapter() {
    alert("分享成功！你获得了一个免费章节的阅读权。");
    let freeDaysLeft = parseInt(localStorage.getItem('freeDaysLeft')) || 0;
    freeDaysLeft += 1; // 每次分享增加1天免费阅读
    localStorage.setItem('freeDaysLeft', freeDaysLeft);
    updateFreeDaysDisplay();
}

function updateFreeDaysDisplay() {
    const freeDaysLeft = localStorage.getItem('freeDaysLeft') || 10;
    document.getElementById('days-left').textContent = `剩余免费天数: ${freeDaysLeft}`;
}

document.addEventListener('DOMContentLoaded', () => {
    displayCategories();
    updatePointsDisplay();
    updateFreeDaysDisplay();
    updateMemberStatus();
});