<template>
  <div v-loading="loading" class="app-container">
    <el-row :gutter="10">
      <el-form>
        <el-col :xs="24" :md="8">
          <el-form-item label="Fecha de intervencion programada">
            <el-input v-model="programacion.fecha_cirugia" placeholder="" :readonly="true" disabled />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="8">
          <el-form-item label="Operacion programada">
            <el-input v-model="programacion.operacion_programada" :readonly="true" disabled />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="8">
          <el-form-item label="Paciente">
            <el-input v-model="programacion.paciente" :readonly="true" disabled />
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-divider />
    <el-row :gutter="15">
      <el-col :xs="24" :md="12">
        <h3>Detalle Cirugia</h3>
        <el-form>
          <el-form-item label="ASA">
            <el-select v-model="detallecirugia.asa_id">
              <el-option v-for="item in opcionesAsa" :key="item.id" :label="item.nombre" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Tipo cirugia">
            <el-select v-model="detallecirugia.tipo_cirugia_id">
              <el-option v-for="item in opcionesTipoCirugia" :key="item.id" :label="item.nombre" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Categoria cirugia">
            <el-select v-model="detallecirugia.categoria_cirugia_id">
              <el-option v-for="item in opcionesCategoriaCirugia" :key="item.id" :label="item.nombre" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="Equipo Completo">
                <el-switch v-model="detallecirugia.equipo_completo" active-text="SI" inactive-text="NO" />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="Observacion equipo completo">
                <el-input v-model="detallecirugia.observaciones_equipo_completo" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="Check List Cirugia">
                <el-switch v-model="detallecirugia.checklist" active-text="SI" inactive-text="NO" />
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="Cirugia Segura">
                <el-switch v-model="detallecirugia.cirugia_segura" active-text="Completo" inactive-text="Incompleto" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="Fallecimiento del paciente">
                <el-switch v-model="detallecirugia.fallecimiento_paciente" active-text="SI" inactive-text="NO" />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="Observaciones fallecimiento del paciente">
                <el-input v-model="detallecirugia.observacion_fallecimiento_paciente" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-col :xs="24" :md="12">
        <h3>Detalle Cronologico</h3>
        <el-form>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="Hora ingreso quirofano">
                <el-time-picker v-model="detaleCronologico.hora_ingreso_quirofano" placeholder="seleccionar" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Hora salida quirofano">
                <el-time-picker v-model="detaleCronologico.hora_ingreso_quirofano" placeholder="seleccionar" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="Hora inicio anestesia">
                <el-time-picker v-model="detaleCronologico.hora_ingreso_quirofano" placeholder="seleccionar" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Hora fin anestesia">
                <el-time-picker v-model="detaleCronologico.hora_ingreso_quirofano" placeholder="seleccionar" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="Hora inicio cirugia">
                <el-time-picker v-model="detaleCronologico.hora_ingreso_quirofano" placeholder="seleccionar" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Hora fin cirugia">
                <el-time-picker v-model="detaleCronologico.hora_ingreso_quirofano" placeholder="seleccionar" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="Alta postanestesia">
                <el-date-picker v-model="detaleCronologico.hora_ingreso_quirofano" type="datetime" placeholder="seleccionar" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form :model="detallecirugia">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="Destino postcirugia">
                <el-select v-model="detallecirugia.destino_postcirugia_id">
                  <el-option v-for="item in opcionesDestinosPoscirugia" :key="item.id" :label="item.nombre" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Cama destino">
                <el-autocomplete
                  v-model="cama_id_label"
                  :fetch-suggestions="buscarCama"
                  placeholder="Buscar por codigo"
                  style="width: 100% "
                  @select="seleccionarCama"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-divider />
    <el-row>
      <el-form>
        <el-col :span="24">
          <el-form-item label="Operaciones realizadas">
            <el-autocomplete
              v-model="searchoperaciones"
              :fetch-suggestions="buscarOperaciones"
              placeholder="Buscar por operacion"
              style="width: 100% "
              @select="seleccionarOperacion"
            />
            <div>
              <el-table :data="operacionesRealizadas">
                <el-table-column label="Operacion" prop="value" />
                <el-table-column label="Opciones">
                  <template slot-scope="scope">
                    <el-button icon="el-icon-delete" @click="eliminarOperacion(scope.row.id)" />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-divider />
    <el-row :gutter="10" :type="rowType" justify="center" style="padding: 10px;">
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

// Resource
import ProgramacionCirugiaResource from '@/api/programacion-cirugia'
const programacionCirugiaResource = new ProgramacionCirugiaResource()
import CamasResource from '@/api/camas'
const camasResource = new CamasResource()
import AsaResource from '@/api/asa'
const asaResource = new AsaResource()
import TiposCirugiaResource from '@/api/tipos-cirugia'
const tiposCirugiaResource = new TiposCirugiaResource()
import CategoriasCirugiaResource from '@/api/categorias-cirugia'
const categoriasCirugiaResource = new CategoriasCirugiaResource()
import DestinoPostCirugiaResource from '@/api/destino-post-cirugia'
const destinoPostCirugiaResource = new DestinoPostCirugiaResource()
import OperacionesResource from '@/api/operaciones'
const operacionesResource = new OperacionesResource()
import { debounce } from '@/utils'
export default {
  name: 'RegistroDetalleCirugia',
  props: {
    programacionCirugia: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      rowType: 'flex',
      // Opciones de seleccion
      opcionesAsa: [],
      opcionesTipoCirugia: [],
      opcionesCategoriaCirugia: [],
      opcionesDestinosPoscirugia: [],
      // Informacion Programacion
      programacion: {
        fecha_cirugia: '',
        operacion_programada: '',
        paciente: ''
      },
      // Modelo detalle Cirugia
      detallecirugia: {
        asa_id: null,
        tipo_cirugia_id: null,
        categoria_cirugia_id: null,
        equipo_completo: false,
        observaciones_equipo_completo: '',
        checklist: false,
        cirugia_segura: false,
        fallecimiento_paciente: false,
        observacion_fallecimiento_paciente: null,
        destino_postcirugia_id: null,
        cama_destino_id: null
      },
      detaleCronologico: {
        programacion_cirugia_id: null,
        hora_ingreso_quirofano: null,
        hora_salida_quirofano: null,
        hora_inicio_anestesia: null,
        hora_fin_anestesia: null,
        hora_inicio_cirugia: null,
        hora_fin_cirugia: null,
        alta_postanestesia: null,
        total_horas_efectivas: null,
        horas_acto_quirurgico: null,
        tiempo_recuperacion: null
      },
      operacionesRealizadas: [],
      cama_id_label: '',
      searchoperaciones: ''
    }
  },
  watch: {
    programacionCirugia(newValue, oldValue) {
      if (newValue > 0) {
        this.cargarInformacionProgramacion()
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

    this.cargarData()
    if (this.programacionCirugia > 0) {
      this.cargarInformacionProgramacion()
    }
  },
  methods: {
    cargarData() {
      this.loading = true
      this.cargarNivelAsa()
      this.cargarTipoCirugia()
      this.cargarCategoriasCirugia()
      this.cargarDestinoPoscirugia()
    },
    cargarNivelAsa() {
      asaResource.opciones()
        .then(
          (response) => {
            this.opcionesAsa = response.data
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = false
          }
        )
    },
    cargarTipoCirugia() {
      tiposCirugiaResource.opciones()
        .then(
          (response) => {
            this.opcionesTipoCirugia = response.data
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = false
          }
        )
    },
    cargarCategoriasCirugia() {
      categoriasCirugiaResource.opciones()
        .then(
          (response) => {
            this.opcionesCategoriaCirugia = response.data
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = false
          }
        )
    },
    cargarDestinoPoscirugia() {
      destinoPostCirugiaResource.opciones()
        .then(
          (response) => {
            this.opcionesDestinosPoscirugia = response.data
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
      this.detallecirugia.cama_destino_id = item.id
    },
    buscarOperaciones(queryString, cb) {
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
      if (this.operacionesRealizadas.some(obj => obj.id === item.id)) {
        this.$message(
          {
            type: 'info',
            message: 'Esta Operacion ya fue seleccionada'
          }
        )
        return
      }
      console.log('seleccionado' + item)
      console.log(item)
      this.operacionesRealizadas.push(item)
      this.$nextTick(() => {
        this.searchoperaciones = ''
      })
    },
    eliminarOperacion(id) {
      const index = this.operacionesRealizadas.findIndex(obj => obj.id === id)
      if (index !== -1) {
        this.operacionesRealizadas.splice(index, 1)
      }
    },
    cargarInformacionProgramacion() {
      this.loading = true
      programacionCirugiaResource.get(this.programacionCirugia)
        .then(
          (response) => {
            this.programacion = response.data
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

    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

