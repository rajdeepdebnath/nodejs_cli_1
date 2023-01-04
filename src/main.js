import path from 'path';
import ncp from 'ncp';
import {promisify} from 'util';
import fs from 'fs'


const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options){
    return await copy(options.templateDirectory, options.targetDirectory, { clobber:false});
}

export async function createProject(options){
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    }

    const templateDir = path.join(
        __dirname,
        '../templates',
        options.template.toLowerCase()
    );

    options.templateDirectory = templateDir;

    try{
        await access(options.templateDirectory, fs.constants.R_OK);
    }catch(err){
        console.log(err);
        process.exit(1);
    }

    console.log(options);
    await copyTemplateFiles(options);
    console.log("DONE...");

    return true;
}