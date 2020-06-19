'use strict'
const Database = use('Database')
const Encryption = use('Encryption')
const moment = require('moment');
const Helpers = use('Helpers')

class HackController {
	async lihatpassword({request,response}){
		return Encryption.decrypt('29493097936a8322efc02d850c823fabTA8CaVc+9w6e5SfV82XE1Q==')
	}
}
module.exports = HackController
