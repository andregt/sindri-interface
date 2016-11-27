/**
 * Created by André Timermann on 26/11/16.
 *
 *
 */
'use strict';

const SindriInterface = require('../lib/sindriInterface');
const Promise = require('bluebird');

////////////////////////////////////////////////////////////////////////////////
// Demo01: Uso Básico (Carrega Plugin StatusBar)
////////////////////////////////////////////////////////////////////////////////

let testInterface = new SindriInterface({
    title: "Migration"
});

testInterface.loadPlugin("StatusBar", {
    // TODO: se a interface não existir gera erro
    networkInterface: 'wlan0'
});


testInterface.addImage({
    file: "smarti_logo.png",
    width: 60,
    height: 10,
    left: "center"
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




let logRotate = testInterface.loadPlugin("logRotate", {
    position: 'RightBottom',
    label: "Demo de Log"
});

Promise.delay(1000)

    .then(() => {
        logRotate.show();
        testInterface.sync();
    })

    .delay(1000)
    .then(() => logRotate.info('Mensagem tipo Info'))
    .delay(1000)
    .then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(1000)
    .then(() => logRotate.error('Mensagem tipo Error'))
    .delay(1000)
    .then(() => logRotate.clear())
    .then(() => logRotate.info('Finalizando:', 'blue'))
    .delay(600)
    .then(() => logRotate.info('10'))
    .delay(550)
    .then(() => logRotate.info('9'))
    .delay(500)
    .then(() => logRotate.info('8'))
    .delay(450)
    .then(() => logRotate.info('7'))
    .delay(400)
    .then(() => logRotate.info('6'))
    .delay(350)
    .then(() => logRotate.info('5'))
    .delay(300)
    .then(() => logRotate.info('4'))
    .delay(250)
    .then(() => logRotate.info('3'))
    .delay(200)
    .then(() => logRotate.info('2'))
    .delay(150)
    .then(() => logRotate.info('1'))
    .delay(100)
    .then(() => logRotate.info('0'))
    .then(() => logRotate.destroy());


let input = testInterface.loadPlugin('inputBox', {
    position: 'LeftTop',
    autoHide: false
});



input.prompt('Clique em uma das opções', ['PalavraMuitoGrande', 'Ornitorrinco'])

    .then(result => {

        input.debug(result);

        return input.prompt(`Você selecionou '${result}'! Clique em 'Continuar'`, ['Continuar']);

    })
    .then(result => {

        input.debug(result);

        return input.radiobox("Escolha", ['Ornitorrinco', 'Laranja', 'Limão', 'Celular', 'Frase Grande', 'Ornitorrinco', 'Laranja', 'Limão', 'Celular', 'Frase Grande', 'Ornitorrinco', 'Laranja', 'Limão', 'Celular', 'Frase Grande', 'Ornitorrinco', 'Laranja', 'Limão', 'Celular', 'Frase Grande'])

    })
    .then(result => {

        input.debug(result);

        return input.prompt(`Você selecionou '${result}'! Teste Finalizado`);

    })
    .then(result => {

        input.debug(result);

        input.destroy();

    })
    .catch(err => {

        // testInterface.destroy();
        console.log(err.message);
        console.log(err.stack);
    });



testInterface.render();
