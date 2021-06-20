import { Component } from '@malagu/core';
import { ErrorHandler,HTTP_ERROR_HANDlER_PRIORITY,Context,HttpError } from '@malagu/web/lib/node';

const list:unknown[] = []
// 调试用
if(1){
    const rawLog = console.log.bind(console)
    console.log = (...arg)=>{
        rawLog(...arg)
        list.push(arg)
    }
}

@Component(ErrorHandler)
export class HttpErrorHandler implements ErrorHandler {
    readonly priority = HTTP_ERROR_HANDlER_PRIORITY;

    canHandle(ctx: Context, err: Error): Promise<boolean> {
        return Promise.resolve(true);
    }

    async handle(ctx: Context, err: Error): Promise<void> {
        ctx.response.statusCode = 500;
        let listStr = "no err"
        try {
            var cache:unknown[] = [];
            listStr = JSON.stringify(list,(key, value) => {
                if (typeof value === 'object' && value !== null) {
                  // Duplicate reference found, discard key
                  if (cache.includes(value)) return "<circular>";

                  // Store value in our collection
                  cache.push(value);
                }
                return value;
              },4)
        } catch (error) {
            listStr = error.stack
        }
        ctx.response.end(err.message+"\n"+err.stack +"\n" + listStr );
    }
}