/**
 * Created by André Timermann on 11/11/16.
 *
 * Criado para Testar e Demonstração do novo sistema de Interface baseado no Blessed
 *
 */
'use strict';

const SindriInterface = require('../lib/sindriInterface');

////////////////////////////////////////////////////////////////////////////////
// Demo01: Uso Básico (Carrega Plugin StatusBar)
////////////////////////////////////////////////////////////////////////////////

let testInterface = new SindriInterface({
    title: "Migration"
});

let menu = testInterface.loadPlugin("MainMenu", {});

menu.addMenu({
    title: "Converter DIA para YAML",
    description: "Converte diagramas do DIA para um esquema YAML no formato do Sindri Framework",
    callback: (screen) => {

        // Mensagem Debug (F12)
        screen.debug('Dia to Yaml');

        // Exibe Menu novamente (é automaticamente ocultado)
        menu.show();

    }
});

menu.addMenu({
    title: "Converter YAML para DIA",
    description: "Converte esquema YAML no formato do Sindri Framework para diagramas do DIA",
    callback: (screen) => {

        // Exibe Menu novamente (é automaticamente ocultado)
        screen.debug('Dia to Yaml');
        menu.show();


    }
});

testInterface.render();

