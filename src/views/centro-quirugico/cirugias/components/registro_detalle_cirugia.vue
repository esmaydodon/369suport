<template>
  <div v-loading="loading" class="app-container">
    <el-row :gutter="10">
      <el-form>
        <el-col :xs="24" :md="8">
          <el-form-item label="Fecha de intervencion programada">
            <el-input
              v-model="programacion.fecha_cirugia"
              placeholder=""
              :readonly="true"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="8">
          <el-form-item label="Operacion programada">
            <el-input
              v-model="programacion.operacion_programada_id_label"
              :readonly="true"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="8">
          <el-form-item label="Paciente">
            <el-input
              v-model="programacion.paciente"
              :readonly="true"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-divider />
    <el-form ref="formDetalleCirugia" :model="modeloFormulario" :rules="reglas">
      <el-row :gutter="15">
        <el-col :xs="24" :md="12">
          <h3>Detalle Cirugia</h3>
          <el-form-item label="ASA" prop="detallecirugia.asa_id">
            <el-select
              v-model="modeloFormulario.detallecirugia.asa_id"
              clearable
            >
              <el-option
                v-for="item in opcionesAsa"
                :key="item.id"
                :label="item.nombre"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="Tipo cirugia"
            prop="detallecirugia.tipo_cirugia_id"
          >
            <el-select
              v-model="modeloFormulario.detallecirugia.tipo_cirugia_id"
              clearable
            >
              <el-option
                v-for="item in opcionesTipoCirugia"
                :key="item.id"
                :label="item.nombre"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="Categoria cirugia"
            prop="detallecirugia.categoria_cirugia_id"
          >
            <el-select
              v-model="modeloFormulario.detallecirugia.categoria_cirugia_id"
            >
              <el-option
                v-for="item in opcionesCategoriaCirugia"
                :key="item.id"
                :label="item.nombre"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item
                label="Equipo Completo"
                prop="detallecirugia.equipo_completo"
              >
                <el-switch
                  v-model="modeloFormulario.detallecirugia.equipo_completo"
                  active-text="SI"
                  inactive-text="NO"
                />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item
                label="Observacion equipo completo"
                prop="detallecirugia.observaciones_equipo_completo"
              >
                <el-input
                  v-model="
                    modeloFormulario.detallecirugia
                      .observaciones_equipo_completo
                  "
                  type="textarea"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item
                label="Check List Cirugia"
                prop="detallecirugia.checklist"
              >
                <el-switch
                  v-model="modeloFormulario.detallecirugia.checklist"
                  active-text="SI"
                  inactive-text="NO"
                />
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item
                label="Cirugia Segura"
                prop="detallecirugia.cirugia_segura"
              >
                <el-switch
                  v-model="modeloFormulario.detallecirugia.cirugia_segura"
                  active-text="Completo"
                  inactive-text="Incompleto"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item
                label="Fallecimiento del paciente"
                prop="detallecirugia.fallecimiento_paciente"
              >
                <el-switch
                  v-model="
                    modeloFormulario.detallecirugia.fallecimiento_paciente
                  "
                  active-text="SI"
                  inactive-text="NO"
                />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item
                label="Observaciones fallecimiento del paciente"
                prop="detallecirugia.observacion_fallecimiento_paciente"
              >
                <el-input
                  v-model="
                    modeloFormulario.detallecirugia
                      .observacion_fallecimiento_paciente
                  "
                  type="textarea"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :md="12">
          <h3>Detalle Cronologico</h3>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item
                label="Fecha y hora ingreso quirofano"
                prop="detalleCronologico.hora_ingreso_quirofano"
              >
                <el-date-picker
                  v-model="modeloFormulario.detalleCronologico.hora_ingreso_quirofano"
                  type="datetime"
                  placeholder="seleccionar"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Fecha y hora salida quirofano"
                prop="detalleCronologico.hora_salida_quirofano"
              >
                <el-date-picker
                  v-model="modeloFormulario.detalleCronologico.hora_salida_quirofano"
                  type="datetime"
                  placeholder="seleccionar"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item
                label="Fecha y hora inicio anestesia"
                prop="detalleCronologico.hora_inicio_anestesia"
              >
                <el-date-picker
                  v-model="modeloFormulario.detalleCronologico.hora_inicio_anestesia"
                  type="datetime"
                  placeholder="seleccionar"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Fecha y hora fin anestesia"
                prop="detalleCronologico.hora_fin_anestesia"
              >
                <el-date-picker
                  v-model="modeloFormulario.detalleCronologico.hora_fin_anestesia"
                  type="datetime"
                  placeholder="seleccionar"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item
                label="Fecha y hora inicio cirugia"
                prop="detalleCronologico.hora_inicio_cirugia"
              >
                <el-date-picker
                  v-model="modeloFormulario.detalleCronologico.hora_inicio_cirugia"
                  type="datetime"
                  placeholder="seleccionar"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Fecha y hora fin cirugia"
                prop="detalleCronologico.hora_fin_cirugia"
              >
                <el-date-picker
                  v-model="modeloFormulario.detalleCronologico.hora_fin_cirugia"
                  placeholder="seleccionar"
                  type="datetime"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item
                label="Alta postanestesia"
                prop="detalleCronologico.alta_postanestesia"
              >
                <el-date-picker
                  v-model="
                    modeloFormulario.detalleCronologico.alta_postanestesia
                  "
                  type="datetime"
                  placeholder="seleccionar"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item
                label="Destino postcirugia"
                prop="detallecirugia.destino_postcirugia_id"
              >
                <el-select
                  v-model="
                    modeloFormulario.detallecirugia.destino_postcirugia_id
                  "
                >
                  <el-option
                    v-for="item in opcionesDestinosPoscirugia"
                    :key="item.id"
                    :label="item.nombre"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Cama destino"
                prop="detallecirugia.cama_destino_id"
              >
                <!-- :rules="[
                  {
                    requiredIf: modeloFormulario.detallecirugia.checklist == true,
                    message: 'Este campo es obligatorio',
                    trigger: 'change',
                  },
                ]" -->
                <el-autocomplete
                  v-model="cama_id_label"
                  :fetch-suggestions="buscarCama"
                  placeholder="Buscar por codigo"
                  style="width: 100%"
                  @select="seleccionarCama"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-divider />
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="Operaciones realizadas"
            prop="detallecirugia.operacionesRealizadas"
          >
            <el-autocomplete
              v-model="searchoperaciones"
              :fetch-suggestions="buscarOperaciones"
              placeholder="Buscar por operacion"
              style="width: 100%"
              @select="seleccionarOperacion"
            />
            <div>
              <el-table
                :data="modeloFormulario.detallecirugia.operacionesRealizadas"
              >
                <el-table-column label="Operacion" prop="value" />
                <el-table-column label="Opciones">
                  <template slot-scope="scope">
                    <el-button
                      icon="el-icon-delete"
                      @click="eliminarOperacion(scope.row.id)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider />
    </el-form>
    <el-row :gutter="10" :type="rowType" justify="center" style="padding: 10px">
      <el-col :xs="24" :sm="12" :md="6" style="text-align: center">
        <el-button
          type="primary"
          plain
          style="width: 100%; margin: 7px 0px"
          @click="close"
        >Cancelar</el-button>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" style="text-align: left">
        <el-button
          type="primary"
          style="width: 100%; margin: 7px 0px"
          @click="handleSubmitForm"
        >Guardar</el-button>
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
import DetalleCirugiaResource from '@/api/detalle_cirugia'
const detalleCirugiaResource = new DetalleCirugiaResource()
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

      modeloFormulario: {
        programacion_id: null,
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
          cama_destino_id: null,
          operacionesRealizadas: []
        },
        detalleCronologico: {
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
        }
      },
      // Modelo detalle Cirugia
      cama_id_label: '',
      searchoperaciones: '',
      // Reglas de formulario
      reglas: {
        'detallecirugia.asa_id': [
          {
            required: true,
            message: 'Este campo es obligatorio',
            trigger: 'change'
          }
        ],
        'detallecirugia.tipo_cirugia_id': [
          {
            required: true,
            message: 'Este campo es obligatorio',
            trigger: 'change'
          }
        ],
        'detallecirugia.categoria_cirugia_id': [
          {
            required: true,
            message: 'Este campo es obligatorio',
            trigger: 'change'
          }
        ],
        'detallecirugia.equipo_completo': [
          {
            required: true,
            message: 'Este campo es obligatorio',
            trigger: 'change'
          }
        ],
        'detallecirugia.checklist': [
          {
            required: true,
            message: 'Este campo es obligatorio',
            trigger: 'change'
          }
        ],
        'detallecirugia.cirugia_segura': [
          {
            required: true,
            message: 'Este campo es obligatorio',
            trigger: 'change'
          }
        ],
        'detallecirugia.fallecimiento_paciente': [
          {
            required: true,
            message: 'Este campo es obligatorio',
            trigger: 'change'
          }
        ],
        'detallecirugia.destino_postcirugia_id': [
          {
            required: true,
            message: 'Este campo es obligatorio',
            trigger: 'change'
          }
        ],
        'detallecirugia.cama_destino_id': [{
          validator: (rule, value, callback) => {
            if (this.modeloFormulario.detallecirugia.destino_postcirugia_id === 1 && value == null) {
              console.log('error')
              callback(new Error('La cama es requerida cuando el destino es un servicio.'))
            }
            callback()
          },
          trigger: 'change'
        }],
        'detalleCronologico.hora_ingreso_quirofano': [
          {
            required: true,
            message: 'Este campo es obligatorio',
            trigger: 'change'
          }
        ],
        'detalleCronologico.hora_salida_quirofano': [
          {
            required: true,
            message: 'Este campo es obligatorio',
            trigger: 'change'
          }
        ],
        'detalleCronologico.hora_inicio_anestesia': [
          {
            required: true,
            message: 'Este campo es obligatorio',
            trigger: 'change'
          }
        ],
        'detalleCronologico.hora_fin_anestesia': [
          {
            required: true,
            message: 'Este campo es obligatorio',
            trigger: 'change'
          }
        ],
        'detalleCronologico.hora_inicio_cirugia': [
          {
            required: true,
            message: 'Este campo es obligatorio',
            trigger: 'change'
          }
        ],
        'detalleCronologico.hora_fin_cirugia': [
          {
            required: true,
            message: 'Este campo es obligatorio',
            trigger: 'change'
          }
        ],
        'detalleCronologico.alta_postanestesia': [
          {
            required: true,
            message: 'Este campo es obligatorio',
            trigger: 'change'
          }
        ],
        'detallecirugia.operacionesRealizadas': [
          {
            type: 'array',
            required: true,
            message: 'Debe seleccionar Por lo menos una operacion',
            trigger: 'change'
          }
        ]
      }
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
      asaResource
        .opciones()
        .then((response) => {
          this.opcionesAsa = response.data
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    cargarTipoCirugia() {
      tiposCirugiaResource
        .opciones()
        .then((response) => {
          this.opcionesTipoCirugia = response.data
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    cargarCategoriasCirugia() {
      categoriasCirugiaResource
        .opciones()
        .then((response) => {
          this.opcionesCategoriaCirugia = response.data
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    cargarDestinoPoscirugia() {
      destinoPostCirugiaResource
        .opciones()
        .then((response) => {
          this.opcionesDestinosPoscirugia = response.data
          this.loading = false
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    buscarCama(queryString, cb) {
      camasResource
        .opcionesSeleccion({ keyword: queryString })
        .then((response) => {
          const { data } = response
          cb(data)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    seleccionarCama(item) {
      console.log(item)
      this.modeloFormulario.detallecirugia.cama_destino_id = item.id
      console.log(this.modeloFormulario.detallecirugia.cama_destino_id)
    },
    buscarOperaciones(queryString, cb) {
      operacionesResource
        .opcionesSeleccion({ keyword: queryString })
        .then((response) => {
          const { data } = response
          cb(data)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    seleccionarOperacion(item) {
      if (
        this.modeloFormulario.detallecirugia.operacionesRealizadas.some(
          (obj) => obj.id === item.id
        )
      ) {
        this.$message({
          type: 'info',
          message: 'Esta Operacion ya fue seleccionada'
        })
        return
      }
      this.modeloFormulario.detallecirugia.operacionesRealizadas.push(item)
      this.$nextTick(() => {
        this.searchoperaciones = ''
      })
    },
    eliminarOperacion(id) {
      const index =
        this.modeloFormulario.detallecirugia.operacionesRealizadas.findIndex(
          (obj) => obj.id === id
        )
      if (index !== -1) {
        this.modeloFormulario.detallecirugia.operacionesRealizadas.splice(
          index,
          1
        )
      }
    },
    cargarInformacionProgramacion() {
      this.loading = true
      programacionCirugiaResource
        .get(this.programacionCirugia)
        .then((response) => {
          this.programacion = response.data
          this.loading = false
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    handleSubmitForm() {
      this.loading = true
      this.$refs['formDetalleCirugia'].validate((valid) => {
        if (valid) {
          this.modeloFormulario.programacion_id = this.programacionCirugia
          // Enviar informacion al backend
          detalleCirugiaResource
            .store(this.modeloFormulario)
            .then((response) => {
              this.$message({
                type: 'success',
                message: response.message
              })
              this.loading = false
              this.close()
            })
            .catch((error) => {
              console.log(error)
              this.loading = false
            })
        } else {
          this.loading = false
          console.log('incorrecto')
          return false
        }
      })
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
