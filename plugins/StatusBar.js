/**
 * **Created on 12/11/16**
 *
 * plugins/statusBar.js
 * @author André Timermann <andre@andregustvo.org>
 *
 */
'use strict';

const SindriInterfacePlugin = require('../lib/sindriInterfacePlugin');

const blessed = require('blessed');
const os = require('os-utils');
const exec = require('child_process').exec;
const moment = require('moment');
moment.locale('pt-BR');

const _ = require('lodash');

const prettyBytes = require('pretty-bytes');

class StatusBar extends SindriInterfacePlugin {

    constructor(sindriInterface, options) {

        super(sindriInterface, options);


        let statusBar = blessed.box({
            parent: this.sindriInterface.screen,
            tags: true,
            bottom: 0,
            // left: 'center',
            // width: '50%',
            height: 3,
            // height: '50%',
            // content: 'Hello {bold}world{/bold}!',
            // tags: true,
            border: {
                type: 'line',
                fg: 'cyan'
            },
            align: 'right'
        });

        // Altera Limite da Tela
        this.sindriInterface.bottomCorner = 2;

        let cpuUsage = "";

        let netBytesCountReceive = Infinity;
        let diffByteReceive = "";

        let netBytesCountTransmit = Infinity;
        let diffByteTransmit = "";

        // TODO: Criar algoritmo para detectar interface automaticamente ( OU deixar usuário selecionar)
        let networkInterface = options.networkInterface || 'wlan0';

        this.debug('Init StatusBar');

        let tick = () => {

            try {


                if (statusBar) {

                    ///////////////////////////////////////
                    // CPU
                    ///////////////////////////////////////
                    os.cpuUsage(usage => {
                        cpuUsage = `CPU: ${Math.round(usage * 100)}%`;
                    });

                    ///////////////////////////////////////
                    // MEMORY
                    ///////////////////////////////////////

                    let memoryP = (100 - Math.round(os.freememPercentage() * 100)) + "%";

                    let memoryUsage = `${((os.totalmem() - os.freemem()) / 1024).toFixed(2)} / ${((os.totalmem() / 1024).toFixed(2))}G (${memoryP})`;

                    ///////////////////////////////////////
                    // NETWORK RECEIVE
                    ///////////////////////////////////////
                    exec(`cat /proc/net/dev | sed 's,^ *,,; s, *$,,' | grep ${networkInterface} | tr -s " " |  cut -f 2 -d ' '`, (error, stdout, stderr) => {

                        let nowByteReceive = parseInt(stdout) || 0;

                        if (netBytesCountReceive !== Infinity) {
                            diffByteReceive = 'R:' + _.padStart(prettyBytes((nowByteReceive - netBytesCountReceive)) + '/s', 12, ' ');
                        }
                        netBytesCountReceive = nowByteReceive;

                    });

                    ///////////////////////////////////////
                    // NETWORK TRANSMIT
                    ///////////////////////////////////////
                    exec(`cat /proc/net/dev | sed 's,^ *,,; s, *$,,' | grep ${networkInterface} | tr -s " " | cut -f 10 -d ' '`, (error, stdout, stderr) => {

                        let nowByteTransmit = parseInt(stdout);

                        if (netBytesCountReceive !== Infinity) {
                            diffByteTransmit = 'T:' + _.padStart(prettyBytes((nowByteTransmit - netBytesCountTransmit)) + '/s', 12, ' ');
                        }
                        netBytesCountTransmit = nowByteTransmit;

                    });

                    ///////////////////////////////////////
                    // DATA
                    ///////////////////////////////////////
                    let dateTime = `${moment().format('LTS')}`;

                    ///////////////////////////////////////
                    // RENDER
                    ///////////////////////////////////////
                    statusBar.setContent(`${diffByteReceive} {blue-fg}${diffByteTransmit}{/} {yellow-fg}${cpuUsage}{/} {cyan-fg}MEM: ${memoryUsage}{/} {red-fg}${dateTime}{/}`);

                    this.sindriInterface.sync();

                    setTimeout(tick, 1000);

                }
            } catch (err) {

                this.debug(err.message);
                this.debug(err.stack);

            }
        };
        tick();


    }
}


module.exports = StatusBar;