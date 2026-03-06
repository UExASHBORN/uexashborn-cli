import ashbornSVG from "../assets/ashborn-full.svg?raw";

export function renderIntro(container) {

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
    if(skipBtn) skipBtn.style.display = "block";
    if(skipBtn){
      skipBtn.addEventListener("click", finishIntro);
    }
  },1500);
  document.addEventListener("keydown",(e)=>{
    if(e.key === "Escape"){
      finishIntro();
    }
  });


  function finishIntro(){

    if(inputRow){
      inputRow.style.opacity = "1";
    }
    const boot = document.querySelector(".intro-text-block");
    const final = document.getElementById("intro-final");
    const wrapper = document.querySelector(".ashborn-wrapper");

    if(boot) boot.remove();
    if(final) final.remove();

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

  }

  const log = document.getElementById("intro-log"); 
  const final = document.getElementById("intro-final");

  function showCharacter(){
    const ashbornContainer = document.getElementById("ashborn-container");
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
        "You have found Ashborn.<br>Press ENTER to continue";
      waitForEnter();
    },1500);
  }

  const steps = [
    { text: "searching for ASHBORN...", mode: "command", delay:1200 },
    { mode:"kernelBoot" },
    { text: "match found", mode: "type", delay:800 }
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

    line.appendChild(document.createTextNode(""));
    line.appendChild(cursor);

    log.appendChild(line);

    function type(){

      if(index < text.length){

        line.firstChild.textContent += text[index];
        index++;

        setTimeout(type, 35);

      }
      else{

        if(!step.cursor){
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

      if(index >= kernelLines.length){

        setTimeout(callback,600);
        return;

      }

      const line = document.createElement("div");
      line.textContent = generateTimestamp() + " " + kernelLines[index];

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
    const input = document.getElementById("cli-input");
    const handler = (e)=>{
      if(e.key === "Enter"){
        finishIntro();
        input.removeEventListener("keydown", handler);
      }
      if(e.key === "Escape"){
        finishIntro();
        input.removeEventListener("keydown", handler);
      }
    }
    input.addEventListener("keydown",handler);
  }
  printLine();
}
