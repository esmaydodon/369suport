<template>
  <div v-loading="loading">
    <el-form ref="formSuspensionCirugia" :model="suspensionCirugia" :rules="reglas" label-position="top">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="Nombre Doctor" prop="doctor_suspende_cirugia">
            <el-autocomplete
              v-model="doctor_suspende_id_label"
              :fetch-suggestions="buscarDoctor"
              placeholder="Ingrese nombre del doctor"
              style="width: 100%;"
              @select="seleccionarDoctor"
              @focus="doctor = 1"
              @change="suspensionCirugia.doctor_suspende_cirugia = null"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Observaciones" prop="motivo_suspension">
            <el-input v-model="suspensionCirugia.motivo_suspension" type="textarea" maxlength="255" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="10" :type="rowType" justify="center">
      <el-col :xs="24" :sm="12" :md="8" style="text-align: right;">
        <el-button type="primary" plain style="width: 100%; margin: 7px 0px;" @click="close">Cancelar</el-button>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" style="text-align: left;">
        <el-button type="primary" style="width: 100%; margin: 7px 0px;" @click="handleSubmitForm">Guardar</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// Utils
import { debounce } from '@/utils'
// Resource
import PersonasResource from '@/api/personas'
const personasResource = new PersonasResource()
import SuspensionCirugiaResource from '@/api/suspension-cirugia'
const suspensionCirugiaResource = new SuspensionCirugiaResource()
export default {
  name: 'AgregarSuspensionCirugia',
  props: {
    programacionCirugiaId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      rowType: 'flex',
      suspensionCirugia: {
        id: undefined,
        doctor_suspende_cirugia: '',
        motivo_suspension: ''
      },
      reglas: {
        doctor_suspende_cirugia: [
          { required: true, message: 'El campo es obligatorio', trigger: 'change' }
        ],
        motivo_suspension: [
          { required: true, message: 'El campo es obligatorio' },
          { max: 255, message: 'El campo debe tener máximo 255 caracteres.' }
        ]
      },
      doctor_suspende_id_label: ''
    }
  },
  watch: {
    programacionCirugiaId(newValue, oldValue) {
    }
  },
  mounted() {
    this._resizeHandler = debounce(() => {
      const windowWidth = document.documentElement.clientWidth
      if (windowWidth < 768) {
        this.rowType = ''
      } else {
        this.rowType = 'flex'
      }
    })
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    window.addEventListener('resize', this._resizeHandler)
  },
  methods: {
    getSuspensionCirugia() {
      this.loading = true
      suspensionCirugiaResource.get(this.programacionCirugiaId)
        .then(
          (response) => {
            this.suspensionCirugia = response.data
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
    buscarDoctor(queryString, cb) {
      console.log('buscando: ', queryString)
      personasResource.opcionesSeleccionTrabajadores({ keyword: queryString })
        .then(
          (response) => {
            const { data } = response
            cb(data)
          }
        )
        .catch(
          (error) => {
            console.log(error)
          }
        )
    },
    seleccionarDoctor(item) {
      this.suspensionCirugia.doctor_suspende_cirugia = item.id
    },
    handleSubmitForm() {
      this.loading = true
      this.$refs['formSuspensionCirugia'].validate((valid) => {
        if (valid) {
          if (this.programacionCirugiaId > 0) {
            console.log('Enviando informaion')
            // this.agregarSuspensionCirugia()
            suspensionCirugiaResource.store({ suspensionCirugia: this.suspensionCirugia, programacion: this.programacionCirugiaId })
              .then(
                (response) => {
                  this.$message({
                    message: response.message,
                    type: response.type
                  })
                  this.close()
                  this.loading = false
                  console.log('Aquiii error then')
                }
              )
              .catch(
                (error) => {
                  console.log(error)
                  this.loading = false
                  console.log('Aquiii error catch')
                }
              )
          }
        } else {
          console.log('Aquiii error')
          this.loading = false
        }
      })
    },
    close() {
      this.suspensionCirugia = {
        id: undefined,
        doctor_suspende_cirugia: null,
        motivo_suspension: null
      }
      this.doctor_suspende_id_label = ''
      this.$refs['formSuspensionCirugia'].resetFields()
      this.$emit('close')
    }
  }
}
</script>
