<template>
  <div class="app-container">
    <el-card style="padding;: 5px !important">
      <div slot="header">
        <h3 class="card-header">CIRUGÍAS</h3>
      </div>
      <div style="position: relative;height: calc(100vh - 210px)">
        <el-row :gutter="10">
          <el-col :xs="24" :md="6">
            <el-input
              v-model="listQuery.keyword"
              placeholder="Buscar"
              style="width: 100%; margin-bottom: 5px;"
              class="filter-item"
              clearable
              @clear="listarCirugias"
            />
          </el-col>
          <el-col :xs="24" :md="3">
            <el-date-picker v-model="listQuery.fechaProgramacion" placeholder="" style="margin-bottom: 5px;" />
          </el-col>
          <el-col :xs="24" :md="2">
            <el-button
              class="filter-item"
              type="primary"
              style="width: 100%; margin-bottom: 5px;"
              icon="el-icon-search"
              @click="listarCirugias"
            />
          </el-col>
          <!-- v-permission="['permisos.crear']" -->
          <el-col :xs="24" :md="6">
            <el-button
              class="filter-item"
              style="width: 100%; margin-bottom: 5px;"
              type="primary"
              icon="el-icon-plus"
              @click="abrirModalAgregar"
            >
              Agregar
            </el-button>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              :data="data"
              height="calc(calc(100vh - 380px))"
              style="width: 100%"
            >
              <el-table-column
                header-align="center"
                type="index"
                label="#"
                width="30"
              />
              <el-table-column
                header-align="center"
                align="center"
                prop="paciente"
                label="PACIENTE"
                min-width="300"
              />
              <el-table-column
                header-align="center"
                align="center"
                prop="fecha_cirugia"
                label="FECHA CIRUGIA"
                min-width="124"
              />
              <el-table-column
                header-align="center"
                align="center"
                prop="turno"
                label="TURNO"
                min-width="120"
              />
              <el-table-column
                header-align="center"
                align="center"
                prop="cama_origen"
                label="CAMA ORIGEN"
                min-width="210"
              />
              <el-table-column
                header-align="center"
                align="center"
                prop="sala_operacion"
                label="SALA OPERACIONES"
                min-width="210"
              />
              <el-table-column
                header-align="center"
                align="center"
                prop="nro_historia_clinica"
                label="N° HISTORIA CLINICA"
                min-width="210"
              />}
              <el-table-column
                header-align="center"
                align="center"
                prop="activo"
                label="OPCIONES"
                width="250"
              >
                <template slot-scope="scope">
                  <el-dropdown trigger="click" @command="handleCommand">
                    <el-button type="text" size="mini">
                      OPCIONES <i class="el-icon-arrow-down el-icon--right" /></el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item icon="el-icon-edit" :command="{command: 'VER',id: scope.row.id}">Ver detalles</el-dropdown-item>
                      <el-dropdown-item v-if="scope.row.suspencionregistrada == false && scope.row.detalleregistrado == false" icon="el-icon-edit" :command="{command: 'EDITAR',id: scope.row.id}">EDITAR</el-dropdown-item>
                      <el-dropdown-item v-if="scope.row.suspencionregistrada == false && scope.row.detalleregistrado == false" icon="el-icon-edit" :command="{command: 'REGISTRODETALLE',id: scope.row.id}">Registrar Detalle</el-dropdown-item>
                      <el-dropdown-item v-if="scope.row.suspencionregistrada == false && scope.row.detalleregistrado == false" :command="{command: 'SUSPENSION',id: scope.row.id}">SUSPENSION</el-dropdown-item>
                      <el-dropdown-item icon="el-icon-remove" :command="{command: 'ELIMINAR',id: scope.row.id}">ELIMINAR</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <paginator
              :total="listQuery.total"
              :page.sync="listQuery.page"
              :limit.sync="listQuery.limit"
              layout="total, prev, pager, next"
              @pagination="listarCirugias"
            />
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- Dialogo para editar o Crear un servicio -->
    <el-dialog
      :title="tituloModalAgregarEditar"
      :visible.sync="modalAgregarEditar"
      top="1vh"
      :width="widthModal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <agregar-editar-programacion-cirugia :programacion-cirugia-id="programacionCirugiaEditarId" @close="cerrarModalAgregarEditar" />
    </el-dialog>
    <!-- Dialogo para Registro de detalle cirugia -->

    <el-dialog
      title="Detalle Cirugia"
      top="1vh"
      :visible.sync="modalRegistroDetalleCirugia"
      :width="widthModal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <registro-detalle-cirugia :programacion-cirugia="programacionRegistroDetalle_Id" @close="cerrarModalRegistroDetalle" />
    </el-dialog>

    <el-dialog
      :title="tituloModalAgregarEditar"
      :visible.sync="modalAgregarEditar"
      top="1vh"
      :width="widthModal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <agregar-editar-programacion-cirugia :programacion-cirugia-id="programacionCirugiaEditarId" @close="cerrarModalAgregarEditar" />
    </el-dialog>
    <!-- Dialogo para suspension cirugia -->
    <el-dialog
      title="SUSPENSION CIRUGIA"
      :visible.sync="modalSuspensionCirugia"
      :width="widthModal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <agregar-suspension-cirugia :programacion-cirugia-id="suspensionCirugiaProgramacionId" @close="cerrarModalSuspensionCirugia" />
    </el-dialog>
  </div>
</template>

<script>
// Utilidades
import { debounce } from '@/utils'
import Swal from 'sweetalert2'
// Componentes
import AgregarEditarProgramacionCirugia from './components/agregar_editar_programacion'
import RegistroDetalleCirugia from './components/registro_detalle_cirugia'
import AgregarSuspensionCirugia from './components/suspension_cirugia'
import Paginator from '@/components/Pagination'
// Resource
import ProgramacionCirugiaResource from '@/api/programacion-cirugia'
const programacionCirugiaResource = new ProgramacionCirugiaResource()
export default {
  name: 'Cirugias',
  components: { AgregarEditarProgramacionCirugia, RegistroDetalleCirugia, AgregarSuspensionCirugia, Paginator },
  data() {
    return {
      loading: false,
      data: [],
      tituloModalAgregarEditar: '',
      modalAgregarEditar: false,
      tituloModalSuspension: '',
      widthModal: '80%',
      listQuery: {
        total: 0,
        page: 1,
        limit: 14,
        keyword: '',
        fechaProgramacion: new Date()
      },
      programacionCirugiaEditarId: -5,
      modalSuspensionCirugia: false,
      suspensionCirugiaProgramacionId: -6,
      // variables para el registro del detalle de la cirugia
      modalRegistroDetalleCirugia: false,
      programacionRegistroDetalle_Id: -5
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      const windowWidth = document.documentElement.clientWidth
      if (windowWidth < 768) {
        this.widthModal = '90%'
      } else {
        this.widthModal = '80%'
      }
    })
    window.addEventListener('resize', this.__resizeHandler)

    this.listarCirugias()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    listarCirugias() {
      this.loading = true
      programacionCirugiaResource.list(this.listQuery)
        .then(
          (response) => {
            const { data, meta } = response
            this.data = data
            this.listQuery.total = meta.total
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
    abrirModalAgregar() {
      this.tituloModalAgregarEditar = 'REGISTRAR PROGRAMACIÓN DE CIRUGÍA'
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    abrirModalEditar(programacionCirugiaId) {
      this.tituloModalAgregarEditar = 'EDITAR CIRUGÍA'
      this.programacionCirugiaEditarId = programacionCirugiaId
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    cerrarModalAgregarEditar() {
      this.modalAgregarEditar = false
      this.$nextTick(() => {
        this.tituloModalAgregarEditar = ''
        this.programacionCirugiaEditarId = -5
        this.listarCirugias()
      })
    },
    eliminarProgramacionCirugia(programacionCirugiaEditarId) {
      Swal.fire({
        title: '¿Está seguro de eliminar el tipo de personal?',
        text: 'Si no se visualiza la información correcta se recomienda editar el tipo de personal, a menos que el tipo de personal nunca haya sido parte del HRDC',
        icon: 'error',
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonColor: '#1e88e5',
        confirmButtonText: 'Sí, estoy seguro',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true
          programacionCirugiaResource.destroy(programacionCirugiaEditarId)
            .then(
              (response) => {
                this.$message({
                  type: 'info',
                  message: response.message
                })
                this.loading = false
                this.listarTipoPersonal()
              }
            )
            .catch(
              (error) => {
                console.log(error)
                this.loading = false
              }
            )
        } else {
          this.loading = false
        }
      })
    },
    handleCommand({ command, id }) {
      if (command === 'EDITAR') {
        this.abrirModalEditar(id)
      }
      if (command === 'ELIMINAR') {
        this.eliminarProgramacionCirugia(id)
      }
      if (command === 'REGISTRODETALLE') {
        this.abrirModalRegistroDetalle(id)
      }
      if (command === 'SUSPENSION') {
        this.abrirModalSuspension(id)
      }
    },
    abrirModalRegistroDetalle(programacion_id) {
      this.programacionRegistroDetalle_Id = programacion_id
      this.$nextTick(() => {
        this.modalRegistroDetalleCirugia = true
      })
    },
    cerrarModalRegistroDetalle() {
      this.modalRegistroDetalleCirugia = false
      this.$nextTick(() => {
        this.programacionRegistroDetalle_Id = -5
        this.listarCirugias()
      })
    },
    abrirModalSuspension(programacionCirugiaId) {
      this.tituloModalSuspension = 'REGISTRAR SUSPENSIÓN'
      this.suspensionCirugiaProgramacionId = programacionCirugiaId
      this.$nextTick(() => {
        this.modalSuspensionCirugia = true
      })
    },
    cerrarModalSuspensionCirugia() {
      this.modalSuspensionCirugia = false
      this.$nextTick(() => {
        this.suspensionCirugiaProgramacionId = -5
        this.listarCirugias()
      })
    }
  }
}
</script>
