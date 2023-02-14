<template>
  <div>
    <div v-loading="loading">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form ref="formProvincia" :model="provincia" :rules="reglas" label-position="top">
            <el-form-item label="Provincia" prop="nombre">
              <el-input v-model="provincia.nombre" />
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
import ProvinciasResource from '@/api/provincias'
const provinciasResource = new ProvinciasResource()
export default {
  name: 'AgregarEditarProvincia',
  props: {
    provinciaEditarId: {
      required: true,
      type: Number
    },
    regionId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      provincia: {
        id: undefined,
        nombre: '',
        region_id: -1
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
    provinciaEditarId(newValue, oldValue) {
      if (newValue > 0 && oldValue !== newValue) {
        this.geProvincia()
        this.provincia.region_id = this.regionId
      }
    },
    regionId(newValue, oldValue) {
      if (newValue > 0 && oldValue !== newValue) {
        this.provincia.region_id = this.regionId
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
    if (this.provinciaEditarId > 0) {
      this.geProvincia()
    }
    this.provincia.region_id = this.regionId
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    geProvincia() {
      this.loading = true
      provinciasResource.get(this.provinciaEditarId)
        .then(
          (response) => {
            this.provincia = response.data
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
      this.$refs['formProvincia'].validate((valid) => {
        if (valid) {
          if (this.provinciaEditarId < 0) {
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
      provinciasResource.store(this.provincia)
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
      provinciasResource.update(this.provinciaEditarId, this.provincia)
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
      this.provincia = {
        id: undefined,
        nombre: '',
        region_id: this.regionId
      }
      this.$refs['formProvincia'].resetFields()
      this.$emit('close')
    }
  }
}

</script>
