import ashbornSVG from "../assets/svg/ashborn-full.svg?raw";
import { dispatch } from "../core/dispatch";

export function renderIntro(container) {
  let introFinished = false;
  let characterShown = false;
  let introActive = true;
  let skipIntro = false;

  const inputRow = document.querySelector(".terminal-input-row");
  if(inputRow){
    inputRow.style.opacity = "0";
  }

  const input = document.getElementById("cli-input");
  if(input){
    input.disabled = true;
  }


  container.innerHTML = `
  <div class="intro-layout">

    <div class="intro-text-block">
      <div id="intro-log"></div>
    </div>

    <div id="ashborn-container"></div>
    <div id="intro-final"></div>
  </div>
  `;

  const skipBtn = document.getElementById("skip-intro");
  setTimeout(()=>{
    if(introFinished) return;
    if(skipBtn) skipBtn.style.display = "block";
    if(skipBtn){
      skipBtn.addEventListener("click", ()=>{
        skipIntro = true;
        introActive = false;  
        const log = document.getElementById("intro-log");
        const final = document.getElementById("intro-final");
        if(log) log.innerHTML = "";
        if(final) final.innerHTML = "";
        revealCharacterInstant();
        setTimeout(finishIntro,50);
      });
    }
  },1500);
  document.addEventListener("keydown",(e)=>{
    if(introFinished) return;

    if(e.key === "Escape"){

      skipIntro = true;
      introActive = false;
      const log = document.getElementById("intro-log");
      const final = document.getElementById("intro-final");
      if(log) log.innerHTML = "";
      if(final) final.innerHTML = "";
      revealCharacterInstant();
      setTimeout(finishIntro, 50); 
    }
  });

  function revealCharacterInstant(){

  const ashbornContainer = document.getElementById("ashborn-container");
  if(!ashbornContainer) return;

  ashbornContainer.innerHTML = `
  <div class="ashborn-wrapper">
    ${ashbornSVG}
  </div>
  `;

}

  function finishIntro(){

  if(introFinished) return;
  introFinished = true;

  const skipBtn = document.getElementById("skip-intro");
  if(skipBtn) skipBtn.style.display = "none";

  const log = document.getElementById("intro-log");
  const final = document.getElementById("intro-final");

  if(log) log.innerHTML = "";
  if(final) final.innerHTML = "";

  const inputRow = document.querySelector(".terminal-input-row");
  if(inputRow){
    inputRow.style.opacity = "1";
  }

  let wrapper = document.querySelector(".ashborn-wrapper");

  if(!wrapper){

    const ashbornContainer = document.getElementById("ashborn-container");

    if(ashbornContainer){
      ashbornContainer.innerHTML = `
        <div class="ashborn-wrapper">
          ${ashbornSVG}
        </div>
      `;
    }

    wrapper = document.querySelector(".ashborn-wrapper");
  }

  if(wrapper){
    wrapper.style.overflow = "visible";
    wrapper.style.height = "auto";
    wrapper.style.transform = "translateX(14vw)";
  }

  const input = document.getElementById("cli-input");

  if(input){
    input.disabled = false;
    input.focus();
  }
  
  document.body.classList.add("intro-complete");
  
  dispatch({ type: "INTRO_COMPLETE" });

}

  const log = document.getElementById("intro-log"); 
  const final = document.getElementById("intro-final");

  function showCharacter(){
    characterShown = true;

    if(!introActive) return;

    const ashbornContainer = document.getElementById("ashborn-container");
    if(!ashbornContainer) return;
    ashbornContainer.innerHTML = `
    <div class="ashborn-wrapper">
    ${ashbornSVG}
    </div>
    `;
    const svg = ashbornContainer.querySelector("svg");
    if(!svg) return;

    const final = document.getElementById("intro-final");
    setTimeout(()=>{
      final.innerHTML =
        "You have found Ashborn.<br>Press [ENTER] to continue";
      waitForEnter();
    },4300);
  }

  const steps = [
    { text: "searching for ASHBORN...", mode: "command", delay:1200 },
    { mode:"kernelBoot" },
    { text: "match found.", mode: "type", delay:800 , cursor:true}
  ];

  const kernelLines = [
    "Initializing Ashborn kernel",
    "Loading spectral modules",
    "Mounting shadow filesystem",
    "Establishing identity link",
    "Starting Ashborn core services",
    "Entity signature detected",
    "Identity confirmed"
  ];
  function generateTimestamp(){
    return "[ " + (Math.random()*2.5).toFixed(3) + " ]";
  }

  let i = 0;

  function printLine(){
    if(skipIntro) return;

    if(i >= steps.length){
      showCharacter();
      return;
    }

    const step = steps[i];
    i++;

    if(step.mode === "html"){
      const line = document.createElement("div");
      line.innerHTML = step.text;
      log.appendChild(line);
      setTimeout(printLine, step.delay || 800);
      return;
    }

    if(step.mode === "kernelBoot"){
      runKernelBoot(printLine);
      return;
    }

    if(step.mode === "command"){
      commandLine(step, printLine);
      return;
    }

    if(step.mode === "type"){
      typeLine(step, printLine);
      return;
    }

    else if(step.mode === "lineDots"){
      lineWithDots(step, printLine);
    }
    else{
      log.innerHTML += step.text + "<br>";
      setTimeout(printLine, step.delay);
    }
  }

  function typeLine(step, callback){

    let index = 0;
    const text = step.text;

    const line = document.createElement("div");
    const cursor = document.createElement("span");

    cursor.className = "cursor";
    cursor.textContent = "█";

    const textNode = document.createTextNode("");
    line.appendChild(textNode);
    line.appendChild(cursor);

    log.appendChild(line);

    function type(){
      if(skipIntro) return;

      if(index < text.length){

        textNode.textContent += text[index];
        index++;

        setTimeout(type, 35);

      }
      else{

      if(step.cursor === false){
        cursor.remove();
      }
        const pause = step.delay || 600;
        setTimeout(callback, pause);
      }
    } 

    type();

  }

  function commandLine(step, callback){

    let index = 0;
    const text = step.text;

    const line = document.createElement("div");

    const prompt = document.createElement("span");
    prompt.textContent = ">>> ";
    prompt.style.color = "#58a6ff";

    const command = document.createElement("span");

    const cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.textContent = "█";

    line.appendChild(prompt);
    line.appendChild(command);
    line.appendChild(cursor);

    log.appendChild(line);

    function type(){
      if(skipIntro) return;

      if(index < text.length){

        command.textContent += text[index];
        index++;

        setTimeout(type,35);

      }
      else{

        cursor.remove();

        const pause = step.delay || 800;
        setTimeout(callback, pause);

      }

    }

    type();

  }

  function runKernelBoot(callback){

    let index = 0;

    function next(){
      if(skipIntro) return;

      if(index >= kernelLines.length){

        setTimeout(callback,600);
        return;

      }

      const line = document.createElement("div");
      line.innerHTML =
      `<span class="kernel-time">${generateTimestamp()}</span><span class="kernel-msg">${kernelLines[index]}</span>`;
      line.style.color = "#8b949e";
      line.style.opacity = "0.85";

      log.appendChild(line);

      index++;

      const delay = 150 + Math.random()*180;
      setTimeout(next, delay);

    }
    next();

  }

  function lineWithDots(step, callback){

    const baseText = step.text;
    const startDelay = step.startDelay || 1000;
    const gap = step.dotGap || 1200;

    const line = document.createElement("div");
    line.textContent = baseText;
    log.appendChild(line);

    let dots = 0;

    function addDot(){

      dots++;

      line.textContent = baseText + ".".repeat(dots);

      if(dots < 3){
        setTimeout(addDot, gap);
      }
      else{
        setTimeout(callback, 400);
      }

    }

    setTimeout(addDot, startDelay);

  }


  function waitForEnter(){
    const handler = (e)=>{
      if(e.key === "Enter"){
      document.removeEventListener("keydown", handler);
      finishIntro();
      }
    }
    document.addEventListener("keydown", handler);  
  }
  printLine();
}
