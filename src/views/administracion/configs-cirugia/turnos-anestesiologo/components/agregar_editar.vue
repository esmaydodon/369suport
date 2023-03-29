<template>
  <div>
    <div v-loading="loading">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form ref="formTurnoanestesiologo" :model="turnoanestesiologo" :rules="reglas" label-position="top">
            <el-form-item label="Nombre del turno" prop="nombre">
              <el-input v-model="turnoanestesiologo.nombre" />
            </el-form-item>
            <el-row :gutter="10">
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="Hora inicio" prop="hora_inicio">
                  <el-time-select
                    v-model="turnoanestesiologo.hora_inicio"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:59'
                    }"
                    placeholder="Seleccione la hora"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="Hora fin" prop="hora_fin">
                  <el-time-select
                    v-model="turnoanestesiologo.hora_fin"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:59'
                    }"
                    placeholder="Seleccione la hora"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="Finaliza al siguiente dia" prop="finaliza_dia_siguiente">
                  <el-switch v-model="turnoanestesiologo.finaliza_dia_siguiente" inactive-text="No" active-text="Si" />
                </el-form-item>
              </el-col>
            </el-row>
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
import TurnosanestesiologoResource from '@/api/turnos-anestesiologo'
const turnosanestesiologoResource = new TurnosanestesiologoResource()
export default {
  name: 'AgregarEditarTurnoanestesiologo',
  props: {
    turnoanestesiologoId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      turnoanestesiologo: {
        id: undefined,
        nombre: '',
        hora_inicio: '',
        hora_fin: '',
        finaliza_dia_siguiente: false
      },
      reglas: {
        nombre: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'blur' },
          { require: true, max: 100, message: 'El campo debe tener máximo 100 caracteres.', trigger: 'blur' }
        ],
        hora_inicio: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'blur' }
        ],
        hora_fin: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'blur' }
        ],
        finaliza_dia_siguiente: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'blur' }
        ]
      },
      rowType: 'flex'
    }
  },
  watch: {
    turnoanestesiologoId(newValue, oldValue) {
      if (newValue > 0 && oldValue !== newValue) {
        this.getTurnoanestesiologo()
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
    if (this.turnoanestesiologoId > 0) {
      this.getTurnoanestesiologo()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getTurnoanestesiologo() {
      this.loading = true
      turnosanestesiologoResource.get(this.turnoanestesiologoId)
        .then(
          (response) => {
            this.turnoanestesiologo = response.data
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
      this.$refs['formTurnoanestesiologo'].validate((valid) => {
        if (valid) {
          if (this.turnoanestesiologoId < 0) {
            this.agregarTurnoanestesiologo()
          } else {
            this.editarTurnoanestesiologo()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    agregarTurnoanestesiologo() {
      this.loading = true
      turnosanestesiologoResource.store(this.turnoanestesiologo)
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
    editarTurnoanestesiologo() {
      this.loading = true
      turnosanestesiologoResource.update(this.turnoanestesiologoId, this.turnoanestesiologo)
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
      this.turnoanestesiologo = {
        id: undefined,
        nombre: '',
        hora_inicio: '',
        hora_fin: '',
        finaliza_dia_siguiente: false
      }
      this.$refs['formTurnoanestesiologo'].resetFields()
      this.$emit('close')
    }
  }
}

</script>
