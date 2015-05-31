/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
  '/': {
    view: 'homepage'
  },

  //验证手机号码是否注册
  'GET /api/v1/checkPhone/:phone':'AuthController.checkPhone',





  //登录
  'POST /api/v1/login': 'AuthController.login',

  //注册
  'POST /api/v1/signin':'AuthController.signin',

  //登出
  'GET /api/v1/logout':'AuthController.logout',







  //获取用户详情
  'GET /api/v1/user/profile/:uid':'UserController.profile',

  //修改用户资料
  'POST /api/v1/user/update':'UserController.updateProfile',
  //'GET /api/v1/user':{response:'forbidden'},
  
  //搜索用户资料（通过手机号码或者昵称）
  'GET /api/v1/search/user':'SearchController.userinfo',



  //加入黑名单
  'POST /api/v1/blacklist/add':'BlacklistController.add',
  //移除黑名单
  'POST /api/v1/blacklist/remove':'BlacklistController.remove',
  //获取黑名单
  'GET /api/v1/blacklist':'BlacklistController.blacklist',



  //添加关注
  'POST /api/v1/follow/add':'FollowController.add',

  //取消关注
  'POST /api/v1/follow/remove':'FollowController.remove',
  //获取粉丝
  'GET /api/v1/followers':'FollowController.followers',
  //获取我关注的人
  'GET /api/v1/followees':'FollowController.followees',
  


  //发布
  'POST /api/v1/activity/publish':'ActivityController.publish',
  //删除
  'POST /api/v1/activity/delete':'ActivityController.delActivity',



  //评论
  'POST /api/v1/activity/reply':'ReplyController.reply',
  //删除评论
  'POST /api/v1/reply/delete':'ReplyController.delComment',

  //点赞
  'POST /api/v1/activity/like':'ActivityController.like',
  //收藏
  'POST /api/v1/activity/collect':'ActivityController.collect',

  //报名
  'POST /api/v1/activity/attend':'ActivityController.attend',
  //取消报名
  'POST /api/v1/activity/quit':'ActivityController.quit',



  'GET /api/v1/activity/latest':'ListActivityController.latest',
  'GET /api/v1/activity/nearest':'ListActivityController.nearest',
  'GET /api/v1/activity/:aid':'ActivityController.detail',
  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
