'use strict'
const Database = use('Database')
const Encryption = use('Encryption')
const moment = require('moment');
const Helpers = use('Helpers')
const randomstring = use("randomstring");

class ListController {
	async list({response}){
		try{
			const kategori = await Database
				.select('kategori')
				.table('in_mitra_produk')
				.orderBy('kategori','ASC')

			for(var i =  0; i < kategori.length; i++){
				const list = await Database
					.select('t2.id_mitra','t2.nama','t2.email','t2.no_telp','kota','alamat','t1.id_produk','t1.nama_produk','t1.jumlah','t1.harga','t1.deskripsi','t1.sub_kategori')
					.innerJoin('in_mitra as t2','t1.id_mitra','t2.id_mitra')
					.table('in_mitra_produk as t1')
					.where('t1.kategori',kategori[i].kategori)
					.orderBy('t1.nama_produk','ASC')

					for (var keyImgPr = 0; keyImgPr < list.length; keyImgPr++) {
						const Image = await Database
							.table('in_mitra_gambar_produk')
							.where('id_produk',list[keyImgPr].id_produk)
							.first()
						list[keyImgPr]['image'] = Image;
					}
				kategori[i]['list'] = list
			}

			return response.json({
				response : 200,
				data     : kategori
			})
		}catch(e){
			return response.json({
				response  : 500,
				data      : e,
			})
		}	
	}

	async listProdukKategori({response,request}){
		const Inputs = request.only(['kategori','page'])
		try{
			const list = await Database
				.select('t2.id_mitra','t2.nama','t2.email','t2.no_telp','kota','alamat','t1.id_produk','t1.nama_produk','t1.jumlah','t1.harga','t1.deskripsi','t1.sub_kategori')
				.innerJoin('in_mitra as t2','t1.id_mitra','t2.id_mitra')
				.table('in_mitra_produk as t1')
				.where('t1.kategori',Inputs.kategori)
				.orderBy('t1.nama_produk','ASC')
				.paginate(Inputs.page,5)

				let produk = list.data
				for (var keyImgPr = 0; keyImgPr < produk.length; keyImgPr++) {
					const Image = await Database
						.table('in_mitra_gambar_produk')
						.where('id_produk',produk[keyImgPr].id_produk)

						for(var i = 0; i < Image.length; i++){
							Image[i].gambar_produk = 'http://api.binercloud.com:6464/api/v1/image/file/produk/'+Image[i].gambar_produk
						}

					produk[keyImgPr]['image'] = Image;
				}
	
			return response.json({
				response : 200,
				data     : produk
			})
		}catch(e){
			return response.json({
				response  : 201,
				data      : e,
			})
		}
	}

	async DetailProduk({params,response}){
		try{
			const data = await Database
				.table('in_mitra_produk')
				.where('id_produk',params.id)


			for (var keyImgPr = 0; keyImgPr < data.length; keyImgPr++) {
				const Image = await Database
					.table('in_mitra_gambar_produk')
					.where('id_produk',data[keyImgPr].id_produk)

					for(var i = 0; i < Image.length; i++){
						Image[i].gambar_produk = 'http://api.binercloud.com:6464/api/v1/image/file/produk/'+Image[i].gambar_produk
					}

				data[keyImgPr]['image'] = Image;
			}

			return response.json({
				response : 200,
	    	    data     : data,
		    });	
		}catch(e){
			return response.json({
				response : 500,
	    	    data     : [],
		    });	
		}
	}
}
module.exports = ListController	

