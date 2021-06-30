<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download" />
          <a :href="'/static/template.xlsx'">点击下载模版</a>
        </el-tag>
      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API + '/eduservice/edusubject/addSubject'"
          name="file"
          accept="application/vnd.ms-excel"
        >
          <el-button slot="trigger" size="small" type="primary"
            >选取文件</el-button
          >
          <el-button
            :loading="loading"
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            >上传到服务器</el-button
          >
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 接口API地址
      BASE_API: process.env.BASE_API,
      // 阿里云OSS地址
      OSS_PATH: process.env.OSS_PATH,
      // 按钮是否禁用,
      importBtnDisabled: false,
      loading: false,
    };
  },

  methods: {
    /**
     * 点击按钮提交excel文件
     */
    submitUpload() {
      this.importBtnDisabled = true;
      this.loading = true;
      this.$refs.upload.submit();
    },

    /**
     *  上传成功,提示信息,跳转到课程分类列表 (路由跳转)
     */
    fileUploadSuccess() {
      this.loading = false;
      this.$message({
        type: "success",
        message: "添加课程分类成功",
      });
      this.$router.push({ path: "/subject/list" });
    },

    /**
     * 上传失败,提示信息,禁止在上传
     */
    fileUploadError() {
      this.loading = false;
      this.$error({
        type: "error",
        message: "添加课程分类失败,请检查上传文件",
      });
    },
  },
};
</script>