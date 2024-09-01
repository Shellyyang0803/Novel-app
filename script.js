// main.js

// Translations
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

function setLanguage(language) {
    document.getElementById('title').textContent = translations[language].title;
    document.getElementById('uploadButton').textContent = translations[language].upload;
    // 继续将其他需要切换的文本进行替换...
}

// Data management
let points = JSON.parse(localStorage.getItem('points')) || 0;
let freeDaysLeft = JSON.parse(localStorage.getItem('freeDaysLeft')) || 10;
let isMember = JSON.parse(localStorage.getItem('isMember')) || false;
let memberExpiryDate = localStorage.getItem('memberExpiryDate');

function updatePointsDisplay() {
    document.getElementById('points-display').textContent = `积分: ${points}`;
}

function updateFreeDaysDisplay() {
    document.getElementById('days-left').textContent = `剩余免费天数: ${freeDaysLeft}`;
}

function dailyCheckIn() {
    const lastCheckIn = localStorage.getItem('lastCheckIn');
    const today = new Date().toDateString();

    if (lastCheckIn !== today) {
        points += 10; // 每次打卡增加10积分
        if (isMember) points += 10; // 会员获得额外积分
        localStorage.setItem('points', JSON.stringify(points));
        localStorage.setItem('lastCheckIn', today);
        alert("打卡成功！获得积分。");
        updatePointsDisplay();
    } else {
        alert("今天已打卡，请明天再来。");
    }
}

function redeemPointsForReading() {
    if (points >= 100) { // 假设100积分兑换一个章节
        points -= 100;
        localStorage.setItem('points', JSON.stringify(points));
        alert("成功兑换一个章节！");
        updatePointsDisplay();
    } else {
        alert("积分不足，无法兑换章节。");
    }
}

function shareForFreeChapter() {
    alert("分享成功！你获得了一个免费章节的阅读权。");
    freeDaysLeft++;
    localStorage.setItem('freeDaysLeft', JSON.stringify(freeDaysLeft));
    updateFreeDaysDisplay();
}

function openMemberArea() {
    const memberArea = document.getElementById('member-area');
    memberArea.style.display = 'block';
}

function becomeMember() {
    isMember = true;
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 会员有效期一年
    memberExpiryDate = expiryDate.toDateString();
    localStorage.setItem('isMember', JSON.stringify(isMember));
    localStorage.setItem('memberExpiryDate', memberExpiryDate);
    alert("恭喜你成为会员！");
    updateMemberStatus();
}

function logoutMember() {
    isMember = false;
    localStorage.removeItem('isMember');
    localStorage.removeItem('memberExpiryDate');
    alert("你已退出会员状态。");
    updateMemberStatus();
}

function updateMemberStatus() {
    const greeting = document.getElementById('member-greeting');
    const memberArea = document.getElementById('member-area');
    if (isMember) {
        greeting.textContent = `欢迎，尊贵的会员！会员有效期至：${memberExpiryDate}`;
        memberArea.style.display = 'block';
    } else {
        greeting.textContent = "欢迎，游客";
        memberArea.style.display = 'none';
    }
}

// Script functionality
function uploadNovel() {
    if (!isMember) {
        alert("此功能仅限会员使用。请先成为会员！");
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
        'fiction': '小说',
        'non-fiction': '非小说',
        'sci-fi': '科幻',
        'fantasy': '奇幻',
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

document.addEventListener('DOMContentLoaded', () => {
    displayCategories();
    updatePointsDisplay();
    updateFreeDaysDisplay();
    updateMemberStatus();
});