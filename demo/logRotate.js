/**
 * Created by André Timermann on 11/11/16.
 *
 * Criado para Testar e Demonstração do novo sistema de Interface baseado no Blessed
 *
 */
'use strict';

const SindriInterface = require('../lib/sindriInterface');
const Promise = require('bluebird');

////////////////////////////////////////////////////////////////////////////////
// Demo01: Uso Básico (Carrega Plugin StatusBar)
////////////////////////////////////////////////////////////////////////////////

let testInterface = new SindriInterface({
    title: "Log Rotate"
});

let logRotate = testInterface.loadPlugin("logRotate", {
    position: 'RightBottom',
    label: "Demo de Log"
});

testInterface.render();


Promise.delay(1000)

    .then(() => {
        logRotate.show();
        testInterface.sync();
    })

    .delay(1000).then(() => logRotate.info('Mensagem tipo Info'))
    .delay(1000).then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(1000).then(() => logRotate.error('Mensagem tipo Error'))
    .delay(100).then(() => logRotate.info('Mensagem tipo Info'))
    .delay(100).then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(100).then(() => logRotate.error('Mensagem tipo Error'))
    .delay(100).then(() => logRotate.info('Mensagem tipo Info'))
    .delay(100).then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(100).then(() => logRotate.error('Mensagem tipo Error'))
    .delay(100).then(() => logRotate.info('Mensagem tipo Info'))
    .delay(100).then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(100).then(() => logRotate.error('Mensagem tipo Error'))
    .delay(100).then(() => logRotate.info('Mensagem tipo Info'))
    .delay(100).then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(100).then(() => logRotate.error('Mensagem tipo Error'))
    .delay(100).then(() => logRotate.info('Mensagem tipo Info'))
    .delay(100).then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(100).then(() => logRotate.error('Mensagem tipo Error'))
    .delay(100).then(() => logRotate.info('Mensagem tipo Info'))
    .delay(100).then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(100).then(() => logRotate.error('Mensagem tipo Error'))
    .delay(100).then(() => logRotate.info('Mensagem tipo Info'))
    .delay(100).then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(100).then(() => logRotate.error('Mensagem tipo Error'))
    .delay(100).then(() => logRotate.info('Mensagem tipo Info'))
    .delay(100).then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(100).then(() => logRotate.error('Mensagem tipo Error'))
    .delay(100).then(() => logRotate.info('Mensagem tipo Info'))
    .delay(100).then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(100).then(() => logRotate.error('Mensagem tipo Error'))
    .delay(100).then(() => logRotate.info('Mensagem tipo Info'))
    .delay(100).then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(100).then(() => logRotate.error('Mensagem tipo Error'))
    .delay(100).then(() => logRotate.info('Mensagem tipo Info'))
    .delay(100).then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(100).then(() => logRotate.error('Mensagem tipo Error'))
    .delay(100).then(() => logRotate.info('Mensagem tipo Info'))
    .delay(100).then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(100).then(() => logRotate.error('Mensagem tipo Error'))
    .delay(100).then(() => logRotate.info('Mensagem tipo Info'))
    .delay(100).then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(100).then(() => logRotate.error('Mensagem tipo Error'))
    .delay(100).then(() => logRotate.info('Mensagem tipo Info'))
    .delay(100).then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(100).then(() => logRotate.error('Mensagem tipo Error'))
    .delay(100).then(() => logRotate.info('Mensagem tipo Info'))
    .delay(100).then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(100).then(() => logRotate.error('Mensagem tipo Error'))
    .delay(100).then(() => logRotate.info('Mensagem tipo Info'))
    .delay(100).then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(100).then(() => logRotate.error('Mensagem tipo Error'))
    .delay(100).then(() => logRotate.info('Mensagem tipo Info'))
    .delay(100).then(() => logRotate.warn('Mensagem tipo Warn'))
    .delay(100).then(() => logRotate.error('Mensagem tipo Error'))
    .delay(3000).then(() => logRotate.clear())
    .then(() => logRotate.info('Finalizando:', 'blue'))
    .delay(600).then(() => logRotate.info('10'))
    .delay(550).then(() => logRotate.info('9'))
    .delay(500).then(() => logRotate.info('8'))
    .delay(450).then(() => logRotate.info('7'))
    .delay(400).then(() => logRotate.info('6'))
    .delay(350).then(() => logRotate.info('5'))
    .delay(300).then(() => logRotate.info('4'))
    .delay(250).then(() => logRotate.info('3'))
    .delay(200).then(() => logRotate.info('2'))
    .delay(150).then(() => logRotate.info('1'))
    .delay(100).then(() => logRotate.info('0'))

    .then(() => logRotate.destroy());



