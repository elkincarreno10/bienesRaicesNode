/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/menu.js":
/*!************************!*\
  !*** ./src/js/menu.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\r\n\r\n    const nav = document.querySelector('#nav')\r\n    const divMenu = document.querySelector('#divMenu')\r\n\r\n    const menu = document.querySelector('#menu')\r\n    menu.addEventListener('click', () => {\r\n        mostrarMenu()\r\n    })\r\n\r\n    function mostrarMenu() {\r\n        if(nav.classList.contains('hidden')) {\r\n            nav.classList.remove('hidden')\r\n            nav.classList.add('flex', 'flex-col')\r\n            divMenu.classList.add('flex-col', 'gap-5', 'items-center')\r\n        } else {\r\n            nav.classList.add('hidden')\r\n            nav.classList.remove('flex', 'flex-col')\r\n            divMenu.classList.remove('flex-col', 'gap-5', 'items-center')\r\n        }\r\n    }\r\n})()\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/menu.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/menu.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;