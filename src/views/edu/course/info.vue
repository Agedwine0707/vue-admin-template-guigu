<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder="PHP" />
      </el-form-item>

      <el-form-item label="课程分类">
        <!-- 所属分类 一级分类 -->
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
          @change="subjectlevelOneChanged"
        >
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject2 in subjectTowList"
            :key="subject2.id"
            :label="subject2.title"
            :value="subject2.id"
          />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/eduoss/fileoss'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>

      <!-- 课程价格 -->
      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from "@/api/edu/course";
import subject from "@/api/edu/subject";
import Tinymce from "@/components/Tinymce";

const defaultForm = {
  title: "",
  subjectId: "",
  teacherId: "",
  lessonNum: 0,
  description: "",
  subjectParentId: "",
  cover: "/static/upload.png",
  price: 0,
};

export default {
  // 声明组件
  components: { Tinymce },
  data() {
    return {
      courseInfo: defaultForm,
      // 保存按钮是否禁用
      saveBtnDisabled: false,
      // 讲师列表数据
      teacherList: [],
      // 课程一级分类
      subjectOneList: [],
      // 课程二级分类
      subjectTowList: [],
      // 接口API地址
      BASE_API: process.env.BASE_API,
      courseId: "",
    };
  },
  
  // 路由变化监听，变化后重新初始化
  watch: {
    $route(to, from) {
      this.init();
    },
  },

  // 页面加载时执行
  created() {
    this.getTeacherList();
    this.getSubjectOneList();

    /**
     * 如果页面路由中带有id值就回显课程信息，没有就置空数据
     */
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getCourseInfo();
    }else{
      this.courseInfo={}
      this.courseInfo.cover='/static/upload.png'
      this.courseInfo.lessonNum=0
      this.courseInfo.price=0
    }
  },

  methods: {
    // 根据课程id查询回显信息
    getCourseInfo() {
      course.getCourseInfo(this.courseId).then((response) => {
        this.courseInfo = response.data.courseInfo;

        subject.getTreeSubjectList().then((response) => {
          this.subjectOneList = response.data.list;

          /**
           * 点击上一步回显信息时，下拉列表框中的数据没有初始化，只有id值
           * 在回显信息的同时加载课程二级下拉框和讲师下拉框，实现上一步，
           * 下拉框默认选中
           */
          for (var i = 0; i < this.subjectOneList.length; i++) {
            var subject = this.subjectOneList[i];
            if (this.courseInfo.subjectParentId === subject.id) {
              this.subjectTowList = subject.children;
            }
          }
        });
        this.getTeacherList();
      });
    },
    // 上传封面成功回调
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.url;
    },
    // 上传封面之前执行
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 获取讲师列表
    getTeacherList() {
      course.getAllTeacherInfo().then((response) => {
        this.teacherList = response.data.items;
      });
    },
    // 获取所有的一级课程列表
    getSubjectOneList() {
      subject.getTreeSubjectList().then((response) => {
        this.subjectOneList = response.data.list;
      });
    },

    // 点击某个一级分类，触发change,显示对应的二级分类(value就是一级分类的id值)
    subjectlevelOneChanged(value) {
      // 遍历所有的课程列表数据
      for (var i = 0; i < this.subjectOneList.length; i++) {
        // 取到每个一级分类
        var subjectOne = this.subjectOneList[i];
        // 如果数据中一级列表id和当前选择id一样
        if (value === subjectOne.id) {
          // 从一级列表中把二级目录取出
          this.subjectTowList = subjectOne.children;
          // 把二级分类的id值清空(防止数据残留)
          this.courseInfo.subjectId = "";
        }
      }
    },

    saveOrUpdate() {
      // 判断是添加操作还是修改
      if(!this.courseInfo.id){
        course.addCourseInfo(this.courseInfo).then((response) => {
          this.$message({
            type: "success",
            message: "保存成功!",
          });
          this.$router.push({
            path: "/edu/course/chapter/" + response.data.courseId,
          })
        })

      }else{
        this.updateCourse()
      }
    },
    // 修改课程
    updateCourse(){
      course.updateCourseInfo()
        .then(response =>{
          this.$message({
            type:'success',
            message:'修改课程信息成功！'
          })
          // 带上courseId进入第二步
          this.$router.push({path:'/edu/course/chapter/'+this.courseId})
        })
    }
  }
}
</script>

<style scoped>
/* 富文本编辑器样式 */
.tinymce-container {
  line-height: 29px;
}
</style>