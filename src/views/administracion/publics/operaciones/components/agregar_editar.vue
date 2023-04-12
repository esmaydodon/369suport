<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form ref="formOperaciones" :model="operacion" :rules="reglas" label-position="top">
          <el-form-item label="Operación" prop="nombre">
            <el-input v-model="operacion.nombre" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="10" :type="rowType" justify="center">
      <el-col :xs="24" :sm="12" :md="8" style="text-align: right;">
        <el-button type="primary" plain style="width: 100%; margin: 7px 0px;" @click="close">Cancelar</el-button>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" style="text-align: left;">
        <el-button type="primary" style="width: 100%; margin: 7px 0px;" @click="handleSubmitForm">Guardar</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// Utilidades
import { debounce } from '@/utils'
// Resource
import OperacionesResource from '@/api/operaciones'
const operacionesResource = new OperacionesResource()
export default {
  name: 'AgregarEditarOperacion',
  props: {
    operacionId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      rowType: 'flex',
      loading: false,
      operacion: {
        id: undefined,
        nombre: ''
      },
      reglas: {
        nombre: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'blur' },
          { require: true, max: 100, message: 'El campo debe tener máximo 100 caracteres.', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    operacionId(newValue, oldValue) {
      if (newValue > 0 && newValue !== oldValue) {
        this.getOperacion()
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
      return true
    })
    window.addEventListener('resize', this.__resizeHandler)
    if (this.operacionId > 0) {
      this.getOperacion()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getOperacion() {
      this.loading = true
      operacionesResource.get(this.operacionId)
        .then(
          (response) => {
            this.operacion = response.data
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
      this.$refs['formOperaciones'].validate((valid) => {
        if (valid) {
          if (this.operacionId < 0) {
            this.agregarOperacion()
          } else {
            this.editarOperacion()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    agregarOperacion() {
      this.loading = true
      operacionesResource.store(this.operacion)
        .then(
          (response) => {
            this.$message({
              type: 'success',
              message: response.message
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
    editarOperacion() {
      this.loading = true
      operacionesResource.update(this.operacionId, this.operacion)
        .then(
          (response) => {
            this.$message({
              type: 'success',
              message: response.message
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
      this.operacion = {
        id: undefined,
        nombre: ''
      }
      this.$refs['formOperaciones'].resetFields()
      this.$emit('close')
    }
  }
}
</script>
