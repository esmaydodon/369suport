<template>
  <div>
    <div v-loading="loading">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form ref="formSalasOperaciones" :model="salaOperaciones" :rules="reglas" label-position="top">
            <el-form-item label="Nro de sala" prop="nro_sala">
              <el-input v-model="salaOperaciones.nro_sala" />
            </el-form-item>
            <el-form-item label="Especialidad" prop="especialidad">
              <el-input v-model="salaOperaciones.especialidad" />
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
import SalasOperacionesResource from '@/api/salas-operaciones'
const salasOperacionesResource = new SalasOperacionesResource()
export default {
  name: 'AgregarEditarSalaOperaciones',
  props: {
    salaOperacionesId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      salaOperaciones: {
        id: undefined,
        nro_sala: '',
        especialidad: ''
      },
      reglas: {
        nro_sala: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'blur' },
          { require: true, max: 20, message: 'El campo debe tener máximo 20 caracteres.', trigger: 'blur' }
        ],
        especialidad: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'blur' },
          { require: true, max: 150, message: 'El campo debe tener máximo 150 caracteres.', trigger: 'blur' }
        ]
      },
      rowType: 'flex'
    }
  },
  watch: {
    salaOperacionesId(newValue, oldValue) {
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
    if (this.salaOperacionesId > 0) {
      this.getSalaOperaciones()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getSalaOperaciones() {
      this.loading = true
      salasOperacionesResource.get(this.salaOperacionesId)
        .then(
          (response) => {
            this.salaOperaciones = response.data
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
      this.$refs['formSalasOperaciones'].validate((valid) => {
        if (valid) {
          if (this.salaOperacionesId < 0) {
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
      salasOperacionesResource.store(this.salaOperaciones)
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
      salasOperacionesResource.update(this.salaOperacionesId, this.salaOperaciones)
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
      this.salaOperaciones = {
        id: undefined,
        nro_sala: '',
        especialidad: ''
      }
      this.$refs['formSalasOperaciones'].resetFields()
      this.$emit('close')
    }
  }
}

</script>
