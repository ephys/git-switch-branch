'use strict';

const inquirer = require('inquirer');

function exec(command) {
  const exec_ = require('child_process').exec;

  return new Promise((resolve, reject) => {
    exec_(command, (error, stdout) => {
      if (error) {
        return void reject(error);
      }

      resolve(stdout);
    });
  });
}

(async function () {
  const rawBranches = await exec('git --no-pager branch -l');

  const currentBranch = rawBranches.match(/\* (.+)/)[1];

  const branches = rawBranches.split('\n')
    .map(branch => {
      const match = branch.match(/[^ ]+$/);

      if (match) {
        return match[0];
      }

      return null;
    })
    .filter(branch => branch !== null);

  const { branch: newBranch } = await inquirer.prompt([{
    name: 'branch',
    message: 'Select a branch',
    type: 'list',
    default: currentBranch,
    choices: branches,
  }]);

  await exec(`git checkout ${newBranch}`);
  console.log('Switched to branch', newBranch);
}()).catch(e => {
  console.log(e.message);
  process.exit(1);
});
