import { on } from "./eventBus";

import hey from "../assets/svg/ashborn-full.svg?raw";
import cool from "../assets/svg/cool-stand.svg?raw";
import wait from "../assets/svg/wait-moment.svg?raw";
import ninja from "../assets/svg/ninja-fight.svg?raw";

const SVG_CACHE = {
  hey,
  cool,
  wait,
  ninja
};

function preloadPoses(){

  Object.values(SVG_CACHE).forEach(raw => {

    const temp = document.createElement("div");
    temp.innerHTML = raw;

  });

}


const SECTION_POSE = {
  root: "hey",
  whoami: "cool",
  soc: "wait",
  games: "ninja"
};

let currentPose = null;

function setPose(pose){

  if(pose === currentPose) return;

  currentPose = pose;

  const wrapper = document.querySelector(".ashborn-wrapper");

  if(!wrapper) return;

  const raw = SVG_CACHE[pose];

  if(!raw) return;

  const temp = document.createElement("div");
  temp.innerHTML = raw;

  const svg = temp.firstElementChild;

  wrapper.innerHTML = "";
  wrapper.appendChild(svg);

}

on("section:enter",(section)=>{

  const pose = SECTION_POSE[section] || "hey";

  setPose(pose);

});

export { preloadPoses };
