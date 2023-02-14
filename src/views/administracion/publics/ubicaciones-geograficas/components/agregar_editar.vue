<template>
  <div>
    <div v-loading="loading">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form ref="formRegion" :model="region" :rules="reglas" label-position="top">
            <el-form-item label="Region" prop="nombre">
              <el-input v-model="region.nombre" />
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
import RegionesResource from '@/api/regiones'
const regionesResource = new RegionesResource()
export default {
  name: 'AgregarEditarRegion',
  props: {
    regionId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      region: {
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
    regionId(newValue, oldValue) {
      if (newValue > 0 && oldValue !== newValue) {
        this.getRegion()
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
    if (this.regionId > 0) {
      this.getRegion()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getRegion() {
      this.loading = true
      regionesResource.get(this.regionId)
        .then(
          (response) => {
            this.region = response.data
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
      this.$refs['formRegion'].validate((valid) => {
        if (valid) {
          if (this.regionId < 0) {
            this.agregarRegion()
          } else {
            this.editarRegion()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    agregarRegion() {
      this.loading = true
      regionesResource.store(this.region)
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
    editarRegion() {
      this.loading = true
      regionesResource.update(this.regionId, this.region)
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
      this.region = {
        id: undefined,
        nombre: ''
      }
      this.$refs['formRegion'].resetFields()
      this.$emit('close')
    }
  }
}

</script>
