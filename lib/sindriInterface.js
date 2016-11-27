/**
 * Created by André Timermann on 10/11/16.
 *
 * Class Principal para criação de Intarface usando Sindri Interface, baseado no Blessed
 *
 * Não deve ser herdado, apenas instanciado
 *
 *
 */
'use strict';

const blessed = require('blessed');
const _ = require('lodash');


class SindriInterface {

    constructor(options) {


        // Configuração Padrão
        options = _.defaults(options, {
            title: "Sindri Interface"
        });

        // Instancia screen
        // Configuração extra: https://github.com/chjj/blessed#screen-from-node
        this.screen = blessed.screen({
            smartCSR: true,
            debug: true,
            dockBorders: true,
            title: options.title
        });


        // Atalho para sair
        this.screen.key(['escape', 'q', 'C-c'], (ch, key) => {
            return process.exit(0);
        });

        // Atributos da tela, usado para definir o limite onde uma janela pode ser impresso
        // Pode ser usado por plugins que desejam fixar em uma extremidade da dela e diminuir a area disponível
        // TODO: Implementas outros
        this.topCorner = 0;
        this.bottomCorner = 0;
        this.leftCorner = 0;
        this.rightCorner = 0;


        /**
         * Lista de Plugins Carregados
         *
         * @type {Array}
         */
        this.plugins = [];


    }


    /**
     * Adiciona uma Imagem
     *
     *
     *
     * @param options
     * @returns {*}
     */
    addImage(options) {

        options.parent = this.screen;
        options.type = options.type || 'ansi';

        return blessed.image(options);

    }


    /**
     * Renderiza Interface
     */
    render() {

        // Executa função de renderização dos plugins. Útil
        for (let plugin of this.plugins) {
            if (plugin.render && typeof plugin.render === 'function') {
                plugin.render();
            }
        }

        this.screen.render();
    }

    /**
     * Atualiza Tela
     */
    sync() {

        this.screen.render();
    }


    /**
     * Carrega um Plugin Automaticamente
     *
     * @param plugin    {String|SindriInterfacePlugin}   Plugin a ser carregado, pode ser string (para plugin interno) objeto para novos plugins
     * @param options   {Object}                         Lista de Opções do Plugin
     */
    loadPlugin(plugin, options = {}) {

        return typeof plugin === 'string' ? this._loadBuiltInPlugin(plugin, options) : this._loadPlugin(plugin, options);

    }


    /**
     * Carrega Plugin Builtint (pré-definido)
     *
     * @param pluginName
     * @param options
     * @private
     */
    _loadBuiltInPlugin(pluginName, options) {

        console.log('Carregando Plugin:', pluginName);

        try {

            let PluginClass = require('../plugins/' + pluginName);
            return this._loadPlugin(PluginClass, options);

        } catch (err) {

            if (err instanceof TypeError) {
                // throw new TypeError("PluginName must be String or SindriInterfacePlugin");
                throw err;
            } else {
                throw err;
            }

        }

    }

    /**
     * Carrega Plugin Externo
     *
     * @param pluginClass
     * @param options
     * @returns {*}
     * @private
     */
    _loadPlugin(pluginClass, options) {


        let plugin = new pluginClass(this, options);

        if (plugin.include) this.plugins.push(plugin);

        this.plugins.push(plugin);

        return plugin;


    }
}


module.exports = SindriInterface;