<template>
  <div>
    <a-upload
      name="file"
      listType="picture"
      :action="uploadAction"
      :fileList="fileList"
      @change="handleChange"
      @preview="handlePreview"
    >
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel()">
      <img alt="example" style="width: 100%" :src="previewImage" :close="false" />
    </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getFileAccessHttpUrl } from '@/api/manage'

const uidGenerator = () => {
  return '-' + parseInt(Math.random() * 10000 + 1, 10)
}
const getFileName = path => {
  if (path.lastIndexOf('\\') >= 0) {
    const reg = new RegExp('\\\\', 'g')
    path = path.replace(reg, '/')
  }
  return path.substring(path.lastIndexOf('/') + 1)
}
export default {
  name: 'JImageUpload',
  data() {
    return {
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
      urlView: window._CONFIG['staticDomainURL'],
      uploadLoading: false,
      picUrl: false,
      headers: {},
      fileList: [],
      previewImage: '',
      previewVisible: false
    }
  },
  props: {
    text: {
      type: String,
      required: false,
      default: '上传'
    },
    /* 这个属性用于控制文件上传的业务路径*/
    bizPath: {
      type: String,
      required: false,
      default: 'temp'
    },
    //  fileList图片列表
    value: {
      type: [String, Array],
      required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    isMultiple: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function(val) {
        if (val instanceof Array) {
          this.initFileList(val.join(','))
        } else {
          this.initFileList(val)
        }
      }
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
  },
  methods: {
    initFileList(paths) {
      if (!paths || paths.length == 0) {
        this.fileList = []
        return
      }
      this.picUrl = true
      const fileList = []
      const arr = paths.split(',')
      for (var a = 0; a < arr.length; a++) {
        const url = getFileAccessHttpUrl(arr[a], this.urlView, 'http')
        fileList.push({
          uid: uidGenerator(),
          name: getFileName(arr[a]),
          status: 'done',
          url: url,
          response: {
            status: 'history',
            message: arr[a]
          }
        })
      }
      this.fileList = fileList
    },
    handleChange(info) {
      this.picUrl = false
      let fileList = info.fileList
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          this.picUrl = true
          fileList = fileList.map(file => {
            if (file.response) {
              file.url = file.response.message
            }
            return file
          })
        }
        // this.$message.success(`${info.file.name} 上传成功!`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`)
      } else if (info.file.status === 'removed') {
        this.handleDelete(info.file)
      }
      this.fileList = fileList
      if (info.file.status === 'done' || info.file.status === 'removed') {
        this.handlePathChange()
      }
    },
    // 预览
    handlePreview(file) {
      console.log('file预览', file)

      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    getAvatarView() {
      if (this.fileList.length > 0) {
        const url = this.fileList[0].url
        return getFileAccessHttpUrl(url, this.urlView, 'http')
      }
    },
    handlePathChange() {
      const uploadFiles = this.fileList
      let path = ''
      if (!uploadFiles || uploadFiles.length == 0) {
        path = ''
      }
      const arr = []
      if (!this.isMultiple) {
        arr.push(uploadFiles[uploadFiles.length - 1].response.message)
      } else {
        for (var a = 0; a < uploadFiles.length; a++) {
          arr.push(uploadFiles[a].response.message)
        }
      }
      if (arr.length > 0) {
        path = arr.join(',')
      }
      this.$emit('change', path)
    },
    handleDelete(file) {
      return
      // 如有需要新增 删除逻辑
      console.log(file)
    },
    handleCancel() {
      this.close()
      this.previewVisible = false
    },
    close() {}
  },
  model: {
    prop: 'value',
    event: 'change'
  }
}
</script>

<style scoped lang="less">
/deep/ .ant-upload-list{
  div{
  display: inline-block;
  margin-right: 5px;
  }
}
/deep/ .ant-upload-list-item {
  overflow: hidden;
  display: inline-block;
  border: 0;
}
/deep/ .anticon-close {
  display: none !important;
}
/deep/ .ant-upload-list-item-card-actions {
  display: none !important;
}
/deep/ .ant-upload-list-item-name {
  display: none !important;
}
/deep/ .ant-upload-list-item {
  padding: 0;
  span,
  img {
    display: inline-block;
    width: 48px;
    height: 48px;
  }
  a {

    position: absolute;
    top: 0px !important;
    left: 0px;
  }
}
</style>
