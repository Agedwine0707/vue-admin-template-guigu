import request from '@/utils/request'

export default {
  /**
   * 添加课程信息
   * @param {*} courseInfo 
   * @returns 
   */
  addCourseInfo(courseInfo) {
    return request({
      url: `/eduservice/educourse/addEduCourse`,
      method: 'post',
      data: courseInfo
    })
  },

  /**
   * 讲师名称下拉列表展示
   * @returns 
   */
  getAllTeacherInfo(){
    return request({
      url: '/eduservice/teacher/findAll',
      method: 'get'
    })
  },
  /**
   * 根据id回显课程信息
   * @param {*} id 
   * @returns 
   */
  getCourseInfo(id){
    return request({
      url: `/eduservice/educourse/getCourseInfo/${id}`,
      method: 'get'
    })
  },

  /**
   * 修改课程信息
   * @param {*} courseInfo 
   * @returns 
   */
  updateCourseInfo(courseInfo){
    return request({
      url: '/eduservice/educourse/updateCourseInfo',
      method:'post',
      data: courseInfo
    })
  }

}