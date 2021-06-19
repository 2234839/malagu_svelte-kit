import './middleware';
import './error_handler';

import './user-controller';
import { autoBind } from '@malagu/core';
export default autoBind();

process.addListener("uncaughtException",(e)=>{
    console.log(e.name);
    console.log(e);
    console.log(e.stack);
})