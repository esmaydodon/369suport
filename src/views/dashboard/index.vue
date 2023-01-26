<template>
  <div class="app-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import adminDashboard from './admin'
import userDashboard from './user'

export default {
  name: 'Dashboard',
  components: { userDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.currentRole = 'userDashboard'
    // if (!this.roles.includes('Administrador')) {
    // }
  }
}
</script>
