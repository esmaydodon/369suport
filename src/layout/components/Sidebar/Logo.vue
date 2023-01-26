<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" style="width: 40px;">
        <h1 v-else class="sidebar-title">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" style="width: 100px;">
        <!-- <h1 class="sidebar-title">{{ title }} </h1> -->
      </router-link>
    </transition>
  </div>
</template>

<script>
import logoApp from '@/assets/img/logo_landscape.png'
const defaultSettings = require('@/settings.js')

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: defaultSettings.title,
      logo: logoApp
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
    margin-top: 0px;
    margin-right: 10px;
}

.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 65px;
  line-height: 55px;
  // background: #ffffff; // #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    padding-top: 5px;
    height: 100%;
    width: 100%;

    & .sidebar-logo {
    //   width: 32px;
    //   height: 32px;
      // width: 170px;
      // height: 55px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      // display: inline-block;
      background-color: #3F474E;
      margin: 0;
      color: rgb(255, 255, 255);
      font-weight: 500;
      line-height: 45px;
      font-size: 12px;
      font-family: "Nunito", Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
