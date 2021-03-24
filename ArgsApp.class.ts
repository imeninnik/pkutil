/**
 *
 Kills the process by port

 https://www.npmjs.com/package/pkg

 */
import { Command } from "commander";
const taskkill = require('taskkill');
const find = require('find-process');


export default class ArgsApp {
    public args = process.argv;

    private _cmdProg;
    private _options;


    constructor() {
        this._cmdProg = new Command();
        this._cmdProg.version('0.0.1');

        this.initOptions();
        this.initHandlers();
    }

    public initOptions() {
        this._cmdProg
            .option('-p, --port <number>', 'find the process listening to the port number'/*, process.argv[2]*/)
            .option('-d, --debug', 'output extra debugging')
            .option('-k, --kill', 'kill the process')
            // .option('-n, --name <string>', 'process name')

        this._cmdProg.parse(this.args)
        this._options = this._cmdProg.opts();


    }

    public initHandlers() {
        if (this._options.debug) console.log(this._options);

        if (this._options.port)  this._handlePort(this._options.port);

        if (this._options.kill)  console.log('SHOOT!');
    }

    //////////////////

    private _handlePort(port) {
        port = parseInt(port);
        if (isNaN(port)) return this._exit(`"${this._options.port}" not a valid port`);

        find('port', port)
            .then(async (list) => {
                if (!list.length) return this._exit(`No processes on port ${port} has been found`);

                if (this._options.kill) {
                    await taskkill([list[0].pid], {force: true});
                    console.log(`Process "${list[0].cmd || list[0].name}" on port ${port} has been terminated`);
                } else {
                    console.log(`Process on port ${port} details: ${'\n' + JSON.stringify(list[0],null, 4) } `);
                }


            }, (err) => this._exit(err.stack || err) )
        ;
    }

    private _exit(details) {
        console.warn(details);
        return process.exit(1);
    }

}


// async function proceedWithName(name) {
//     find('name', name)
//         .then(async (list) => {
//             if (!list.length) return exit(0, `No processes with name ${name} has been found`);
//
//             await taskkill([proc[0].pid], {force: true});
//             console.log(`Process with name "${proc[0].name}" has been terminated`);
//
//
//
//         }, function (err) {
//             return exit(1, err.stack || err);
//         });
// }
