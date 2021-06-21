<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number
          v-model="teacher.sort"
          controls-position="right"
          min="0"
        />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow = true"
          >更换头像
        </el-button>

        <!--
          v-show：是否显示上传组件
          :key：类似于id，如果一个页面多个图片上传控件，可以做区分
          :url：后台上传的url地址
          @close：关闭上传组件
          @crop-upload-success：上传成功后的回调 
        -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API + '/eduoss/fileoss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
// 引入组件
import teacherAip from "@/api/edu/teacher";
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  // 声明组件
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        name: "",
        sort: 0,
        level: 1,
        career: "",
        intro: "",
        // 没有上传头像时默认
        avatar: "https://mybucket-guli.oss-cn-shenzhen.aliyuncs.com/e27976887f6ae2d5a99114591517233f.jpeg",
      },
      imagecropperKey:0,  // 上传的图片id
      BASE_API: process.env.BASE_API, // 接口API地址
      imagecropperShow:false, // 是否显示上传组件
      saveBtnDisabled: false, // 保存按钮是否禁用,
    };
  },

  // 路由变化监听，变化后重新初始化
  watch: {
    $route(to, from) {
      this.init();
    },
  },

  created() {
    // 页面渲染完成之前执行
    this.init();
  },

  methods: {
    // 关闭头像上传组件
    close(){
      // 关闭头像上传组件
      this.imagecropperShow = false
      // 关闭上传组件后，初始化上传组件
      this.imagecropperKey = this.imagecropperKey + 1
    },
    // 上传头像成功的方法
    cropSuccess(data){
      this.imagecropperShow = false
      // 把返回的地址赋值给avatar字段(数据库存路径)
      this.teacher.avatar = data.url
      this.imagecropperKey = this.imagecropperKey + 1
    },
    init() {
      // 判断路径中是否有id值
      if (this.$route.params && this.$route.params.id) {
        // 获取路径中的id值
        const id = this.$route.params.id;
        // 调用回显方法
        this.getInfo(id);
      } else {
        this.teacher = {};
      }
    },
    // 判断当前操作是修改还是添加(根据teacher是否有id),执行相应操作
    saveOrUpdate() {
      if (!this.teacher.id) {
        this.saveTeacher();
      } else {
        this.updateTeacher();
      }
    },

    // 添加讲师
    saveTeacher() {
      teacherAip.addTeacher(this.teacher).then((response) => {
        // 添加成功
        this.$message({
          type: "success",
          message: "添加成功！",
        });
        // 返回讲师列表 路由跳转
        this.$router.push({ path: "/teacher/table" });
      });
    },

    // 根据id获取回显信息(修改讲师)
    getInfo(id) {
      teacherAip.getTeacherInfo(id).then((response) => {
        this.teacher = response.data.teacher;
      });
    },
    // 修改讲师
    updateTeacher() {
      teacherAip.updateTeacher(this.teacher).then((response) => {
        // 修改成功
        this.$message({
          type: "success",
          message: "修改成功！",
        });
        // 返回讲师列表 路由跳转
        this.$router.push({ path: "/teacher/table" });
      });
    },
  },
};
</script>
