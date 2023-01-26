<template>
  <div class="dashboard-user-container">
    <div class=" clearfix">
      <pan-thumb :image="avatar" style="float: left">
        Sus roles:
        <span v-for="item in roles" :key="item" class="pan-info-roles">{{
          item
        }}</span>
      </pan-thumb>
      <div class="info-container">
        <div class="display_name">{{ name }}</div>
        <span
          style="font-size:20px;padding-top:20px;display:inline-block;"
        >Dashboard</span>
      </div>
    </div>
    <div>
      <el-row class="info-permissions">
        <span class="display_name">Sus permisos:</span>
        <el-row :gutter="10" style="position: relative;">
          <el-col v-for="item in permissions" :key="item" :xs="24" :sm="12" :md="8" class="pan-info-permissions">
            <span :key="item" class="pan-info-permissions">{{
              item
            }}</span>
          </el-col>
        </el-row>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'

export default {
  name: 'DashboardEditor',
  components: { PanThumb },
  data() {
    return {
      emptyGif:
        'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'roles', 'permissions'])
  }
}
</script>
