import {createInterface} from 'readline';
import fs from 'fs';
import {access} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import path from 'path';

const PATHS = process.env.PATH?.split(':') ?? [];

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '$ ',
});

rl.prompt();

rl.on('line', async (input) => {
    const [command, ...args] = input.trim().split(/\s+/);

    switch (command) {
        case 'exit':
            rl.close();
            return;
        case 'type':
            await handleType(args[0]);
            break;
        case 'echo':
            handleEcho(args);
            break;
        case 'pwd':
            handlePwd();
            break;
        case 'cd':
            handleCd(args[0]);
            break;
        default:
            const executed = await handleExec(command, args);
            if (!executed) {
                console.log(`${input}: command not found`);
            }
    }
    rl.prompt();
});

const handleType = async (command: string): Promise<void> => {
    const types = ['exit', 'echo', 'type', 'pwd', 'cd'];
    if (types.includes(command)) {
        console.log(`${command} is a shell builtin`);
        return;
    } else {
        for (const path of PATHS) {
            let execPath = path + '/' + command;
            if (fs.existsSync(execPath)) {
                try {
                    await access(execPath, fs.constants.X_OK);
                    console.log(`${command} is ${execPath}`);
                    return;
                } catch (e) {

                }
            }
        }
    }
    console.log(`${command}: not found`);
};

const findExecutable = async (file: string): Promise<string | null> => {
    for (const p of PATHS) {
        let execPath = path.join(p, file);
        if (fs.existsSync(execPath)) {
            try {
                await access(execPath, fs.constants.X_OK);
                return execPath;
            } catch (e) {

            }
        }
    }
    return null;
};

const handleEcho = (args: string[]): void => {
    console.log(...args);
};

const handleExec = async (command: string, args: string[]): Promise<boolean> => {
    const execFilePromise = promisify(execFile);
    const execFilePath = await findExecutable(command);
    if(execFilePath) {
        const {stdout} = await execFilePromise(command, args);
        process.stdout.write(stdout);
        return true;
    }
    return false;
};

const handlePwd = (): void => {
    console.log(process.cwd());
};

const handleCd = (dir: string): void => {
    try {
        if (dir.startsWith('~')) {
            process.chdir(process.env.HOME + dir.slice(1));
            return;
        }
        process.chdir(dir);
    } catch (e) {
        console.log(`cd: ${dir}: No such file or directory`);
    }

}