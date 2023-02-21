<template>
  <div>
    <div v-loading="loading">
      <el-form ref="formPersona" :model="persona" :rules="reglas" label-position="top">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="Tipo doc. identidad" prop="tipo_doc_identidad">
              <el-select v-model="persona.tipo_doc_identidad" placeholder="Seleccionar">
                <el-option label="DNI" :value="1" />
                <el-option label="CARNET EXTRANGERIA" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Nro. doc. identidad" prop="doc_identidad">
              <el-input v-model="persona.doc_identidad" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Nombres" prop="nombres">
              <el-input v-model="persona.nombres" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Apellido Paterno" prop="apellido_paterno">
              <el-input v-model="persona.apellido_paterno" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Apellido Materno" prop="apellido_materno">
              <el-input v-model="persona.apellido_materno" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="Fecha de naciemiento" prop="fecha_nacimiento">
              <el-date-picker v-model="persona.fecha_nacimiento" placeholder="Seleccionar o ingresar" format="dd/MM/yyyy" value-format="yyyy-MM-dd H:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Sexo" prop="sexo">
              <el-select v-model="persona.sexo" placeholder="Seleccionar">
                <el-option label="MASCULINO" value="M" />
                <el-option label="FEMENINO" value="F" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="Telefono" prop="telefono">
              <el-input v-model="persona.telefono" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Correo" prop="correo">
              <el-input v-model="persona.correo" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="REGION">
              <el-select v-model="regionSeleccionada" placeholder="Seleccione" @change="cargarOpcionesProvincia">
                <el-option v-for="item in opcionesRegiones" :key="item.id" :label="item.nombre" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Provincia">
              <el-select v-model="provinciaSeleccionada" placeholder="Seleccione" @change="cargarOpcionesDistritos">
                <el-option v-for="item in opcionesProvincia" :key="item.id" :label="item.nombre" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Distrito" prop="distrito_id">
              <el-select v-model="persona.distrito_id" placeholder="Seleccione">
                <el-option v-for="item in opcionesDistrito" :key="item.id" :label="item.nombre" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="23">
            <el-form-item label="Direccion" prop="direccion">
              <el-input v-model="persona.direccion" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="10" :type="rowType" justify="center">
        <el-col :xs="24" :sm="12" :md="8" style="text-align: right;">
          <el-button type="primary" plain style="width: 100%; margin: 7px 0px;" @click="close(null)">Cancelar</el-button>
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
import PersonasResource from '@/api/personas'
const personasResource = new PersonasResource()
import RegionesResource from '@/api/regiones'
const regionesResource = new RegionesResource()
import ProvinciasResource from '@/api/provincias'
const provinciasResource = new ProvinciasResource()
import DistritosResource from '@/api/distritos'
const distritosResource = new DistritosResource()

export default {
  name: 'AgregarEditarPersona',
  props: {
    personaId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      persona: {
        id: undefined,
        tipo_doc_identidad: '',
        doc_identidad: '',
        nombres: '',
        apellido_paterno: '',
        apellido_materno: '',
        fecha_nacimiento: '',
        sexo: '',
        telefono: '',
        correo: '',
        distrito_id: '',
        direccion: ''
      },
      reglas: {
        tipo_doc_identidad: [{ required: true, message: 'El campo es obligatorio', trigger: 'change' }],
        doc_identidad: [
          { required: true, message: 'El campo es obligatorio', trigger: 'blur' },
          { require: true, max: 20, message: 'El campo debe tener máximo 20 caracteres.', trigger: 'blur' }
        ],
        nombres: [
          { required: true, message: 'El campo es obligatorio', trigger: 'blur' },
          { require: true, max: 200, message: 'El campo debe tener máximo 200 caracteres.', trigger: 'blur' }
        ],
        apellido_paterno: [
          { required: true, message: 'El campo es obligatorio', trigger: 'blur' },
          { require: true, max: 50, message: 'El campo debe tener máximo 50 caracteres.', trigger: 'blur' }
        ],
        apellido_materno: [
          { required: true, message: 'El campo es obligatorio', trigger: 'blur' },
          { require: true, max: 50, message: 'El campo debe tener máximo 50 caracteres.', trigger: 'blur' }
        ],
        fecha_nacimiento: [{ required: true, message: 'El campo es obligatorio', trigger: 'blur' }],
        sexo: [
          { required: true, message: 'El campo es obligatorio', trigger: 'blur' },
          { require: true, max: 1, message: 'El campo debe tener máximo 1 caracteres.', trigger: 'blur' }
        ],
        telefono: [
          { required: true, message: 'El campo es obligatorio', trigger: 'blur' },
          { require: true, max: 9, message: 'El campo debe tener máximo 9 caracteres.', trigger: 'blur' }
        ],
        correo: [
          { required: true, message: 'El campo es obligatorio', trigger: 'blur' },
          { require: true, max: 70, message: 'El campo debe tener máximo 70 caracteres.', trigger: 'blur' }
        ],
        distrito_id: [{ required: true, message: 'El campo es obligatorio', trigger: 'change' }],
        direccion: [
          { required: true, message: 'El campo es obligatorio', trigger: 'blur' },
          { require: true, max: 255, message: 'El campo debe tener máximo 255 caracteres.', trigger: 'blur' }
        ]
      },
      rowType: 'flex',
      opcionesRegiones: [],
      regionSeleccionada: null,
      opcionesProvincia: [],
      provinciaSeleccionada: null,
      opcionesDistrito: []
    }
  },
  watch: {
    personaId(newValue, oldValue) {
      if (newValue > 0) {
        this.getPersona()
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
    if (this.personaId > 0) {
      this.getPersona()
    }
    this.cargarOpcionesRegion()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    cargarOpcionesRegion() {
      this.loading = true
      regionesResource.opcionesSeleccion()
        .then(
          (response) => {
            this.opcionesRegiones = response.data
            this.loading = false
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = true
          }
        )
    },
    cargarOpcionesProvincia() {
      this.loading = true
      this.opcionesProvincia = []
      this.opcionesDistrito = []
      if (this.personaId <= 0) {
        this.provinciaSeleccionada = null
        this.persona.distrito_id = null
      }
      provinciasResource.opcionesSeleccion({ region_id: this.regionSeleccionada })
        .then(
          (response) => {
            this.opcionesProvincia = response.data
            this.loading = false
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = true
          }
        )
    },
    cargarOpcionesDistritos() {
      this.opcionesDistrito = []
      if (this.personaId <= 0) {
        this.persona.distrito_id = null
      }
      distritosResource.opcionesSeleccion({ provincia_id: this.provinciaSeleccionada })
        .then(
          (response) => {
            this.opcionesDistrito = response.data
            this.loading = false
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = true
          }
        )
    },
    getPersona() {
      this.loading = true
      personasResource.get(this.personaId)
        .then(
          (response) => {
            this.persona = response.data
            this.regionSeleccionada = response.data.region_id
            this.provinciaSeleccionada = response.data.provincia_id
            // this.loading = false
            this.cargarOpcionesProvincia()
            this.cargarOpcionesDistritos()
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
      this.$refs['formPersona'].validate((valid) => {
        if (valid) {
          if (this.personaId < 0) {
            this.agregarPersona()
          } else {
            this.editarPersona()
          }
        } else {
          return false
        }
      })
    },
    agregarPersona() {
      this.loading = true
      personasResource.store(this.persona)
        .then(
          (response) => {
            this.$message({
              type: 'success',
              message: response.message
            })
            this.loading = false
            this.close(response)
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = false
          }
        )
    },
    editarPersona() {
      this.loading = true
      personasResource.update(this.personaId, this.persona)
        .then(
          (response) => {
            this.$message({
              type: 'success',
              message: response.message
            })
            this.loading = false
            this.close(null)
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = false
          }
        )
    },
    close(data) {
      this.persona = {
        id: undefined,
        tipo_doc_identidad: '',
        doc_identidad: '',
        nombres: '',
        apellido_paterno: '',
        apellido_materno: '',
        fecha_nacimiento: '',
        sexo: '',
        telefono: '',
        correo: '',
        distrito_id: '',
        direccion: ''
      }
      this.$refs['formPersona'].resetFields()
      this.$emit('close', { persona_id: data != null ? data.persona_id : null })
    }
  }
}

</script>
