<template>
  <div style="padding-top: 10vh">
    <el-row style="display: flex; justify-content: center;">
      <el-col :xs="23" :sm="12" :md="8" :lg="7" style="justify-content: center;">
        <el-card>
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            autocomplete="on"
            label-position="left"
          >
            <el-row>
              <el-col :xs="24" :sm="24" style="text-align: center" class="my-3 pb-3">
                <div style="background-color: #186cb7 ">
                  <img width="240" src="@/assets/img/logo_landscape.png">
                </div>
              </el-col>
              <el-col :xs="24" :sm="24">
                <el-form-item prop="username">
                  <el-input
                    ref="username"
                    v-model="loginForm.username"
                    placeholder="USUARIO"
                    name="username"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
                    size="8"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24">
                <el-tooltip
                  v-model="capsTooltip"
                  content="Mayúsculas está activo!"
                  placement="right"
                  manual
                >
                  <el-form-item prop="password">
                    <el-input
                      :key="passwordType"
                      ref="password"
                      v-model="loginForm.password"
                      :type="passwordType"
                      placeholder="CONTRASEÑA"
                      name="password"
                      tabindex="2"
                      autocomplete="on"
                      @keyup.native="checkCapslock"
                      @blur="capsTooltip = false"
                      @keyup.enter.native="handleLogin"
                    />
                  </el-form-item>
                </el-tooltip>
              </el-col>
              <el-col :xs="24" :sm="24">
                <el-button
                  :loading="loading"
                  type="primary"
                  style="width: 100%; margin-bottom: 10px; margin-top:10px"
                  @click.native.prevent="handleLogin"
                >
                  Acceder
                </el-button>
              </el-col>
              <el-col :xs="24" :sm="24" class="mt-2" style="text-align: center">
                <div class="text-muted small">© Derechos reservados</div>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { csrf } from '@/api/auth'
const defaultSettings = require('@/settings.js')

export default {
  name: 'Login',
  components: {},
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Ingrese un usuario válido'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('Ingrese su contraseña'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      appTitle: defaultSettings.title
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {},
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {},
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          csrf().then(() => {
            this.$store
              .dispatch('user/login', this.loginForm)
              .then(() => {
                this.$router.push({
                  path: this.redirect || '/',
                  query: this.otherQuery
                })
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          }) // csrf()
        } else {
          console.log('error Login!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>
