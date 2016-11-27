/**
 * Created by André Timermann on 26/11/16.
 *
 *
 */
'use strict';


const SindriInterface = require('../lib/sindriInterface');

let testInterface = new SindriInterface({
    title: "InputBox"
});


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