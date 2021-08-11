const API_SECRET = process.env.API_SECRET;
let jwt = require('jsonwebtoken');
let users = require('../utils/users/index');
var helpers = require('../services/helper/index');
const Admin = require('../utils/admin/admin');
checkToken = async (req, res, next) => {
    let token = req.headers['access_token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (!token) {
        return res.status(401).json({ status: false, message: "Something went wrong with token" });
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    if (token) {
        jwt.verify(token, API_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ status: false, message: "Something went wrong with token" });
            }
            let user_id = decoded.user_id;
            console.log(user_id,decoded)
            let response = { status: null, data: { status: null } }
            if (decoded.type == 'User') {
                response = await users.getUserDetail(user_id);
            }
            else {
                return res.status(451).json({ status: false, message: "Invalid Token" });
            }
            if (!response.status) {
                return res.status(451).json({ status: false, message: "Unauthorized User" });
            }
            if (!response.data.status) {
                return res.status(423).json({ status: false, message: "Invalid User" });
            }
            req.decoded = decoded;
            req.token = token
            next();
        });
    } else {
        return res.status(401).json({ status: false, message: "Something went wrong with token" });
    }
};
checkAdminToken = async (req, res, next) => {
    let token = req.headers['access_token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (!token) {
        return res.status(401).json({ status: false, message: "Something went wrong with token" });
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    if (token) {
        // console.log(token)
        jwt.verify(token, API_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ status: false, message: "Something went wrong with token" });
            }
            let user_id = decoded.user_id;
            console.log(user_id)
            let response = { status: null, data: { status: null } }

            if(decoded.type=="admin"){
                 response = await Admin.getUserDetail(user_id);

            }

            if (!response.status) {
                return res.status(451).json({ status: false, message: "Invalid Token" });
            }
            if (!response.data.status) {
                return res.status(423).json({ status: false, message: "Invalid User" });
            }
            req.decoded = decoded;
            req.token = token
            next();
        });
    } else {
        return res.status(401).json({ status: false, message: "Something went wrong with token" });
    }
};

// reauthAdminToken = async (req, res, next) => {
//   let token = req.headers['access_token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
//   if (!token) {
//     return res.status(401).json({ status: false, message: "Something went wrong with token" });
//   }
//   if (token.startsWith('Bearer ')) {
//     token = token.slice(7, token.length);
//   }
//   if (token) {
//     jwt.verify(token, API_SECRET, async (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ status: false, message: "Something went wrong with token" });
//       }
//       let user_id = decoded.user_id;
//       console.log(user_id)
//       let response={status:null,data:{status:null}}
//       if(decoded.type==0){
//          response = await Admin.getUserDetail(user_id);
//       }
//       if (!response.status) {
//         return res.status(451).json({ status: false, message: "Invalid Token" });
//       }
//       if (!response.data.status) {
//         return res.status(423).json({ status: false, message: "Invalid User" });
//       }
//       req.decoded = decoded;
//       req.token = token
//       return res.status(200).json({ status: true, message: "Success" });
//     });
//   } else {
//     return res.status(401).json({ status: false, message: "Something went wrong with token" });
//   }
// };
// checkTokenRestaurant = async (req, res, next) => {
//     let token = req.headers['access_token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
//     if (!token) {
//         return res.status(401).json({ status: false, message: "Something went wrong with tokenn" });
//     }
//     if (token.startsWith('Bearer ')) {
//         token = token.slice(7, token.length);
//     }
//     console
//     if (token) {
//         jwt.verify(token, API_SECRET, async (err, decoded) => {

//             if (err) {
//                 return res.status(401).json({ status: false, message: err.message });
//             }
//             let user_id = decoded.user_id;
//             console.log(user_id, decoded)
//             let response = { status: null, data: { status: null } }

//             if (decoded.type == 'restaurant') {
//                 response = await Restaurant.getRestaurantDetail(user_id);
//             }
//             if (!response.status) {
//                 return res.status(451).json({ status: false, message: "Invalid Token" });
//             }
//             if (!response.data.status) {
//                 return res.status(423).json({ status: false, message: "Invalid User" });
//             }
//             req.decoded = decoded;
//             req.token = token
//             next();
//         });
//     } else {
//         return res.status(401).json({ status: false, message: "Something went wrong with token" });
//     }
// };
// refreshToken = async (req, res) => {
//   let requiredFields = ['type', '_id'];
//   let validator = helpers.validateParams(req, requiredFields);
//   if (!validator.status) {
//     response = helpers.showResponse(false, validator.message)
//     return res.status(203).json(response);
//   }
//   let { type, _id } = req.body
//   if (type === 'user') {
//     let result = await Users.getUserDetail(_id);
//     if (!result.status) {
//       return res.status(403).json(helpers.showResponse(false, "Invalid User"));
//     }
//     let userData = result.data;
//     if(userData.status == 0) {
//       return res.status(451).json(helpers.showResponse(false, "Your account login has been disabled by admin !!! Please contact administrator"));
//     }
//     if (userData.status == 2) {
//       return res.status(423).json(helpers.showResponse(false, "Your Account has been deleted by admin !!! Please register again"));
//     }
//     let token = jwt.sign({ user_id: _id }, API_SECRET, {
//       expiresIn: process.env.JWT_EXPIRY
//     });
//     data = { token: token, time: process.env.JWT_EXPIRY };
//   } 
//   // else if (type === 'admin') {
//   //   let result = await getSingleData(Admin, { _id: ObjectId(_id) }, '');
//   //   if (!result.status) {
//   //     return res.status(403).json(helpers.showResponse(false, A_NOT_FOUND));
//   //   }
//   //   let AdminData = result.data;
//   //   if (AdminData.status == 0) {
//   //     return res.status(451).json(helpers.showResponse(false, A_DISABLED));
//   //   }
//   //   if (AdminData.status == 2) {
//   //     return res.status(423).json(helpers.showResponse(false, A_DELETED));
//   //   }
//   //   let token = jwt.sign({ admin_id: _id }, API_SECRET, {
//   //     expiresIn: process.env.JWT_EXPIRY
//   //   });
//   //   data = { token: token, time: process.env.JWT_EXPIRY };
//   // }
//   return res.status(200).json(helpers.showResponse(true, "TOKEN_CREATED", data));
// }



module.exports = {
    checkToken: checkToken,
    // checkTokenRestaurant: checkTokenRestaurant,
    checkAdminToken: checkAdminToken,
    //   reauthAdminToken:reauthAdminToken

}