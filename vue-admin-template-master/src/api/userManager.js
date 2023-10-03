import request from '@/utils/request'

export default{
  /*
  searchModel:{
    pageNo: 1,
    pageSize: 10
  }
   */
  getUserList(searchModel){
    return request({
      url: '/user/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        username: searchModel.username,
        phone: searchModel.phone
      }
    });
  },
  addUser(user){
    //这里的user就是那个表单
    return request({
      url: '/user',
      method: 'post',
      data: user
    });
  },
  getUserById(id){
    return request({
      url: `/user/${id}`,
      method: 'get'
    });
  },
  updateUser(user){
    return request({
      url: `/user`,
      method: 'put',
      data: user
    });
  },
  //!!!注意这里`引号的方向!!!
  deleteUserById(id){
    return request({
      url: `/user/${id}`,
      method: 'delete'
    });
  }
}