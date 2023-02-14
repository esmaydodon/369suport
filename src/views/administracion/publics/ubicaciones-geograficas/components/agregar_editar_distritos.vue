<template>
  <div>
    <div v-loading="loading">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form ref="formDistrito" :model="distrito" :rules="reglas" label-position="top">
            <el-form-item label="Distrito" prop="nombre">
              <el-input v-model="distrito.nombre" />
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
  </div>
</template>

<script>
// Utilidades
import { debounce } from '@/utils'
// Resource
import DistritosResource from '@/api/distritos'
const distritosResource = new DistritosResource()
export default {
  name: 'AgregarEditarDistrito',
  props: {
    distritoEditarId: {
      required: true,
      type: Number
    },
    provinciaId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      distrito: {
        id: undefined,
        nombre: '',
        provincia_id: -1
      },
      reglas: {
        nombre: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'blur' },
          { require: true, max: 100, message: 'El campo debe tener máximo 100 caracteres.', trigger: 'blur' }
        ]
      },
      rowType: 'flex'
    }
  },
  watch: {
    distritoEditarId(newValue, oldValue) {
      if (newValue > 0 && oldValue !== newValue) {
        this.getDistrito()
        this.distrito.provincia_id = this.provinciaId
      }
    },
    provinciaId(newValue, oldValue) {
      if (newValue > 0 && oldValue !== newValue) {
        this.distrito.provincia_id = this.provinciaId
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
    if (this.distritoEditarId > 0) {
      this.getDistrito()
    }
    this.distrito.provincia_id = this.provinciaId
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getDistrito() {
      this.loading = true
      distritosResource.get(this.distritoEditarId)
        .then(
          (response) => {
            this.distrito = response.data
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
      this.$refs['formDistrito'].validate((valid) => {
        if (valid) {
          if (this.distritoEditarId < 0) {
            this.agregarProvincia()
          } else {
            this.editarProvincia()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    agregarProvincia() {
      this.loading = true
      distritosResource.store(this.distrito)
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
    editarProvincia() {
      this.loading = true
      distritosResource.update(this.distritoEditarId, this.distrito)
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
      this.distrito = {
        id: undefined,
        nombre: '',
        provincia_id: this.provinciaId
      }
      this.$refs['formDistrito'].resetFields()
      this.$emit('close')
    }
  }
}

</script>
