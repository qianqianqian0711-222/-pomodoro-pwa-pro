let sec=1500,t=null;
let count=Number(localStorage.count||0);
let minutes=Number(localStorage.minutes||0);
document.getElementById('count').innerText=count;
document.getElementById('minutes').innerText=minutes;
function show(){timer.innerText=Math.floor(sec/60).toString().padStart(2,'0')+':'+(sec%60).toString().padStart(2,'0')}
function startTimer(){if(t)return;t=setInterval(()=>{sec--;show();if(sec<=0){clearInterval(t);t=null;count++;minutes+=25;localStorage.count=count;localStorage.minutes=minutes;document.getElementById('count').innerText=count;document.getElementById('minutes').innerText=minutes;alert('专注完成')}} ,1000)}
function resetTimer(){clearInterval(t);t=null;sec=1500;show()}
if('serviceWorker'in navigator){navigator.serviceWorker.register('service-worker.js')}
