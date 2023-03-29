<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <h3 class="card-header">HISTORIAS CLÍNICAS</h3>
      </div>
      <div style="position: relative;height: calc(100vh - 210px)">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :md="12" :lg="8">
            <el-input
              v-model="listQuery.keyword"
              placeholder="Buscar"
              style="margin: 5px 0px;width: 100%;"
              class="filter-item"
              clearable
              @clear="listaHistoriasClinicas"
            />
          </el-col>
          <el-col :xs="24" :sm="24" :md="4" :lg="2">
            <el-button
              class="filter-item"
              type="primary"
              style="margin: 5px 0px; width: 100%;"
              icon="el-icon-search"
              @click="listaHistoriasClinicas"
            />
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6">
            <el-button
              class="filter-item"
              style="margin: 5px 0px; width: 100%;"
              type="primary"
              icon="el-icon-plus"
              @click="abrirModalAgregarPersonaHisoriaClinica"
            >
              Agregar Persona + Historia Clinica
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
                align="center"
                type="index"
                label="#"
                width="100"
              />
              <el-table-column
                prop="doc_identidad"
                label="DOC IDENTIDAD"
                min-width="150"
              />
              <el-table-column
                prop="nombre_completo"
                label="NOMBRE COMPLETO"
                min-width="500"
              />
              <el-table-column
                header-align="center"
                align="center"
                label="HISTORIA CLINICA"
                min-width="150"
              >
                <template slot-scope="scope">
                  <el-button v-if="scope.row.historiaclinica == null" type="info" icon="el-icon-plus" plain @click="abriModalAgregarHistoriaClinica(scope.row)">CREAR</el-button>
                  <el-button v-else type="primary" icon="el-icon-view" plain @click="abrirModalDetalleHistoriaClinica(scope.row)">VER</el-button>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="activo"
                label="OPCIONES"
                width="250"
              >
                <template slot-scope="scope">
                  <el-dropdown v-if="scope.row.historiaclinica" trigger="click" @command="handleCommand">
                    <el-button type="text" size="mini">
                      OPCIONES <i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="{command:'EDITAR',id:scope.row.historiaclinica}" icon="el-icon-edit">Editar</el-dropdown-item>
                      <el-dropdown-item :command="{command:'ELIMINAR',id:scope.row.historiaclinica}" icon="el-icon-delete-solid">Eliminar</el-dropdown-item>
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
              @pagination="listaHistoriasClinicas"
            />
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- Modal Agregar o Editar Historia Clinica -->
    <el-dialog
      :title="tituloModalAgregarEditar"
      :visible.sync="modalAgregarEditar"
      :width="widthModal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <agregar-editar-historia-clinica :historia-clinica-id="historiaClinicaEditar_id" :persona-id="personaCrearHistoria_Id" @close="cerrarModalAgregarEditarHistoriaClinica" />
    </el-dialog>
    <!-- Modal Agregar Persona + Historia Clinica -->
    <el-dialog
      title="AGREGAR PERSONA + HISTORIA CLINICA"
      :visible.sync="modalAgregarPersonaHisoriaClinica"
      :width="widthModal"
      top="2vh"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <agregar-persona-historia-clinica @click="cerrarModalAgregarPersonaHisoriaClinica" @close="cerrarModalAgregarPersonaHisoriaClinica" />
    </el-dialog>
    <!-- Modal detalle historia clinica -->
    <el-dialog
      title="HISTORIA CLINICA"
      :visible.sync="modalVerDetalleHisoriaClinica"
      fullscreen
    >
      <detalle-historia-clinica :historia-clinica-id="historiaClinicaVerDetalleId" @close="cerrarModalDetalleHistoriaClinica" />
    </el-dialog>
  </div>
</template>

<script>
// utils
import { debounce } from '@/utils'
import Swal from 'sweetalert2'
// Resource
import HistoriasClinicasResource from '@/api/historiasclinicas'
const historiasClinicasResource = new HistoriasClinicasResource()
// @note components
import AgregarEditarHistoriaClinica from './components/agregar_editar'
import AgregarPersonaHistoriaClinica from './components/agregar_persona_historiaclinica'
import DetalleHistoriaClinica from './components/detalle_historiaclinica'
import Paginator from '@/components/Pagination'

export default {
  name: 'HistoriasClinicas',
  components: { AgregarEditarHistoriaClinica, AgregarPersonaHistoriaClinica, DetalleHistoriaClinica, Paginator },
  data() {
    return {
      loading: false,
      widthModal: '40%',
      data: [],
      listQuery: {
        total: 0,
        page: 1,
        limit: 14,
        keyword: ''
      },
      modalAgregarEditar: false,
      tituloModalAgregarEditar: '',
      historiaClinicaEditar_id: -1,
      personaCrearHistoria_Id: -1,
      // modal persona + historia clinica
      modalAgregarPersonaHisoriaClinica: false,
      // modal ver detalle historia clinica
      modalVerDetalleHisoriaClinica: false,
      historiaClinicaVerDetalleId: -1
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      const windowWidth = document.documentElement.clientWidth
      if (windowWidth < 768) {
        this.widthModal = '90%'
      } else if (windowWidth <= 992 && windowWidth >= 768) {
        this.widthModal = '60%'
      } else {
        this.widthModal = '40%'
      }
      return true
    })
    window.addEventListener('resize', this.__resizeHandler)
    this.listaHistoriasClinicas()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    listaHistoriasClinicas() {
      this.loading = true
      historiasClinicasResource.list(this.listQuery)
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
    abriModalAgregarHistoriaClinica({ persona_id }) {
      this.tituloModalAgregarEditar = 'AGREGAR HISTORIA CLINICA'
      this.personaCrearHistoria_Id = persona_id
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    handleCommand({ command, id }) {
      if (command === 'EDITAR') {
        this.abrirModalEditar(id)
        console.log(command)
      }
      if (command === 'ELIMINAR') {
        this.handleEliminarHistoriaClinica(id)
      }
    },
    abrirModalEditar(historiaClinica_id) {
      this.tituloModalAgregarEditar = 'EDITAR HISTORIA CLINICA'
      this.historiaClinicaEditar_id = historiaClinica_id
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    handleEliminarHistoriaClinica(historiaClinica_id) {
      Swal.fire({
        title: '¿Esta seguro de eliminar la historia clinica?',
        text: 'Si se visualiza información incorrecta se recomienda editar la historia clinica',
        icon: 'error',
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonColor: '#1e88e5',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true
          historiasClinicasResource.destroy(historiaClinica_id)
            .then(
              (response) => {
                this.$message({
                  type: 'info',
                  message: response.message
                })
                this.loading = false
                this.listaHistoriasClinicas()
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
    cerrarModalAgregarEditarHistoriaClinica() {
      this.modalAgregarEditar = false
      this.historiaClinicaEditar_id = -5
      this.tituloModalAgregarEditar = ''
      this.listaHistoriasClinicas()
    },
    // Modal agregar persona mas  historia clinca
    abrirModalAgregarPersonaHisoriaClinica() {
      this.modalAgregarPersonaHisoriaClinica = true
    },
    cerrarModalAgregarPersonaHisoriaClinica() {
      this.modalAgregarPersonaHisoriaClinica = false
    },
    abrirModalDetalleHistoriaClinica({ historiaclinica }) {
      this.historiaClinicaVerDetalleId = historiaclinica
      this.$nextTick(() => {
        this.modalVerDetalleHisoriaClinica = true
      })
    },
    cerrarModalDetalleHistoriaClinica() {
      this.modalVerDetalleHisoriaClinica = false
      this.$nextTick(() => {
        this.historiaClinicaVerDetalleId = -5
      })
    }
  }
}
</script>
