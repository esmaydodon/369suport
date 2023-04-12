<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <h3 class="card-header">DIAGNÓSTICOS</h3>
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
              @clear="getListaDiagnosticos"
            />
          </el-col>
          <el-col :xs="24" :sm="24" :md="4" :lg="2">
            <el-button
              class="filter-item"
              type="primary"
              style="margin: 5px 0px; width: 100%;"
              icon="el-icon-search"
              @click="getListaDiagnosticos"
            />
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="4">
            <el-button
              class="filter-item"
              style="margin: 5px 0px; width: 100%;"
              type="primary"
              icon="el-icon-plus"
              @click="abriModalAgregarDiagnostico"
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
                width="100"
              />
              <el-table-column
                prop="nombre"
                label="DIAGNÓSTICO"
                min-width="500"
              />
              <el-table-column
                header-align="center"
                align="center"
                prop="activo"
                label="ACTIVO"
                width="150"
              >
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.activo == true" type="primary" plain>ACTIVO</el-tag>
                  <el-tag v-else type="warning" plain>INACTIVO</el-tag>
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
                  <el-dropdown trigger="click" @command="handleCommand">
                    <el-button type="text" size="mini">
                      OPCIONES<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="{command:'EDITAR',id:scope.row.id}" icon="el-icon-edit">Editar</el-dropdown-item>
                      <el-dropdown-item v-if="scope.row.activo == true" :command="{command:'DESACTIVAR',id:scope.row.id}" icon="el-icon-remove">Desactivar</el-dropdown-item>
                      <el-dropdown-item v-else :command="{command:'ACTIVAR',id:scope.row.id}" icon="el-icon-circle-plus">ACTIVAR</el-dropdown-item>
                      <el-dropdown-item :command="{command:'ELIMINAR',id:scope.row.id}" icon="el-icon-delete-solid">Eliminar</el-dropdown-item>
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
              @pagination="getListaDiagnosticos"
            />
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- Modal Agregar o Editar Diagnostico -->
    <el-dialog
      :title="tituloModalAgregarEditar"
      :visible.sync="modalAgregarEditarDiagnostico"
      :width="widthModal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <agregar-editar-diagnostico :diagnostico-id="diagnosticoEditar_id" @close="cerrarModalAgregarEditarDiagnostico" />
    </el-dialog>
  </div>
</template>

<script>
// Resource
import DiagnosticosResource from '@/api/diagnosticos'
const diagnosticosResource = new DiagnosticosResource()
// @note components
import AgregarEditarDiagnostico from './components/agregar_editar'
import Paginator from '@/components/Pagination'
import { debounce } from '@/utils'
import Swal from 'sweetalert2'

export default {
  name: 'Diagnosticos',
  components: { AgregarEditarDiagnostico, Paginator },
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
      modalAgregarEditarDiagnostico: false,
      tituloModalAgregarEditar: '',
      diagnosticoEditar_id: -1
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
    this.getListaDiagnosticos()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    getListaDiagnosticos() {
      this.loading = true
      diagnosticosResource.list(this.listQuery)
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
    abriModalAgregarDiagnostico() {
      this.tituloModalAgregarEditar = 'AGREGAR DIAGNÓSTICO'
      this.diagnosticoEditar_id = -5
      this.$nextTick(() => {
        this.modalAgregarEditarDiagnostico = true
      })
    },
    handleCommand({ command, id }) {
      if (command === 'EDITAR') {
        this.abrirModalEditar(id)
        console.log(command)
      }
      if (command === 'DESACTIVAR') {
        this.handleDesactivarDiagnostico(id, false)
      }
      if (command === 'ACTIVAR') {
        this.handleDesactivarDiagnostico(id, true)
      }
      if (command === 'ELIMINAR') {
        this.handleEliminarDiagnostico(id)
      }
    },
    abrirModalEditar(diagnostico_id) {
      this.tituloModalAgregarEditar = 'EDITAR DIAGNÓSTICO'
      this.diagnosticoEditar_id = diagnostico_id
      this.$nextTick(() => {
        this.modalAgregarEditarDiagnostico = true
      })
    },
    handleDesactivarDiagnostico(diagnostico_id, activar) {
      if (activar) {
        this.loading = true
        diagnosticosResource.desactivar(diagnostico_id)
          .then(
            (response) => {
              this.loading = false
              this.$message({
                type: 'info',
                message: response.message
              })
              this.getListaDiagnosticos()
            }
          )
          .catch(
            (error) => {
              console.log(error)
              this.loading = false
            }
          )
      } else {
        Swal.fire({
          title: '¿Está seguro de desactivar el diagnóstico?',
          text: 'Al desactivar el diagnóstico, no podra ser usado en el sistema.',
          icon: 'warning',
          reverseButtons: true,
          showCancelButton: true,
          confirmButtonColor: '#1e88e5',
          confirmButtonText: 'Sí, estoy seguro',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.loading = true
            diagnosticosResource.desactivar(diagnostico_id)
              .then(
                (response) => {
                  this.$message({
                    type: 'info',
                    message: response.message
                  })
                  this.loading = false
                  this.getListaDiagnosticos()
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
      }
    },
    handleEliminarDiagnostico(diagnostico_id) {
      Swal.fire({
        title: '¿Está seguro de eliminar el diagnóstico?',
        text: 'Si no se visualiza la información correcta se recomienda editar el diagnóstico, o desactivarlo.',
        icon: 'error',
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonColor: '#1e88e5',
        confirmButtonText: 'Sí, estoy seguro',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true
          diagnosticosResource.destroy(diagnostico_id)
            .then(
              (response) => {
                this.$message({
                  type: 'info',
                  message: response.message
                })
                this.loading = false
                this.getListaDiagnosticos()
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
    cerrarModalAgregarEditarDiagnostico() {
      this.modalAgregarEditarDiagnostico = false
      this.diagnosticoEditar_id = -5
      this.tituloModalAgregarEditar = ''
      this.getListaDiagnosticos()
    }
  }
}
</script>
