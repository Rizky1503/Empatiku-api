'use strict'
const Database = use('Database')
const Encryption = use('Encryption')
const moment = require('moment');
const Helpers = use('Helpers')

class OrderController {
	async ListProduk({response}){
		const data = await Database
			.table('in_mitra_produk')

		for (var keyImgPr = 0; keyImgPr < data.length; keyImgPr++) {
			const Image = await Database
				.table('in_mitra_gambar_produk')
				.where('id_produk',data[keyImgPr].id_produk)
				.first()
			data[keyImgPr]['image'] = Image;
		}
		return response.json(data)
	}

	async pemesan({response}){
		const data = await Database
			.select('nama_pemesan','id_pemesan')
			.table('in_pemesan')
			.where('status','Requested')
			.groupBy('nama_pemesan','id_pemesan')
		return response.status(200).json({
		    data,
		});
	}

	async pemesanRequest({response}){
		const data = await Database
			.table('in_pemesan')
			.innerJoin('in_order','in_pemesan.id_member','in_order.id_pemesan')
			.where('in_pemesan.status','Requested')
		return data;

		for (var keyPesanan = 0; keyPesanan < data.length; keyPesanan++) {
			const Pemesan = await Database
				.table('in_order')
				.where('id_pemesan',data[keyPesanan].id_pemesan)
				.count()
				.first()
			data[keyPesanan]['pesanan'] = Pemesan;
		}

		return response.status(200).json({
		    data,
		});
	}

	async DetailPesanan({params,response}){
		const data = await Database
			.select('in_mitra.nama','in_mitra_produk.nama_produk','in_mitra_produk.harga','in_order.jumlah','in_order.desc','in_mitra.no_telp','in_order.id_produk')
			.table('in_order')
			.innerJoin('in_mitra','in_order.id_mitra','in_mitra.id_mitra')
			.innerJoin('in_mitra_produk','in_order.id_produk','in_mitra_produk.id_produk')
			.where('in_order.id_pemesan',params.id)

		const pemesan = await Database
			.table('in_pemesan')
			.where('id_pemesan',params.id)
			.first()

		const deal = await Database
			.table('in_order_deal')
			.where('id_pemesan',params.id)
			.first()

		return response.status(200).json({
		    data,
		    pemesan,
		    deal,
		});
	}

	async OrderProduk ({request,response}){
		const Inputs = request.only(['id_produk','id_mitra','jumlah','nama_pemesan','no_telp_pemesan','alamat','desc','id_pemesan'])

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

		if(Inputs.id_pemesan){
			const cek_pesanan = await Database
				.table('in_order')
				.where('id_produk',Inputs.id_produk)
				.where('id_pemesan',Inputs.id_pemesan)
				.count()
				.first()

			const data_pesanan = await Database
				.table('in_order')
				.where('id_produk',Inputs.id_produk)
				.where('id_pemesan',Inputs.id_pemesan)
				.first()


			if (cek_pesanan.count < 1) {
				const Data = await Database
					.insert({
						id_produk		: Inputs.id_produk,
						id_mitra		: Inputs.id_mitra,
						jumlah	   	 	: Inputs.jumlah,
						id_pemesan		: Inputs.id_pemesan, 
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
					.where('id_pemesan',Inputs.id_pemesan)
					.update({ 
						jumlah : penambahanproduk, 
					})
			}
		}else{
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
				.returning('id_pemesan')

			const Data = await Database
				.insert({
					id_produk		: Inputs.id_produk,
					id_mitra		: Inputs.id_mitra,
					jumlah	   	 	: Inputs.jumlah,
					id_pemesan		: pemesan[0], 
					desc			: Inputs.desc,
					created_at 	 	: new Date(),
					updated_at 	 	: new Date()
				})
				.into('in_order')
		}

		

		return response.status(200).json({
		    status: "Success",
		});
	}	

	async HapusPesanan ({response,request}){
		const Inputs = request.only(['id_produk','id_pemesan'])
		const DataProduk = await Database
			.table('in_mitra_produk')
			.where('id_produk',Inputs.id_produk)
			.first()

		const DataBatal = await Database
			.table('in_order')
			.where('id_produk',Inputs.id_produk)
			.where('id_pemesan',Inputs.id_pemesan)

		const tambah = await Database
			.table('in_mitra_produk')
			.where('id_produk',Inputs.id_produk)
			.update({ jumlah : parseFloat(DataProduk.jumlah) + parseFloat(DataBatal[0].jumlah) })

		const hapus = await Database
			.table('in_order')
			.where('id_produk',Inputs.id_produk)
			.where('id_pemesan',Inputs.id_pemesan)
			.delete()
	}

	async OrderlDeal ({response,request}){
		const Inputs = request.only(['id_pemesan','total','dp'])
		function appendLeadingZeroes(n){
			if(n <= 9){
			  return "0" + n;
			}
			return n
		}
	  
	  	let current_datetime = new Date()
	  	
	  	let formatted_date = current_datetime.getFullYear() +''+ appendLeadingZeroes(current_datetime.getMonth() + 1) +''+ appendLeadingZeroes(current_datetime.getDate())			  
	  	
	  	const lastProduk = await Database.select(Database.raw('substr(id_inv,12,30) as id_inv'))
  					.from('in_order_deal')
  					.orderBy(Database.raw('substr(id_inv,12,30)'), 'desc')
  					.first();

		let FormatNumberId = null;	  
		if (lastProduk ) {	  
			FormatNumberId = 'INV'+ formatted_date + ++lastProduk.id_inv;
		} else {	  
			FormatNumberId = 'INV'+ formatted_date +'1000000001';	  
		}

		const deal = await Database
			.insert({
				id_inv			: FormatNumberId,
				id_pemesan		: Inputs.id_pemesan,
				total 			: Inputs.total,
				dp 				: Inputs.dp,
				status			: 'DP',
				pelunasan 		: parseFloat(Inputs.total) - parseFloat(Inputs.dp),
				created_at 	 	: new Date(),
				updated_at 	 	: new Date()
			})
			.into('in_order_deal')

		const update = await Database
			.table('in_pemesan')
			.where('id_pemesan',Inputs.id_pemesan)
			.update({ status : 'DP', updated_at : new Date() })
	}

	async LunasiPemesanan({params}){
		const update = await Database
			.table('in_pemesan')
			.where('id_pemesan',params.id)
			.update({ status : 'Lunas' , updated_at : new Date() })

		const updatedeal = await Database
			.table('in_order_deal')
			.where('id_pemesan',params.id)
			.update({ status : 'Lunas' , updated_at : new Date() })
	}

	async pesananmitdor({response,params}){
		const data = await Database
			.table('in_order')
			.innerJoin('in_pemesan','in_order.id_pemesan','in_pemesan.id_pemesan')
			.innerJoin('in_mitra_produk','in_order.id_produk','in_mitra_produk.id_produk')
			.where('in_order.id_mitra',params.id)

		return response.json(data)
	}
}
module.exports = OrderController
