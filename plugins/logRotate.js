/**
 * Created by André Timermann on 30/10/16.
 *
 *
 */
'use strict';

const SindriInterfacePlugin = require('../lib/sindriInterfacePlugin');
const blessed = require('blessed');
const _ = require('lodash');


class logRotate extends SindriInterfacePlugin {


    /**
     *
     * @param sindriInterface {SindriInterface}
     * @param options
     * @param label
     * @param position
     */
    constructor(sindriInterface, options) {
        super(sindriInterface, options);

        /**
         * Indica que este plugin não será carregado internamente no Sindri Interface, normalmente usado em plugin descartável
         *
         * @type {boolean}
         */
        this.include = false;


        /**
         * Cria Box Principal. (Super.createBox)
         */
        this.inputBox = this.createBox(options || {});

        this.logObject = blessed.log({
            parent: this.inputBox,
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
            scrolback: 1000
        });


    }

    /**
     * Exibe Box
     */
    show() {
        this.inputBox.show();
    }

    /**
     * Oculta Box
     */
    hide() {
        this.inputBox.hide();
    }


    /**
     * Imprime Mensagem Normal com cor padrão personalizada
     *
     * @param message
     * @param color
     */
    info(message, color) {

        if (color) {
            this.logObject.add(`{${color}-fg}${message}{/}`);
        } else {
            this.logObject.add(message);
        }

    }

    // self.interface.screen.render();


    /**
     * Imprime Texto com cor Amarela
     *
     * @param message
     */
    warn(message) {

        this.logObject.add(`{yellow-fg}${message}{/}`);
        this.sindriInterface.sync();

    }

    /**
     * Imprime Texto na Cor vermelha
     * @param message
     */
    error(message) {

        this.logObject.add(`{red-fg}${message}{/}`);
        this.sindriInterface.sync();

    }

    /**
     * Destroi Objeto
     * TODO: Não funciona, gera erros diversos. Portanto, estou apenas limpando e ocultando
     */
    destroy() {
        // this.logObject.destroy();
        // this.inputBox.destroy();

        this.clear();
        this.hide();

    };


    /**
     * Limpa Log
     */
    clear() {
        this.logObject.setContent('');
    };


}

module.exports = logRotate;