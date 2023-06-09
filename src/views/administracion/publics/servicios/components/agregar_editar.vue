<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form ref="formServicios" :model="servicio" :rules="reglas" label-position="top">
          <el-form-item label="Nombre del servicio" prop="nombre">
            <el-input v-model="servicio.nombre" />
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
// Resource
import ServiciosResource from '@/api/servicios'
const serviciosResource = new ServiciosResource()

import { debounce } from '@/utils'
export default {
  name: 'AgregarEditarServicio',
  props: {
    servicioId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      servicio: {
        id: undefined,
        nombre: ''
      },
      reglas: {
        nombre: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'blur' },
          { require: true, max: 150, message: 'El campo debe tener máximo 150 caracteres.', trigger: 'blur' }
        ]
      },
      rowType: 'flex'
    }
  },
  watch: {
    servicioId(newValue, oldValue) {
      if (newValue > 0) {
        this.getServicio()
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
    if (this.servicioId > 0) {
      this.getServicio()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getServicio() {
      this.loading = true
      serviciosResource.get(this.servicioId)
        .then(
          (response) => {
            this.servicio = response.data
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
      this.$refs['formServicios'].validate((valid) => {
        if (valid) {
          if (this.servicioId < 0) {
            console.log('Crear')
            this.agregarServicio()
          } else {
            this.editarServicio()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    agregarServicio() {
      this.loading = true
      serviciosResource.store(this.servicio)
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
    editarServicio() {
      this.loading = true
      serviciosResource.update(this.servicioId, this.servicio)
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
      this.servicio = {
        id: undefined,
        nombre: ''
      }
      this.$refs['formServicios'].resetFields()
      this.$emit('close')
    }
  }
}
</script>
