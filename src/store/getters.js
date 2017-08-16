const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.app.visitedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  crpRoles: state => state.role,
  crpPermissions: (state) => {
    return { records: state.permission.records, pageInfo: state.permission.pageInfo }
  },
  crpUsers: (state) => {
    return { records: state.user.records, pageInfo: state.user.pageInfo }
  }
};
export default getters
