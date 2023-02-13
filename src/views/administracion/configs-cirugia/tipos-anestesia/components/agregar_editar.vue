<template>
  <div>
    <div v-loading="loading">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form ref="formTipoAnestesia" :model="tipoAnestesia" :rules="reglas" label-position="top">
            <el-form-item label="Tipo anestesia" prop="nombre">
              <el-input v-model="tipoAnestesia.nombre" />
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
import TiposAnestesiaResource from '@/api/tipos-anestesia'
const tiposAnestesiaResource = new TiposAnestesiaResource()
export default {
  name: 'AgregarEditarTipoAnestesia',
  props: {
    tipoAnestesiaId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      tipoAnestesia: {
        id: undefined,
        nombre: ''
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
    tipoAnestesiaId(newValue, oldValue) {
      if (newValue > 0 && oldValue !== newValue) {
        this.getTipoAnestesia()
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
    if (this.tipoAnestesiaId > 0) {
      this.getTipoAnestesia()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getTipoAnestesia() {
      this.loading = true
      tiposAnestesiaResource.get(this.tipoAnestesiaId)
        .then(
          (response) => {
            this.tipoAnestesia = response.data
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
      this.$refs['formTipoAnestesia'].validate((valid) => {
        if (valid) {
          if (this.tipoAnestesiaId < 0) {
            this.agregarTipoAnestesia()
          } else {
            this.editarEditarAnestesia()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    agregarTipoAnestesia() {
      this.loading = true
      tiposAnestesiaResource.store(this.tipoAnestesia)
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
    editarEditarAnestesia() {
      this.loading = true
      tiposAnestesiaResource.update(this.tipoAnestesiaId, this.tipoAnestesia)
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
      this.tipoAnestesia = {
        id: undefined,
        nombre: ''
      }
      this.$refs['formTipoAnestesia'].resetFields()
      this.$emit('close')
    }
  }
}

</script>
