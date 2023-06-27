<template>
  <div>
    <div v-loading="loading">
      <el-form ref="formEstadoTarea" :model="estadoTareaObject" :rules="reglas" label-position="top">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="Nombre" prop="nombre">
              <el-input v-model="estadoTareaObject.nombre" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="10" :type="rowType" justify="center">
        <el-col :xs="24" :sm="12" :md="8" style="text-align: right;">
          <el-button type="primary" plain style="width: 100%; margin: 7px 0px;" @click="close(null)">Cancelar</el-button>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" style="text-align: left;">
          <el-button type="primary" style="width: 100%; margin: 7px 0px;" @click="handleSubmitForm">Guardar</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- Dialogo Para registrar al padre o madre -->
  </div>
</template>

<script>
// Utilidades
import { debounce } from '@/utils'
// Resource
// import PersonasResource from '@/api/personas'
// const personasResource = new PersonasResource()
import EstadoTareaResource from '@/api/soporte/estadotarea'
const estadoTareaResource = new EstadoTareaResource()
// Components
// import RegistroPersonaApoderado from './registro-persona-padre'

export default {
  name: 'AgregarEditarEstadoTarea',
  components: {
  },
  props: {
    estadoId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      estadoTareaObject: {
        id: undefined,
        nombre: '',
        activo: ''
      },
      reglas: {
        nombre: [
          { required: true, message: 'El campo es obligatorio', trigger: 'blur' }
          // { require: true, max: 200, message: 'El campo debe tener máximo 200 caracteres', trigger: 'blur' }
        ]
      },
      rowType: 'flex',
      widthModal: '50%'
    }
  },
  watch: {
    estadoId(newValue, oldValue) {
      if (newValue > 0) {
        this.getEstadoTarea()
      }
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      const windowWidth = document.documentElement.clientWidth
      if (windowWidth < 768) {
        this.widthModal = '90%'
        this.rowType = ''
      } else {
        this.widthModal = '50%'
        this.rowType = 'flex'
      }
    })

    window.addEventListener('resize', this.__resizeHandler)
    if (this.estadoId > 0) {
      this.getEstadoTarea()
    }
    this.cargarOpcionesNivelesEducativos()
    this.cargarOpcionesRegion()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getEstadoTarea() {
      this.loading = true
      // console.log('estadoId ' + this.estadoId)
      estadoTareaResource.get(this.estadoId)
        .then(
          (response) => {
            this.estadoTareaObject = response.data
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
      this.$refs['formEstadoTarea'].validate((valid) => {
        if (valid) {
          if (this.estadoId < 0) {
            this.agregarEstadoArea()
          } else {
            this.editarEstadoArea()
          }
        } else {
          return false
        }
      })
    },
    agregarEstadoArea() {
      this.loading = true
      console.log('estadoTareaObjec AGREGAR' + this.estadoTareaObjec)
      estadoTareaResource.store(this.estadoTareaObject)
        .then(
          (response) => {
            this.$message({
              type: 'success',
              message: response.message
            })
            this.loading = false
            this.close(response)
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = false
          }
        )
    },
    editarEstadoArea() {
      this.loading = true
      console.log('estadoTareaObjec EDITAR' + this.estadoTareaObjec)
      estadoTareaResource.update(this.estadoId, this.estadoTareaObject)
        .then(
          (response) => {
            this.$message({
              type: 'success',
              message: response.message
            })
            this.loading = false
            this.close(null)
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = false
          }
        )
    },

    close(data) {
      this.estadoTareaObject = {
        id: undefined,
        nombre: '',
        activo: ''
      }
      this.$refs['formEstadoTarea'].resetFields()
      this.$emit('close', { estado_id: data != null ? data.estado_id : null })
    }
  }
}

</script>
