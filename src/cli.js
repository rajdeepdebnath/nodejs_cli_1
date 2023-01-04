import arg from 'arg'
import inquirer from 'inquirer';

function parseArgIntoOptions(rawArgs){
    const args = arg({
        '--git': Boolean,
        '--yes': Boolean,
        '--imstall': Boolean,
        '-g':'--git',
        '-y':'--yes',
        '-i':'--install'
    },
    {
        argv: rawArgs.slice(2),
    });
    return {
        skipPrompt: args['--yes'] || false,
        git: args['--git'] || false,
        template: args._[0],
        install: args['--install'] || false,
    }
}

async function promptForMissingItems(options){
    if(options.skipPrompt){
        return {
            ...options,
            template: "Javascript"
        }
    }

    const questions = [];
    if(!options.template){
        questions.push({
            type:'list',
            name:'template',
            message:'Please choose which project template to use for',
            choices: ['Javascript', 'Typescript'],
            default: "Javascript"
        });
    }

    if(!options.git){
        questions.push({
            type:'confirm',
            name:'git',
            message:"Initialize git repository",
            default:false
        });
    }

    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        template: options.template || answers.template,
        git: options.git || answers.git
    }
}

export async function cli(args){
    let options = parseArgIntoOptions(args);
    options = await promptForMissingItems(options);
    console.log(args);
    console.log(options);
}