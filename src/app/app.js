require('jquery');
require('bootstrap');

import angular from 'angular';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../style/app.css';
import 'open-iconic/font/css/open-iconic-bootstrap.css'

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

class AppCtrl {
  constructor() {
    this.data = {
      occupation: {
        percentage: 55,
        time: 56
      },
      menu:{
        meat: {
          total: 200,
          available: 10
        },
        fish: {
          total: 200,
          available: 55
        },
        vegetarian: {
          total: 200,
          available: 195
        },
        extra: {
          total: 200,
          available: 135
        }
      },
      activeViewFlipped: false
    };
    this.switchView = function(){
      this.data.activeViewFlipped = !this.data.activeViewFlipped;
    }
  }
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl)
  .directive('graphicOccupation', ['$parse', '$compile', function ($parse, $compile) {
    function getTemplate(){
      return [
        '<div id="cont" data-pct="100">',
          '<svg id="svg" width="250" height="250" viewPort="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">',
            '<circle r="117" cx="125" cy="125" fill="transparent" stroke-dasharray="736" stroke-dashoffset="0"></circle>',
            '<circle id="bar" r="117" cx="125" cy="125" fill="transparent" stroke-dasharray="736" stroke-dashoffset="0"></circle>',
          '</svg>',
          '<div class="inner">',
            '<div class="arrow-top"></div>',
            '<div class="percentage">',
              '<div class="value">{{ data.percentage }}<span class="unit">%</span></div>',
              '<legend>OCUPAÇÃO FILA DE ESPERA</legend>',
            '</div>',
            '<div class="arrow-bottom"></div>',
            '<div class="time">' +
              '<div class="value">{{ data.time | date:\'mm:ss\' }}<span class="oi oi-clock"></span></div>',
              '<legend>TEMPO MÉDIO DE ESPERA</legend>',
            '</div>',
          '</div>',
        '</div>'
      ].join('');
    };

    var fnTemplate = $compile(getTemplate());// ::fnTemplate

    return {
      require: ['ngModel'],
      compile: function(tElement, tAttrs, tControllers){
        return function postLink ($scope, $element, $attrs, $controllers){
          var myscope = $scope.$new(true);
          var ngModelCtrl = $controllers[0];

          fnTemplate(myscope, function (clone, scope){
            $element.append(clone);
          });

          if ( ngModelCtrl ){
            // ngModelCtrl.$formatters.push(updateGraph);
            myscope.$watch(function(){ return ngModelCtrl.$modelValue; }, updateGraph ,true)
          }

          function updateGraph($modelvalue){
            myscope.data = $modelvalue;
            var $bar = $element.children().children().eq(0).children(0).eq(1);

            if (isNaN($modelvalue.percentage)) {
              $modelvalue.percentage = 100;
            }
            else{
              var r = $bar.attr('r');
              var c = Math.PI*(r*2);

              if ($modelvalue.percentage < 0) { $modelvalue.percentage = 0;}
              if ($modelvalue.percentage > 100) { $modelvalue.percentage = 100;}

              var pct = ((100-$modelvalue.percentage)/100)*c;

              $bar.css({ strokeDashoffset: pct});

              if ( $modelvalue.percentage > 75 ){
                  $bar.attr('class', 'state-4-4');
              }else if ( $modelvalue.percentage >50 && $modelvalue.percentage <= 75 ){
                  $bar.attr('class', 'state-4-3');
              }else if ( $modelvalue.percentage >25 && $modelvalue.percentage <= 50 ){
                  $bar.attr('class', 'state-4-2');
              }else if ( $modelvalue.percentage <= 25 ){
                  $bar.attr('class', 'state-4-1');
              }


              // $element.children().attr('data-pct',$modelvalue);
              // $element.children().children().eq(1)[0].innerHTML = "<div>"+$modelvalue+"<span class='unit'>%</span></div>";
            }
            // return $modelvalue;
          }

        }
      }
    }
  }])
  .directive('graphicMenu', ['$parse', function($parse){
      return {
        require: ['ngModel'],
        compile: function (tElement, tAttrs){
          return function postLink($scope, $element, $attrs, $controllers){
            var ngModelCtrl = $controllers[0];

            if ( ngModelCtrl ){
              ngModelCtrl.$formatters.push(updateGraph);
              $scope.$watch(function(){ return ngModelCtrl.$modelValue; }, updateGraph, true);
            }


            function updateGraph($modelvalue){
              var graph = $element.children().children().eq(0).children().eq(1).children().eq(2).children().eq(0);
              var percentage = null;

              if ( angular.isObject($modelvalue) && $modelvalue.total && $modelvalue.available ){
                percentage = 100-(($modelvalue.available*100) / $modelvalue.total);
                graph.css('clip-path', 'inset(0px '+percentage+'% 0px 0px)')
              }else{
                graph.css('clip-path', 'inset(0px 0% 0px 0px)')
              }

              return $modelvalue;
            }

          }
        }
      }
  }]);

export default MODULE_NAME;