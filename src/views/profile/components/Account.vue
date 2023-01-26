<template>
  <el-card v-loading="loadingFormUserAcount" class="mt-3 mb-4" shadow="never">
    <el-row class="row-center">
      <el-col :xs="24" :sm="12" :md="12">
        <el-form
          ref="formUsuarioAccountEdit"
          :rules="reglasValidacion"
          :model="user"
          class="my-2"
        >
          <!-- <el-form-item label="DNI" prop="dni">
            <el-input v-model.trim="user.dni" :readonly="true" />
          </el-form-item> -->
          <el-form-item label="Nombre" prop="name">
            <el-input v-model.trim="user.name" :readonly="true" />
          </el-form-item>
          <el-form-item label="Clave" prop="clave">
            <el-input v-model.trim="user.clave" />
          </el-form-item>
          <el-form-item label="Confirmar clave" prop="clave_confirm">
            <el-input v-model.trim="user.clave_confirm" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="row-center">
      <el-col :xs="24" :sm="12" :md="12">
        <el-button type="primary" @click="submitCambiarClave">Cambiar clave</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import UserResource from '@/api/user'
const miperfilResource = new UserResource('actualizar/miclave')

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  data() {
    return {
      loadingFormUserAcount: false,
      reglasValidacion: {
        clave: [
          {
            required: true,
            message: 'El campo clave es requerido',
            trigger: 'blur'
          }
        ],
        clave_confirm: [
          {
            required: true,
            message: 'Por favor ingrese la confirmación de la clave',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    // this.getUser()
  },
  mounted() {
    // this.resetFormUserAcount()
  },
  methods: {
    submitCambiarClave() {
      this.$refs['formUsuarioAccountEdit'].validate((valid) => {
        if (valid) {
          this.loadingFormUserAcount = true
          miperfilResource
            .actualizarMiclave(this.user)
            .then((response) => {
              this.$message({
                message: 'Clave actualizada correctamente',
                type: 'success',
                duration: 4.25 * 1000
              })
              this.user.clave_confirm = ''
              this.user.clave = ''
              this.loadingFormUserAcount = false
            })
            .catch(() => {
              this.loadingFormUserAcount = false
              this.$message({
                message: 'Se ha producido un error',
                type: 'error',
                duration: 4.25 * 1000
              })
            })
            .finally(() => {
              this.loadingFormUserAcount = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .row-center {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
