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
}
module.exports = ListMitraVendorController
