<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>

    <el-button type="text" @click="openChapterDialog">添加章节</el-button>

    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}

          <span class="acts">
            <el-button style="" type="text" @click="openVideo(chapter.id)"
              >添加小节</el-button
            >
            <el-button style="" type="text" @click="openEditChatper(chapter.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="removeChapter(chapter.id)"
              >删除</el-button
            >
          </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}

              <span class="acts">
                <el-button style="" type="text" @click="editVideo(video.id)"
                  >编辑</el-button
                >
                <el-button type="text" @click="removeVideo(video.id)"
                  >删除</el-button
                >
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next"
        >下一步</el-button
      >
    </div>

    <!-- 添加和修改章节表单 弹出框 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapter.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单(小节) -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number
            v-model="video.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button
          :disabled="saveVideoBtnDisabled"
          type="primary"
          @click="saveOrUpdateVideo"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from "@/api/edu/chapter";
import video from "@/api/edu/video";

export default {
  data() {
    return {
      // 保存按钮是否禁用
      saveBtnDisabled: false,
      courseId: "",
      chapterVideoList: {},
      // 弹窗是否显示
      dialogChapterFormVisible: false,
      dialogVideoFormVisible: false,
      //封装弹窗的数据
      chapter: {
        title: "",
        sort: 0,
      },
      // 课时对象
      video: {
        title: "",
        sort: 0,
        free: 0,
        videoSourceId: "",
      },
    };
  },

  /**
   * 页面渲染之前执行，获取当前路由中的课程id,获取所有的章节小节列表
   */
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getAllChapterVideoList();
    }
  },

  methods: {
    /**
     * 编辑小节，打开弹窗调API回显数据
     */
    editVideo(videoId) {
      video.getVideoInfo(videoId).then((response) => {
        this.video = response.data.video;
      });
      this.dialogVideoFormVisible = true;
    },

    /**
     * 保存小节，给课程id和章节id赋值，调用api,刷新列表
     */
    saveVideo() {
      this.video.courseId = this.courseId;
      this.video.chapterId = this.chapterId;
      video.addVideo(this.video).then((response) => {
        this.$message({
          type: "success",
          message: "保存成功！",
        });
        this.helpStopDialog();
      });
    },

    /**
     * 在添加DML操作后调用，关闭弹窗，刷新列表，清空video对象
     */
    helpStopDialog() {
      this.dialogVideoFormVisible = false;
      this.getAllChapterVideoList();
      this.video.title = ""; // 重置章节标题
      this.video.sort = 0; // 重置章节标题
      this.video.videoSourceId = ""; // 重置视频资源id
      this.saveVideoBtnDisabled = false;
    },

    /**
     * 根据是否有video是否有id值判断当前操作是修改还是添加
     */
    saveOrUpdateVideo() {
      if (!this.video.id) {
        this.saveVideo();
      } else {
        this.updateVideo();
      }
    },

    /**
     * 点击修改小节
     */
    updateVideo() {
      video.updateVideo(this.video).then((response) => {
        this.$message({
          type: "success",
          message: "修改成功!",
        });
        this.helpStopDialog();
      });
    },

    /**
     * 初始化章节id值，打开添加小节弹窗
     */
    openVideo(chapterId) {
      this.chapterId = chapterId;
      this.dialogVideoFormVisible = true;
    },

    /**
     * 点击删除小节
     */
    removeVideo(videoId) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return video.deleteVideoById(videoId);
        })
        .then(() => {
          this.getAllChapterVideoList();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch((response) => {
          if (response === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          }
        });
    },

    /**
     * 删除章节，弹窗确认，成功后刷新列表,（没有return章节列表无法实时刷新？？？）
     */
    removeChapter(chapterId) {
      this.$confirm("此操作将永久删除该章节记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return chapter.deleteChapterById(chapterId);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getAllChapterVideoList();
        });
    },

    /**
     * 修改章节信息
     */
    updateChapter() {
      chapter.updateChapter(this.chapter).then((response) => {
        this.$message({
          type: "success",
          message: "修改章节成功!",
        });
        this.dialogChapterFormVisible = false;
        this.getAllChapterVideoList();
      });
    },

    /**
     * 修改章节数据回显，弹出章节弹窗，回显
     */
    openEditChatper(chapterId) {
      this.dialogChapterFormVisible = true;
      chapter.getChapterById(chapterId).then((response) => {
        this.chapter = response.data.chapter;
      });
    },

    /**
     * 打开添加章节的弹窗，清空里边数据
     */
    openChapterDialog() {
      this.dialogChapterFormVisible = true;
      this.chapter = {};
    },

    /**
     * 根据chapter对象中是否有id判断操作是保存还是修改
     */
    saveOrUpdate() {
      if (!this.chapter.id) {
        this.addChapter();
      } else {
        this.updateChapter();
      }
    },

    /**
     * 设置课程id,添加章节,关闭弹窗,提示信息,刷新页面
     */
    addChapter() {
      this.chapter.courseId = this.courseId;
      chapter.addChapter(this.chapter).then((response) => {
        this.dialogChapterFormVisible = false;
        this.$message({
          type: "success",
          message: "添加章节成功!",
        });
        this.getAllChapterVideoList();
      });
    },

    /**
     * 根据路由中的id值去获取章节和小节信息
     */
    getAllChapterVideoList() {
      chapter.getChapterVideoList(this.courseId).then((response) => {
        this.chapterVideoList = response.data.allChapterVideo;
      });
    },

    /**
     * 上一步
     */
    previous() {
      this.$router.push({ path: "/edu/course/info/" + this.courseId });
    },

    /**
     * 下一步
     */
    next() {
      console.log("next");
      this.$router.push({ path: "/edu/course/publish/" + this.courseId });
    },
  },
};
</script>


<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>