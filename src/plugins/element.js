import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElRow,
  ElMessage,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain
} from 'element-plus'

export default (app) => {
  app.use(ElButton)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.use(ElRow)
  app.use(ElMessage)
  app.use(ElContainer)
  app.use(ElHeader)
  app.use(ElAside)
  app.use(ElMain)
}
