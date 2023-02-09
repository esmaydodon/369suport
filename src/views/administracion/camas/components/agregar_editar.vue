<template>
  <div>
    <div v-loading="loading">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form ref="formCama" :model="cama" :rules="reglas" label-position="top">
            <el-form-item label="Nro cama" prop="nro_cama">
              <el-input v-model="cama.nro_cama" />
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
import CamasResource from '@/api/camas'
const camasResource = new CamasResource()

export default {
  name: 'AgregarEditarCama',
  props: {
    camaId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      cama: {
        id: undefined,
        nro_cama: ''
      },
      reglas: {
        nro_cama: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'blur' },
          { require: true, max: 20, message: 'El campo debe tener máximo 20 caracteres.', trigger: 'blur' }
        ]
      },
      rowType: 'flex'
    }
  },
  watch: {
    camaId(newValue, oldValue) {
      if (newValue > 0) {
        this.getCama()
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
    if (this.camaId > 0) {
      this.getCama()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getCama() {
      this.loading = true
      camasResource.get(this.camaId)
        .then(
          (response) => {
            this.cama = response.data
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
      this.$refs['formCama'].validate((valid) => {
        if (valid) {
          alert('submit!')
          if (this.camaId < 0) {
            this.agregarCama()
          } else {
            this.editarCama()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    agregarCama() {
      this.loading = true
      camasResource.store(this.cama)
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
    editarCama() {
      this.loading = true
      camasResource.update(this.camaId, this.cama)
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
      this.cama = {
        id: undefined,
        nro_cama: ''
      }
      this.$refs['formCama'].resetFields()
      this.$emit('close')
    }
  }
}

</script>
