import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.prompt();

rl.on("line", (input) => {
    let command = input.split(" ")[0];
    switch (command) {
        case "exit": rl.close(); return;
        case "echo": handleEcho(input); break;
        default: console.log(`${input}: command not found`);
    }
    rl.prompt();
})

const handleEcho = (input: string)=> {
    input = input.replace("echo ", "");
    console.log(input);
}