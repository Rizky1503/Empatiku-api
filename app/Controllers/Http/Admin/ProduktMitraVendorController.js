'use strict'
const Database = use('Database')
const Encryption = use('Encryption')
const moment = require('moment');
const Helpers = use('Helpers')

class ProduktMitraVendorController {
	async StoreGambarProduk({request,response}){
		const Inputs    = request.only(['id_produk','produk'])
	    const produk = request.file('produk')
	    let filenameProduk = ""
	    try {
	    	if (produk !== null) {
		        let path = "images/file/produk"
		        filenameProduk = produk.toJSON().clientName;
		        await produk.move(Helpers.publicPath(path), {
		            name: filenameProduk,
		            overwrite: true
		        })
	    	}

	    	const data = await Database
        		.insert({
        			id_produk: Inputs.id_produk, 
        			gambar_produk: filenameProduk, 
        		})
        		.into('in_mitra_gambar_produk')
        		.returning('id')

	    	return response.status(200).json({
	    	    status: "Finish",
	    	    error: data[0],
	    	});
		}catch(error) {
		    return response.status(201).json({
		        status: "Gagal",
		        error: error,
		    });
		}
	}

	async RemoveGambarProduk({request,response}){
		const Inputs    = request.only(['id_produk','id_gambar'])
	    const produk = request.file('produk')

    	const data = await Database
    		.table('in_mitra_gambar_produk')
    		.where('id_produk',Inputs.id_produk)
    		.where('id',Inputs.id_gambar)
    		.delete()

    	return response.status(200).json({
    	    status: "Finish",
    	    error: Inputs.id_gambar,
	    });	
	}

	async StoreKategori({request,response}){
		const Inputs = request.only(['kategori','sub_kategori'])
		const data = await Database
    		.insert({
    			kategori: Inputs.kategori, 
    			sub_kategori: Inputs.sub_kategori,
    			created_at : new Date(),
    			updated_at : new Date()
    		})
    		.into('in_kategori')

    	return response.status(200).json({
    	    status: "Success",
	    });	
	}

	async ViewKategori({request,response}){
		const data = await Database
			.query()
			.table('in_kategori')    		

    	return response.status(200).json({
    	    status: data,
	    });	
	}

	async UpdateKategori({request,response}){
		const Inputs = request.only(['id_kategori','kategori','sub_kategori'])
		const data = await Database
    		.table('in_kategori')
			.where('id_kategori', Inputs.id_kategori)
			.update({ 
				kategori: Inputs.kategori,
				sub_kategori: Inputs.sub_kategori 
			})

    	return response.status(200).json({
    	    status: "Success",
	    });	
	}

	async GetKategori ({response}){
		const data = await Database
			.select('kategori')
			.table('in_kategori')
			.groupBy('kategori')
		return response.status(200).json({
    	    data: data,
	    });	
	}

	async GetSubKategori ({request,response}){
		const Inputs = request.only(['kategori'])
		const data = await Database
			.select('sub_kategori')
			.table('in_kategori')
			.where('kategori',Inputs.kategori)
			.groupBy('sub_kategori')
		return response.status(200).json({
    	    data: data,
	    });	
	}

	async StoreProduk({request,response}){
		const Inputs    = request.only(['id_mitra','nama_produk','jumlah','deskripsi','kategori','sub_kategori','harga'])

		function appendLeadingZeroes(n){
			if(n <= 9){
			  return "0" + n;
			}
			return n
		}
	  
	  	let current_datetime = new Date()
	  	
	  	let formatted_date = current_datetime.getFullYear() +''+ appendLeadingZeroes(current_datetime.getMonth() + 1) +''+ appendLeadingZeroes(current_datetime.getDate())			  
	  	
	  	const lastProduk = await Database.select(Database.raw('substr(id_produk,12,30) as id_produk'))
  					.from('in_mitra_produk')
  					.orderBy(Database.raw('substr(id_produk,12,30)'), 'desc')
  					.first();

		let FormatNumberId = null;	  
		if (lastProduk ) {	  
			FormatNumberId = 'PMT'+ formatted_date + ++lastProduk.id_produk;
		} else {	  
			FormatNumberId = 'PMT'+ formatted_date +'1000000001';	  
		}

		const data = await Database
    		.insert({
    			id_produk: FormatNumberId, 
    			id_mitra: Inputs.id_mitra,
    			nama_produk : Inputs.nama_produk,
    			jumlah : Inputs.jumlah,
    			harga : Inputs.harga,
    			deskripsi : Inputs.deskripsi,
    			kategori : Inputs.kategori,
    			sub_kategori : Inputs.sub_kategori,
    			created_at : new Date(),
    			updated_at : new Date()
    		})
    		.into('in_mitra_produk')
    		.returning('id_produk')
    	return response.status(200).json({
    	    data: data[0],
	    });	
	}

	async DetailProduk({params,response}){
		const data = await Database
			.table('in_mitra_produk')
			.where('id_produk',params.id)


		for (var keyImgPr = 0; keyImgPr < data.length; keyImgPr++) {
			const Image = await Database
				.table('in_mitra_gambar_produk')
				.where('id_produk',data[keyImgPr].id_produk)
			data[keyImgPr]['image'] = Image;
		}

		return response.status(200).json({
    	    data: data,
	    });	
	}
}

module.exports = ProduktMitraVendorController
