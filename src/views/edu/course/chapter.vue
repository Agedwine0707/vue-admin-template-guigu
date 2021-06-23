<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>
    <!-- 章节 -->
<ul class="chanpterList" >
    <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
            {{ chapter.title }}

            <span class="acts">
                <el-button type="text">添加课时</el-button>
                <el-button style="" type="text">编辑</el-button>
                <el-button type="text">删除</el-button>
            </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
            <li
                v-for="video in chapter.children"
                :key="video.id">
                <p>{{ video.title }}
                    <span class="acts">
                        <el-button type="text">编辑</el-button>
                        <el-button type="text">删除</el-button>
                    </span>
                </p>
            </li>
        </ul>
    </li>
</ul>

    <el-form label-width="120px">

      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import chapter from '@/api/edu/chapter'

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId:'',
      chapterVideoList:[],
    }
  },

    // 页面渲染之前执行
  created() {
    // 获取路由的id值
    if(this.$route.params && this.$route.params.id){
      this.courseId = this.$route.params.id
      this.getAllChapterVideoList()
    }

  },

  methods: {
    // 根据路由中的id值去获取课程章节信息
    getAllChapterVideoList(){
      chapter.getChapterVideoList(this.courseId)
        .then(response =>{
          this.chapterVideoList = response.data.allChapterVideo
        })
    },
    // 上一步
    previous() {
      this.$router.push({ path: '/edu/course/info/' +this.courseId })
    },
    // 下一步
    next() {
      console.log('next')
      this.$router.push({ path: '/edu/course/publish/'+this.courseId })
    }
  }
}
</script>