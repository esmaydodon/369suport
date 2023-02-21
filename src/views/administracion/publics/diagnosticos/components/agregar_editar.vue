<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form ref="formDiagnosticos" :model="diagnostico" :rules="reglas" label-position="top">
          <el-form-item label="Diagnostico" prop="nombre">
            <el-input v-model="diagnostico.nombre" />
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
import DiagnosticosResource from '@/api/diagnosticos'
const diagnosticosResource = new DiagnosticosResource()
export default {
  name: 'AgregarEditarDiagnostico',
  props: {
    diagnosticoId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      rowType: 'flex',
      loading: false,
      diagnostico: {
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
    diagnosticoId(newValue, oldValue) {
      if (newValue > 0 && newValue !== oldValue) {
        this.getDiagnostico()
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
    if (this.diagnosticoId > 0) {
      this.getDiagnostico()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getDiagnostico() {
      this.loading = true
      diagnosticosResource.get(this.diagnosticoId)
        .then(
          (response) => {
            this.diagnostico = response.data
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
      this.$refs['formDiagnosticos'].validate((valid) => {
        if (valid) {
          if (this.diagnosticoId < 0) {
            this.agregarDiagnostico()
          } else {
            this.editarDiagnostico()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    agregarDiagnostico() {
      this.loading = true
      diagnosticosResource.store(this.diagnostico)
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
    editarDiagnostico() {
      this.loading = true
      diagnosticosResource.update(this.diagnosticoId, this.diagnostico)
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
      this.diagnostico = {
        id: undefined,
        nombre: ''
      }
      this.$refs['formDiagnosticos'].resetFields()
      this.$emit('close')
    }
  }
}
</script>
