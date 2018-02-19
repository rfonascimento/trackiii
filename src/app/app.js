require('jquery');
require('bootstrap');

import angular from 'angular';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../style/app.css';

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
      occupation: 55
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
          '<svg id="svg" width="300" height="300" viewPort="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">',
            '<circle r="90" cx="150" cy="150" fill="transparent" stroke-dasharray="565.48" stroke-dashoffset="0"></circle>',
            '<circle id="bar" r="90" cx="150" cy="150" fill="transparent" stroke-dasharray="565.48" stroke-dashoffset="0"></circle>',
          '</svg>',
          '<div class="value">',
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
            ngModelCtrl.$formatters.push(updateGraph)
          }

          function updateGraph($modelvalue){
            var $circle = $element.children().children().children().eq(1);

            if (isNaN($modelvalue)) {
              $modelvalue = 100;
            }
            else{
              var r = $circle.attr('r');
              var c = Math.PI*(r*2);

              if ($modelvalue < 0) { $modelvalue = 0;}
              if ($modelvalue > 100) { $modelvalue = 100;}

              var pct = ((100-$modelvalue)/100)*c;

              $circle.css({ strokeDashoffset: pct});

              $element.children().attr('data-pct',$modelvalue);
              $element.children().children().eq(1)[0].innerHTML = "<div>"+$modelvalue+"<span class='unit'>%</span></div>";
            }
            return $modelvalue;
          }

        }
      }
    }
  }]);

export default MODULE_NAME;