<template>
  <div v-loading="loading">
    <el-form ref="formHistoriaClinica" :model="historiaClinica" :rules="reglas" label-position="top">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="Persona" prop="persona_id">
            <el-row :gutter="10">
              <el-col :span="16">
                <el-form-item label="Nombre">
                  <el-input v-model="historiaClinica.nombre_completo" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="DNI">
                  <el-input v-model="historiaClinica.nro_historia_clinica" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Nro historia clinica" prop="nro_historia_clinica">
            <el-input v-model="historiaClinica.nro_historia_clinica" disabled />
          </el-form-item>
          <el-form-item label="Nro historia clinica fisica" prop="nro_historia_clinica_fisica">
            <el-input v-model="historiaClinica.nro_historia_clinica_fisica" />
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
// Utilidades
import { debounce } from '@/utils'
// Resource
import HistoriasClinicasResource from '@/api/historiasclinicas'
const historiasClinicasResource = new HistoriasClinicasResource()
import PersonasResource from '@/api/personas'
const personasResource = new PersonasResource()
export default {
  name: 'AgregarEditarHistoriaClinica',
  props: {
    historiaClinicaId: {
      required: true,
      type: Number
    },
    personaId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      rowType: 'flex',
      loading: false,
      historiaClinica: {
        id: undefined,
        persona_id: '',
        nombre_completo: '',
        dni: '',
        nro_historia_clinica: '',
        nro_historia_clinica_fisica: ''
      },
      reglas: {
        persona_id: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'change' }
        ],
        nro_historia_clinica: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'change' },
          { require: true, max: 20, message: 'El campo debe tener máximo 20 caracteres.', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    historiaClinicaId(newValue, oldValue) {
      if (newValue > 0 && newValue !== oldValue) {
        this.getHistoriaClinica()
      }
    },
    personaId(newValue, oldValue) {
      if (newValue > 0 && newValue !== oldValue) {
        this.getPersonaCrear()
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
      return true
    })
    window.addEventListener('resize', this.__resizeHandler)
    if (this.historiaClinicaId > 0) {
      this.getHistoriaClinica()
    }
    if (this.personaId > 0) {
      this.getPersonaCrear()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getPersonaCrear() {
      this.loading = true
      personasResource.get(this.personaId)
        .then(
          (response) => {
            console.log(response)
            const { data } = response
            this.historiaClinica = {
              id: undefined,
              persona_id: data.id,
              nombre_completo: data.nombres + ' ' + data.apellido_paterno + ' ' + data.apellido_materno,
              dni: data.doc_identidad,
              nro_historia_clinica: data.doc_identidad,
              nro_historia_clinica_fisica: ''
            }
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
    getHistoriaClinica() {
      this.loading = true
      historiasClinicasResource.get(this.historiaClinicaId)
        .then(
          (response) => {
            this.historiaClinica = response.data
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
      this.$refs['formHistoriaClinica'].validate((valid) => {
        if (valid) {
          if (this.historiaClinicaId < 0) {
            this.agregarHistoriaClinica()
          } else {
            this.editarHistoriaClinica()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    agregarHistoriaClinica() {
      this.loading = true
      historiasClinicasResource.store(this.historiaClinica)
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
    editarHistoriaClinica() {
      this.loading = true
      historiasClinicasResource.update(this.historiaClinicaId, this.historiaClinica)
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
      this.historiaClinica = {
        id: undefined,
        persona_id: '',
        nombre_completo: '',
        dni: '',
        nro_historia_clinica: '',
        nro_historia_clinica_fisica: ''
      }
      this.$refs['formHistoriaClinica'].resetFields()
      this.$emit('close')
    }
  }
}
</script>
