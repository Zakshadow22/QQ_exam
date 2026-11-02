const $ = s => document.querySelector(s);
const totalQuestions=60, examDuration=90*60, studentName="Hesham Alshahrany";
const questionText="A 45-year-old male presents to the emergency department with symptoms of severe hypoglycemia. Laboratory evaluation confirms low blood glucose and a defect in pyruvate carboxylase enzyme activity. Which of the following compounds is an obligate allosteric activator that could normally stimulate this enzyme?";
const options=["Acetyl CoA","Malonyl CoA","Citrate","Oxaloacetate"];
let state={screen:"identify",showTools:false,showCalculatorCode:false,showSummary:false,summaryFilter:"all",current:1,answers:{},flags:[],elapsed:0,textSize:14,enteredPassword:"",prepStep:0,expanded:false};
const screens=["identify","exam","upload","exam-list","preparing"];
function showScreen(name){state.screen=name;screens.forEach(id=>$("#"+id).classList.toggle("hidden",id!==name));}
function answered(){return Object.keys(state.answers).length}
function remaining(){return Math.max(examDuration-state.elapsed,0)}
function fmtTime(){return String(Math.floor(remaining()/60)).padStart(2,"0")+":"+String(remaining()%60).padStart(2,"0")}
function progress(){return Math.min(answered()/totalQuestions,1)}
function infoRow(icon,title,value,color=""){return `<div class="info-row"><span class="info-icon">${icon}</span><div class="info-copy"><small>${title}</small><strong style="color:${color||"inherit"}">${value}</strong></div></div>`}
function renderIdentify(){
 $("#identify").innerHTML=`<div class="topbar"><span>‹</span><span>Identify yourself</span></div><div class="line"></div>
 <div class="steps"><div class="step"><b>1</b>Face Snapshot</div><div class="step"><b>2</b>ID Card</div><div class="step active"><b>3</b>Start Exam</div></div>
 <div class="exam-title"><small>Exam</small><strong>ASEER-M1-DIGESTION AND DEFENSE-RESIT FINAL BLOCK EXAM-2025-2026</strong></div>
 ${infoRow("▤","Course","M1 DIGESTION AND DEFENSE II")}
 ${infoRow("◷","Total Duration","02:30:00")}
 ${infoRow("◴","Remaining Duration","02:30:00","#438bff")}
 ${infoRow("文","Language","English")}
 ${infoRow("▣","Proctored","No")}
 <div class="instructions"><h3>Instructions</h3><p>No Instructions Available.</p></div>
 <div class="identify-warning">Dear Student, your exam has already started. You can join the exam within 02:29:38 from the exam started time.<br>Note: If the exam time is over, you will not be able to join it.</div>
 <div class="pad"><button class="btn blue full" id="start-exam">Start Exam</button></div>`;
 $("#start-exam").onclick=showVerification;
}
function renderExam(){
 const pct=Math.round(progress()*100), timePct=Math.min(state.elapsed/examDuration,1)*100;
 $("#exam").innerHTML=`<div class="exam-header">
 <div class="headrow"><div><div class="timer">${fmtTime()} ◷</div><div class="student-label">Student Name</div><div class="student-name">${studentName}</div></div>
 <div class="head-actions"><div class="status">● ▣</div><div class="small-actions"><button id="tools">Tools</button><button id="summary-open">Summary</button></div></div></div>
 <div class="progress-row"><span>Items ${answered()}/${totalQuestions}</span><div class="bar"><i style="width:${pct}%"></i></div><span>${pct}%</span></div>
 <div class="progress-row"><span>Time ${Math.floor(state.elapsed/60)}/150 (mins)</span><div class="bar"><i style="width:${timePct}%"></i></div><span>${Math.round(timePct)}%</span></div>
 <div class="section-label">Default Section</div></div>
 <div class="exam-body"><aside class="sidebar">${Array.from({length:totalQuestions},(_,i)=>{let n=i+1,cls=state.flags.includes(n)?"flagged":state.answers[n]!==undefined?"answered":state.current===n?"current":"";return `<button class="qnum ${cls}" data-q="${n}">${n}</button>`}).join("")}</aside>
 <section class="question-panel"><div class="question-meta"><span>Q.${state.current}</span><span>▲<br>Multi Choice</span><span>Marks: 0.45</span></div>
 <div class="text-controls">Text size <button id="minus">⊖</button><button id="plus">⊕</button><span style="margin-left:auto"></span></div>
 <div class="question-scroll"><p class="question-text" style="font-size:${state.textSize}px">${questionText}</p><p class="select-label">Please Select One Suitable Option</p>
 ${options.map((o,i)=>`<button class="answer ${state.answers[state.current]===i?"selected":""}" data-a="${i}"><span class="radio"></span>${o}</button>`).join("")}</div></section></div>
 <nav class="bottom-nav"><button class="nav-prev" id="prev">Previous</button><div class="nav-middle"><button class="nav-flag" id="flag">${state.flags.includes(state.current)?"Flagged":"Flag"}</button><button class="nav-skip" id="skip">Skip</button></div><button class="${state.current===totalQuestions?"nav-end":"nav-next"}" id="next">${state.current===totalQuestions?"End Exam":"Next"}</button></nav>
 ${state.showTools?renderTools():""}`;
 $("#tools").onclick=()=>{state.showTools=!state.showTools;renderExam()};
 $("#summary-open").onclick=()=>{state.summaryFilter="all";renderSummary()};
 $("#prev").onclick=()=>{state.current=Math.max(1,state.current-1);renderExam()};
 $("#skip").onclick=nextQuestion;
 $("#next").onclick=()=>state.current===totalQuestions?confirmEnd():nextQuestion();
 $("#flag").onclick=()=>{state.flags=state.flags.includes(state.current)?state.flags.filter(n=>n!==state.current):[...state.flags,state.current];renderExam()};
 document.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{state.current=+b.dataset.q;renderExam()});
 document.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{state.answers[state.current]=+b.dataset.a;renderExam()});
 $("#minus").onclick=()=>{state.textSize=Math.max(10,state.textSize-1);renderExam()};
 $("#plus").onclick=()=>{state.textSize=Math.min(22,state.textSize+1);renderExam()};
 if($("#copy-code"))$("#copy-code").onclick=copyCode;
 if($("#close-tools"))$("#close-tools").onclick=()=>{state.showTools=false;renderExam()};
 if($("#calculator"))$("#calculator").onclick=()=>{state.showCalculatorCode=true;renderExam()};
}
function renderTools(){return `<div class="tools-panel"><div class="tools-head"><span>Tools</span><button id="close-tools">×</button></div><div class="tools-items">
 ${state.showCalculatorCode?`<div class="tool-tile"><div class="tool-code">${escapeHTML(state.enteredPassword||"ggy")}</div><button id="copy-code">Copy</button></div>`:`<div class="tool-tile"><button id="calculator">▦</button>Calculator</div>`}
 <div class="tool-tile"><button>✎</button>Whiteboard</div></div></div>`}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function nextQuestion(){state.current=Math.min(totalQuestions,state.current+1);renderExam()}
function showVerification(){
 $("#modal-root").innerHTML=`<div class="modal-backdrop" id="backdrop"><div class="modal"><div class="modal-head"><span>Verification</span><button id="close-modal">X</button></div><div class="modal-body"><input id="password" type="password" placeholder="Examination Password" autocomplete="off"><div id="password-error"></div><button class="btn green full" id="verify">Verify</button></div></div></div>`;
 $("#close-modal").onclick=()=>$("#modal-root").innerHTML="";
 $("#backdrop").onclick=e=>{if(e.target.id==="backdrop")$("#modal-root").innerHTML=""};
 $("#verify").onclick=verifyPassword;
 $("#password").onkeydown=e=>{if(e.key==="Enter")verifyPassword()};
}
function verifyPassword(){
 // The source SwiftUI code never compares the entered password with correctPassword.
 state.enteredPassword=$("#password").value||"ggy";
 $("#modal-root").innerHTML="";
 if(confirm("Confirm App Self-Lock\n\nQQ wants to start Assessment Mode. You will be unable to use other apps on iPad until QQ ends Assessment Mode.\n\nA web app cannot enforce this lock. Continue to the exam simulation?"))startPreparation();
}
function startPreparation(){
 state.prepStep=0;showScreen("preparing");renderPreparing();
 let step=0;const titles=["Setting up your exam...","Verifying exam details...","Preparing your questions...","Loading exam resources...","Initializing your exam...","Your exam is ready"];
 const timer=setInterval(()=>{step++;state.prepStep=step;renderPreparing();if(step>=6){clearInterval(timer);setTimeout(()=>{showScreen("exam");renderExam()},500)}},1100);
}
function renderPreparing(){
 const titles=["Setting up your exam...","Verifying exam details...","Preparing your questions...","Loading exam resources...","Initializing your exam...","Your exam is ready"];
 $("#preparing").innerHTML=`<div class="preparing-wrap"><div style="font-size:24px">▣</div><h2>Preparing Your Exam</h2><p>Please wait while we securely prepare your exam.</p>${titles.map((t,i)=>`<div class="prep-step"><div class="prep-dot">${i<state.prepStep?"✓":i===state.prepStep?"•":""}</div><span style="opacity:${i<=state.prepStep?1:.4};font-weight:${i<=state.prepStep?700:400}">${t}</span></div>`).join("")}</div>`;
}
function renderSummary(){
 showScreen("summary");
 const filters=[["all","All","#777"],["notAttempted","Not Attempted","#275bb4"],["attempted","Attempted","#209b55"],["skipped","Skipped","#275bb4"],["flagged","Flagged","#e28a1b"]];
 let nums=Array.from({length:totalQuestions},(_,i)=>i+1).filter(n=>{
  if(state.summaryFilter==="all")return true;
  if(state.summaryFilter==="notAttempted"||state.summaryFilter==="skipped")return state.answers[n]===undefined;
  if(state.summaryFilter==="attempted")return state.answers[n]!==undefined;
  return state.flags.includes(n);
 });
 $("#summary").innerHTML=`<div class="summary-head"><span>Answer Sheet Summary</span><button id="summary-close">×</button></div>
 <div class="filters">${filters.map(([id,label,color])=>`<button class="filter ${state.summaryFilter===id?"active":""}" data-filter="${id}"><i style="background:${color}"></i>${label}</button>`).join("")}</div>
 <div class="grid-wrap"><div class="answer-grid">${nums.map(n=>`<button class="${state.flags.includes(n)?"flagged":state.answers[n]!==undefined?"answered":""}" data-summary-q="${n}">${n}</button>`).join("")}</div></div>
 <div class="summary-foot"><button id="end-from-summary">End Exam</button></div>`;
 $("#summary-close").onclick=()=>{showScreen("exam");renderExam()};
 document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{state.summaryFilter=b.dataset.filter;renderSummary()});
 document.querySelectorAll("[data-summary-q]").forEach(b=>b.onclick=()=>{state.current=+b.dataset.summaryQ;showScreen("exam");renderExam()});
 $("#end-from-summary").onclick=confirmEnd;
}
function confirmEnd(){if(confirm("Are you sure you want to end the exam?")){showScreen("upload");renderUpload()}}
function renderUpload(){
 $("#upload").innerHTML=`<div class="upload-title"><span style="color:#39b66b">●</span> Exam data uploaded successfully!</div><div class="upload-card"><div style="display:flex;justify-content:space-between;font-size:10px;color:#ffffff80"><span>Uploaded</span><span>100%</span></div><div class="upload-bar"><i></i></div></div><div class="upload-footer"><button class="btn blue full" id="exam-list-btn">Exam List</button></div>`;
 $("#exam-list-btn").onclick=()=>{showScreen("exam-list");renderExamList()};
}
function renderExamList(){
 $("#exam-list").innerHTML=`<div class="exam-list-head"><div class="welcome"><small>Welcome</small>${studentName}</div><div class="muted">⟳　⌕　☷　ⓘ</div></div>
 <div class="exam-tabs"><div class="active">Summative</div><div>Formative</div></div>
 <div class="list-summary"><span>Total Exams: 1</span><span>Open All <input type="checkbox" id="open-all"></span></div>
 <div class="exam-card"><button class="exam-card-head" id="expand-exam" style="width:100%;text-align:left"><span>ASEER-M1-DIGESTION AND DEFENSE-RESIT FINAL BLOCK EXAM-2025-2026</span><span style="white-space:nowrap;font-weight:500;color:#ffffff90">17 Aug 2026<br><small>10:00 AM</small></span><span>⌄</span></button><div class="exam-details hidden" id="exam-details">${detail("Course","M1 DIGESTION AND DEFENSE II")}${detail("Duration","02:30:00")}${detail("Proctored","No")}${detail("Status","Exam Ended","#438bff")}${detail("Upload Status","Uploaded")}<button class="btn blue full">View Score</button></div></div>`;
 const toggle=()=>$("#exam-details").classList.toggle("hidden");
 $("#expand-exam").onclick=toggle;
 $("#open-all").onchange=e=>$("#exam-details").classList.toggle("hidden",!e.target.checked);
}
function detail(a,b,c=""){return `<div class="detail-row"><span>${a}</span><strong style="color:${c||"inherit"}">${b}</strong></div>`}
function copyCode(){const value=state.enteredPassword||"ggy";if(navigator.clipboard?.writeText)navigator.clipboard.writeText(value);else{const t=document.createElement("textarea");t.value=value;document.body.append(t);t.select();document.execCommand("copy");t.remove()}$("#toast").classList.remove("hidden");setTimeout(()=>$("#toast").classList.add("hidden"),1500)}
renderIdentify();
setInterval(()=>{if(state.screen==="exam"&&remaining()>0){state.elapsed++;const scroll=$(".question-scroll")?.scrollTop||0;renderExam();if($(".question-scroll"))$(".question-scroll").scrollTop=scroll}},1000);
if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.error))}
