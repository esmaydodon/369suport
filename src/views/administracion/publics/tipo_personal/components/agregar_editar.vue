<template>
  <div v-loading="loading" class="app-container">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form ref="formTipoPersonal" :model="tipoPersonal" :rules="reglas" label-position="top">
          <el-form-item label="Tipo De Personal" prop="nombre">
            <el-input v-model="tipoPersonal.nombre" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="10" :type="rowType" justify="center">
      <el-col :xs="24" :sm="12" :md="8">
        <el-button type="primary" plain style="width: 100%; margin:7px 0px;" @click="close">Cancelar</el-button>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-button type="primary" style="width: 100%; margin:7px 0px;" @click="handleSubmitForm">Guardar</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// Utils
import { debounce } from '@/utils'
// Resource
import TipoPersonalResource from '@/api/tipo_personal'
const tipoPersonalResource = new TipoPersonalResource()
export default {
  name: 'AgregarEditarTipoPersonal',
  props: {
    tipoPersonalId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      tipoPersonal: {
        id: undefined,
        nombre: ''
      },
      reglas: {
        nombre: [
          { required: true, message: 'El campo es obligatorio', trigger: 'blur' },
          { require: true, max: 255, message: 'El campo debe tener maximo 255 caracteres', trigger: 'blur' }
        ]
      },
      rowType: 'flex'
    }
  },
  watch: {
    tipoPersonalId(newValue, oldValue) {
      if (newValue !== oldValue && newValue > 0) {
        this.getTipoPersonal()
      }
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      const windowWidth = document.documentElement.clientWidth
      if (windowWidth < 768) {
        this.rowType = ''
      } else {
        this.rowType = 'flex'
      }
    })
    window.addEventListener('resize', this.__resizeHandler)

    if (this.tipoPersonalId > 0) {
      this.getTipoPersonal()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getTipoPersonal() {
      this.loading = true
      tipoPersonalResource.get(this.tipoPersonalId)
        .then(
          (response) => {
            this.tipoPersonal = response.data
            this.loading = false
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = false
          }
        )
    },
    handleSubmitForm() {
      this.loading = true
      this.$refs['formTipoPersonal'].validate((valid) => {
        if (valid) {
          if (this.tipoPersonalId < 0) {
            this.agregarTipoPersonal()
          } else {
            this.editarTipoPersonal()
          }
        } else {
          this.loading = false
        }
      })
    },
    agregarTipoPersonal() {
      tipoPersonalResource.store(this.tipoPersonal)
        .then(
          (response) => {
            this.$message({
              message: response.message,
              type: response.type
            })
            this.loading = false
            this.close()
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = false
          }
        )
    },
    editarTipoPersonal() {
      tipoPersonalResource.update(this.tipoPersonalId, this.tipoPersonal)
        .then(
          (response) => {
            this.$message({
              message: response.message,
              type: response.type
            })
            this.loading = false
            this.close()
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = false
          }
        )
    },
    close() {
      this.tipoPersonal = {
        id: undefined,
        nombre: ''
      }
      this.$refs['formTipoPersonal'].resetFields()
      this.$emit('close')
    }
  }
}
</script>

