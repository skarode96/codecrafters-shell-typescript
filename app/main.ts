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
        case "type": handleType(input); break;
        case "echo": handleEcho(input); break;
        default: console.log(`${input}: command not found`);
    }
    rl.prompt();
})

const handleType = (input: string): void => {
    input = input.replace("type ", "");
    const types = ["exit", "echo", "type"];
    types.includes(input) ? console.log(`${input} is a shell builtin`) : console.log(`${input}: not found`);
}

const handleEcho = (input: string): void => {
    input = input.replace("echo ", "");
    console.log(input);
}