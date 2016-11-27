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

testInterface.loadPlugin("StatusBar", {
    networkInterface: 'usb0'
});

testInterface.render();
