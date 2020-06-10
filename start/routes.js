'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')


Route.get('/', 'Admin/AdminController.test')

Route.group(() => {
	Route.post('login', 'Admin/AdminController.login')
}).prefix('api/v1/login')

Route.group(() => {
	Route.get('get_provinsi', 'Admin/AdminController.get_provinsi')
	Route.post('get_kota', 'Admin/AdminController.get_kota')

	Route.post('StoreMitdor', 'Admin/AdminController.StoreMitdor')
	Route.post('StoreMitdorPic', 'Admin/AdminController.StoreMitdorPic')
	Route.post('StoreMitdorBerkas', 'Admin/AdminController.StoreMitdorBerkas')

}).prefix('api/v1/mitdor')