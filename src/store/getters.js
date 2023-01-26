const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  dni: state => state.user.dni,
  email: state => state.user.email,
  introduction: state => state.user.introduction, // se va eliminar
  roles: state => state.user.roles,
  permissionRoutes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  userId: state => state.user.id,
  permissions: state => state.user.permissions,
  user: state => state.user.user,
  avatarDefault: state => state.user.avatarDefault
}
export default getters
