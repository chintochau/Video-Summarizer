// utils/pythonRunner.js

import { exec, spawn } from 'child_process';
//exec for one time output, swpan for streaming response in real time

export const pythonRunner = (scriptPath, additionalArgs = []) => {
    return new Promise((resolve, reject) => {
        const pythonScript = `python ${scriptPath} ${additionalArgs.join(' ')}`;

        const child = exec(pythonScript, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        });

        child.on('exit', (code) => {
            console.log(`Child process exited with code ${code}`);
        });
    });
};


export const checkPackage = () => {
    const pythonProcess = spawn('pip', ['list']);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Python script output:\n ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error occurred in Python script: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
    });

}

export const installPackage = (pythonPackage) => {
    if (!pythonPackage) { return }
    const pythonProcess = spawn('pip', ['install', pythonPackage]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Python script output:\n ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error occurred in Python script: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
    });

}

export const vastai = (command) => {
    if (!command) { return }
    const pythonProcess = spawn('vastai', ['--help']);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Python script output:\n ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error occurred in Python script: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
    });

}

