parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"XNMn":[function(require,module,exports) {
module.exports="/icon.284e2ce6.svg";
},{}],"QvaY":[function(require,module,exports) {
"use strict";var t=e(require("../assets/svg/icon.svg"));function e(t){return t&&t.__esModule?t:{default:t}}document.documentElement.style.setProperty("--board-columns-count","15"),document.documentElement.style.setProperty("--board-rows-count","20");var r=document.querySelector(".board"),a=parseInt(document.documentElement.style.getPropertyValue("--board-columns-count")),n=parseInt(document.documentElement.style.getPropertyValue("--board-rows-count")),o=["hsl(190deg, 75%, 50%)","hsl(240deg, 75%, 50%)","hsl(290deg, 75%, 50%)","hsl(340deg, 75%, 50%)","hsl(30deg, 75%, 50%)","hsl(80deg, 75%, 50%)","hsl(130deg, 75%, 50%)","hsl(180deg, 75%, 50%)"],u=function(t,e){for(var r=[],a=function(){return Math.floor(Math.random()*e)},n=0;n<t;n++){for(var o=a();r.includes(o);)o=a();r.push(o)}return r},d=function(t){return"bomb"===t.getAttribute("data-type")},s=function(t){var e=parseInt(t.getAttribute("data-x")),a=parseInt(t.getAttribute("data-y")),n=[-1,0,1];return n.reduce(function(t,o){return t+n.reduce(function(t,n){var u=e+n,s=a+o,c=r.querySelector('.board__square[data-x="'.concat(u,'"][data-y="').concat(s,'"]'));return c&&d(c)?t+1:t},0)},0)},c=function(){r.style.pointerEvents="none",r.style.filter="brightness(50%)",alert("You lose ! Reload the page to restart.")},i=function t(e){if("hidden"===e.getAttribute("data-status")){if(e.setAttribute("data-status","discovered"),d(e))return c();var a=s(e);if(0!==a)return e.textContent=a.toString(),void(e.style.color=o[a-1]);var n=[-1,0,1];console.group(),n.forEach(function(a){n.forEach(function(n){var o=parseInt(e.getAttribute("data-x"))+n,u=parseInt(e.getAttribute("data-y"))+a,d='.board__square[data-x="'.concat(o,'"][data-y="').concat(u,'"]'),s=r.querySelector(d);s&&s!==e&&t(s)})}),console.groupEnd()}},l=function(e){var r=e.getAttribute("data-status");if("discovered"!==r){if("hidden"===r){e.setAttribute("data-status","marked");var a=document.createElement("img");return a.setAttribute("src",t.default),void e.appendChild(a)}e.setAttribute("data-status","hidden"),e.innerHTML=""}},f=function(){for(var t=u(30,a*n),e=0,o=0;o<n;o++)for(var d=function(a){e++;var n=document.createElement("button");n.classList.add("board__square"),(o+a)%2==0&&n.classList.add("light"),n.setAttribute("data-type","grass"),n.setAttribute("data-status","hidden"),n.setAttribute("data-x","".concat(o)),n.setAttribute("data-y","".concat(a)),t.includes(e)&&n.setAttribute("data-type","bomb"),n.addEventListener("click",function(){i(n)}),n.addEventListener("contextmenu",function(t){t.preventDefault(),l(n)}),r.appendChild(n)},s=0;s<a;s++)d(s)};f();
},{"../assets/svg/icon.svg":"XNMn"}]},{},["QvaY"], null)
//# sourceMappingURL=/js.5cd0e560.js.map