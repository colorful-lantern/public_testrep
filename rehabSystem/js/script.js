// progressbar.js@1.0.0 version is used
// Docs: http://progressbarjs.readthedocs.org/en/1.0.0/

// comments

// grobal variables
var numberOfClass = 0;
var nowClass = 0;

// Query parameters are saved to local storage as key-value pairs.
function saveQueryParamsToLocalStorage() {
    const params = new URLSearchParams(location.search);
    params.forEach((value, key) => localStorage.setItem(key, decodeURIComponent(value)));
}
saveQueryParamsToLocalStorage();

// 日付が変わった場合にlocalStorageの古いデータを削除する
(function clearOldDataOnNewDay() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD形式
    const lastAccessDate = localStorage.getItem('lastAccessDate');

    if (lastAccessDate !== today) {
        // 日付が変わった場合、each0~3を削除
        for (let i = 0; i <= 3; i++) {
            localStorage.removeItem(`each${i}`);
        }

        // 1週間以上前のデータを削除
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // 7日前の日付
        const oneWeekAgoString = oneWeekAgo.toISOString().split('T')[0];

        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('status_')) {
                const date = key.split('_')[1];
                if (date < oneWeekAgoString) {
                    localStorage.removeItem(key);
                }
            }
        });

        // 今日の日付を保存
        localStorage.setItem('lastAccessDate', today);
    }
})();

// localstrageのkey(each0~3)のvalueがtrueである場合、cntを足して、その数を、localstrageのkey=nmboftrueに保存する
function saveTrueCountToLocalStorage() {
    let cnt = 0;
    for (let i = 0; i <= 3; i++) {
        const key = `each${i}`;
        const value = localStorage.getItem(key);
        const key2 = `rehabilitation${i + 1}`;
        const value2 = localStorage.getItem(key2);
        if (value === 'true' && value2 === 'true') {
            cnt++;
        }
    }
    localStorage.setItem('nmboftrue', cnt);
    nowClass = cnt;

    // 日付ごとの達成状況を保存
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD形式
    const totalRehabilitations = parseInt(localStorage.getItem('numberofClass') || 0);

    if (cnt === totalRehabilitations && totalRehabilitations > 0) {
        localStorage.setItem(`status_${today}`, 'clear'); // すべて達成した場合は "clear"
    } else {
        localStorage.setItem(`status_${today}`, cnt); // 達成数を保存
    }
}
saveTrueCountToLocalStorage();

// localstrage のkey=rehabilitation1~4のvalueを取得して、htmlのid=rehabilitation1~4のcheckboxにチェックを入れる
function loadCheckboxStates() {
    let cnt = 0;
    for (let i = 1; i <= 4; i++) {
        const key = `rehabilitation${i}`;
        const value = localStorage.getItem(key);
        if (value === 'true') {
            cnt++;
        }
    }
    // numberofClassにcntを代入する
    if(cnt>0){
        numberOfClass = cnt;
    }else{
        // ポップアップで「リハビリテーションを選択してください」と表示する
        alert('初期設定を行います。次の画面で自分のリハビリテーションを種類を選択してください');
        // rehabilitation.htmlにリダイレクトする
        location.href = 'rehabilitation.html';
        return;
    }
    // localstrageのkey=numberofClassにcntを保存する
    localStorage.setItem('numberofClass', numberOfClass);
}
loadCheckboxStates();

// claer local storage when URL contains ?clear=true
if (location.search.includes('clear=true')) {
    var result = confirm('すべてのデータを削除しますか？※削除するとデータを復元することはできません。\nOK: 削除する\nキャンセル: 削除しない');
    if(result == true){
        // localStorageのすべてのデータを削除する
        localStorage.clear();
    }
    // urlに?以下の文字が含まれている場合は、その文字列を消去してからリロードする
    if (location.search) {
        const url = location.href.split('?')[0];
        history.replaceState(null, null, url);
    }
    location.reload();  
};

// Display icons based on local storage values for each0 to each3
function displayIconsBasedOnLocalStorage() {
    for (let i = 0; i <= 3; i++) {
        const key = `each${i}`;
        const value = localStorage.getItem(key);
        const element = document.getElementById(key);

        const key2 = `rehabilitation${i+1}`;
        const value2 = localStorage.getItem(key2);
        const element2 = document.getElementById(key2);

        if (value === 'true') {
            if(value2 === 'false'){
                // 登録処理を行う
                localStorage.setItem(key2, 'true');
                // アラートを表示
                alert('設定されていないリハビリのため、新規登録されました。');
                // リロードする
                location.reload();
                return;
            }
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            icon.setAttribute('class', 'bi bi-check-circle-fill');
            icon.setAttribute('fill', 'green');
            icon.setAttribute('viewBox', '0 0 16 16');
            icon.setAttribute('width', '36'); // Set the width of the icon (e.g., 24px)
            icon.setAttribute('height', '36'); // Set the height of the icon (e.g., 24px)
            icon.innerHTML = `
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 10.97a.75.75 0 0 0 1.07 0l3.992-3.992a.75.75 0 1 0-1.06-1.06L7.5 9.44 6.067 8.007a.75.75 0 1 0-1.06 1.06l1.963 1.963z"/>
            `;
            icon.className = 'fas fa-check-circle'; // Example icon class (Font Awesome)
            icon.style.color = 'green'; // Example icon color
            element.appendChild(icon);

        }else if(value2 === 'false'){
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            icon.setAttribute('class', 'bi bi-dash');
            icon.setAttribute('fill', 'currentColor');
            icon.setAttribute('viewBox', '0 0 16 16');
            icon.setAttribute('width', '36'); // Set the width of the icon (e.g., 24px)
            icon.setAttribute('height', '36'); // Set the height of the icon (e.g., 24px)
            icon.innerHTML = `
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
            `;
            icon.style.color = 'gray'; // Example icon color
            element.appendChild(icon);
        }else{
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            icon.setAttribute('class', 'bi bi-x-circle-fill');
            icon.setAttribute('fill', 'red');
            icon.setAttribute('viewBox', '0 0 16 16');
            icon.setAttribute('width', '36'); // Set the width of the icon (e.g., 24px)
            icon.setAttribute('height', '36'); // Set the height of the icon (e.g., 24px)
            icon.innerHTML = `
                <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z" />
            `;
            icon.style.color = 'red'; // Example icon color
            element.appendChild(icon);
        }
    }
}
displayIconsBasedOnLocalStorage();


// main progress bar
function createProgressBar(container, color, duration, fromColor, toColor, strokeWidth, trailWidth) {
    return new ProgressBar.Circle(container, {
        color: color,
        strokeWidth: strokeWidth,
        trailWidth: trailWidth,
        easing: 'easeInOut',
        duration: duration,
        text: {
            autoStyleContainer: false
        },
        from: { color: fromColor, width: strokeWidth },
        to: { color: toColor, width: strokeWidth },
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);

            var value = Math.round(circle.value() * 100);
            if (value === 0 || numberOfClass === 0) {
                circle.setText('0');
            } else {
                circle.setText(nowClass);
            }
        }
    });
}

// main progress bar
var bar = createProgressBar(container, '#000000', 1400, '#0000ff', '#0000ff', 7, 5);
bar.text.style.fontSize = '3rem';
var animate = nowClass/numberOfClass;
if(animate >1) animate = 1;
bar.animate(animate);  // Number from 0.0 to 1.0

function displayWeeklyStatus() {
    const container = document.getElementById('weekly-status-container');
    container.innerHTML = ''; // コンテナを初期化

    const today = new Date();
    const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土']; // 曜日リスト

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD形式
        const dayOfWeek = daysOfWeek[date.getDay()]; // 曜日を取得

        const status = localStorage.getItem(`status_${dateString}`) || 0; // データがない場合は0
        const totalRehabilitations = parseInt(localStorage.getItem('numberofClass') || 0); // その日のリハビリ数

        // 曜日と数字を含む要素を作成
        const item = document.createElement('div');
        item.className = 'weekly-status-item';

        const dayElement = document.createElement('div');
        dayElement.className = 'day-of-week';
        dayElement.textContent = dayOfWeek; // 曜日を設定

        const statusElement = document.createElement('div');
        statusElement.className = 'status-number';

        if (status === 'clear') {
            // チェックマークを表示
            const checkMark = document.createElement('div');
            checkMark.className = 'check-mark';
            checkMark.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="green" class="bi bi-check-circle-fill" viewBox="0 0 16 16" width="24" height="24">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 10.97a.75.75 0 0 0 1.07 0l3.992-3.992a.75.75 0 1 0-1.06-1.06L7.5 9.44 6.067 8.007a.75.75 0 1 0-1.06 1.06l1.963 1.963z"/>
                </svg>
            `;
            statusElement.appendChild(checkMark);
        } else {
            statusElement.textContent = status; // 数字を設定
        }

        // 曜日と数字を親要素に追加
        item.appendChild(dayElement);
        item.appendChild(statusElement);

        container.appendChild(item);
    }
}
saveTrueCountToLocalStorage();
displayWeeklyStatus();
