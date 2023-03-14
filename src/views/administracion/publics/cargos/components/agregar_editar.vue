<template>
  <div>
    <div v-loading="loading">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form ref="aformCargo" :model="cargo" :rules="reglas" label-position="top">
            <el-form-item label="Nombre" prop="nombre">
              <el-input v-model="cargo.nombre" @keyup.native="cargo.nombre = upperModel(cargo.nombre)" />
            </el-form-item>
            <el-form-item label="Abreviatura" prop="abreviatura">
              <el-input v-model="cargo.abreviatura" @keyup.native="cargo.abreviatura = upperModel(cargo.abreviatura)" />
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
import CargosResource from '@/api/cargos'
const cargosResource = new CargosResource()

export default {
  name: 'AgregarEditarCargo',
  props: {
    cargoId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      cargo: {
        id: undefined,
        abreviatura: '',
        nombre: ''
      },
      reglas: {
        nombre: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'blur' }
          // ,{ require: true, max: 20, message: 'El campo debe tener máximo 20 caracteres.', trigger:cargoId 'blur' }
        ],
        abreviatura: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'blur' }
          // ,{ require: true, max: 20, message: 'El campo debe tener máximo 20 caracteres.', trigger: 'blur' }
        ]
      },
      rowType: 'flex'
    }
  },
  watch: {
    cargoId(newValue, oldValue) {
      if (newValue > 0) {
        this.getCargo()
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
    if (this.cargoId > 0) {
      this.getCargo()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    upperModel(value) {
      return value.toUpperCase()
    },
    async getCargo() {
      this.loading = true
      await cargosResource.get(this.cargoId)
        .then(
          (response) => {
            this.cargo = response.data
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
      this.$refs['aformCargo'].validate((valid) => {
        if (valid) {
          if (this.cargoId < 0) {
            this.agregarCargo()
          } else {
            this.editarCargo()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    agregarCargo() {
      this.loading = true
      cargosResource.store(this.cargo)
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
    editarCargo() {
      this.loading = true
      cargosResource.update(this.cargoId, this.cargo)
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
      this.cargo = {
        id: undefined,
        abreviatura: '',
        nombre: ''
      }
      this.$refs['aformCargo'].resetFields()
      this.$emit('close')
    }
  }
}

</script>
