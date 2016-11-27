# sindri-interface
Framework de Interface baseado no Blessed, Blessed-contrib e node-drawille



this.create('<plugin>' ou <plugin>);

* Vamos Ter Slots para encaixar o plugin se for do tipo interface (pode ser configurado no prṕrio plugin)
    - não vai ter slot, cada plugin se autoposiciona

No plugin menu, vamos autoconfigurar disparadores para executa interfaces no diretorio interfaces

* Tentar usar objeto em vez de classe estática
* Método let statusBar = this.create('statusBar');


* Seguir arquitetura do próprio Blessed
* Em vez de Herança, só instancia e passa função
  * Testar várias Métodologias diferente e ver a melhor