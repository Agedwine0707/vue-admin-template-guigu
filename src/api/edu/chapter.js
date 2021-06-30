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

  /**
   * 添加章节列表
   * @param {*} chapter 
   * @returns 
   */
  addChapter(chapter){
    return request({
      url: `/eduservice/chapter/addChapter`,
      method: 'post',
      data:chapter
    })
  },

  /**
   * 根据id获取章节信息
   * @param {*} chapterId 
   * @returns 
   */
  getChapterById(chapterId){
    return request({
      url: `/eduservice/chapter/getChapterInfo/${chapterId}`,
      method: 'get'
    })
  },

  /**
   * 修改章节信息
   * @param {*} chapter 
   * @returns 
   */
  updateChapter(chapter){
    return request({
      url: `/eduservice/chapter/updateChapter`,
      method: 'post',
      data:chapter
    })
  },

  /**
   * 删除章节信息
   * @param {*} chapter 
   * @returns 
   */
  deleteChapterById(chapterId){
    return request({
      url: `/eduservice/chapter/deleteChapter/${chapterId}`,
      method: 'delete',
    })
  }


}
