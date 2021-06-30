import request from '@/utils/request'

export default {
     /**
     * 添加小节
     * @param {*} video 
     * @returns 
     */
    addVideo(video) {
        return request({
            url: `/eduservice/video/addVideo`,
            method: 'post',
            data: video
        })
    },  

    /**
     * 根据id回显小节信息
     * @param {*} videoId 
     * @returns 
     */
    getVideoInfo(videoId){
        return request({
            url: `/eduservice/video/${videoId}`,
            method: 'get',
        })
    },

    /**
     * 修改小节信息
     * @param {*} video 
     * @returns 
     */
    updateVideo(video){
        return request({
            url: `/eduservice/video/updateVideo`,
            method: 'post',
            data: video
        })
    },

    /**
     * 删除小节信息
     * @param {*} video 
     * @returns 
     */
    deleteVideoById(videoId) {
        return request({
            url: `/eduservice/video/${videoId}`,
            method: 'delete',
        })
    }
}
