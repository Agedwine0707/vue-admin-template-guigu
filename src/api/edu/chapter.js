import request from '@/utils/request'

export default {

  /**
   * 获取章节列表，根据课程id
   * @param {*} courseId 
   * @returns 
   */
  getChapterVideoList(courseId) {
    return request({
      url: `/eduservice/chapter/getChapterVideo/${courseId}`,
      method: 'get',
    })
  },

}
