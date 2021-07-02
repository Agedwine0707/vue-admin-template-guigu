import request from '@/utils/request'

export default {
    /**
     * 根据id删除视频
     * @param {*} id 阿里云中存储的视频id
     * @returns 
     */
     removeVideoById(id){
        return request({
            url: `/vod/video/${id}`,
            method: 'delete',
        })
    },
}