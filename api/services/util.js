module.exports.checkPhone =function (phone){
	return (/^(?:13\d|15[89])-?\d{5}(\d{3}|\*{3})$/.test(phone));
	} 