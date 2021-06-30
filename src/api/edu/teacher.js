import request from '@/utils/request'
export default {
    /**
     * 分页获取讲师数据
     * @param {*} current 当前页
     * @param {*} limit    每页记录条数
     * @param {*} teacherQuery 查询条件
     * @returns 
     */
    getTeacherListPage(current, limit, teacherQuery) {
        return request({
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            data: teacherQuery
        })
    },

    /**
     * 根据id删除讲师
     * @param {*} id 
     * @returns 
     */
    deleteTeacherId(id){
        return request({
            url:`/eduservice/teacher/${id}`,
            method:'delete',
        
        })
    },

    /**
     * 添加讲师
     * @param {*} teacher 
     * @returns 
     */
    addTeacher(teacher){
        return request({
            url:`/eduservice/teacher/addTeacher`,
            method:'post',
            data:teacher
        })
    },

    /**
     * 修改讲师数据回显
     * @param {*} id 根据id
     * @returns 
     */
    getTeacherInfo(id){
        return request({
            url:`/eduservice/teacher/getTeacher/${id}`,
            method:'get',
        })
    },

    /**
     * 修改讲师
     * @param {*} teacher 
     * @returns 
     */
    updateTeacher(teacher){
        return request({
            url:`/eduservice/teacher/updateTeacher`,
            method:'post',
            data:teacher
        })
    },

    /**
     * 获取所有讲师数据
     * @returns 
     */
    getTeacherList(){
        return request({
            url:`/eduservice/teacher/findAll`,
            method:'get',
        })
    }



}
