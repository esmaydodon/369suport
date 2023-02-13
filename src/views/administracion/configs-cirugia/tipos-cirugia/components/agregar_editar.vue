<template>
  <div>
    <div v-loading="loading">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form ref="formTipoCirugia" :model="tipoCirugia" :rules="reglas" label-position="top">
            <el-form-item label="Nombre" prop="nombre">
              <el-input v-model="tipoCirugia.nombre" />
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
import TiposCirugiaResource from '@/api/tipos-cirugia'
const tiposCirugiaResource = new TiposCirugiaResource()
export default {
  name: 'AgregarEditarTipoCirugia',
  props: {
    tipoCirugiaId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      tipoCirugia: {
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
    tipoCirugiaId(newValue, oldValue) {
      if (newValue > 0 && oldValue !== newValue) {
        this.getTipoCirugia()
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
    if (this.tipoCirugiaId > 0) {
      this.getTipoCirugia()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getTipoCirugia() {
      this.loading = true
      tiposCirugiaResource.get(this.tipoCirugiaId)
        .then(
          (response) => {
            this.tipoCirugia = response.data
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
      this.$refs['formTipoCirugia'].validate((valid) => {
        if (valid) {
          if (this.tipoCirugiaId < 0) {
            this.agregarTipoCirugia()
          } else {
            this.editarEditarCirugia()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    agregarTipoCirugia() {
      this.loading = true
      tiposCirugiaResource.store(this.tipoCirugia)
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
    editarEditarCirugia() {
      this.loading = true
      tiposCirugiaResource.update(this.tipoCirugiaId, this.tipoCirugia)
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
      this.tipoCirugia = {
        id: undefined,
        nombre: ''
      }
      this.$refs['formTipoCirugia'].resetFields()
      this.$emit('close')
    }
  }
}

</script>
