import { runSimulation } from "./runner";
import { cliPrint } from "../renderers/cliRenderer";

export async function runBreach(target) {

  const script = [
    "[breach] initializing exploit module...",
    `[breach] targeting ${target}`,
    "[breach] testing credentials...",
    "[breach] bypass attempt...",
    "[breach] privilege escalation..."
  ];

  await runSimulation(script);

  cliPrint("");
  cliPrint("ACCESS LEVEL: ROOT");
  cliPrint("SESSION ESTABLISHED");

}