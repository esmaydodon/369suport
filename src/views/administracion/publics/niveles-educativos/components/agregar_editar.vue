<template>
  <div>
    <div v-loading="loading">
      <el-form ref="formNivelesEducativos" :model="nivelEducativo" :rules="reglas" label-position="top">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="Nivel educativo" prop="nivel_educativo">
              <el-input v-model="nivelEducativo.nivel_educativo" />
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
import NivelesEducativosResource from '@/api/niveles-educativos'
const nivelesEducativosResource = new NivelesEducativosResource()
export default {
  name: 'AgregarEditarNivelEducativo',
  props: {
    nievelEducativoId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      nivelEducativo: {
        id: undefined,
        nivel_educativo: ''
      },
      reglas: {
        nivel_educativo: [
          { required: true, message: 'El campo es obligatorio', trigger: 'blur' },
          { require: true, max: 255, message: 'El campo debe tener máximo 255 caracteres.', trigger: 'blur' }
        ]
      },
      rowType: 'flex'
    }
  },
  watch: {
    nievelEducativoId(newValue, oldValue) {
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
    if (this.nievelEducativoId > 0) {
      this.getProfesion()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getProfesion() {
      this.loading = true
      nivelesEducativosResource.get(this.nievelEducativoId)
        .then(
          (response) => {
            this.nivelEducativo = response.data
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
      this.$refs['formNivelesEducativos'].validate((valid) => {
        if (valid) {
          if (this.nievelEducativoId < 0) {
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
      nivelesEducativosResource.store(this.nivelEducativo)
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
      nivelesEducativosResource.update(this.nievelEducativoId, this.nivelEducativo)
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
      this.nivelEducativo = {
        id: undefined,
        nivel_educativo: ''
      }
      this.$refs['formNivelesEducativos'].resetFields()
      this.$emit('close')
    }
  }
}

</script>
