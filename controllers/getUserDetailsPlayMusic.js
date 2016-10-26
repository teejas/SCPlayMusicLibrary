/**
 * Created by tejassiripurapu on 10/26/16.
 */
module.exports = {
    getPlaylists : function() {
        return new Promise(function(resolve, reject) {
            pm.getPlaylists(function(err, data) {
                if(err) {
                    return reject(err);
                }
                resolve(data);
            })
        })
    }
}