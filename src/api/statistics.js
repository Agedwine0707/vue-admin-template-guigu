import request from '@/utils/request'

export default{
    /**
     * 获取某天的注册人数
     * @param {*} day 
     * @returns 
     */
    createStatistics(day){
        return request({
            url: `/statistics/daily/${day}`,
            method: 'post'
        })
    },

    /**
     * 获取图表显示数据
     * @param {*} searchObj 
     * @returns 
     */
    showChart(searchObj) {
        return request({
            url: `/statistics/daily/show-chart/${searchObj.begin}/${searchObj.end}/${searchObj.type}`,
            method: 'get'
        })
    }

}