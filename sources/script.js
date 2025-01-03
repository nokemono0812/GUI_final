function getCSV(){
    let req = new XMLHttpRequest();
    req.open("get", "data/songlist.csv", true);
    req.send(null);
    	
    req.onload = function(){
	    convertCSVtoArray(req.responseText);
    }
}

let songData = [];
let songList = [];
let listMax = 0;
const parent = document.getElementById("list");

function convertCSVtoArray(str){
    let tmp = str.split("\n");

    listMax = tmp.length;

    for(let i = 0; i < tmp.length; i ++){
        songData[i] = tmp[i].split(',');
        songList[i] = i;
        let create = document.createElement("div");
        create.setAttribute("id", "list" + i);
        if(songData[i][6] == "fav"){
            create.setAttribute("class", "list fav");
            create.innerHTML = songData[i][0] + '<span id="star' + i + '" class= "star">♥</span>';
        }
        else{
            create.setAttribute("class", "list");
            create.innerHTML = songData[i][0] + '<span id="star' + i + '" class= "star">♡</span>';
        }
        parent.appendChild(create);
    }
    
    displaySet();
}
 
getCSV();

function displaySet(){
    document.getElementById("list0").classList.remove("list");
    document.getElementById("list0").classList.add("selected");
    document.getElementById("ytPlayer").setAttribute("src", songData[0][3]);
    if(songData[0][2] != ""){
        document.getElementById("lyrics").innerHTML = songData[0][2];
    }
    else{
        document.getElementById("lyrics").innerHTML = "歌詞はありません";
    }
    document.getElementById("composer").innerHTML = songData[0][1];
    document.getElementById("title").innerHTML = songData[0][0];
}

parent.addEventListener("click", function(e){
    if(e.target.id != "list"){
        let star = 0;
        for(let i = 0; i < listMax; i ++){
            if(e.target.id == "star" + i){
                star = 1;
                starClick(e,i);
                i = listMax;
            }
        }
        if(star == 0){
            selectList(e);
        }
    }
});

function starClick(e,n){
    const obj = document.getElementById(e.target.id);
    if(obj.innerHTML == "♥"){
        obj.innerHTML = "♡";
        document.getElementById("list" + n).classList.remove("fav");
        songData[n][6] = "";
    }
    else{
        obj.innerHTML = "♥";
        document.getElementById("list" + n).classList.add("fav");
        songData[n][6] = "fav";
    }
}

function selectList(e){
    let num = 0;
    for(let i = 0; i < listMax; i ++){
        document.getElementById("list" + i).classList.remove("selected");
        document.getElementById("list" + i).classList.add("list");
        if(e.target.id == "list" + i){
            num = i;
        }
    }
    document.getElementById("list" + num).classList.remove("list");
    document.getElementById("list" + num).classList.add("selected");
    if(songData[num][3] == ""){
        document.getElementById("ytPlayer").style.height = "0";
        document.getElementById("ytPlayer").style.margin = "margin: 0 5% 12px 5%;";
        document.getElementById("ytPlayer").setAttribute("src", "");
    }
    else{
        document.getElementById("ytPlayer").style.height = "50vw";
        document.getElementById("ytPlayer").style.margin = "margin: 9px 5% 12px 5%;";
        document.getElementById("ytPlayer").setAttribute("src", songData[num][3]);
    }
    if(songData[num][1] != ""){
        document.getElementById("composer").innerHTML = songData[num][1];
    }
    else{
        document.getElementById("composer").innerHTML = "不明";
    }
    if(songData[num][2] != ""){
        document.getElementById("lyrics").innerHTML = songData[num][2];
    }
    else{
        document.getElementById("lyrics").innerHTML = "歌詞はありません";
    }
    document.getElementById("title").innerHTML = songData[num][0];
}

let submitMode = 0;

const addBtn = document.getElementById("addBtn");
const addMenu = document.getElementById("addDisp");
const mask = document.getElementById("mask");

const randomBtn = document.getElementById("randomBtn");
const sortMenu = document.getElementById("sortDisp");
const mask2 = document.getElementById("mask2");

const addSongBtn = document.getElementById("addSongBtn");
const songAddMenu = document.getElementById("songAddDisp");
const mask3 = document.getElementById("mask3");

const exportBtn = document.getElementById("exportBtn");

const randomSongBtn = document.getElementById("randomSongBtn");

const cancel = document.getElementById("cancel");

const execAddSongBtn = document.getElementById("submit");

addBtn.addEventListener("click", function(){
    addMenu.classList.add("open");
});

randomBtn.addEventListener("click", function(){
    sortMenu.classList.add("open");
});

addSongBtn.addEventListener("click", function(){
    submitMode = 1;
    execAddSongBtn.innerHTML = "追加";
    document.getElementById("winTitle").innerHTML = "曲を追加";
    document.getElementById("formBox").innerHTML = '<span id="err"></span>曲名はなに？ ※<input type="text" class="textInput" placeholder="曲名" id="songNm">作曲者はだれ？<input type="text" class="textInput" placeholder="アーティスト名" id="artistNm">ジャンルはある？<select class="textInput2" id="genre"><option value="">ジャンルなし</option><option value="ロック">ロック</option><option value="ダンス">ダンス</option><option value="J-POP">J-POP</option><option value="アニソン">アニソン</option><option value="演歌">演歌</option></select>歌詞は？<textarea rows="5" class="textInput" placeholder="歌詞" id="lyricsIn"></textarea>YouTubeのリンク<input type="text" class="textInput" placeholder="https://youtu.be/eXamPLe" id="ytIn">';
    songAddMenu.classList.add("open");
    addMenu.classList.remove("open");
});

mask.addEventListener("click", function(){
    addMenu.classList.remove("open");
});

mask2.addEventListener("click", function(){
    sortMenu.classList.remove("open");
});

mask3.addEventListener("click", function(){
    songAddMenu.classList.remove("open");
});

cancel.addEventListener("click", function(){
    songAddMenu.classList.remove("open");
});

execAddSongBtn.addEventListener("click", function(){
    if(submitMode == 1){
        let ans = execAddSong();
        if(ans == 0){
            document.getElementById("err").innerHTML = "曲名だけでもお願いします...<br>";
        }
        else{
            submitMode == 0;
            document.getElementById("err").innerHTML = "";
            songAddMenu.classList.remove("open");
        }
    }
    if(submitMode == 2){
        exportCSV();
        submitMode == 0;
        songAddMenu.classList.remove("open");
    }
});

const shuffleBtn = document.getElementById("shuffleBtn");

shuffleBtn.addEventListener("click", function(){
    songList = shuffle(songList);
    sortMenu.classList.remove("open");
});

function shuffle(list){
    let domList = [];
    for(let i = 0; i < list.length; i ++){
        let r = Math.floor(Math.random() * (i + 1));
        let tmp = list[i];
        list[i] = list[r];
        list[r] = tmp;
    }
    for(let i = 0; i < list.length; i ++){
        let fav = "";
        let favq = 0;
        if(songData[list[i]][6] == "fav"){
            fav = '<span id="star' + list[i] + '" class= "star">♥</span>';
            favq = 1;
        }
        else{
            fav = '<span id="star' + list[i] + '" class= "star">♡</span>';
        }
        if(i == 0){
            if(songData[list[0]][3] == ""){
                document.getElementById("ytPlayer").style.height = "0";
                document.getElementById("ytPlayer").style.margin = "margin: 0 5% 12px 5%;";
                document.getElementById("ytPlayer").setAttribute("src", "");
            }
            else{
                document.getElementById("ytPlayer").style.height = "50vw";
                document.getElementById("ytPlayer").style.margin = "margin: 9px 5% 12px 5%;";
                document.getElementById("ytPlayer").setAttribute("src", songData[list[0]][3]);
            }
            if(songData[list[0]][2] != ""){
                document.getElementById("lyrics").innerHTML = songData[list[0]][2];
            }
            else{
                document.getElementById("lyrics").innerHTML = "歌詞はありません";
            }
            document.getElementById("composer").innerHTML = songData[list[0]][1];
            document.getElementById("title").innerHTML = songData[list[0]][0];
            if(favq == 1){
                domList[i] = '<div class="selected fav" id="list' + list[i] + '">' + songData[list[i]][0] + fav + '</div>';
            }
            else{
                domList[i] = '<div class="selected" id="list' + list[i] + '">' + songData[list[i]][0] + fav + '</div>';
            }
        }
        else{
            if(favq == 1){
                domList[i] = '<div class="list fav" id="list' + list[i] + '">' + songData[list[i]][0] + fav + '</div>';
            }
            else{
                domList[i] = '<div class="list" id="list' + list[i] + '">' + songData[list[i]][0] + fav + '</div>';
            }
        }
    }
    parent.innerHTML = "";
    for(let i = 0; i < list.length; i ++){
        parent.innerHTML += domList[i];
    }
    return list;
}

let rouletteNow = 0;
randomSongBtn.addEventListener("click", function(){
    if(rouletteNow == 0){
        rouletteNow = 1;
        document.getElementById("Q").innerHTML = "？";
        document.getElementById("Q").classList.remove("tikatika");
        document.getElementById("Q").classList.add("guruguru");
        document.getElementById("info").classList.add("open");
        let r = Math.floor(Math.random() * songList.length) + Math.floor(Math.random() * 5) + 50;
        roulette(songList, 0, r, 50);
        sortMenu.classList.remove("open");
    }
});

function roulette(list, num, cnt, fps){
    for(let i = 0; i < listMax; i ++){
        document.getElementById("list" + i).classList.remove("selected");
        document.getElementById("list" + i).classList.add("list");
    }
    document.getElementById("list" + list[num]).classList.add("selected");
    if(cnt > 0){
        if(num + 1 < listMax){
            num ++;
        }
        else{
            num = 0;
        }
        if(fps > 3){
            fps -= 1;
        }
        else{
            fps = 3;
        }
        setTimeout(function(){
            roulette(list, num, cnt - 1, fps);
        }, 1000/fps);
    }
    else{
        if(songData[list[num]][3] == ""){
            document.getElementById("ytPlayer").style.height = "0";
            document.getElementById("ytPlayer").style.margin = "margin: 0 5% 12px 5%;";
            document.getElementById("ytPlayer").setAttribute("src", "");
        }
        else{
            document.getElementById("ytPlayer").style.height = "50vw";
            document.getElementById("ytPlayer").style.margin = "margin: 9px 5% 12px 5%;";
            document.getElementById("ytPlayer").setAttribute("src", songData[list[num]][3]);
        }
        if(songData[list[num]][1] != ""){
            document.getElementById("composer").innerHTML = songData[list[num]][1];
        }
        else{
            document.getElementById("composer").innerHTML = "不明";
        }
        if(songData[list[num]][2] != ""){
            document.getElementById("lyrics").innerHTML = songData[list[num]][2];
        }
        else{
            document.getElementById("lyrics").innerHTML = "歌詞はありません";
        }
        document.getElementById("title").innerHTML = songData[list[num]][0];
        document.getElementById("Q").innerHTML = "！";
        document.getElementById("Q").classList.remove("guruguru");
        document.getElementById("Q").classList.add("tikatika");
        setTimeout(function(){
            document.getElementById("info").classList.remove("open");
            rouletteNow = 0;
        }, 900);
    }
}

function execAddSong(){
    const song = document.getElementById("songNm");
    const artist = document.getElementById("artistNm");
    const genre = document.getElementById("genre");
    const lyrics = document.getElementById("lyricsIn");
    let str = lyrics.value;
    let fixedLyrics = "";
    if(lyrics.value != ""){
        fixedLyrics = str.replace(/(\r\n|\r|\n)/g, "<br>");
    }
    const yt = document.getElementById("ytIn");
    let ytArr = yt.value.split("/");
    let ytIn = "";
    if((ytArr[2] == "www.youtube.com") && (ytArr[3] == "embed")){
        ytIn = yt.value;
    }
    else if(ytArr[2] == "youtu.be"){
        ytIn = "https://www.youtube.com/embed/" + ytArr[3]; 
    }
    if(song.value == ""){
        return 0;
    }
    else{
        listMax ++;
        let newSongData = [];
        newSongData[0] = song.value;
        newSongData[1] = artist.value;
        newSongData[2] = fixedLyrics;
        newSongData[3] = ytIn;
        newSongData[4] = genre.value;
        songData[listMax - 1] = newSongData;
        songList[listMax - 1] = listMax - 1;
        parent.innerHTML += '<div class="list" id="list' + (listMax - 1) + '">' + song.value + '<span id="star' + (listMax - 1) + '" class= "star">♡</span></div>';
        return 1;
    }
}

exportBtn.addEventListener("click", function(){
    submitMode = 2;
    execAddSongBtn.innerHTML = "出力";
    document.getElementById("winTitle").innerHTML = "CSVとしてエクスポート";
    document.getElementById("formBox").innerHTML = 'ファイル名は？<input type="text" class="textInput" placeholder="ファイル名" id="fileNm">';
    songAddMenu.classList.add("open");
    addMenu.classList.remove("open");
});

let cpValue = "";
function exportCSV(){
    for(let i = 0; i < listMax; i ++){
        cpValue += songData[i] + "\n";
    }
    const blob = new Blob([cpValue],{type:"text/csv"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    if(document.getElementById("fileNm").value != ""){
        link.download = document.getElementById("fileNm").value + '.csv';
    }
    else{
        link.download = 'songlist.csv';
    }
    link.click();
}

const noticeParent = document.getElementById("body");
function sorry(){
    let create = document.createElement("div");
    create.setAttribute("class", "notice");
    let r = Math.floor(Math.random()*100);
    if(r < 33){
        create.innerHTML = "ごめんなさい！<br>デモ版では使えません！！";
    }
    else if(r < 66){
        create.innerHTML = "未実装の機能です。<br>制作が間に合いませんでした...";
    }
    else{
        create.innerHTML = "発表に間に合わなかった機能です、<br>申し訳ないです。";
    }
    noticeParent.appendChild(create);
    sortMenu.classList.remove("open");
}
function sorry2(){
    let create = document.createElement("div");
    create.setAttribute("class", "notice");
    let r = Math.floor(Math.random()*100);
    if(r < 33){
        create.innerHTML = "ごめんなさい！<br>デモ版では使えません！！";
    }
    else if(r < 66){
        create.innerHTML = "未実装の機能です。<br>制作が間に合いませんでした...";
    }
    else{
        create.innerHTML = "発表に間に合わなかった機能です、<br>申し訳ないです。";
    }
    noticeParent.appendChild(create);
    addMenu.classList.remove("open");
}
