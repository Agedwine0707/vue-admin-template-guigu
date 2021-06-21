import request from '@/utils/request'
export default {
    /**
     * 获取课程类别（tree）
     * @returns 
     */
    getTreeSubjectList() {
        return request({
            url: '/eduservice/edusubject/getAllSubject',
            method: 'get',
        })
    }
}