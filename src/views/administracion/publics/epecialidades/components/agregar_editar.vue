<template>
  <div>
    <div v-loading="loading">
      <el-form ref="formEspecialidades" :model="especialidad" :rules="reglas" label-position="top">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="Codigo" prop="codigo">
              <el-input v-model="especialidad.codigo" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Especialidad" prop="nombre">
              <el-input v-model="especialidad.nombre" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Abreviatura" prop="abreviatura">
              <el-input v-model="especialidad.abreviatura" />
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
  </div>
</template>

<script>
// Utilidades
import { debounce } from '@/utils'
// Resource
import EspecialidadesResource from '@/api/espedialidades'
const especialidadesResource = new EspecialidadesResource()
export default {
  name: 'AgregarEditarEspecialidad',
  props: {
    especialidadId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      especialidad: {
        id: undefined,
        codigo: '',
        nombre: '',
        abreviatura: ''
      },
      reglas: {
        codigo: [
          { required: true, message: 'El campo es obligatorio', trigger: 'blur' },
          { require: true, max: 20, message: 'El campo debe tener máximo 20 caracteres.', trigger: 'blur' }
        ],
        nombre: [
          { required: true, message: 'El campo es obligatorio', trigger: 'blur' },
          { require: true, max: 255, message: 'El campo debe tener máximo 255 caracteres.', trigger: 'blur' }
        ],
        abreviatura: [
          { require: true, max: 20, message: 'El campo debe tener máximo 20 caracteres.', trigger: 'blur' }
        ]
      },
      rowType: 'flex'
    }
  },
  watch: {
    especialidadId(newValue, oldValue) {
      if (newValue !== oldValue && newValue > 0) {
        this.getEspecialidad()
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
    if (this.especialidadId > 0) {
      this.getEspecialidad()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getEspecialidad() {
      this.loading = true
      especialidadesResource.get(this.especialidadId)
        .then(
          (response) => {
            this.especialidad = response.data
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
      this.$refs['formEspecialidades'].validate((valid) => {
        if (valid) {
          if (this.especialidadId < 0) {
            this.agregarEspecialidad()
          } else {
            this.editarEspecialidad()
          }
        } else {
          return false
        }
      })
    },
    agregarEspecialidad() {
      this.loading = true
      console.log(' addespecialidad' + this.especialidad)
      especialidadesResource.store(this.especialidad)
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
    editarEspecialidad() {
      this.loading = true
      especialidadesResource.update(this.especialidadId, this.especialidad)
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
    close(data) {
      this.especialidad = {
        id: undefined,
        codigo: '',
        nombre: '',
        abreviatura: ''
      }
      this.$refs['formEspecialidades'].resetFields()
      this.$emit('close')
    }
  }
}

</script>
