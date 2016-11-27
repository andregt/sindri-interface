/**
 * **Created on 10/11/16**
 *
 * lib/sindriInterfacePlugin.js
 * @author André Timermann <andre@andregustvo.org>
 *
 *  - this.iface acessa interface
 *  - this.iface.screen acessa objeto screen do blessed
 *
 * - TODO: Borda dos boxes não ficam vermelhos, mesmo quando tem o foco
 */
'use strict';

const _ = require('lodash');
const blessed = require('blessed');

class SindriInterfacePlugin {

    /**
     * Inicializa um Plugin
     *
     * @param sindriInterface     {SindriInterface}   Instancia de uma Interface
     * @param options   {Object}            Lista de Opções
     */
    constructor(sindriInterface, options) {

        if (!(sindriInterface instanceof require('../lib/sindriInterface'))) throw new TypeError("'iface' deve ser instancia de 'SindriInterface'");

        this.sindriInterface = sindriInterface;
        this.options = options;

        /**
         * Indica que este plugin não será carregado internamente no Sindri Interface, normalmente usado em plugin descartável
         *
         * @type {boolean}
         */
        this.include = true;

    }


    /**
     * Cria um Box Padrão para ser usado por váriso Plugins
     *
     * @param options   {Object} Lista de Opções para gerar o Box https://github.com/chjj/blessed#box-from-element
     *  '     options.position  {String} Posição do Box na Tela: LeftTop, LeftBottom, RightTop, RightBottom (No futuro criar mais)

     * @param parent    {Object} Blessed.screen
     * @returns {*}
     */
    createBox(options, parent = this.sindriInterface.screen) {

        let top, left, width, height;

        switch (options.position) {

            case 'LeftTop':
                top = `0%`;
                left = `0%`;
                height = `50%-${this.sindriInterface.bottomCorner}`;
                width = '50%';
                break;

            case 'LeftBottom':
                top = `50%`;
                left = `0%`;
                height = `50%-${this.sindriInterface.bottomCorner}`;
                width = '50%';
                break;

            case 'RightTop':
                top = `0%`;
                left = `50%`;
                height = `50%-${this.sindriInterface.bottomCorner}`;
                width = '50%';
                break;

            case 'RightBottom':
                top = `50%`;
                left = `50%`;
                height = `50%-${this.sindriInterface.bottomCorner}`;
                width = '50%';
                break;

            default:
                top = `0`;
                left = `0`;
                height = `100%-${this.sindriInterface.bottomCorner}`;
                width = '100%';
                break;


        }

        delete options.position;


        return blessed.box(_.defaults(options.box, {
            parent: parent,
            top: top,
            left: left,
            height: height,
            width: width,
            mouse: true,
            border: {
                type: 'line',
                fg: 'cyan'
            },
            style: {
                focus: {
                    border: {
                        fg: 'red'
                    }
                },
            },
            label: options.label,
            hidden: options.hidden || true
        }));


    }

    /**
     * Imprime mensagem na janela de deuperação (F12)
     *
     */
    debug() {
        this.sindriInterface.screen.debug.apply(this.sindriInterface.screen, arguments);
    }

}


module.exports = SindriInterfacePlugin;