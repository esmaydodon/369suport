<template>
  <div>
    <div v-loading="loading">
      <el-form ref="formProfesiones" :model="profesion" :rules="reglas" label-position="top">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="Codigo" prop="codigo">
              <el-input v-model="profesion.codigo" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Profesion" prop="nombre">
              <el-input v-model="profesion.nombre" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Abreviatura" prop="abreviatura">
              <el-input v-model="profesion.abreviatura" />
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
import ProfesionesResource from '@/api/profesiones'
const profesionesResource = new ProfesionesResource()
export default {
  name: 'AgregarEditarProfesion',
  props: {
    profesionId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      profesion: {
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
    profesionId(newValue, oldValue) {
      if (newValue > 0) {
        this.getProfesion()
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
    if (this.profesionId > 0) {
      this.getProfesion()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getProfesion() {
      this.loading = true
      profesionesResource.get(this.profesionId)
        .then(
          (response) => {
            this.profesion = response.data
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
      this.$refs['formProfesiones'].validate((valid) => {
        if (valid) {
          if (this.profesionId < 0) {
            this.agregarProfesion()
          } else {
            this.editarProfesion()
          }
        } else {
          return false
        }
      })
    },
    agregarProfesion() {
      this.loading = true
      profesionesResource.store(this.profesion)
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
    editarProfesion() {
      this.loading = true
      profesionesResource.update(this.profesionId, this.profesion)
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
      this.profesion = {
        id: undefined,
        codigo: '',
        nombre: '',
        abreviatura: ''
      }
      this.$refs['formProfesiones'].resetFields()
      this.$emit('close')
    }
  }
}

</script>
