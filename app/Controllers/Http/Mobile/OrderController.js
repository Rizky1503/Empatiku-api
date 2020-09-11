'use strict'
const Database = use('Database')
const Encryption = use('Encryption')
const moment = require('moment');
const Helpers = use('Helpers')
const randomstring = use("randomstring");

class OrderController {
	async Order ({request,response}){
		try{
			const Inputs = request.only(['id_produk','id_mitra','jumlah','nama_pemesan','no_telp_pemesan','alamat','desc','id_member'])

			const ambiljumlahproduk = await Database
				.select('jumlah')
				.table('in_mitra_produk')
				.where('id_produk',Inputs.id_produk)
				.first()

			let sisaproduk = parseFloat(ambiljumlahproduk.jumlah) - parseFloat(Inputs.jumlah)

			const pengurangan = await Database
				.table('in_mitra_produk')
				.where('id_produk',Inputs.id_produk)
				.update({ 
					jumlah : sisaproduk, 
				})

			const cek_pesanan = await Database
				.table('in_order')
				.where('id_produk',Inputs.id_produk)
				.where('id_pemesan',Inputs.id_member)
				.count()
				.first()

			const data_pesanan = await Database
				.table('in_order')
				.where('id_produk',Inputs.id_produk)
				.where('id_pemesan',Inputs.id_member)
				.first()

			const pemesan = await Database
				.insert({
					nama_pemesan 	: Inputs.nama_pemesan,
					no_telpon		: Inputs.no_telp_pemesan,
					alamat			: Inputs.alamat,
					status			: 'Requested',
					created_at 	 	: new Date(),
					updated_at 	 	: new Date(),
				})
				.into('in_pemesan')

			if (cek_pesanan.count < 1) {
				const Data = await Database
					.insert({
						id_produk		: Inputs.id_produk,
						id_mitra		: Inputs.id_mitra,
						jumlah	   	 	: Inputs.jumlah,
						id_pemesan		: Inputs.id_member, 
						desc			: Inputs.desc,
						created_at 	 	: new Date(),
						updated_at 	 	: new Date()
					})
					.into('in_order')
			}else{
				let penambahanproduk = parseFloat(data_pesanan.jumlah) + parseFloat(Inputs.jumlah)
				
				const tambah = await Database
					.table('in_order')
					.where('id_produk',Inputs.id_produk)
					.where('id_pemesan',Inputs.id_member)
					.update({ 
						jumlah : penambahanproduk, 
					})
			}

			return response.json({
				response : 200,
				data     : "Sukses Order"
			})
		}catch(e){
			return response.json({
				response  : 201,
				data      : e,
			})
		}
	}
}
module.exports = OrderController	

