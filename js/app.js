const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const KEY="pomodoroProV4";
const defaults={tomatoes:0,minutes:0,totalMinutes:0,streak:1,tasks:[],notify:false,history:[0,0,0,0,0,0,0]};
let data=JSON.parse(localStorage.getItem(KEY)||"null")||defaults;
let timer={seconds:1500,running:false,mode:"focus",interval:null};
let deferredPrompt=null;

function save(){localStorage.setItem(KEY,JSON.stringify(data));renderAll()}
function renderAll(){
  $("#statTomatoes").textContent=data.tomatoes;$("#statMinutes").textContent=data.minutes;$("#statStreak").textContent=data.streak;
  $("#goalCount").textContent=Math.min(data.tomatoes,8);$("#goalProgress").style.width=Math.min(data.tomatoes/8*100,100)+"%";
  $("#totalMinutes").textContent=data.totalMinutes;
  $("#notifyStatus").textContent=data.notify?"开启":"关闭";
  renderTasks();renderChart();
}
function setGreeting(){const h=new Date().getHours();$("#greeting").textContent=(h<6?"夜深了":h<12?"早上好":h<18?"下午好":"晚上好")+" 👋"}
function fmt(s){return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
function drawTimer(){
  $("#time").textContent=fmt(timer.seconds);
  const total=timer.mode==="focus"?1500:300;
  const p=(1-timer.seconds/total)*100;
  $("#timerRing").style.setProperty("--progress",p+"%");
  $("#modeLabel").textContent=timer.mode==="focus"?"专注时间":"休息时间";
  $("#timerState").textContent=timer.running?"专注进行中":(timer.mode==="focus"?"准备开始":"休息中");
  $("#startBtn").textContent=timer.running?"Ⅱ 暂停":"▶ 开始"+(timer.mode==="focus"?"专注":"休息");
}
function finishTimer(){
  timer.running=false;clearInterval(timer.interval);
  if(timer.mode==="focus"){
    data.tomatoes++;data.minutes+=25;data.totalMinutes+=25;
    data.history[(data.history.length-1)] = (data.history[data.history.length-1]||0)+25;
    save(); alert("🍅 专注完成！休息一下吧");
    timer.mode="break";timer.seconds=300;
  }else{timer.mode="focus";timer.seconds=1500;alert("☀️ 休息结束，准备下一轮专注吧");}
  drawTimer();
}
function toggleTimer(){
  timer.running=!timer.running;
  if(timer.running){timer.interval=setInterval(()=>{timer.seconds--;drawTimer();if(timer.seconds<=0)finishTimer()},1000)}
  else clearInterval(timer.interval);
  drawTimer();
}
function resetTimer(){timer.running=false;clearInterval(timer.interval);timer.mode="focus";timer.seconds=1500;drawTimer()}
function switchTab(tab){
  const map={home:"homePanel",focus:"homePanel",tasks:"tasksPanel",stats:"statsPanel",ai:"aiPanel",profile:"profilePanel"};
  $$(".screen").forEach(x=>x.classList.remove("active"));$("#"+map[tab]).classList.add("active");
  $$(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.tab===tab));
  if(tab==="focus")window.scrollTo({top:120,behavior:"smooth"});
  else window.scrollTo({top:0,behavior:"smooth"});
}
function renderTasks(){
  const box=$("#taskList");box.innerHTML="";
  if(!data.tasks.length){box.innerHTML='<div class="card" style="padding:30px;text-align:center;color:#a2948f">还没有任务，添加今天的第一件事吧 ✨</div>';return}
  data.tasks.forEach((t,i)=>{
    const el=document.createElement("div");el.className="task-item "+(t.done?"done":"");
    el.innerHTML=`<button class="check">${t.done?"✓":""}</button><div class="task-text">${escapeHtml(t.text)}</div><button class="delete-task">×</button>`;
    el.querySelector(".check").onclick=()=>{t.done=!t.done;save()};
    el.querySelector(".delete-task").onclick=()=>{data.tasks.splice(i,1);save()};
    box.appendChild(el);
  })
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function addTask(){
  const v=$("#taskInput").value.trim();if(!v)return;
  data.tasks.unshift({text:v,done:false});$("#taskInput").value="";save();
}
function renderChart(){
  const c=$("#chart"),vals=data.history||defaults.history, days=["一","二","三","四","五","六","日"],max=Math.max(25,...vals);
  c.innerHTML=vals.map((v,i)=>`<div class="bar-col"><div class="bar" style="height:${Math.max(4,v/max*120)}px"></div><small>${days[i]}</small></div>`).join("");
}
function generatePlan(){
  const goal=$("#aiGoal").value.trim()||"完成今天的学习任务",hours=Math.max(1,Math.min(12,+$("#aiHours").value||3)),n=Math.max(2,Math.round(hours*60/30));
  const types=["核心学习","练习巩固","错题/复盘","输出总结"],box=$("#planResult");box.innerHTML="";
  for(let i=0;i<n;i++){const type=types[i%types.length];const el=document.createElement("div");el.className="plan-item";el.innerHTML=`<strong>${i+1}. ${type} · 25分钟</strong><p>${goal}｜完成一个番茄后休息5分钟，记录完成情况。</p>`;box.appendChild(el)}
}
$("#startBtn").onclick=toggleTimer;$("#resetBtn").onclick=resetTimer;$("#quickFocus").onclick=()=>{switchTab("focus");toggleTimer()};
$("#addTaskBtn").onclick=()=>$("#taskInput").focus();$("#saveTaskBtn").onclick=addTask;$("#taskInput").addEventListener("keydown",e=>{if(e.key==="Enter")addTask()});
$("#generatePlan").onclick=generatePlan;
$$("[data-tab]").forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));
$("#notifyBtn").onclick=async()=>{if(!("Notification"in window)){alert("当前浏览器不支持通知");return}if(Notification.permission!=="granted")await Notification.requestPermission();data.notify=Notification.permission==="granted";save()};
$("#exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="pomodoro-pro-data.json";a.click();URL.revokeObjectURL(a.href)};
$("#clearBtn").onclick=()=>{if(confirm("确定清除所有本地数据吗？")){localStorage.removeItem(KEY);location.reload()}};
$("#installBtn").onclick=()=>{if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null}else alert("如果浏览器已支持，请使用浏览器菜单中的“添加到主屏幕/安装应用”。")};
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e});
window.addEventListener("load",()=>{setGreeting();renderAll();drawTimer()});
if("serviceWorker"in navigator)navigator.serviceWorker.register("service-worker.js").catch(()=>{});
