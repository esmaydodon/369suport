<template>
  <div v-loading="loading">
    <el-form :model="programacionCirugia" label-position="top">
      <el-row :gutter="10">
        <el-col :xs="24" :md="8">
          <el-card header="Detalles de programación">
            <el-row :gutter="10">
              <el-col :xs="24" :md="12">
                <el-form-item label="Fecha de cirugía">
                  <el-date-picker v-model="programacionCirugia.fecha_cirugia" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="Sala de operaciones">
                  <el-select v-model="programacionCirugia.sala_operaciones_id" placeholder="">
                    <el-option v-for="opcion in opcionesSalasOperaciones" :key="opcion.id" :label="opcion.nro_sala" :value="opcion.id" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Turno">
              <span v-if="programacionCirugiaId > 0 ">{{ programacionCirugia.turno }}</span>
              <span v-else style="font-style: italic;">El turno es generado automáticamente</span>
            </el-form-item>
            <el-form-item label="Paciente">
              <el-autocomplete
                v-model="pacienteLabel"
                placeholder="Buscar por DNI"
                :fetch-suggestions="buscarPaciente"
                :trigger-on-focus="false"
                style="width: 100%;"
                @select="seleccionarPaciente"
              />
            </el-form-item>
            <el-form-item label="Cama">
              <el-autocomplete
                v-model="camaLabel"
                placeholder="Buscar por DNI"
                :fetch-suggestions="buscarCama"
                :trigger-on-focus="false"
                style="width: 100%;"
                @select="seleccionarCama"
              />
            </el-form-item>
            <el-form-item label="Diagnóstico" prop="diagnostico_id">
              <el-autocomplete
                v-model="diagnosticoLabel"
                :fetch-suggestions="buscarDiagnostico"
                placeholder="Busque y seleccione"
                style="width: 100%;"
                @select="seleccionarDiagnostico"
              />
            </el-form-item>
            <el-form-item label="Operación" prop="operacion_programada_id">
              <el-autocomplete
                v-model="operacionLabel"
                :fetch-suggestions="buscarOperacion"
                placeholder="Busque y seleccione"
                style="width: 100%;"
                @select="seleccionarOperacion"
              />
            </el-form-item>
            <el-form-item label="Duración programada">
              <el-input v-model="programacionCirugia.duracion_programada" type="number">
                <template slot="append">
                  <span class="suffix-input"><strong>Horas</strong></span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="Observaciones">
              <el-input v-model="programacionCirugia.obserbacion" type="textarea" />
            </el-form-item>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="16">
          <el-card header="Equipo quirúrgico">

            <el-row :gutter="10">
              <el-col :xs="24" :md="12">
                <el-form-item label="Anestesiólogo">
                  <el-autocomplete placeholder="" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="Anestesiólogo 2">
                  <el-autocomplete placeholder="" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="Cirujano">
                  <el-autocomplete placeholder="" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="Cirujano 2">
                  <el-autocomplete placeholder="" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="Cirujano 3">
                  <el-autocomplete placeholder="" style="width: 100%;" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :xs="24" :md="12">
                <el-form-item label="Médico Residente Anestesiólogo">
                  <el-autocomplete placeholder="" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="Médico Residente Anestesiólogo 2">
                  <el-autocomplete placeholder="" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="Médico Residente cirugía">
                  <el-autocomplete placeholder="" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="Médico Residente cirugía 2">
                  <el-autocomplete placeholder="" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="Licenciada instrumentista">
                  <el-autocomplete placeholder="" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="Licenciada instrumentista 2">
                  <el-autocomplete placeholder="" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="Licenciada circulante">
                  <el-autocomplete placeholder="" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="Licenciada circulante 2">
                  <el-autocomplete placeholder="" style="width: 100%;" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="10" :type="rowType" justify="center" style="padding: 10px;">
      <el-col :xs="24" :sm="12" :md="6" style="text-align: right;">
        <el-button type="primary" plain style="width: 100%; margin: 7px 0px;">Cancelar</el-button>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" style="text-align: left;">
        <el-button type="primary" style="width: 100%; margin: 7px 0px;">Guardar</el-button>
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
        fecha_cirugia: null,
        sala_operaciones_id: null,
        turno: null,
        historia_clinica_paciente_id: null,
        cama_id: null,
        equipo_quirurgico_id: null,
        diagnostico_id: null,
        operacion_programada_id: null,
        duracion_programada: null,
        obserbacion: null,
        equipo_quirurgico: {
          id: null,
          anesteciologo_1_id: null,
          anesteciologo_2_id: null,
          cirujano_1_id: null,
          cirujano_2_id: null,
          cirujano_3_id: null,
          medico_residente_anasteciologo_1_id: null,
          medico_residente_anasteciologo_2_id: null,
          medico_residente_cirugia_1_id: null,
          medico_residente_cirugia_2_id: null,
          licenciada_instrumentista_id: null,
          licenciada_instrumentista_2_id: null,
          licenciada_circulante_id: null,
          licenciada_circulante_2_id: null
        }
      },
      pacienteLabel: '',
      camaLabel: '',
      diagnosticoLabel: '',
      operacionLabel: '',
      opcionesSalasOperaciones: []
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
        obserbacion: null,
        equipo_quirurgico: {
          id: null,
          anesteciologo_1_id: null,
          anesteciologo_2_id: null,
          cirujano_1_id: null,
          cirujano_2_id: null,
          cirujano_3_id: null,
          medico_residente_anasteciologo_1_id: null,
          medico_residente_anasteciologo_2_id: null,
          medico_residente_cirugia_1_id: null,
          medico_residente_cirugia_2_id: null,
          licenciada_instrumentista_id: null,
          licenciada_instrumentista_2_id: null,
          licenciada_circulante_id: null,
          licenciada_circulante_2_id: null
        }
      }
      this.$emit('close')
    }
  }
}

</script>

<style>

input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

</style>
