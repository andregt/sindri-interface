/**
 * Created by André Timermann on 30/10/16.
 *
 *
 */
'use strict';

const SindriInterfacePlugin = require('../lib/sindriInterfacePlugin');
const blessed = require('blessed');
const _ = require('lodash');

class inputBox extends SindriInterfacePlugin {


    /**
     *
     * @param sindriInterface {SindriInterface}
     * @param options
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
         * Objeto Pai (Tela)
         * Padrão screen
         *
         */
        this.parent = sindriInterface.screen;

        /**
         * Oculta Box automaticamente após finalizar  questionario
         *
         * @type {boolean}
         */
        this.autoHide = (this.autoHide === undefined) ? true : !!options.autoHide;

        /**
         * Cria Box Principal. (Super.createBox)
         */
        this.inputBox = this.createBox(options || {}, this.parent);


    }


    /**
     * Carrega um input do tipo Prompt
     *
     * @param text      {String}    Texto a Ser Exibido
     * @param buttons   {Array}     Lista de botões
     * @returns {Promise}
     */
    prompt(text, buttons = ['Ok']) {

        this.show();

        return new Promise(resolve => {

            let textInstance = this._createText(text);

            /**
             * Armazena botões para futura remoção
             *
             * @type {Array}
             */
            let buttonInstances = [];

            // Posição dos botões, varia a medida que cada botão é criado
            let top = 3;
            let left = 1;


            // Cria Botão
            for (let buttonLabel of buttons) {

                // Não deixar passar do limite do box
                if (left >= (this.inputBox.width - buttonLabel.length - 7 )) {
                    left = 1;
                    top = top + 4;
                }

                let buttonInstance = this._createButton({
                    value: buttonLabel,
                    top: top,
                    left: left
                });

                left = left + buttonLabel.length + 7;

                buttonInstance.on('press', () => {

                    // Destroy Elementos
                    textInstance.destroy();
                    for (let buttonInstance of buttonInstances) {
                        buttonInstance.destroy();
                    }

                    if (this.autoHide) this.hide();

                    this.sindriInterface.sync();

                    // Retorna Resultado
                    resolve(buttonLabel);

                });

                buttonInstances.push(buttonInstance);

            }


        })

    }


    /**
     * Imprime uma lista de Opções
     *
     * @param text
     * @param options
     * @param confirmLabel
     */
    radiobox(text, options, confirmLabel) {

        if (!confirmLabel) confirmLabel = "Ok";

        this.show();

        return new Promise(resolve => {

            let textInstance = this._createText(text);

            let top = 3;
            let left = 1;
            let biggerLength = 0;

            let buttonInstances = [];

            /**
             * Será retornado como resultado, será o item selecionado
             */
            let value;

            ////////////////////////////////////////////////////////////////////////////////////
            // Organiza Opções em Coluna
            ////////////////////////////////////////////////////////////////////////////////////
            for (let option of options) {

                // Não deixar passar do limite do box
                if (top >= (this.inputBox.height - 5 )) {
                    top = 3;
                    left += biggerLength + 5;
                    biggerLength = 0;
                }

                let radioInstance = this._createRadio(option, top, left);

                radioInstance.on("check", () => value = radioInstance.text);

                biggerLength = Math.max(biggerLength, option.length);
                top = top + 1;

                buttonInstances.push(radioInstance);

            }

            ////////////////////////////////////////////////////////////////////////////////////
            // Cria botão de Confirmação, ficará no canto inferior direito
            ////////////////////////////////////////////////////////////////////////////////////
            let confirmButtonInstance = this._createButton({
                value: confirmLabel,
                top: this.inputBox.height - 5,
                //left: this.inputBox.width - confirmLabel.length - 100 TODO: Bug Aqui, se ficar encostado na direita ou próxima o botão não funciona e seleciona ultimo item
            });


            confirmButtonInstance.on('press', () => {


                // Destroy Elementos
                textInstance.destroy();
                for (let buttonInstance of buttonInstances) buttonInstance.destroy()

                confirmButtonInstance.destroy();

                if (this.options.autoHide) this.hide();

                this.sindriInterface.sync();

                // Retorna Resulta
                resolve(value);

            });

            // Atualiza
            this.sindriInterface.sync();


        });


    }

    /**
     * Destroy elementos
     */
    destroy() {

        this.inputBox.destroy();

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
     * Cria Novo Botão
     * TODO: Criar um plugin apenas para o botão e aproveitar aqui este botão em vez de implementar na própria interface
     *
     * @param options
     * @returns {*}
     * @private
     */
    _createButton(options) {


        return blessed.button({
            parent: this.inputBox,
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
     * Cria Objeto de Texto
     *
     * @param text {String}
     * @private
     */
    _createText(text) {

        return blessed.Text({
            parent: this.inputBox,
            content: text,
            top: this.top,
            left: this.left,
            tags: true
        });

    }


    /**
     * Cria Botão Radio
     *
     * @param option
     * @param top
     * @param left
     * @returns {*}
     * @private
     */
    _createRadio(option, top, left) {

        return blessed.RadioButton({
            parent: this.inputBox,
            text: option,
            top: top,
            left: left,
            mouse: true
        });


    }
}


module.exports = inputBox;