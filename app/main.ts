import {createInterface} from 'readline';
import fs from 'fs';
import {access, constants} from 'node:fs/promises';

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '$ ',
});

rl.prompt();

rl.on('line', async (input) => {
    let command = input.split(' ')[0];

    switch (command) {
        case 'exit':
            rl.close();
            return;
        case 'type':
            await handleType(input);
            break;
        case 'echo':
            handleEcho(input);
            break;
        default:
            console.log(`${input}: command not found`);
    }
    rl.prompt();
});

const handleType = async (input: string): Promise<void> => {
    input = input.replace('type ', '');
    const types = ['exit', 'echo', 'type'];
    const paths: string[] = process.env.PATH!.split(':');
    if (types.includes(input)) {
        console.log(`${input} is a shell builtin`);
        return;
    } else {
        for (const path of paths) {
            let execPath = path + '/' + input;
            if (fs.existsSync(execPath)) {
                try {
                    await access(execPath, fs.constants.X_OK);
                    console.log(`${input} is ${execPath}`);
                    return;
                } catch (e) {

                }
            }
        }
    }
    console.log(`${input}: not found`);
};

const handleEcho = (input: string): void => {
    input = input.replace('echo ', '');
    console.log(input);
};
