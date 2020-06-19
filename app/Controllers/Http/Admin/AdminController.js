'use strict'
const Database = use('Database')
const Encryption = use('Encryption')
const moment = require('moment');
const Helpers = use('Helpers')

class AdminController {

// start login
	async login({request,response}){
		const pelangganInfo = request.only(['email','password'])
		
		const cekEmailMitra = await Database.from('in_mitra_pic').where('email',pelangganInfo.email).first()
		const cekEmailVEndor = await Database.from('in_vendor_pic').where('email',pelangganInfo.email).first() 
		
		if (cekEmailMitra) {
			if (Encryption.decrypt(cekEmailMitra.password) == pelangganInfo.password) {
				return response.status(200).json({
					data :cekEmailMitra,
					status: 'true Mitra',
			  	})
			}else{
				return response.json({status : 'false'})
			}		
		}else if(cekEmailVEndor){
			if (Encryption.decrypt(cekEmailVEndor.password) == pelangganInfo.password) {
				return response.status(200).json({
					data : cekEmailVEndor,
					status: 'true Vendor',
			  	})
			}else{
				return response.json({status : 'false'})
			}		
		}else if( pelangganInfo.email == 'admin' && pelangganInfo.password == '3mp4t1ku' ){
			return response.status(200).json({
				data : [],
				status: 'true Admin',
			})
		}else{
			return response.json({status : 'false'})
		}
	}
// end login

// start mitra/vendor
	async get_provinsi({response}){
		const provinsi = await Database
			.select('provinsi')
			.from('in_alamat')
			.orderBy('provinsi','ASC')
			.groupBy('provinsi')
		return response.json(provinsi)
	}

	async get_kota({response,request}){
		const Inputs = request.only(['provinsi'])
		const kota = await Database
			.select('kota')
			.from('in_alamat')
			.where('provinsi',Inputs.provinsi)
			.orderBy('kota','ASC')
			.groupBy('kota')
		return response.json(kota)
	}



	async StoreMitdor({response,request}){
		const Inputs    = request.only(['jenis_user','nama','email','no_telp','alamat','kota'])

		function appendLeadingZeroes(n){
			if(n <= 9){
			  return "0" + n;
			}
			return n
		}
	  
	  	let current_datetime = new Date()
	  	
	  	let formatted_date = current_datetime.getFullYear() +''+ appendLeadingZeroes(current_datetime.getMonth() + 1) +''+ appendLeadingZeroes(current_datetime.getDate())			  
	  	
	  	if(Inputs.jenis_user == 'Mitra'){
	  		const check = await Database
	  			.table('in_mitra')
	  			.where('email',Inputs.email)
	  			.count()
	  			.first()

	  		if (check.count < 1) {
  			  	const lastProduk = await Database.select(Database.raw('substr(id_mitra,12,30) as id_mitra'))
  					.from('in_mitra')
  					.orderBy(Database.raw('substr(id_mitra,12,30)'), 'desc')
  					.first();

  				let FormatNumberId = null;	  
  				if (lastProduk ) {	  
  					FormatNumberId = 'MIT'+ formatted_date + ++lastProduk.id_mitra;
  				} else {	  
  					FormatNumberId = 'MIT'+ formatted_date +'1000000001';	  
  				}

  				const store = await Database			
  					.insert([{
  						id_mitra: FormatNumberId,
  						nama: Inputs.nama, 
  						email: Inputs.email, 
  						no_telp: Inputs.no_telp, 
  						alamat: Inputs.alamat, 
  						kota :  Inputs.kota,
  						provinsi : Inputs.provinsi,
  						created_at : new Date(), 
  						updated_at : new Date(),
  					}])
  					.into('in_mitra')
  					.returning('id_mitra')

  				return response.json({
  					status : 'true',
  					responses : '200',
  					id : store[0]			
  				})
	  		}else{
	  			return response.json({
  					status : 'false',
  					responses : '201',
  					id : 'already exist'			
  				})
	  		}

	  	}else if(Inputs.jenis_user == 'Vendor'){
	  		const check = await Database
	  			.table('in_vendor')
	  			.where('email',Inputs.email)
	  			.count()
	  			.first()

	  		if (check.count < 1) {
		  		const lastProduk = await Database.select(Database.raw('substr(id_vendor,12,30) as id_vendor'))
	  				.from('in_vendor')
	  				.orderBy(Database.raw('substr(id_vendor,12,30)'), 'desc')
	  				.first();
	  			let FormatNumberId = null;	  
	  			if (lastProduk ) {	  
	  				FormatNumberId = 'VEN'+ formatted_date + ++lastProduk.id_vendor;
	  			} else {	  
	  				FormatNumberId = 'VEN'+ formatted_date +'1000000001';	  
	  			}

	  			const store = await Database			
	  				.insert([{
	  					id_vendor: FormatNumberId,
	  					nama: Inputs.nama, 
	  					email: Inputs.email, 
	  					no_telp: Inputs.no_telp, 
	  					alamat: Inputs.alamat, 
	  					kota :  Inputs.kota,
	  					provinsi : Inputs.provinsi,
	  					created_at : new Date(), 
	  					updated_at : new Date(),
	  				}])
	  				.into('in_vendor')
	  				.returning('id_vendor')

	  			return response.json({
	  				status : 'true',
	  				responses : '200',
	  				id : store[0]			
	  			})
	  		}else{
	  			return response.json({
  					status : 'false',
  					responses : '201',
  					id : 'already exist'			
  				})
	  		}
	  	}

	}

	async StoreMitdorPic({response,request}){
		const Inputs    = request.only(['jenis_user','nama','email','no_telp','alamat','kota','id_mitdor','username','password'])

		if (Inputs.jenis_user == 'Mitra') {
			const check = await Database
	  			.table('in_mitra_pic')
	  			.where('email',Inputs.email)
	  			.count()
	  			.first()

	  		if (check.count < 1) {
				const store = await Database			
					.insert([{
						id_mitra: Inputs.id_mitdor, 
						nama: Inputs.nama, 
						email: Inputs.email, 
						no_telp: Inputs.no_telp, 
						alamat: Inputs.alamat, 
						kota :  Inputs.kota,
						provinsi : Inputs.provinsi,
						password :Encryption.encrypt(Inputs.password),
						created_at : new Date(), 
						updated_at : new Date(),
					}])
					.into('in_mitra_pic')
					.returning('id_pic_mitra')

				return response.json({
					status : 'true',
					responses : '200',
					id : Inputs.id_mitdor			
				})
	  		}else{
	  			return response.json({
  					status : 'false',
  					responses : '201',
  					id : 'already exist'			
  				})
	  		}
		}else{
			const check = await Database
	  			.table('in_vendor_pic')
	  			.where('email',Inputs.email)
	  			.count()
	  			.first()
	  			
	  		if (check.count < 1) {
				const store = await Database			
					.insert([{
						id_vendor: Inputs.id_mitdor, 
						nama: Inputs.nama, 
						email: Inputs.email, 
						no_telp: Inputs.no_telp, 
						alamat: Inputs.alamat, 
						kota :  Inputs.kota,
						provinsi : Inputs.provinsi,
						password :Encryption.encrypt(Inputs.password),
						created_at : new Date(), 
						updated_at : new Date(),
					}])
					.into('in_vendor_pic')
					.returning('id_pic_mitra')

				return response.json({
					status : 'true',
					responses : '200',
					id : Inputs.id_mitdor			
				})
	  		}else{
	  			return response.json({
  					status : 'false',
  					responses : '201',
  					id : 'already exist'			
  				})
	  		}
		}
	}

	async StoreMitdorBerkas({request,response}){
		const Inputs    = request.only(['id_mitdor','ktp','npwp','jenis_user'])
	    const ktp = request.file('ktp')
	    const npwp = request.file('npwp')
	    let filenameKTP = ""
	    let filenameNPWP = ""

	    if (Inputs.jenis_user == 'Mitra') {
	    	if (ktp !== null) {
	    	    let path = "images/file/KTP"
	    	    filenameKTP = ktp.toJSON().clientName;
	    	    await ktp.move(Helpers.publicPath(path), {
	    	        name: filenameKTP,
	    	        overwrite: true
	    	    })
	    	}

	    	if (npwp !== null) {
	    	    let path = "images/file/NPWP"
	    	    filenameNPWP = npwp.toJSON().clientName;
	    	    await npwp.move(Helpers.publicPath(path), {
	    	        name: filenameNPWP,
	    	        overwrite: true
	    	    })
	    	}

	    	const store = await Database			
	    		.insert([{
	    			id_mitra: Inputs.id_mitdor, 
	    			ktp: filenameKTP, 
	    			npwp: filenameNPWP, 
	    			created_at : new Date(), 
	    			updated_at : new Date(),
	    		}])
	    		.into('in_mitra_berkas')

	    	return response.json({
	    		status : 'true',
	    		responses : '200',
	    	})
	    }else{
	    	const store = await Database			
	    		.insert([{
	    			id_mitra: Inputs.id_mitdor, 
	    			ktp: filenameKTP, 
	    			npwp: filenameNPWP, 
	    			created_at : new Date(), 
	    			updated_at : new Date(),
	    		}])
	    		.into('in_vendor_berkas')

	    	if (ktp !== null) {
	    	    let path = "images/file/KTP"
	    	    filenameKTP = ktp.toJSON().clientName;
	    	    await ktp.move(Helpers.publicPath(path), {
	    	        name: filenameKTP,
	    	        overwrite: true
	    	    })
	    	}

	    	return response.json({
	    		status : 'true',
	    		responses : '200',
	    	})
	    }
	}


// end mitra/vendor
	
}
module.exports = AdminController
