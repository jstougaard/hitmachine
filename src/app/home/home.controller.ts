/// <reference path="../../types/types.ts"/>


class HomeController {
  greeting: string;
  times: number;
    basePattern: Array<core.RhythmBlock> = [];
    patternTone1: Array<core.RhythmBlock> = [];
    patternTone2: Array<core.RhythmBlock> = [];
    patternTone3: Array<core.RhythmBlock> = [];

  /* @ngInject */
  constructor(
    private $rootScope: core.IRootScope,
    private HomeService: core.IHomeService
  ) {
    $rootScope.pageTitle = "Hello";
    this.times = 5;
    this.greeting = HomeService.getGreeting("Hello").greeting;

    this.basePattern = [
        {start: 2, length: 4}
    ];
      /*setTimeout(() => {
         console.log("Update it", this, this.basePattern);
          this.basePattern.push({"start": 6, "length": 2});
      }, 3000);*/
  }

    addBlock() {
        console.log("Update it", this, this.basePattern);
        this.basePattern.push({"start": 6, "length": 2});
    }
}

angular
  .module("home.index", [
    "home.services"
  ])
  .controller("HomeController", HomeController);
