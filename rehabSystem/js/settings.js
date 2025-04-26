// htmlのid=rehabilitation1~4のcheckboxのvalueをlocalstorageに保存する
['save', 'homebtn', 'explainbtn'].forEach(function(buttonId) {
    document.getElementById(buttonId).addEventListener('click', function() {
        document.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
            const key = checkbox.id;
            const value = checkbox.checked;
            localStorage.setItem(key, value);
        });
        saveCheckboxStates();
    });
});


// clearボタンが押されたら、index.html?clear=trueにリダイレクトする
document.getElementById('clear').addEventListener('click', function() {
    // index.html?clear=trueにリダイレクトする
    location.href = 'index.html?clear=true';
});

function saveCheckboxStates() {
    let cnt = 0;
    document.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
        const key = checkbox.id;
        const value = localStorage.getItem(key);
        if (value === 'true') {
            checkbox.checked = true;
            cnt++;
        } else {
            checkbox.checked = false;
        }
    });
    // numberofClassにcntを代入する
    if(cnt>0){
        // 同じディレクトリ内のindex.htmlにリダイレクトする
        location.href = 'index.html';
    }else{
        // アラートで「1つ以上選択してください」と表示する
        alert('リハビリは1つ以上選択してください');
    }
}



// localstrage のkey=rehabilitation1~4のvalueを取得して、htmlのid=rehabilitation1~4のcheckboxにチェックを入れる
function loadCheckboxStates() {
    let cnt = 0;
    document.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
        const key = checkbox.id;
        const value = localStorage.getItem(key);
        if (value === 'true') {
            checkbox.checked = true;
            cnt++;
        } else {
            checkbox.checked = false;
        }
    });
    // numberofClassにcntを代入する
    if(cnt>0){
        numberOfClass = cnt;
    }else{
        numberOfClass = 0;
    }
    // localstrageのkey=numberofClassにcntを保存する
    localStorage.setItem('numberofClass', numberOfClass);
}
loadCheckboxStates();