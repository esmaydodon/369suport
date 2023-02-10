<template>
  <div>
    <div v-loading="loading">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form ref="formCategoriasCirugia" :model="categoriaCirugia" :rules="reglas" label-position="top">
            <el-form-item label="Nombre" prop="nombre">
              <el-input v-model="categoriaCirugia.nombre" />
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
import CategoriasCirugiaResource from '@/api/categorias-cirugia'
const categoriasCirugiaResource = new CategoriasCirugiaResource()
export default {
  name: 'AgregarEditarCategoriaCirugia',
  props: {
    categoriaCirugiaId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      categoriaCirugia: {
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
    categoriaCirugiaId(newValue, oldValue) {
      if (newValue > 0 && oldValue !== newValue) {
        this.getCategoriaCirugia()
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
    if (this.categoriaCirugiaId > 0) {
      this.getCategoriaCirugia()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getCategoriaCirugia() {
      this.loading = true
      categoriasCirugiaResource.get(this.categoriaCirugiaId)
        .then(
          (response) => {
            this.categoriaCirugia = response.data
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
      this.$refs['formCategoriasCirugia'].validate((valid) => {
        if (valid) {
          if (this.categoriaCirugiaId < 0) {
            this.agregarCategoriaCirugia()
          } else {
            this.editarCategoriaCirugia()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    agregarCategoriaCirugia() {
      this.loading = true
      categoriasCirugiaResource.store(this.categoriaCirugia)
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
    editarCategoriaCirugia() {
      this.loading = true
      categoriasCirugiaResource.update(this.categoriaCirugiaId, this.categoriaCirugia)
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
      this.categoriaCirugia = {
        id: undefined,
        nombre: ''
      }
      this.$refs['formCategoriasCirugia'].resetFields()
      this.$emit('close')
    }
  }
}

</script>
