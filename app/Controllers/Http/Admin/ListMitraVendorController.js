'use strict'
const Database = use('Database')
const Encryption = use('Encryption')
const moment = require('moment');
const Helpers = use('Helpers')

class ListMitraVendorController {
	async ListMitraVendor({request,response}){
		const data = await Database
			.select('id_mitra','nama')
			.table('in_mitra')

		for (var keyPic = 0; keyPic < data.length; keyPic++) {
			const Pic = await Database
				.table('in_mitra_pic')
				.where('id_mitra',data[keyPic].id_mitra)
				.count()
				.first()
			data[keyPic]['pic'] = Pic;
			data[keyPic]['jenis'] = 'Mitra';
		}

		for (var keyBerkas = 0; keyBerkas < data.length; keyBerkas++) {
			const Berkas = await Database
				.table('in_mitra_berkas')
				.where('id_mitra',data[keyBerkas].id_mitra)
				.first()

			if (Berkas) {
				if (Berkas.ktp && Berkas.npwp) {
					data[keyBerkas]['berkas'] = 'Berkas Lengkap';
				}else{
					data[keyBerkas]['berkas'] = 'Harap Lengkapi Berkas';
				}	
			}else{
				data[keyBerkas]['berkas'] = 'Harap Lengkapi Berkas';
			}
		}
		return response.json(data)
	}

	async DetailMitraVendor({response,request,params}){
		const data = await Database
			.table('in_mitra')
			.where('id_mitra',params.id)

		for (var keyPic = 0; keyPic < data.length; keyPic++) {
			const Pic = await Database
				.table('in_mitra_pic')
				.where('id_mitra',data[keyPic].id_mitra)
			data[keyPic]['pic'] = Pic;
			data[keyPic]['jenis'] = 'Mitra';
		}

		for (var keyBerkas = 0; keyBerkas < data.length; keyBerkas++) {
			const Berkas = await Database
				.table('in_mitra_berkas')
				.where('id_mitra',data[keyBerkas].id_mitra)
				.first()
			if (Berkas) {
				data[keyBerkas]['berkas'] = Berkas;
			}else{
				data[keyBerkas]['berkas'] = [];
			}	
		}

		for (var keyProduk = 0; keyProduk < data.length; keyProduk++) {
			const Produk = await Database
				.table('in_mitra_produk')
				.where('id_mitra',data[keyProduk].id_mitra)
			if (Produk) {
				data[keyProduk]['produk'] = Produk;
			}else{
				data[keyProduk]['produk'] = [];
			}	
		}
		return response.json(data)	
	}

	async UpdateMitraVendor({response,request}){
		const Inputs = request.only(['id_mitdor','nama','email','no_telpon','alamat','provinsi','kota'])
		const data = await Database
    		.table('in_mitra')
			.where('id_mitra', Inputs.id_mitdor)
			.update({ 
				nama: Inputs.nama,
				email: Inputs.email, 
				no_telp: Inputs.no_telpon, 
				alamat: Inputs.alamat, 
				provinsi: Inputs.provinsi, 
				kota: Inputs.kota, 
			})

    	return response.status(200).json({
    	    status: "Success",
	    });	
	}

}
module.exports = ListMitraVendorController
