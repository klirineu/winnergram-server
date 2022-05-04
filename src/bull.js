import "dotenv";
import Bull from "./lib//bull";

Bull.process();
console.log("wg:bull_queue ➜ is waiting for new jobs...");
