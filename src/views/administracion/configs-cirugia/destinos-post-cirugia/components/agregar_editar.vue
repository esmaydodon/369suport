<template>
  <div>
    <div v-loading="loading">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form ref="formDestinoPostCirugia" :model="destinoPostCirugia" :rules="reglas" label-position="top">
            <el-form-item label="Destino post-cirugia" prop="nombre">
              <el-input v-model="destinoPostCirugia.nombre" />
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
import DestinoPostCirugiaResource from '@/api/destino-post-cirugia'
const destinoPostCirugiaResource = new DestinoPostCirugiaResource()
export default {
  name: 'AgregarEditarDestinoPostCirugia',
  props: {
    destinoPostCirugiaId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      destinoPostCirugia: {
        id: undefined,
        nombre: ''
      },
      reglas: {
        nombre: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'blur' },
          { require: true, max: 60, message: 'El campo debe tener máximo 60 caracteres.', trigger: 'blur' }
        ]
      },
      rowType: 'flex'
    }
  },
  watch: {
    destinoPostCirugiaId(newValue, oldValue) {
      if (newValue > 0 && oldValue !== newValue) {
        this.getDestinoPostCirugia()
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
    if (this.destinoPostCirugiaId > 0) {
      this.getDestinoPostCirugia()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getDestinoPostCirugia() {
      this.loading = true
      destinoPostCirugiaResource.get(this.destinoPostCirugiaId)
        .then(
          (response) => {
            this.destinoPostCirugia = response.data
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
      this.$refs['formDestinoPostCirugia'].validate((valid) => {
        if (valid) {
          if (this.destinoPostCirugiaId < 0) {
            this.agregarDestinoPostCirugia()
          } else {
            this.editarDestinoPostCirugia()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    agregarDestinoPostCirugia() {
      this.loading = true
      destinoPostCirugiaResource.store(this.destinoPostCirugia)
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
    editarDestinoPostCirugia() {
      this.loading = true
      destinoPostCirugiaResource.update(this.destinoPostCirugiaId, this.destinoPostCirugia)
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
      this.destinoPostCirugia = {
        id: undefined,
        nombre: ''
      }
      this.$refs['formDestinoPostCirugia'].resetFields()
      this.$emit('close')
    }
  }
}

</script>
