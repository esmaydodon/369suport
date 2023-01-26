<template>
  <div class="app-container">
    <el-card style="margin-bottom:20px;" class="border-top-primary" shadow="never">

      <template #header>
        <div class="card-header">
          <h3 class="card-header">MI PERFIL</h3>
        </div>
      </template>

      <div v-if="user">

        <el-row>
          <el-col :span="24" :xs="24">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Datos de la cuenta" name="activity">
                <user-card :user="user" />
              </el-tab-pane>
              <el-tab-pane label="Cambiar clave" name="timeline">
                <account :user="user" />
              </el-tab-pane>
              <!-- <el-tab-pane label="Account" name="account">
                <timeline :user="user" />
              </el-tab-pane> -->
            </el-tabs>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
// import Activity from './components/Activity'
// import Timeline from './components/Timeline'
import Account from './components/Account'

export default {
  name: 'Profile',
  components: { UserCard, Account },
  // components: { UserCard, Activity, Timeline, Account },
  // components: { UserCard },
  data() {
    return {
      user: {},
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'dni',
      'email',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        dni: this.dni,
        name: this.name,
        role: this.roles.join(' | '),
        // email: 'crisoper@gmail.com',
        email: this.email,
        avatar: this.avatar
      }
    }
  }
}
</script>
