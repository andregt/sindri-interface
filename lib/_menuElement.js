/**
 * **Created on 11/07/16**
 *
 *  Elemento Menu
 *
 * lib/menu.js
 * @author André Timermann <andre@andregustvo.org>
 *
 */
'use strict';

const blessed = require('blessed');
const _ = require('lodash');

class MenuElement {

    constructor(menus, parent, screen) {

        let self = this;

        self.screen = screen;

        self.menuHelp = false;
        self.menuItens = menus;

        if (menus.length == 0) {
            throw new Error("Menu Vazio");
        }

        ////////////////////////////////////////////////////////////
        // Elementos
        ////////////////////////////////////////////////////////////

        // Menu Principal
        self.menuBox = blessed.list({
            parent: parent,
            border: {
                type: 'line',
                fg: 'cyan'
            },
            top: 'center',
            left: 'center',
            height: 20,
            width: 34,
            items: _.map(self.menuItens, "title"),
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

        // Box de Ajuda
        self.helpMenuBox = blessed.box({
            parent: parent,
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


        self.updateDescription();

        ////////////////////////////////////////////////////////
        // EVENTOS
        ////////////////////////////////////////////////////////

        self.menuBox.key("h", function () {

            self.menuHelp = !self.menuHelp;

            if (self.menuHelp) {
                self.menuBox.left = 1;
                self.helpMenuBox.show();
            } else {
                self.menuBox.left = 'center';
                self.helpMenuBox.hide();
            }

            self.screen.render();

        });

        self.menuBox.key(["down", "up"], () => self.updateDescription());

        // Executa Menu
        self.menuBox.on("select", (element, index) => self.selectMenu(element, index));

    }

    /**
     * Atualiza Descrição
     */
    updateDescription() {

        let index = this.menuBox.selected;
        let menu = this.menuItens[index];

        this.helpMenuBox.setContent(menu.description);
        this.screen.render();
    }

    /**
     * Aciona um Menu
     */
    selectMenu(element, index) {

        let self = this;

        let content = self.menuItens[index];

        if (content.callback) {

            self.menuBox.hide();
            self.helpMenuBox.hide();
            self.screen.render();

            // Executa
            content.callback();
        }

    }

    show() {

        let self = this;

        self.menuHelp = false;
        self.menuBox.show();
        self.menuBox.focus();

    }

    /**
     * Destroy elementos
     */
    destroy() {

        let self = this;

        self.menuBox.destroy();
        self.helpMenuBox.destroy();

    }
}


module.exports = MenuElement;