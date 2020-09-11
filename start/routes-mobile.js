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
const Helpers = use('Helpers')

Route.group(() => {
	Route.post('registrasi', 'Mobile/LoginController.registrasi')
	Route.post('login', 'Mobile/LoginController.login')
}).prefix('api/v1/mobile')


Route.group(() => {
	Route.get('list', 'Mobile/ListController.list')
	Route.get('listProdukKategori/:id', 'Mobile/ListController.listProdukKategori')
	Route.get('DetailProduk/:id', 'Mobile/ListController.DetailProduk')
}).prefix('api/v1/mobile/produk')


Route.group(() => {
	Route.post('produk', 'Mobile/OrderController.Order')
}).prefix('api/v1/mobile/order')




