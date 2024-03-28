// utils/pythonRunner.js

import { exec } from 'child_process';

const pythonRunner = (scriptPath, additionalArgs = []) => {
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

export default pythonRunner;
