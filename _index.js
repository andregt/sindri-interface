/**
 * **Created on 09/07/16**
 *
 * index.js
 * @author André Timermann <andre@andregustvo.org>
 *
 * Classe Padrão para criação de Interface usando SindriInterface
 *
 * SindriInterface funciona apenas como uma classe abstrata
 *
 */
'use strict';

const blessed = require('blessed');
const moment = require('moment');

const os = require('os-utils');
const Promise = require('bluebird');

const path = require('path');

const fs = require('fs');
Promise.promisifyAll(fs);

const prettyBytes = require('pretty-bytes');

const exec = require('child_process').exec;

const _ = require('lodash');

const subclassof = require('subclassof');

const SindriCli = require('sindri-cli');

moment.locale('pt-BR');

class SindriInterface {

    /**
     * Inicializa Interface, instancia Blessed
     *
     * @param parent  Se esta instancia for uma interface filha carregada de um diretório, será passado parent que representa a classe principal
     */
    constructor(parent) {


        ////////////////////////////////////
        // Inicialização
        ////////////////////////////////////
        if (parent) {

            this.interface = parent.interface;

        } else {

            // Lista de Interfaces (Não deve ficar disponível em interface, pois não deve ser acessado pelos filhos)
            this.interface = {};

            // Sub Interfaces (Não deve ficar disponível em interface, pois não deve ser acessado pelos filhos)
            this.subInterfaces = [];

            // Menu Principal

            // Classe pai
            this.interface.screen = blessed.screen({
                smartCSR: true,
                dockBorders: true
            });

            // Quit on Escape, q, or Control-C.
            this.interface.screen.key(['escape', 'q', 'C-c'], (ch, key) => {
                return process.exit(0);
            });

            // Lista de Scripts do Sindri-cli (Legacy)
            this.legacyScripts = [];

            this.interface.mainMenu = undefined;

            // Atributos da tela, usado para definir o limite onde uma janela pode ser impresso
            this.interface.topCorner = 0;
            this.interface.bottomCorner = 0;
            this.interface.leftCorner = 0;
            this.interface.rightCorner = 0;


        }


    }

    /**
     * Inicializa Sistema de Interface
     */
    start() {

        console.log("Inicializando Sindri Intarface...");
        this.interface.screen.render();

    }

    /**
     * Cria Barra de Status Básico para a Interface
     *
     * // TODO: Colocar Status Bar em outra classe
     * // TODO: retornar instancia em vez de definir global
     *
     */
    createStatusBar() {

        let self = this;

        let statusBar = blessed.box({
            parent: self.interface.screen,
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

        self.interface.bottomCorner = 2;

        let cpuUsage = "";

        let netBytesCountReceive = Infinity;
        let diffByteReceive = "";

        let netBytesCountTransmit = Infinity;
        let diffByteTransmit = "";

        // TODO: Criar algoritmo para detectar interface automaticamente, ou permitir configurar
        let networkInterface = 'wlan0';

        let tick = function () {

            if (statusBar) {

                ///////////////////////////////////////
                // CPU
                ///////////////////////////////////////
                os.cpuUsage(function (usage) {
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
                exec(`cat /proc/net/dev | grep ${networkInterface} | tr -s " " |  cut -f 2 -d ' '`, (error, stdout, stderr) => {

                    let nowByteReceive = parseInt(stdout) || 0;

                    if (netBytesCountReceive !== Infinity) {
                        diffByteReceive = 'R:' + _.padStart(prettyBytes((nowByteReceive - netBytesCountReceive)) + '/s', 12, ' ');
                    }
                    netBytesCountReceive = nowByteReceive;

                });

                ///////////////////////////////////////
                // NETWORK TRANSMIT
                ///////////////////////////////////////
                exec(`cat /proc/net/dev | grep ${networkInterface} | tr -s " " | cut -f 10 -d ' '`, (error, stdout, stderr) => {

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
                self.interface.screen.render();

                setTimeout(tick, 1000);

            }
        };
        tick();


        // blessed.box({
        //     parent: self.interface.screen,
        //     // left: 'center',
        //     // width: '50%',
        //     height: '100%-2',
        //     // height: '50%',
        //     // content: 'Hello {bold}world{/bold}!',
        //     // tags: true,
        //     border: {
        //         type: 'line',
        //         fg: 'cyan'
        //     }
        // });

        // TODO: Definir uma area "livre" para outros boxs

    }


    /**
     * Cria Menu Principal
     *
     * @param {Array.<Object>}  menus   Lista de menus, com atributos: title, description e callback
     * @param {object}          parent  Objeto Parent do Menu (padrão screen)
     */
    createMainMenu(menus) {

        let self = this;

        // Argumentos padrão
        menus = menus || [];

        ///////////////////////////////////////////////////////////
        // Carrega Menus dos scripts e sub interface carregadas
        ///////////////////////////////////////////////////////////


        // TODO: REMOVER Legacy Scripts
        _.forIn(self.legacyScripts, function (scriptInfo, scriptName) {

            // TODO: Criar novo LogRotate para cada execução
            //logRotate.warn(`Carregando '${scriptName}'`);


            // let script = new self.legacyScripts[scriptName]();
            //
            // // Transfere alguns Atributos para o novo Script instanciado
            // script.localPath = process.cwd();


            menus.push({
                title: scriptName,
                description: "Indisponível",
                callback: function () {

                    // TODO: ABRIR NOVO PROCESSO, para ter a capacidade de fechar depois

                    let logRotate = self.createLogRotate({});

                    console.log = function () {
                        let log = _.values(arguments);
                        logRotate.info(_.join(log, ' '));
                    };

                    logRotate.warn(`Executando '${this.title}'...`);

                    let script = new self.legacyScripts[this.title]();
                    // Transfere alguns Atributos para o novo Script instanciado
                    script.localPath = process.cwd();

                    // executa espera um objeto de argv (como é iterativo não tem)
                    script.execute({}, function () {


                        self.interface.mainMenu.show();

                        //TODO: Criar novo LogRotate para cada execução
                        setTimeout(function () {
                            logRotate.destroy();
                            self.interface.screen.render();
                        }, 2000);

                    });

                    // Barra de Status
                    self.createStatusBar();

                    // Carrega Controlador e Monitor de Processo


                }

            });

        });

        self.subInterfaces.forEach(function (interfaceInstance) {
            menus = menus.concat(interfaceInstance.getMenu());
        });

        // Menus Internos
        ///////////////////////////////////////////////////////////

        menus.push({
            title: "-----------------------------------------",
        });

        menus.push({
            title: "Sair",
            description: "Fecha Aplicação. \nAtalhos: q, esc ou ctrl+c",
            callback: function () {
                process.exit(0);
            }
        });

        self.interface.mainMenu = self.createMenu(menus)


    }

    /**
     * Cria um novo Elemento Menu
     *
     * @param menus
     * @param parent
     * @returns {MenuElement}
     */
    createMenu(menus, parent) {

        let self = this;

        let MenuElement = require('./lib/menuElement');
        return new MenuElement(menus, parent || self.interface.screen, self.interface.screen);

    }

    createInputBox(parent) {

        let self = this;

        let inputElement = require('./lib/inputElement');

        return new inputElement(parent, self);

    }

    /**
     * Cria um novo Botão
     *
     * Opções:
     *  parent
     *  top
     *  left
     *  name
     *  value
     *  height
     *  value
     *
     * @param options
     * @returns {*}
     */
    createButton(options) {

        let self = this;

        options = options || {};

        return blessed.button({
            parent: options.parent || self.interface.screen,
            mouse: true,
            keys: true,
            shrink: true,
            top: options.top || 0,
            left: options.left || 0,
            height: parseInt(options.height) || undefined,
            width: parseInt(options.width) || undefined,
            align: 'center',
            name: options.name,
            content: options.value,
            padding: {
                top: 1,
                bottom: 1,
                left: 3,
                right: 3
            },
            style: {
                bg: 'cyan',
                hover: {
                    bg: 'red'
                }
            }
        });
    }


    /**
     * Integração com sindri-cli
     *
     * Carrega Scripts Legados
     *
     * TODO: Substituir Scripts e remover isso aqui
     *
     * @param folder
     */
    loadLegacyScriptsFolder(folder) {

        let self = this;


        // TODO: Criar novo LogRotate para cada execução
        // ////////////////////////////////////////
        // // Instacia Widget de Log
        // ////////////////////////////////////////
        // let logRotate = self.createLogRotate({});
        //
        //
        // ////////////////////////////////////////
        // // Intercepta console.log e write
        // // (Winston usado pelo sindri-framework)
        // ////////////////////////////////////////


        ////////////////////////////////////////
        // Carrega Arquivos
        ////////////////////////////////////////
        if (fs.existsSync(folder)) {

            return fs.readdirAsync(folder).then(function (files) {

                ////////////////////////////////////////
                // Carrega Scripts
                ////////////////////////////////////////
                files.forEach(function (file) {

                    let scriptName = path.basename(file, path.extname(file));

                    let scriptPath = path.join(folder, file);
                    let script = require(scriptPath);


                    if (subclassof(script, SindriCli)) {
                        self.legacyScripts[scriptName] = script;
                        // TODO: Criar novo LogRotate para cada execução
                        //logRotate.info("Script '" + scriptName + "' Carregado!");
                    } else {
                        // TODO: Criar novo LogRotate para cada execução
                        //logRotate.info("Script '" + file + "' inválido, deve ser instancia de SindriCli".red);
                    }
                });

                ////////////////////////////////////////
                // Configura Menu
                ////////////////////////////////////////

                // TODO: Criar novo LogRotate para cada execução
                // setTimeout(function () {
                //     self.createMainMenu(menu);
                //     logRotate.log.hide();
                //     self.interface.screen.render();
                // }, 2000);

            })

        } else {
            // TODO: Criar novo LogRotate para cada execução
            //logRotate.error(folder, "Scripts não encontrados");
        }


    }

    /**
     * Carrega uma Lista de Sub Interfaces apartir do diretório passado
     *
     * @param folder
     */
    loadInterfacesFolder(folder) {

        let self = this;

        ////////////////////////////////////////
        // Carrega Arquivos
        ////////////////////////////////////////
        if (fs.existsSync(folder)) {

            return fs.readdirAsync(folder)

                .then(function (files) {

                    ////////////////////////////////////////
                    // Carrega Scripts
                    ////////////////////////////////////////
                    files.forEach(function (file) {

                        if (path.extname(file) === '.js') {

                            let interfaceName = path.basename(file, path.extname(file));

                            let interfacePath = path.join(folder, file);
                            let interfaceClass = require(interfacePath);


                            if (subclassof(interfaceClass, SindriInterface)) {

                                self.subInterfaces.push(new interfaceClass(self));

                            } else {

                                // TODO: Alert
                                throw  new Error(`Interface '${interfaceName}' deve ser instancia de SindriInterface`);

                            }
                        }
                    });

                })
                .catch(function (err) {

                    self.interface.screen.destroy();
                    console.log(err.message);
                    console.log(err.stack);
                    process.exit();

                })

        } else {
            // TODO: Criar alerta
            throw  new Error("Scripts não encontrados");
        }
    }

    /**
     * Cria um Widget de log
     *
     * TODO: Criar Classe
     *
     * @param options
     */
    createLogRotate(options) {

        let self = this;

        ////////////////////////////////////////////////////////////////////////////////////////////
        // BASE OPTIONS
        ////////////////////////////////////////////////////////////////////////////////////////////
        let baseOptions = {
            parent: self.interface.screen,
            border: {
                type: 'line',
                fg: 'cyan'
            },
            height: '50%',
            width: '50%',
            label: "Console Log",
            tags: true,
            mouse: true,
            keys: true,
            scrollbar: {
                ch: ' ',
                track: {
                    bg: 'yellow'
                },
                style: {
                    inverse: true
                }
            },
            scrolback: 1000,
            style: {
                focus: {
                    border: {
                        fg: 'red'
                    }
                },
            }
        };


        ////////////////////////////////////////////////////////////////////////////////////////////
        // Parâmetros Especiais
        ////////////////////////////////////////////////////////////////////////////////////////////
        if (options && options.position) {
            switch (options.position) {
                case 'left-bottom':
                    baseOptions.top = `50%`;
                    baseOptions.height = `50%-${self.interface.bottomCorner}`;
                    break
            }
        }
        delete options.position;


        // Objeto logRotate
        let logRotate = {};

        logRotate.log = blessed.log(_.defaultsDeep(options, baseOptions));



        logRotate.info = function (message, color) {

            if (color) {
                this.log.add(`{${color}-fg}${message}{/}`);
            } else {
                this.log.add(message);
            }

            // self.interface.screen.render();


        };

        logRotate.warn = function (message) {

            this.log.add(`{yellow-fg}${message}{/}`);
            self.interface.screen.render();

        };

        logRotate.error = function (message) {

            this.log.add(`{red-fg}${message}{/}`);
            self.interface.screen.render();

        };

        logRotate.destroy = function () {
            this.log.destroy();
        };

        logRotate.clear = function () {
            this.log.setContent('');
        };

        // TODO: Pq preciso renderizar aqui
        self.interface.screen.render();

        return logRotate;

    }


    createProgressBar(param) {

        let self = this;

        // TODO: Criar em Classe

    }

    createProcessStat(param) {

        let self = this;

        // TODO: Criar em Classe
    }

    /**
     * Deve retorna uma lista de Objetos que descreve um menu (title, description, callback)
     *
     * @abstract
     */
    getMenu() {

        throw new Error("Not Implemented");

    }
}


module.exports = SindriInterface;