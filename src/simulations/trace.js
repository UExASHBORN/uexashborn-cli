import { runSimulation } from "./runner";
import { cliPrint } from "../renderers/cliRenderer";

export async function runTrace(target) {

  const script = [
    "[trace] resolving host...",
    "[trace] sending packets...",
    "hop 1  192.168.0.1",
    "hop 2  10.10.0.1",
    "hop 3  172.16.1.1",
    `hop 4  ${target}`
  ];

  await runSimulation(script);

  cliPrint("");
  cliPrint("Trace complete.");

}