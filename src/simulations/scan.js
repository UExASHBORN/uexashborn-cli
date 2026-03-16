import { cliPrint } from "../renderers/cliRenderer";
import { runSimulation } from "./runner";

export async function runScan(target) {

  const script = [
    "[init] loading scan module...",
    `[init] resolving target ${target}...`,
    "[scan] sending probes...",
    "[scan] discovering open ports...",
    "[analysis] fingerprinting services..."
  ];

  await runSimulation(script);

  cliPrint("");

  cliPrint("PORT      STATE  SERVICE");
  cliPrint("22/tcp    open   ssh");
  cliPrint("80/tcp    open   http");
  cliPrint("443/tcp   open   https");

  cliPrint("");

  cliPrint("Scan complete.");

}