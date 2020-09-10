'use strict'
const Database = use('Database')
const Encryption = use('Encryption')
const moment = require('moment');
const Helpers = use('Helpers')
const randomstring = use("randomstring");

class LoginController {

	async registrasi({request,response}){
		try{
			const pin = randomstring.generate({
	  			length: 6,
	  			charset: 'numeric'
			});

			function appendLeadingZeroes(n){
			  if(n <= 9){
			    return "0" + n;
			  }
			  return n
			}
			
			let current_datetime = new Date()
			let formatted_date = current_datetime.getFullYear() +''+ appendLeadingZeroes(current_datetime.getMonth() + 1) +''+ appendLeadingZeroes(current_datetime.getDate())

			const lastMemID = await Database.select(Database.raw('substr(id_member,12,30) as id_member'))
			    .from('in_member')
			    .orderBy(Database.raw('substr(id_member,12,30)'), 'desc')
			    .first();

	        let lastmemberid = null;

	        if (lastMemID ) {
	          lastmemberid = 'MEM'+ formatted_date + ++lastMemID.id_member;
	        } else {
	          lastmemberid = 'MEM'+ formatted_date +'1000000001';
	        }

	        const pelangganInfo 	= request.only(['nama','no_telpon','email','password','alamat'])
	        const cekEmail = await Database.from('in_member').where('email',pelangganInfo.email)

	        if(cekEmail != ""){	
	        	return response.json({
	        		response : 204,
	        		data     : 'Email Telah Tersedia'
	        	})
	        }else{
	        	const insert = await Database
	        		.table('in_member')
	        		.insert({
	        			id_member  : lastmemberid,
	        			nama       : pelangganInfo.nama,
	        			email      : pelangganInfo.email,
	        			no_telpon  : pelangganInfo.no_telpon,
	        			alamat     : pelangganInfo.alamat,
	        			pin        : pin,
	        			password   : Encryption.encrypt(pelangganInfo.password)
	        		})

	        	if (insert) {
	        		return response.json({
	        			response : 200,
	        			data     : 'Akun Berhasil Didaftarkan'
	        		})
	        	}
	        }
	    }catch(e){
	    	return response.json({
	    		response : 500,
	    		data     : e,
	    	})
	    }
	} 

	async login({request,response}){
		try{
			const Inputs = request.only(['email','password'])
			const cekEmail = await Database.from('in_member').where('email',Inputs.email).first()
			if(cekEmail){
				if (Encryption.decrypt(cekEmail.password) == Inputs.password) {
					return response.json({
						response : 200,
						data     : 'Sukses'
					})	
				}else{
					return response.json({
						response : 204,
						data     : 'Email dan Username Salah'
					})		
				}
			}else{
				return response.json({
					response : 404,
					data     : 'Email Tidak Terdaftar'
				})
			}
		}catch(e){
			return response.json({
				response : 500,
				data     : e
			})
		}
	}
	
}
module.exports = LoginController
