<template>
  <div v-loading="loading">
    <el-form ref="formProgramacionCirugia" :model="programacionCirugia" :rules="reglas" label-position="top">
      <el-row :gutter="10">
        <el-col :xs="24" :md="8">
          <el-card header="Detalles de programación">
            <el-row :gutter="10">
              <el-col :xs="24" :md="12">
                <el-form-item label="Fecha de cirugía" prop="fecha_cirugia">
                  <el-date-picker v-model="programacionCirugia.fecha_cirugia" format="dd/MM/yyyy" value-format="yyyy-MM-dd H:mm:ss" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="Sala de operaciones" prop="sala_operaciones_id">
                  <el-select v-model="programacionCirugia.sala_operaciones_id" placeholder="">
                    <el-option v-for="opcion in opcionesSalasOperaciones" :key="opcion.id" :label="opcion.nro_sala" :value="opcion.id" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Turno" prop="turno">
              <span v-if="programacionCirugiaId > 0 ">{{ programacionCirugia.turno }}</span>
              <span v-else style="font-style: italic;">El turno es generado automáticamente</span>
            </el-form-item>
            <el-form-item label="Paciente" prop="historia_clinica_paciente_id">
              <el-autocomplete
                v-model="historia_clinica_paciente_id_label"
                :fetch-suggestions="buscarPaciente"
                placeholder="Buscar por nombre o DNI"
                style="width: 100% "
                @select="seleccionarPaciente"
                @change="programacionCirugia.historia_clinica_paciente_id = null"
              />
            </el-form-item>
            <el-form-item label="Cama" prop="cama_id">
              <el-autocomplete
                v-model="cama_id_label"
                :fetch-suggestions="buscarCama"
                placeholder="Buscar por codigo"
                style="width: 100% "
                @select="seleccionarCama"
              />
            </el-form-item>
            <el-form-item label="Diagnóstico" prop="diagnostico_id">
              <el-autocomplete
                v-model="diagnostico_id_label"
                :fetch-suggestions="buscarDiagnostico"
                placeholder="Buscar diagnóstico"
                style="width: 100%;"
                @select="seleccionarDiagnostico"
                @change="programacionCirugia.diagnostico_id = null"
              />
            </el-form-item>
            <el-form-item label="Operación" prop="operacion_programada_id">
              <el-autocomplete
                v-model="operacion_programada_id_label"
                :fetch-suggestions="buscarOperacion"
                placeholder="Buscar operación"
                style="width: 100%;"
                @select="seleccionarOperacion"
                @change="programacionCirugia.operacion_programada_id = null"
              />
            </el-form-item>
            <el-form-item label="Duración programada" prop="duracion_programada">
              <el-input v-model.number="programacionCirugia.duracion_programada" type="number" placeholder="Horas totales">
                <template slot="append">
                  <span class="suffix-input"><strong>Horas</strong></span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="Observaciones" prop="observacion">
              <el-input v-model="programacionCirugia.observacion" type="textarea" maxlength="255" show-word-limit />
            </el-form-item>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="16">
          <el-form ref="formEquipoQuirurgico" :model="programacionCirugia.equipoQuirurgico" :rules="reglasEquipo" label-position="top">
            <el-row>
              <el-card header="Equipo Quirúrgico">

                <el-row :gutter="10">
                  <el-col :xs="24" :md="12">
                    <el-form-item label="Anestesiólogo N° 1" prop="anestesiologo_1_id">
                      <el-autocomplete
                        v-model="anestesiologo_1_id_label"
                        :fetch-suggestions="buscarAnestesiologo"
                        placeholder="Ingrese nombre del especialista"
                        style="width: 100% "
                        @select="seleccionarAnestesiologo"
                        @focus="anestesiologo = 1"
                        @change="programacionCirugia.equipoQuirurgico.anestesiologo_1_id = null"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="12">
                    <el-form-item label="Anestesiólogo N° 2" prop="anestesiologo_2_id">
                      <el-autocomplete
                        v-model="anestesiologo_2_id_label"
                        :fetch-suggestions="buscarAnestesiologo"
                        placeholder="Ingrese nombre del especialista"
                        style="width: 100% "
                        @select="seleccionarAnestesiologo"
                        @focus="anestesiologo = 2"
                        @change="programacionCirugia.equipoQuirurgico.anestesiologo_2_id = null"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="12">
                    <el-form-item label="Cirujano N° 1" prop="cirujano_1_id">
                      <el-autocomplete
                        v-model="cirujano_1_id_label"
                        :fetch-suggestions="buscarCirujano"
                        placeholder="Ingrese nombre del especialista"
                        style="width: 100% "
                        @select="seleccionarCirujano"
                        @focus="cirujano = 1"
                        @change="programacionCirugia.equipoQuirurgico.cirujano_1_id = null"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="12">
                    <el-form-item label="Cirujano N° 2" prop="cirujano_2_id">
                      <el-autocomplete
                        v-model="cirujano_2_id_label"
                        :fetch-suggestions="buscarCirujano"
                        placeholder="Ingrese nombre del especialista"
                        style="width: 100% "
                        @select="seleccionarCirujano"
                        @focus="cirujano = 2"
                        @change="programacionCirugia.equipoQuirurgico.cirujano_2_id = null"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="12">
                    <el-form-item label="Cirujano N° 3" prop="cirujano_3_id">
                      <el-autocomplete
                        v-model="cirujano_3_id_label"
                        :fetch-suggestions="buscarCirujano"
                        placeholder="Ingrese nombre del especialista"
                        style="width: 100% "
                        @select="seleccionarCirujano"
                        @focus="cirujano = 3"
                        @change="programacionCirugia.equipoQuirurgico.cirujano_3_id = null"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :xs="24" :md="12">
                    <el-form-item label="Médico Residente Anestesiólogo N° 1" prop="medico_residente_anestesiologo_1_id">
                      <el-autocomplete
                        v-model="medico_residente_anestesiologo_1_id_label"
                        :fetch-suggestions="buscarResidenteanestesiologo"
                        placeholder="Ingrese nombre del especialista"
                        style="width: 100% "
                        @select="seleccionarResidenteanestesiologo"
                        @focus="residenteanestesiologo = 1"
                        @change="programacionCirugia.equipoQuirurgico.medico_residente_anestesiologo_1_id = null"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="12">
                    <el-form-item label="Médico Residente Anestesiólogo N° 2" prop="medico_residente_anestesiologo_2_id">
                      <el-autocomplete
                        v-model="medico_residente_anestesiologo_2_id_label"
                        :fetch-suggestions="buscarResidenteanestesiologo"
                        placeholder="Ingrese nombre del especialista"
                        style="width: 100% "
                        @select="seleccionarResidenteanestesiologo"
                        @focus="residenteanestesiologo = 2"
                        @change="programacionCirugia.equipoQuirurgico.medico_residente_anestesiologo_2_id = null"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="12">
                    <el-form-item label="Médico Residente Cirugia N° 1" prop="medico_residente_cirugia_1_id">
                      <el-autocomplete
                        v-model="medico_residente_cirugia_1_id_label"
                        :fetch-suggestions="buscarResidenteCirugia"
                        placeholder="Ingrese nombre del especialista"
                        style="width: 100% "
                        @select="seleccionarResidenteCirugia"
                        @focus="residenteCirugia = 1"
                        @change="programacionCirugia.equipoQuirurgico.medico_residente_cirugia_1_id = null"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="12">
                    <el-form-item label="Médico Residente Cirugia N° 2" prop="medico_residente_cirugia_2_id">
                      <el-autocomplete
                        v-model="medico_residente_cirugia_2_id_label"
                        :fetch-suggestions="buscarResidenteCirugia"
                        placeholder="Ingrese nombre del especialista"
                        style="width: 100% "
                        @select="seleccionarResidenteCirugia"
                        @focus="residenteCirugia = 2"
                        @change="programacionCirugia.equipoQuirurgico.medico_residente_cirugia_1_id = null"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="12">
                    <el-form-item label="Licenciada instrumentista N° 1" prop="licenciada_instrumentista_1_id">
                      <el-autocomplete
                        v-model=" licenciada_instrumentista_1_id_label"
                        :fetch-suggestions="buscarLicenciadaInstrumental"
                        placeholder="Ingrese nombre del especialista"
                        style="width: 100% "
                        @select="seleccionarLicenciadaInstrumentista"
                        @focus="licenciadaInstrumentista = 1"
                        @change="programacionCirugia.equipoQuirurgico.licenciada_instrumentista_1_id = null"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="12">
                    <el-form-item label="Licenciada instrumentista N° 2" prop="licenciada_instrumentista_2_id">
                      <el-autocomplete
                        v-model=" licenciada_instrumentista_2_id_label"
                        :fetch-suggestions="buscarLicenciadaInstrumental"
                        placeholder="Ingrese nombre del especialista"
                        style="width: 100% "
                        @select="seleccionarLicenciadaInstrumentista"
                        @focus="licenciadaInstrumentista = 2"
                        @change="programacionCirugia.equipoQuirurgico.licenciada_instrumentista_2_id = null"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="12">
                    <el-form-item label="Licenciada circulante N° 1" prop="licenciada_circulante_1_id">
                      <el-autocomplete
                        v-model=" licenciada_circulante_1_id_label"
                        :fetch-suggestions="buscarLicenciadaCirculante"
                        placeholder="Ingrese nombre del especialista"
                        style="width: 100% "
                        @select="seleccionarLicenciadaCirculante"
                        @focus="licenciadaCirculante = 1"
                        @change="programacionCirugia.equipoQuirurgico.licenciada_circulante_1_id = null"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="12">
                    <el-form-item label="Licenciada circulante N° 2" prop="licenciada_circulante_2_id">
                      <el-autocomplete
                        v-model=" licenciada_circulante_2_id_label"
                        :fetch-suggestions="buscarLicenciadaCirculante"
                        placeholder="Ingrese nombre del especialista"
                        style="width: 100% "
                        @select="seleccionarLicenciadaCirculante"
                        @focus="licenciadaCirculante = 2"
                        @change="programacionCirugia.equipoQuirurgico.licenciada_circulante_2_id = null"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-card>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="10" :type="rowType" justify="center" style="padding: 10px;">
      <el-col :xs="24" :sm="12" :md="6" style="text-align: right;">
        <el-button type="primary" plain style="width: 100%; margin: 7px 0px;" @click="resetForm">Limpiar</el-button>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" style="text-align: center;">
        <el-button type="primary" plain style="width: 100%; margin: 7px 0px;" @click="close">Cancelar</el-button>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" style="text-align: left;">
        <el-button type="primary" style="width: 100%; margin: 7px 0px;" @click="handleSubmitForm">Guardar</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// Utils
import { debounce } from '@/utils'
// Resource
import SalasOperacionesResource from '@/api/salas-operaciones'
const salasOperacionesResource = new SalasOperacionesResource()
import HistoriasClinicasResource from '@/api/historiasclinicas'
const historiasClinicasResource = new HistoriasClinicasResource()
import CamasResource from '@/api/camas'
const camasResource = new CamasResource()
import DiagnosticosResource from '@/api/diagnosticos'
const diagnosticosResource = new DiagnosticosResource()
import OperacionesResource from '@/api/operaciones'
const operacionesResource = new OperacionesResource()
import PersonasResource from '@/api/personas'
const personasResource = new PersonasResource()
import ProgramacionCirugiaResource from '@/api/programacion-cirugia'
const programacionCirugiaResource = new ProgramacionCirugiaResource()
export default {
  name: 'AgregarEditarProgramacionCirugia',
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
      programacionCirugia: {
        fecha_cirugia: '',
        sala_operaciones_id: '',
        turno: '',
        historia_clinica_paciente_id: '',
        cama_id: '',
        equipo_quirurgico_id: '',
        diagnostico_id: '',
        operacion_programada_id: '',
        duracion_programada: '',
        observacion: '',
        equipoQuirurgico: {
          anestesiologo_1_id: '',
          anestesiologo_2_id: '',
          cirujano_1_id: '',
          cirujano_2_id: '',
          cirujano_3_id: '',
          medico_residente_anestesiologo_1_id: '',
          medico_residente_anestesiologo_2_id: '',
          medico_residente_cirugia_1_id: '',
          medico_residente_cirugia_2_id: '',
          licenciada_instrumentista_1_id: '',
          licenciada_instrumentista_2_id: '',
          licenciada_circulante_1_id: '',
          licenciada_circulante_2_id: ''
        }
      },
      reglas: {
        fecha_cirugia: [
          { required: true, message: 'El campo es obligatorio', trigger: 'blur' }
        ],
        sala_operaciones_id: [
          { required: true, message: 'El campo es obligatorio', trigger: 'change' }
        ],
        historia_clinica_paciente_id: [
          { required: true, message: 'El campo es obligatorio', trigger: 'change' }
        ],
        cama_id: [
          { required: true, message: 'El campo es obligatorio', trigger: 'change' }
        ],
        diagnostico_id: [
          { required: true, message: 'El campo es obligatorio', trigger: 'change' }
        ],
        operacion_programada_id: [
          { required: true, message: 'El campo es obligatorio', trigger: 'change' }
        ],
        duracion_programada: [
          { required: true, message: 'El campo es obligatorio' },
          { type: 'number', min: 0.1, message: 'Duración Minima 0.1 hora' },
          { type: 'number', max: 120, message: 'Duración maxima 120 horas' }
        ],
        Observaciones: [
          { require: true, max: 255, message: 'El campo debe tener máximo 255 caracteres.', trigger: 'blur' }
        ]
      },
      reglasEquipo: {
        anestesiologo_1_id: [
          { required: true, message: 'El campo es obligatorio', trigger: 'change' }
        ],
        cirujano_1_id: [
          { required: true, message: 'El campo es obligatorio', trigger: 'change' }
        ],
        medico_residente_anestesiologo_1_id: [
          { required: true, message: 'El campo es obligatorio', trigger: 'change' }
        ],
        medico_residente_cirugia_1_id: [
          { required: true, message: 'El campo es obligatorio', trigger: 'change' }
        ],
        licenciada_instrumentista_1_id: [
          { required: true, message: 'El campo es obligatorio', trigger: 'change' }
        ],
        licenciada_circulante_1_id: [
          { required: true, message: 'El campo es obligatorio', trigger: 'change' }
        ]
      },
      historia_clinica_paciente_id_label: '',
      cama_id_label: '',
      diagnostico_id_label: '',
      operacion_programada_id_label: '',
      opcionesSalasOperaciones: [],
      anestesiologo_1_id_label: '',
      anestesiologo_2_id_label: '',
      anestesiologo: -1,
      cirujano_1_id_label: '',
      cirujano_2_id_label: '',
      cirujano_3_id_label: '',
      cirujano: -1,
      medico_residente_anestesiologo_1_id_label: '',
      medico_residente_anestesiologo_2_id_label: '',
      residenteanestesiologo: -1,
      medico_residente_cirugia_1_id_label: '',
      medico_residente_cirugia_2_id_label: '',
      residenteCirugia: -1,
      licenciada_instrumentista_1_id_label: '',
      licenciada_instrumentista_2_id_label: '',
      licenciadaInstrumentista: -1,
      licenciada_circulante_1_id_label: '',
      licenciada_circulante_2_id_label: '',
      licenciadaCirculante: -1
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
    if (this.camaId > 0) {
      this.getCama()
    }
    this.cargarSalasOperaciones()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    cargarSalasOperaciones() {
      this.loading = true
      salasOperacionesResource.opcionesSeleccion()
        .then(
          (response) => {
            this.opcionesSalasOperaciones = response.data
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
    buscarPaciente(queryString, cb) {
      console.log('buscando paciente: ', queryString)
      historiasClinicasResource.opcionesSeleccion({ keyword: queryString })
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
    seleccionarPaciente(item) {
      this.programacionCirugia.historia_clinica_paciente_id = item.id
    },
    buscarCama(queryString, cb) {
      camasResource.opcionesSeleccion({ keyword: queryString })
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
    seleccionarCama(item) {
      this.programacionCirugia.cama_id = item.id
    },
    buscarDiagnostico(queryString, cb) {
      diagnosticosResource.opcionesSeleccion({ keyword: queryString })
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
    seleccionarDiagnostico(item) {
      this.programacionCirugia.diagnostico_id = item.id
    },
    buscarOperacion(queryString, cb) {
      operacionesResource.opcionesSeleccion({ keyword: queryString })
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
    seleccionarOperacion(item) {
      this.programacionCirugia.operacion_programada_id = item.id
    },
    buscarAnestesiologo(queryString, cb) {
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
    seleccionarAnestesiologo(item) {
      if (this.anestesiologo === 1) {
        console.log('Nombre anestesiologo N°1')
        this.programacionCirugia.equipoQuirurgico.anestesiologo_1_id = item.id
      }
      if (this.anestesiologo === 2) {
        console.log('Nombre anestesiologo N°2')
        this.programacionCirugia.equipoQuirurgico.anestesiologo_2_id = item.id
      }
      this.anestesiologo = -1
    },
    buscarCirujano(queryString, cb) {
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
    seleccionarCirujano(item) {
      if (this.cirujano === 1) {
        console.log('Nombre Cirujano N°1')
        this.programacionCirugia.equipoQuirurgico.cirujano_1_id = item.id
      }
      if (this.cirujano === 2) {
        console.log('Nombre Cirujano N2')
        this.programacionCirugia.equipoQuirurgico.cirujano_2_id = item.id
      }
      if (this.cirujano === 3) {
        console.log('Nombre Cirujano N3')
        this.programacionCirugia.equipoQuirurgico.cirujano_3_id = item.id
      }
      this.cirujano = -1
    },
    buscarResidenteanestesiologo(queryString, cb) {
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
    seleccionarResidenteanestesiologo(item) {
      if (this.residenteanestesiologo === 1) {
        console.log('Nombre Medico Residente anestesiologo N°1')
        this.programacionCirugia.equipoQuirurgico.medico_residente_anestesiologo_1_id = item.id
      }
      if (this.residenteanestesiologo === 2) {
        console.log('Nombre Medico Residente anestesiologo N2')
        this.programacionCirugia.equipoQuirurgico.medico_residente_anestesiologo_2_id = item.id
      }
      this.residenteanestesiologo = -1
    },
    buscarResidenteCirugia(queryString, cb) {
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
    seleccionarResidenteCirugia(item) {
      if (this.residenteCirugia === 1) {
        console.log('Nombre Medico Residente Cirugia N°1')
        this.programacionCirugia.equipoQuirurgico.medico_residente_cirugia_1_id = item.id
      }
      if (this.residenteCirugia === 2) {
        console.log('Nombre Medico Residente Cirugia N°2')
        this.programacionCirugia.equipoQuirurgico.medico_residente_cirugia_2_id = item.id
      }
      this.residenteCirugia = -1
    },
    buscarLicenciadaInstrumental(queryString, cb) {
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
    seleccionarLicenciadaInstrumentista(item) {
      if (this.licenciadaInstrumentista === 1) {
        console.log('Nombre Licenciada Instrumentista N°1')
        this.programacionCirugia.equipoQuirurgico.licenciada_instrumentista_1_id = item.id
      }
      if (this.licenciadaInstrumentista === 2) {
        console.log('Nombre Licenciada Instrumentista N2')
        this.programacionCirugia.equipoQuirurgico.licenciada_instrumentista_2_id = item.id
      }
      this.licenciadaInstrumentista = -1
    },
    buscarLicenciadaCirculante(queryString, cb) {
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
    seleccionarLicenciadaCirculante(item) {
      if (this.licenciadaCirculante === 1) {
        console.log('Nombre Licenciada Circulante N°1')
        this.programacionCirugia.equipoQuirurgico.licenciada_circulante_1_id = item.id
      }
      if (this.licenciadaCirculante === 2) {
        console.log('Nombre Licenciada Circulante N2')
        this.programacionCirugia.equipoQuirurgico.licenciada_circulante_2_id = item.id
      }
      this.licenciadaCirculante = -1
    },
    handleSubmitForm() {
      this.$refs['formProgramacionCirugia'].validate((valid) => {
        this.$refs['formEquipoQuirurgico'].validate((valid) => {
          if (valid) {
            if (this.programacionCirugiaId < 0) {
              this.agregarProgramaCirugia()
            } else {
              this.editarProgramaCirugia()
            }
          } else {
            return false
          }
        })
      })
    },
    agregarProgramaCirugia() {
      this.loading = true
      programacionCirugiaResource.store(this.programacionCirugia)
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
    editarProgramaCirugia() {
      this.loading = true
      personasResource.update(this.programacionCirugiaId, this.programacionCirugia)
        .then(
          (response) => {
            this.$message({
              type: 'success',
              message: response.message
            })
            this.loading = false
            this.close = false
          }
        )
        .catch(
          () => {

          }
        )
    },
    close() {
      this.programacionCirugia = {
        fecha_cirugia: null,
        sala_operaciones_id: null,
        turno: null,
        historia_clinica_paciente_id: null,
        cama_id: null,
        equipo_quirurgico_id: null,
        diagnostico_id: null,
        operacion_programada_id: null,
        duracion_programada: null,
        observacion: null,
        equipoQuirurgico: {
          id: null,
          anestesiologo_1_id: null,
          anestesiologo_2_id: null,
          cirujano_1_id: null,
          cirujano_2_id: null,
          cirujano_3_id: null,
          medico_residente_anestesiologo_1_id: null,
          medico_residente_anestesiologo_2_id: null,
          medico_residente_cirugia_1_id: null,
          medico_residente_cirugia_2_id: null,
          licenciada_instrumentista_1_id: null,
          licenciada_instrumentista_2_id: null,
          licenciada_circulante_1_id: null,
          licenciada_circulante_2_id: null
        }
      }
      this.historia_clinica_paciente_id_label = ''
      this.cama_id_label = ''
      this.diagnostico_id_label = ''
      this.operacion_programada_id_label = ''
      this.anestesiologo_1_id_label = ''
      this.anestesiologo_2_id_label = ''
      this.cirujano_1_id_label = ''
      this.cirujano_2_id_label = ''
      this.cirujano_3_id_label = ''
      this.medico_residente_anestesiologo_1_id_label = ''
      this.medico_residente_anestesiologo_2_id_label = ''
      this.medico_residente_cirugia_1_id_label = ''
      this.medico_residente_cirugia_2_id_label = ''
      this.licenciada_instrumentista_1_id_label = ''
      this.licenciada_instrumentista_2_id_label = ''
      this.licenciada_circulante_1_id_label = ''
      this.licenciada_circulante_2_id_label = ''
      this.$refs['formProgramacionCirugia'].resetFields()
      this.$refs['formEquipoQuirurgico'].resetFields()
      this.$emit('close')
    },
    resetForm() {
      console.log('prueba')
      this.programacionCirugia = {
        fecha_cirugia: null,
        sala_operaciones_id: null,
        turno: null,
        historia_clinica_paciente_id: null,
        cama_id: null,
        equipo_quirurgico_id: null,
        diagnostico_id: null,
        operacion_programada_id: null,
        duracion_programada: null,
        observacion: null,
        equipoQuirurgico: {
          id: null,
          anestesiologo_1_id: null,
          anestesiologo_2_id: null,
          cirujano_1_id: null,
          cirujano_2_id: null,
          cirujano_3_id: null,
          medico_residente_anestesiologo_1_id: null,
          medico_residente_anestesiologo_2_id: null,
          medico_residente_cirugia_1_id: null,
          medico_residente_cirugia_2_id: null,
          licenciada_instrumentista_1_id: null,
          licenciada_instrumentista_2_id: null,
          licenciada_circulante_1_id: null,
          licenciada_circulante_2_id: null
        }
      }
      this.historia_clinica_paciente_id_label = ''
      this.cama_id_label = ''
      this.diagnostico_id_label = ''
      this.operacion_programada_id_label = ''
      this.anestesiologo_1_id_label = ''
      this.anestesiologo_2_id_label = ''
      this.cirujano_1_id_label = ''
      this.cirujano_2_id_label = ''
      this.cirujano_3_id_label = ''
      this.medico_residente_anestesiologo_1_id_label = ''
      this.medico_residente_anestesiologo_2_id_label = ''
      this.medico_residente_cirugia_1_id_label = ''
      this.medico_residente_cirugia_2_id_label = ''
      this.licenciada_instrumentista_1_id_label = ''
      this.licenciada_instrumentista_2_id_label = ''
      this.licenciada_circulante_1_id_label = ''
      this.licenciada_circulante_2_id_label = ''
      this.$refs['formProgramacionCirugia'].resetFields()
      this.$refs['formEquipoQuirurgico'].resetFields()
    }
  }
}

</script>

<style>

input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

</style>
