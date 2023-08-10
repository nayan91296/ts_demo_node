import encryptData from "../middleware/encryptData";

module.exports.success = async function(req:any,res:any,data:any) {
   
    if (req.headers.env == "test") {
        return data
    }

    let encData = await encryptData.EncryptedData(req, res, data)
    // console.log('encData',encData);
    return encData
  };
  
  module.exports.error = function(error:any) {
    return {
      success: false,
      error: error
    };
  };
  
  module.exports.validationError = function(errors:any) {
    return {
      success: false,
      errors: errors
    };
  };