<template>
  <div>
    <div v-loading="loading">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form ref="formNivelesAsa" :model="nivelASA" :rules="reglas" label-position="top">
            <el-form-item label="Nombre" prop="nombre">
              <el-input v-model="nivelASA.nombre" />
            </el-form-item>
            <el-form-item label="Abreviatura" prop="abreviatura">
              <el-input v-model="nivelASA.abreviatura" />
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
import AsaResource from '@/api/asa'
const asaResource = new AsaResource()
export default {
  name: 'AgregarEditarNivelAsa',
  props: {
    nivelAsaId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      nivelASA: {
        id: undefined,
        nombre: '',
        abreviatura: ''
      },
      reglas: {
        nombre: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'blur' },
          { require: true, max: 50, message: 'El campo debe tener máximo 50 caracteres.', trigger: 'blur' }
        ],
        abreviatura: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'blur' },
          { require: true, max: 10, message: 'El campo debe tener máximo 10 caracteres.', trigger: 'blur' }
        ]
      },
      rowType: 'flex'
    }
  },
  watch: {
    nivelAsaId(newValue, oldValue) {
      if (newValue > 0 && oldValue !== newValue) {
        this.getSalaOperaciones()
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
    if (this.nivelAsaId > 0) {
      this.getSalaOperaciones()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getSalaOperaciones() {
      this.loading = true
      asaResource.get(this.nivelAsaId)
        .then(
          (response) => {
            this.nivelASA = response.data
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
      this.$refs['formNivelesAsa'].validate((valid) => {
        if (valid) {
          if (this.nivelAsaId < 0) {
            this.agregarSalaOperaciones()
          } else {
            this.editarSalaOperaciones()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    agregarSalaOperaciones() {
      this.loading = true
      asaResource.store(this.nivelASA)
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
    editarSalaOperaciones() {
      this.loading = true
      asaResource.update(this.nivelAsaId, this.nivelASA)
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
      this.nivelASA = {
        id: undefined,
        nombre: '',
        abreviatura: ''
      }
      this.$refs['formNivelesAsa'].resetFields()
      this.$emit('close')
    }
  }
}

</script>
