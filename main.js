var global = this;

angular.module('myApp', []).controller('appCtrl', function($scope, $interval) {
   var c = this;

   c.MIN_SIZE = 2;
   c.MAX_SIZE = 20;
   c.LEVELS_PER_SIZE = 5;

   c.map = null;
   c.size = null;
   c.world = null;
   c.level = null;
   c.points = null;
   c.prompt = {};
   c.timeout = 6;
   c.time = null;

   var isRow;
   var emptyI;
   var timer;
   const FLASH_ANIM = [{
      opacity: 0,
   }, {
      opacity: 1,
   }, {
      opacity: 0,
   }];

   c.cellClicked = function(row, colI) {
      isExplosive(row, colI) ? lose() : win();
   }

   c.createMap = function() {
      c.size = Math.max(c.size, c.MIN_SIZE);
      c.size = Math.min(c.size, c.MAX_SIZE);

      isRow = (floorandom(2) == 1);
      emptyI = floorandom(c.size);
      var duplicateI = emptyI;
      while (duplicateI == emptyI)
         duplicateI = floorandom(c.size);
      var randomIs = createRandomIndexes(emptyI, duplicateI);

      initMap();

      for (var i = 0; i < c.size; i++) {
         if (isRow)
            c.map[randomIs[i]][i] = 1;
         else
            c.map[i][randomIs[i]] = 1
      }
   };

   function win() {
      // prompt("YOU WIN", "green");
      c.level++;
      c.points++;
      if (c.level == c.LEVELS_PER_SIZE) {
         c.level = 0;
         c.size++;
         if (c.size > c.MAX_SIZE) {
            c.size = c.MIN_SIZE;
            c.world++;
         }
      }
      cancelTimer();
      startTimer();
      c.createMap();
   }

   function lose() {
      cancelTimer();
      prompt("KABOOM!", "red");
      restartGame();
   }

   function startTimer() {
      c.time = c.timeout;
      timer = $interval(tick, 1000, c.timeout);
   }

   function cancelTimer() {
      $interval.cancel(timer);
   }

   function tick() {
      c.time--;
      if (!c.time)
         lose();
   }

   function restartGame() {
      initEnv();
      c.createMap();
   }

   function initEnv() {
      c.size = c.MIN_SIZE;
      c.world = 1;
      c.level = 1;
      c.points = 0;
      startTimer();
   }

   function prompt(text, color, duration = 2) {
      c.prompt = {
         text: text,
         color: color,
      };
      document.getElementById("prompt").animate(FLASH_ANIM, {
         duration: duration * 1000,
      });
   }

   function isExplosive(row, colI) {
      return (isRow ? row.includes(1) : colI != emptyI);
   }

   function initMap() {
      c.map = [];
      for (var i = 0; i < c.size; i++)
         c.map.push(new Array(c.size));
   }

   function createRandomIndexes(emptyI, duplicateI) {
      var randomIs = Array.apply(null, {
         length: c.size,
      }).map(Number.call, Number);

      shuffle(randomIs);
      randomIs[randomIs.indexOf(emptyI)] = duplicateI;
      return randomIs;
   }

   function floorandom(x) {
      return Math.floor(Math.random() * x);
   }

   function shuffle(array) {
      var currentIndex = array.length,
         temporaryValue, randomIndex;

      while (0 !== currentIndex) {

         randomIndex = Math.floor(Math.random() * currentIndex);
         currentIndex -= 1;

         temporaryValue = array[currentIndex];
         array[currentIndex] = array[randomIndex];
         array[randomIndex] = temporaryValue;
      }

      return array;
   }

   restartGame();
});
