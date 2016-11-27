/**
 * Created by André Timermann on 26/11/16.
 *
 * REF: https://github.com/chjj/blessed#image-from-box
 */
'use strict';

const SindriInterface = require('../lib/sindriInterface');

let testInterface = new SindriInterface({
    title: "Imagem"
});

testInterface.addImage({
    file: "smarti_logo.png",
    width: 60,
    height: 10,
    left: "center"
});


testInterface.render();