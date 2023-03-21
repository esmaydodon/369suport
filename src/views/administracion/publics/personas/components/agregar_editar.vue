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
            <el-form-item label="Madre" prop="madre_persona_id">
              <el-autocomplete
                v-model="madreLabel"
                :fetch-suggestions="buscarApoderado"
                placeholder="Busque por dni y seleccione la madre"
                style="width: 100%;"
                @select="seleccionarApoderado"
                @focus="tipoRegistroApoderado = 1"
                @change="persona.madre_persona_id = null"
              >
                <el-button slot="append" icon="el-icon-plus" @click="abrirModalAgregarApoderado(1)" />
                <template slot-scope="{ item }">
                  <span>{{ item.value }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Padre" prop="padre_persona_id">
              <el-autocomplete
                v-model="padreLabel"
                :fetch-suggestions="buscarApoderado"
                placeholder="Busque por dni y seleccione el padre"
                style="width: 100%;"
                @select="seleccionarApoderado"
                @focus="tipoRegistroApoderado = 2"
                @change="persona.padre_persona_id = null"
              >
                <el-button slot="append" icon="el-icon-plus" @click="abrirModalAgregarApoderado(2)" />
                <template slot-scope="{ item }">
                  <span>{{ item.value }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Apoderado" prop="apoderado_persona_id">
              <el-autocomplete
                v-model="apoderadoLabel"
                :fetch-suggestions="buscarApoderado"
                placeholder="Busque por dni y seleccione el padre"
                style="width: 100%;"
                @select="seleccionarApoderado"
                @focus="tipoRegistroApoderado = 3"
                @change="persona.padre_persona_id = null"
              >
                <el-button slot="append" icon="el-icon-plus" @click="abrirModalAgregarApoderado(3)" />
                <template slot-scope="{ item }">
                  <span>{{ item.value }}</span>
                </template>
              </el-autocomplete>
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
          <el-col :span="24">
            <el-form-item label="Direccion" prop="direccion">
              <el-input v-model="persona.direccion" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="Nivel educativo" prop="nivel_educativo_id">
              <el-select v-model="persona.nivel_educativo_id" placeholder="Seleccionar">
                <el-option
                  v-for="item in opcionesNivelesEducativos"
                  :key="item.id"
                  :label="item.nivel_educativo"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Profesion" prop="profesion_id">
              <el-autocomplete
                v-model="profesionLabel"
                :fetch-suggestions="buscarProfesion"
                placeholder="Busque y seleccione la profesión"
                style="width: 100%;"
                @select="seleccionarProfesion"
                @focus="persona.profesion_id = null"
              />
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
    <!-- Dialogo Para registrar al padre o madre -->
    <el-dialog
      :title="titleModalApoderado"
      :visible.sync="modalRegistrarApoderado"
      top="5vh"
      :width="widthModal"
      append-to-body
    >
      <registro-persona-apoderado @close="closeModalRegistroApoderado" />
    </el-dialog>
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
import NivelesEducativosResource from '@/api/niveles-educativos'
const nivelesEducativosResource = new NivelesEducativosResource()
import ProfesionesResource from '@/api/profesiones'
const profesionesResource = new ProfesionesResource()
// Components
// import RegistroPersonaApoderado from './registro-persona-padre'

export default {
  name: 'AgregarEditarPersona',
  components: {
    RegistroPersonaApoderado: () => import('./registro-persona-padre')
  },
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
        madre_persona_id: '',
        padre_persona_id: '',
        apoderado_persona_id: '',
        sexo: '',
        telefono: '',
        correo: '',
        distrito_id: '',
        direccion: '',
        nivel_educativo_id: null,
        profesion_id: null
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
      opcionesDistrito: [],
      opcionesNivelesEducativos: [],
      // variables para modal registrar Padre o Madre
      modalRegistrarApoderado: false,
      tipoRegistroApoderado: -1,
      titleModalApoderado: 'AGREGAR APODERADO',
      widthModal: '50%',
      padreLabel: '',
      madreLabel: '',
      apoderadoLabel: '',
      profesionLabel: ''
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
        this.widthModal = '90%'
        this.rowType = ''
      } else {
        this.widthModal = '50%'
        this.rowType = 'flex'
      }
    })

    window.addEventListener('resize', this.__resizeHandler)
    if (this.personaId > 0) {
      this.getPersona()
    }
    this.cargarOpcionesNivelesEducativos()
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
    cargarOpcionesNivelesEducativos() {
      nivelesEducativosResource.opcionesSeleccion()
        .then(
          (response) => {
            this.opcionesNivelesEducativos = response.data
          }
        )
        .catch(
          (error) => {
            console.log(error)
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
    // funciones del autocompletado de profesion
    buscarProfesion(queryString, cb) {
      profesionesResource.opcionesSeleccion({ keyword: queryString })
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
    seleccionarProfesion(item) {
      this.persona.profesion_id = item.id
    },
    buscarApoderado(queryString, cb) {
      console.log('buscando: ', queryString)
      personasResource.opcionesSeleccion({ keyword: queryString })
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
    seleccionarApoderado(item) {
      if (this.tipoRegistroApoderado === 1) {
        console.log('Seleccionado madre')
        this.persona.madre_persona_id = item.id
      }
      if (this.tipoRegistroApoderado === 2) {
        console.log('Seleccionado padre')
        this.persona.padre_persona_id = item.id
      }
      if (this.tipoRegistroApoderado === 3) {
        console.log('Seleccionado apoderado')
        this.persona.apoderado_persona_id = item.id
      }
      this.tipoRegistroApoderado = -1
    },
    abrirModalAgregarApoderado(tipoApoderado) {
      this.tipoRegistroApoderado = tipoApoderado
      if (this.tipoRegistroApoderado === 1) {
        this.titleModalApoderado = 'REGISTRAR MADRE'
      }
      if (this.tipoRegistroApoderado === 2) {
        this.titleModalApoderado = 'REGISTRAR PADRE'
      }
      if (this.tipoRegistroApoderado === 3) {
        this.titleModalApoderado = 'REGISTRAR APODERADO'
      }
      this.$nextTick(() => {
        this.modalRegistrarApoderado = true
      })
    },
    closeModalRegistroApoderado(respuesta) {
      if (respuesta != null) {
        const { persona_id, persona_label } = respuesta
        if (persona_id != null && persona_label != null) {
          if (this.tipoRegistroApoderado === 1) {
            console.log(this.tipoRegistroApoderado)
            this.persona.madre_persona_id = persona_id
            this.madreLabel = persona_label
          }
          if (this.tipoRegistroApoderado === 2) {
            console.log(this.tipoRegistroApoderado)
            this.persona.padre_persona_id = persona_id
            this.padreLabel = persona_label
          }
          if (this.tipoRegistroApoderado === 3) {
            console.log(this.tipoRegistroApoderado)
            this.persona.apoderado_persona_id = persona_id
            this.apoderadoLabel = persona_label
          }
        }
      }
      this.modalRegistrarApoderado = false
      this.$nextTick(() => {
        this.tipoRegistroApoderado = -1
        this.titleModalApoderado = ''
      })
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
        madre_persona_id: '',
        padre_persona_id: '',
        apoderado_persona_id: '',
        sexo: '',
        telefono: '',
        correo: '',
        distrito_id: '',
        direccion: '',
        nivel_educativo_id: null,
        profesion_id: null
      }
      this.padreRegistro = -1
      this.regionSeleccionada = null
      this.provinciaSeleccionada = null
      this.$refs['formPersona'].resetFields()
      this.$emit('close', { persona_id: data != null ? data.persona_id : null })
    }
  }
}

</script>
