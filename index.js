//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const { load } = require('dotenv').config();
const { PORT } = process.env
const app = require('./src/app.js');
const { conn } = require('./src/db.js');
const { loadingvideogames, loadinggenres, loadingdescription, genresforeachgame} = require('./src/loadingpage.js')
// Syncing all the models at once.
conn.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`%s listening at ${PORT}`); // eslint-disable-line no-console
  });
})
.catch(err => console.log(err))