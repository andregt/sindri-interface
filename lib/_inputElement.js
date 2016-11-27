/**
 * **Created on 13/07/16**
 *
 * Box com utilitário para entrada de Usuário
 *
 * lib/inputElement.js
 * @author André Timermann <andre@andregustvo.org>
 *
 */
'use strict';

const blessed = require('blessed');

class InputElement {

    constructor(parent, sindriInterface, options) {

        let self = this;

        self.sindriInterface = sindriInterface;
        self.parent = parent;

        ///////////////////////////////////////////////////////
        // Box Principal
        ///////////////////////////////////////////////////////
        self.inputBox = blessed.box({
            parent: parent || sindriInterface.interface.screen,
            top: `50%`,
            left: '50%',
            height: `50%-${sindriInterface.interface.bottomCorner}`,
            width: '50%',
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
            label: "Interface"
        });


    }

    /**
     * Imprime uma lista de Opções
     *
     * @param text
     * @param options
     */
    radiobox(text, options, confirmLabel) {

        let self = this;

        if (!confirmLabel) confirmLabel = "Aceitar";

        return new Promise(function (resolve, reject) {

            let textInstance = blessed.Text({
                parent: self.inputBox,
                content: text,
                top: 1,
                left: 1,
                tags: true
            });

            // Posição dos botões, varia a medida que cada botão é criado
            let top = 3;
            let left = 1;
            let biggerLength = 0;

            let buttonInstances = [];

            let value;

            options.forEach(function (option) {

                // Não deixar passar do limite do box
                if (top >= (self.inputBox.height - 5 )) {
                    top = 3;
                    left += biggerLength + 5;
                    biggerLength = 0;
                }

                let buttonInstance = blessed.RadioButton({
                    parent: self.inputBox,
                    text: option,
                    top: top,
                    left: left,
                    mouse: true
                });

                buttonInstance.on("check", () => value = buttonInstance.text);

                biggerLength = Math.max(biggerLength, option.length)
                top = top + 1;


                buttonInstances.push(buttonInstance);


            });

            let confirmButtonInstance = self.sindriInterface.createButton({
                parent: self.inputBox,
                value: confirmLabel,
                top: self.inputBox.height - 5,
                left: self.inputBox.width - confirmLabel.length - 9,
            });

            self.sindriInterface.interface.screen.render();

            confirmButtonInstance.on('press', function () {

                // Destroy Elementos
                textInstance.destroy();
                buttonInstances.forEach(function (buttonInstance) {
                    buttonInstance.destroy();
                });

                confirmButtonInstance.destroy();

                self.sindriInterface.interface.screen.render();

                // Retorna Resulta
                resolve(value);

            });


        });


    }

    /**
     * Cria um Prompt baseado na quantidade de botões
     *
     * @param text
     * @param buttons
     * @param height
     * @param width
     * @returns {Promise}
     */
    prompt(text, buttons, height, width) {

        let self = this;

        return new Promise(function (resolve, reject) {

            let textInstance = blessed.Text({
                parent: self.inputBox,
                content: text,
                top: 1,
                left: 1,
                tags: true
            });

            let buttonInstances = [];

            // Posição dos botões, varia a medida que cada botão é criado
            let top = 3;
            let left = 1;

            buttons.forEach(function (buttonLabel) {

                // Não deixar passar do limite do box
                if (left >= (self.inputBox.width - buttonLabel.length - 7 )) {
                    left = 1;
                    top = top + 4;
                }

                let buttonInstance = self.sindriInterface.createButton({
                    parent: self.inputBox,
                    value: buttonLabel,
                    top: top,
                    left: left,
                    height: height,
                    width: width
                });

                left = left + buttonLabel.length + 7;

                buttonInstance.on('press', function () {

                    // Destroy Elementos
                    textInstance.destroy();
                    buttonInstances.forEach(function (buttonInstance) {
                        buttonInstance.destroy();
                    });

                    self.sindriInterface.interface.screen.render();

                    // Retorna Resultado
                    resolve(buttonLabel);

                });

                buttonInstances.push(buttonInstance);

            });

        })
    }


    /**
     * Destroy elementos
     */
    destroy() {

        let self = this;

        self.inputBox.destroy();

    }
}


module.exports = InputElement;