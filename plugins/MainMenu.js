/**
 * Created by André Timermann on 30/10/16.
 *
 * Plugin para Geração de Menu Principal com trigger para execução de comandos ou métodos/funções
 *
 *
 */
'use strict';

const SindriInterfacePlugin = require('../lib/sindriInterfacePlugin');
const blessed = require('blessed');
const _ = require('lodash');


class MainMenu extends SindriInterfacePlugin {


    /**
     *
     * @param sindriInterface {SindriInterface}
     * @param options
     */
    constructor(sindriInterface, options) {
        super(sindriInterface, options);

        /**
         * Lista de Itens do Menu
         *
         * @type {Array}
         */
        this.menuItens = [];

    }

    /**
     * Adiciona um Item ao Menu
     *
     * @param config {Object}
     */
    addMenu(config) {

        this.menuItens.push(config);

    }


    /**
     * Executado ao renderizar menu
     * Executado automaticamente pelo Plugin
     *
     */
    render() {


        this._createMenuBox();

        // Box de Ajuda
        this.helpMenuBox = blessed.box({
            parent: this.sindriInterface.screen,
            border: {
                type: 'line',
                fg: 'cyan'
            },
            top: 'center',
            left: 35,
            height: 20,
            hidden: true,
            content: " "
        });

        this.updateHelpBox()

        console.log('Renderizando Menu')

    }


    /**
     * Atualiza Informações do Box de Ajuda com o texto do menu atual
     */
    updateHelpBox() {

        let index = this.menuBox.selected;
        let menu = this.menuItens[index];

        this.helpMenuBox.setContent(menu.description);
        this.sindriInterface.sync();

    }


    /**
     * Cria Listagem do Menu
     *
     * @private
     */
    _createMenuBox() {

        // Menu Principal
        this.menuBox = blessed.list({
            parent: this.sindriInterface.screen,
            border: {
                type: 'line',
                fg: 'cyan'
            },
            top: 'center',
            left: 'center',
            height: 20,
            width: 34,
            items: _.map(this.menuItens, "title"),
            style: {
                focus: {
                    border: {
                        fg: 'red'
                    }
                },
                selected: {
                    bg: 'blue'
                }

            },
            keys: true,
            focused: true,
            label: 'Selecione uma Opção (h: Ajuda)',
            mouse: true
        });


        // Eventos
        this.menuBox.key('h', () => this._switchHelpBox());
        this.menuBox.key(["down", "up"], () => this.updateHelpBox());
        this.menuBox.on("select", (element, index) => this.selectMenu(element, index));


    }

    /**
     * Aciona Menu
     *
     * @param element
     * @param index
     */
    selectMenu(element, index) {


        let content = this.menuItens[index];

        if (content.callback) {

            this.menuBox.hide();
            this.helpMenuBox.hide();
            this.sindriInterface.sync();

            // Executa
            // Disponibiliza alguns objetos para facil acesso:
            // - screen  (ex: screen.debug())
            content.callback(this.sindriInterface.screen);
        }

    }

    /**
     * Exibe Menu
     *
     */
    show() {

        this.menuHelp = false;
        this.menuBox.show();
        this.menuBox.focus();

    }

    /**
     * Destroy Menu e seus componentes
     */
    destroy() {

        this.menuBox.destroy();
        this.helpMenuBox.destroy();

    }

    /**
     * Liga Desliga Menu de Ajuda
     *
     * @private
     */
    _switchHelpBox() {

        // Ativa/Desativa Menu de Ajuda (Padrão: Undefined)
        this.menuHelp = !this.menuHelp;

        if (this.menuHelp) {
            this.menuBox.left = 1;
            this.helpMenuBox.show();
        } else {
            this.menuBox.left = 'center';
            this.helpMenuBox.hide();
        }

        this.sindriInterface.sync();


    }



}


module.exports = MainMenu;