<template>
  <div>
    <div v-loading="loading">
      <el-form ref="formPersona" :model="persona" :rules="reglas" label-position="top">
        <el-row :gutter="10">
          <!-- <el-col :span="12">
            <el-form-item label="Tipo doc. identidad" prop="tipo_doc_identidad">
              <el-select v-model="persona.tipo_doc_identidad" placeholder="Seleccionar">
                <el-option label="DNI" :value="1" />
                <el-option label="CARNET EXTRANGERIA." :value="2" />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="Nro. doc. identidad" prop="doc_identidad">
              <el-input v-model="persona.doc_identidad" v-loading="dniLoading" style="width: 130px;" @change="handleConsultaDniService(persona.doc_identidad,1)" />
              <!-- <el-button type="primary" :disabled="flagPersonaExhistente" icon="el-icon-plus" @click="abrirModalAgregar" /> -->
              <el-button type="primary" icon="el-icon-search" @change="handleConsultaDniService(persona.doc_identidad,1)" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Nombres" prop="nombres">
              <el-input v-model="persona.nombres" v-loading="dniLoading" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Apellido Paterno" prop="apellido_paterno">
              <el-input v-model="persona.apellido_paterno" v-loading="dniLoading" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Apellido Materno" prop="apellido_materno">
              <el-input v-model="persona.apellido_materno" v-loading="dniLoading" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item ref="formvinculoLaboralObject" label="ÁREA" prop="area_id">
              <el-select v-model="vinculoLaboralObject.area_id" placeholder="Seleccione">
                <el-option v-for="item in opcionesAreas" :key="item.id" :label="item.nombre" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="CARGO" prop="cargo_id">
              <el-select v-model="vinculoLaboralObject.cargo_id" placeholder="Seleccione">
                <el-option v-for="item in opcionesCargo" :key="item.id" :label="item.nombre" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="TIPO PERSONAL" prop="tipo_personal_id">
              <el-select v-model="vinculoLaboralObject.tipo_personal_id" placeholder="Seleccione" :disabled="flagCampoaEditarBloqueado" @change="handleConsultaTipoPersonal(vinculoLaboralObject.tipo_personal_id)">
                <el-option v-for="item in opcionesTipoPersonal" :key="item.id" :label="item.nombre" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="ESPECIALIDAD" prop="especialidad_principal">
              <el-select v-model="vinculoLaboralObject.especialidad_principal" placeholder="Seleccione">
                <el-option v-for="item in opcionesEspecialidades" :key="item.id" :label="item.nombre" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="FECHA INICIO" prop="fecha_inicio">
              <el-date-picker v-model="vinculoLaboralObject.fecha_inicio" placeholder="Seleccionar o ingresar" format="dd/MM/yyyy" value-format="yyyy-MM-dd H:mm:ss" :disabled="flagCampoaEditarBloqueado" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <span>especialidad_principal</span>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="FECHA FIN">
              <el-date-picker v-model="vinculoLaboralObject.fecha_fin" placeholder="Seleccionar o ingresar" format="dd/MM/yyyy" value-format="yyyy-MM-dd H:mm:ss" :disabled="flagCampoaEditarBloqueado" />
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
      :title="tituloModalAgregarEditar"
      :visible.sync="modalAgregarEditar"
      :width="widthModal"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <agregar-editar-persona :persona-id="personaEditar_Id" @close="closeModalAgregarEditar" />
    </el-dialog>
    <el-dialog
      :title="'ESPECIALIDADES '"
      :visible.sync="modalVicularEspecialidades"
      :width="widthModal"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <listar-especialidades :persona-id="personaVerEspecialidad_Id" @close="cerrarModalEspecialidades" />
    </el-dialog>
  </div>
</template>

<script>
// Utilidades
import { debounce } from '@/utils'
// Resource

import PersonasResource from '@/api/personas'
const personasResource = new PersonasResource()
import AgregarEditarPersona from '../../personas/components/agregar_editar.vue'
import VinculoLaboralResource from '@/api/vinculolaboral'
const vinculoLaboralResource = new VinculoLaboralResource()
import AreasResource from '@/api/areas'
const areasResource = new AreasResource()
import CargosResource from '@/api/cargos'
const cargosResource = new CargosResource()
import TipoPersonalResource from '@/api/tipo_personal'
// import Swal from 'sweetalert2'
const tipoPersonalResource = new TipoPersonalResource()
import EspecialidadesResource from '@/api/especialidades'
const especialidadesResource = new EspecialidadesResource()
import ListarEspecialidades from './vincular_especialidades.vue'

// import AgregarEditarPersona from '../../personas/components/agregar_editar'

export default {
  name: 'SeleccionarPersona',
  components: { ListarEspecialidades, AgregarEditarPersona },
  // components: { ListarEspecialidades: () => import('./vincular_especialidades.vue') },
  props: {
    vinculoLaboralId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      modalVicularEspecialidades: false,
      personaEditar_Id: -1,
      tituloModalAgregarEditar: '',
      modalAgregarEditar: false,
      loading: false,
      vinculoLaboralObject: {
        fecha_inicio: '',
        fecha_fin: '',
        persona_id: undefined,
        area_id: undefined,
        cargo_id: undefined,
        tipo_personal_id: undefined,
        especialidad_principal: undefined
      },
      persona: {
        id: undefined,
        tipo_doc_identidad: '',
        nombre_completo: '',
        doc_identidad: '',
        nombres: '',
        apellido_paterno: '',
        apellido_materno: ''
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
        ]
        // area_id: [{ required: true, message: 'El campo es obligatorio', trigger: 'change' }]
        // cargo_id: [{ required: true, message: 'El campo es obligatorio', trigger: 'change' }],
        // tipo_personal_id: [{ required: true, message: 'El campo es obligatorio', trigger: 'change' }],
        // especialidad_principal: [{ required: true, message: 'El campo es obligatorio', trigger: 'change' }],
        // fecha_inicio: [{ required: true, message: 'El campo es obligatorio', trigger: 'change' }]
      },
      dniLoading: false,
      rowType: 'flex',
      opcionesAreas: [],
      TipoPersonalSeleccionado: [],
      personaVerEspecialidad_Id: -3,
      tipoPersonalAsistencial: false,
      flagCampoaEditarBloqueado: false,
      areaSeleccionada: null,
      opcionesCargo: [],
      opcionesTipoPersonal: [],
      opcionesEspecialidades: [],
      cargoSeleccionado: null,
      tipoPersonalSeleccionado: null,
      tipoEspecialidadSeleccionado: null,
      opcionesDistrito: [],
      opcionesNivelesEducativos: [],
      flagPersonaExhistente: false,
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
    vinculoLaboralId(newValue, oldValue) {
      if (newValue > 0) {
        // si es para edicion entonces bloquear campos
        this.flagCampoaEditarBloqueado = true
        this.getDetalleVinculoLaboral()
      } else {
        this.flagCampoaEditarBloqueado = false
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
    if (this.vinculoLaboralId > 0) {
      this.getDetalleVinculoLaboral()
    }
    // this.cargarOpcionesNivelesEducativos()
    // this.cargarOpcionesRegion()
    this.cargarOpcionArea()
    this.cargarOpcionesCargos()
    this.cargarOpcionesTipoPersonal()
    this.cargarOpcionesEspecialidades()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    handleConsultaDniService(dnisolicitante, flag) {
      this.consultaDocumento(dnisolicitante)
    },
    handleConsultaTipoPersonal(tipopersonalId) {
      console.log(tipopersonalId)
      this.consultaTipoPersonal(tipopersonalId)
    },
    // Visualizar y vincular camas
    openModalCamas(id, nombrePersona) {
      this.personaVerEspecialidad_Id = id
      this.areaVerCamaNombre = null
      // console.log(this.personaVerEspecialidad_Id)
      this.$nextTick(() => {
        this.modalVicularEspecialidades = true
      })
    },
    cerrarModalEspecialidades() {
      this.modalVicularEspecialidades = false
      this.areaVerCamaNombre = ''
      this.personaVerEspecialidad_Id = -5
    },
    async consultaDocumento(dnisolicitante) {
      this.dniLoading = true
      await personasResource.getPersonaDocumento(dnisolicitante)
      // console.log(data)
        .then(
          (response) => {
            const { data } = response
            // this.persona = data
            if (data === undefined) {
              this.flagPersonaExhistente = false
              this.vinculoLaboralObject.persona_id = null
              this.abrirModalAgregar()
              // this.resetPersonaModel()
            } else {
              this.flagPersonaExhistente = true
              this.persona = data
              this.vinculoLaboralObject.persona_id = data.id
            }
            this.dniLoading = false
          }
        )
        .catch(
          (error) => {
            this.dniLoading = false
            this.resetPersonaModel()
            this.flagPersonaExhistente = false
            console.log(error)
          }
        )
    },
    getDetalleVinculoLaboral() {
      this.loading = true
      vinculoLaboralResource.get(this.vinculoLaboralId)
        .then(
          (response) => {
            this.vinculoLaboralObject = response.data
            // this.vinculoLaboralObject.fecha_fin = (response.data.fecha_fin !== null ? new Date(response.data.fecha_fin + ' 01:00:00') : '')
            this.persona = response.data.persona
            // this.data = response.data
            this.loading = false
            console.log(this.persona)
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = false
          }
        )
    },
    async cargarOpcionArea() {
      await areasResource
        .cargarComboArea({})
        .then((response) => {
          this.opcionesAreas = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async cargarOpcionesCargos() {
      this.loading = true
      await cargosResource.opcionesSeleccion()
        .then(
          (response) => {
            this.opcionesCargo = response.data
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
    async cargarOpcionesTipoPersonal() {
      this.loading = true
      await tipoPersonalResource.opcionesSeleccion()
        .then(
          (response) => {
            this.opcionesTipoPersonal = response.data
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
    async consultaTipoPersonal(id) {
      this.loading = true
      await tipoPersonalResource.get(id)
        .then(
          (response) => {
            this.TipoPersonalSeleccionado = response.data
            if (this.TipoPersonalSeleccionado.nombre === 'ASISTENCIAL') {
              // console.log(this.TipoPersonalSeleccionado.nombre)
              this.tipoPersonalAsistencial = true
              this.openModalCamas(this.vinculoLaboralObject.persona_id, null)
            } else {
              this.tipoPersonalAsistencial = false
              // console.log('otro tipo' + this.TipoPersonalSeleccionado.nombre)
            }
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
    async cargarOpcionesEspecialidades() {
      await especialidadesResource.opcionesSeleccion()
        .then(
          (response) => {
            this.opcionesEspecialidades = response.data
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

    handleSubmitForm() {
      this.$refs['formPersona'].validate((valid) => {
        if (valid) {
          if (this.vinculoLaboralId < 0) {
            this.agregarVinculoLaboral()
          } else {
            // this.editarPersona()
            this.editarVinculoLaboral(this.vinculoLaboralObject)
          }
        } else {
          return false
        }
      })
    },
    agregarVinculoLaboral() {
      this.loading = true
      // console.log(this.vinculoLaboralObject)
      vinculoLaboralResource.store(this.vinculoLaboralObject)
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
    editarVinculoLaboral(datos) {
      this.loading = true
      // console.log('vinculolaboralId' + this.vinculoLaboralId)
      this.vinculoLaboralObject = datos
      // console.log('vinculoLaboralObject: ' + this.vinculoLaboralObject)
      vinculoLaboralResource.update(this.vinculoLaboralId, this.vinculoLaboralObject)
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
    abrirModalAgregar() {
      this.tituloModalAgregarEditar = 'REGISTRAR PERSONA'
      this.personaEditar_Id = -5
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    //
    closeModalAgregarEditar() {
      this.modalAgregarEditar = false
      this.resetPersonaModel()
      this.personaEditar_Id = -1
    },
    close(data) {
      this.persona = {
        id: undefined,
        tipo_doc_identidad: '',
        doc_identidad: '',
        nombre_completo: '',
        nombres: '',
        apellido_paterno: '',
        apellido_materno: ''
      }
      this.vinculoLaboralObject = {
        fecha_inicio: '',
        fecha_fin: '',
        persona_id: undefined,
        area_id: undefined,
        cargo_id: undefined,
        tipo_personal_id: undefined,
        especialidad_principal: undefined
      }
      this.tipoPersonalAsistencial = false
      this.$refs['formPersona'].resetFields()
      this.$emit('close')
    },
    resetPersonaModel(data) {
      console.log('hola')
      this.persona = {
        id: undefined,
        tipo_doc_identidad: '',
        doc_identidad: '',
        nombre_completo: '',
        nombres: '',
        apellido_paterno: '',
        apellido_materno: ''
      }
      this.tipoPersonalAsistencial = false
      this.$refs['formPersona'].resetFields()
    }
  }
}

</script>
