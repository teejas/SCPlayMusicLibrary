/**
 * Created by tejassiripurapu on 10/26/16.
 */
module.exports = {
    loginPlayMusic : function(loginObj) {
        console.log("user email: " + loginObj.email);
        console.log("user password: " + loginObj.password);
        return new Promise(function(resolve, reject) {
            pm.login(loginObj, function (err, initObj) {
                if (err) {
                    return reject(err);
                }
                console.log('login data: ', JSON.stringify(initObj));
                resolve(initObj);
            })
        });
    },
    initNewSession : function(initObj) {
        return new Promise(function(resolve, reject) {
            pm.init(initObj, function(err) {
                if(err) {
                    return reject(err);
                }
                resolve();
            })
        });
    }
};

