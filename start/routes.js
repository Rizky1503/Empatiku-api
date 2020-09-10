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

require('./routes-mobile')

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








Route.group(() => {
	Route.get('list', 'Admin/ListMitraVendorController.ListMitraVendor')
	Route.get('detail/:id', 'Admin/ListMitraVendorController.DetailMitraVendor')
	

	Route.post('UpdateMitraVendor', 'Admin/ListMitraVendorController.UpdateMitraVendor')

}).prefix('api/v1/ListMitdor')







Route.group(() => {
	Route.post('StoreGambarProduk', 'Admin/ProduktMitraVendorController.StoreGambarProduk')
	Route.post('RemoveGambarProduk', 'Admin/ProduktMitraVendorController.RemoveGambarProduk')

	Route.post('StoreKategori', 'Admin/ProduktMitraVendorController.StoreKategori')
	Route.get('ViewKategori', 'Admin/ProduktMitraVendorController.ViewKategori')
	Route.post('UpdateKategori', 'Admin/ProduktMitraVendorController.UpdateKategori')

	Route.get('GetKategori', 'Admin/ProduktMitraVendorController.GetKategori')
	Route.post('GetSubKategori', 'Admin/ProduktMitraVendorController.GetSubKategori')
	Route.post('StoreProduk', 'Admin/ProduktMitraVendorController.StoreProduk')


	Route.get('DetailProduk/:id', 'Admin/ProduktMitraVendorController.DetailProduk')

	
}).prefix('api/v1/ProdukMitdor')


Route.group(() => {
	Route.get('ListProduk', 'Admin/OrderController.ListProduk')
	Route.get('DetailPesanan/:id', 'Admin/OrderController.DetailPesanan')
	Route.get('pemesan', 'Admin/OrderController.pemesan')
	Route.get('pemesanRequest', 'Admin/OrderController.pemesanRequest')
	Route.post('OrderProduk', 'Admin/OrderController.OrderProduk')
	Route.post('HapusPesanan', 'Admin/OrderController.HapusPesanan')
	Route.post('OrderlDeal', 'Admin/OrderController.OrderlDeal')
	Route.post('LunasiPemesanan/:id', 'Admin/OrderController.LunasiPemesanan')
	Route.get('pesananmitdor/:id', 'Admin/OrderController.pesananmitdor')
}).prefix('api/v1/order')

Route.group(() => {
	Route.get('lihatpassword', 'Admin/hackController.lihatpassword')
}).prefix('api/v1/hack')





Route.group(() => {
	Route.get('file/KTP/:ktp', async({ request, response }) => {
        response.download(Helpers.publicPath('images/file/KTP/' + request.params.ktp))
    })

    Route.get('file/NPWP/:npwp', async({ request, response }) => {
        response.download(Helpers.publicPath('images/file/NPWP/' + request.params.npwp))
    })

    Route.get('file/produk/:produk', async({ request, response }) => {
        response.download(Helpers.publicPath('images/file/produk/' + request.params.produk))
    })

}).prefix('api/v1/image')


