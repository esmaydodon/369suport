<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <h3 class="card-header">TURNOS ANASTECIOLOGO</h3>
      </div>
      <div style="position: relative;height: calc(100vh - 210px)">
        <el-row :gutter="10">
          <el-input
            v-model="listQuery.keyword"
            placeholder="Buscar"
            style="width: 300px"
            class="filter-item"
            clearable
            @clear="listaTurnosAnasteciologo"
          />
          <el-button
            class="filter-item"
            type="primary"
            style="margin-left: 10px"
            icon="el-icon-search"
            @click="listaTurnosAnasteciologo"
          />
          <!-- v-permission="['permisos.crear']" -->
          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            icon="el-icon-plus"
            @click="abrirModalAgregar"
          >
            Agregar
          </el-button>
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
                label="TURNO"
                min-width="500"
              />
              <el-table-column
                prop="hora_inicio"
                label="HORA INICIO"
                min-width="150"
              />
              <el-table-column
                prop="hora_fin"
                label="HORA FIN"
                min-width="150"
              />
              <el-table-column
                label="TERMINA SIGUIENTE DIA"
                min-width="200"
              >
                <template slot-scope="scope">
                  {{ scope.row.finaliza_dia_siguiente? 'SI': 'NO' }}
                </template>
              </el-table-column>
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
              @pagination="listaTurnosAnasteciologo"
            />
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- Dialogo para editar o Crear un servicio -->
    <el-dialog
      :title="tituloModalAgregarEditar"
      :visible.sync="modalAgregarEditar"
      :width="widthModal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <!-- :before-close="dialogBeforeClose" -->
      <agregar-editar-turnos-anasteciologo :turno-anasteciologo-id="turnoAnasteciologo_Id" @close="closeModalAgregarEditar" />
    </el-dialog>
  </div>
</template>

<script>
// Utilidades
import { debounce } from '@/utils'
// Resource
import TurnosAnasteciologoResource from '@/api/turnos-anasteciologo'
const turnosAnasteciologoResource = new TurnosAnasteciologoResource()
// Componentes
import AgregarEditarTurnosAnasteciologo from './components/agregar_editar'
import Paginator from '@/components/Pagination'
import Swal from 'sweetalert2'
// Resource
export default {
  name: 'ConfigTurnosAnasteciologo',
  components: { AgregarEditarTurnosAnasteciologo, Paginator },
  data() {
    return {
      data: [],
      tituloModalAgregarEditar: '',
      modalAgregarEditar: false,
      widthModal: '60%',
      listQuery: {
        total: 0,
        page: 1,
        limit: 14,
        keyword: ''
      },
      loading: false,
      turnoAnasteciologo_Id: -1
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      const windowWidth = document.documentElement.clientWidth
      if (windowWidth < 768) {
        this.widthModal = '90%'
      } else if (windowWidth >= 768 && windowWidth < 1200) {
        this.widthModal = '80%'
      } else {
        this.widthModal = '60%'
      }
    })
    window.addEventListener('resize', this.__resizeHandler)
    this.listaTurnosAnasteciologo()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    listaTurnosAnasteciologo() {
      this.loading = true
      turnosAnasteciologoResource.list(this.listQuery)
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
      this.tituloModalAgregarEditar = 'REGISTRAR TURNO DE ANASTECIOLOGO'
      this.turnoAnasteciologo_Id = -5
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    handleCommand({ command, id }) {
      if (command === 'EDITAR') {
        this.abrirModalEditar(id)
        console.log(command)
      }
      if (command === 'DESACTIVAR') {
        this.handleCambiarEstadoTurnoAnasteciologo(id, false)
      }
      if (command === 'ACTIVAR') {
        this.handleCambiarEstadoTurnoAnasteciologo(id, true)
      }
      if (command === 'ELIMINAR') {
        this.handleEliminarTurnoAnasteciologo(id)
      }
    },
    handleCambiarEstadoTurnoAnasteciologo(turnoAnasteciologoId, activar) {
      if (activar) {
        this.loading = true
        turnosAnasteciologoResource.cambiarEstado(turnoAnasteciologoId)
          .then(
            (response) => {
              this.$message({
                type: 'info',
                message: response.message
              })
              this.loading = false
              this.listaTurnosAnasteciologo()
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
          title: '¿Esta seguro de desactivar el turno de anasteciologo?',
          text: 'El turno de anasteciologo no podrá volver a usarse, hasta ser activado',
          icon: 'warning',
          reverseButtons: true,
          showCancelButton: true,
          confirmButtonColor: '#1e88e5',
          confirmButtonText: 'Si, estoy seguro',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.loading = true
            turnosAnasteciologoResource.cambiarEstado(turnoAnasteciologoId)
              .then(
                (response) => {
                  this.$message({
                    type: 'info',
                    message: response.message
                  })
                  this.loading = false
                  this.listaTurnosAnasteciologo()
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
    handleEliminarTurnoAnasteciologo(turnoAnasteciologoId) {
      Swal.fire({
        title: '¿Esta seguro de eliminar el turno de anasteciologo?',
        text: 'Si no se visualiza información incorrecta se recomienda editar el turno de anasteciologo, o desactivarlo.',
        icon: 'error',
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonColor: '#1e88e5',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true
          turnosAnasteciologoResource.destroy(turnoAnasteciologoId)
            .then(
              (response) => {
                this.$message({
                  type: 'info',
                  message: response.message
                })
                this.loading = false
                this.listaTurnosAnasteciologo()
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
    abrirModalEditar(turnoAnasteciologoId) {
      this.tituloModalAgregarEditar = 'EDITAR TURNO DE ANASTECIOLOGO'
      this.turnoAnasteciologo_Id = turnoAnasteciologoId
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    closeModalAgregarEditar() {
      this.modalAgregarEditar = false
      this.tituloModalAgregarEditar = ''
      this.turnoAnasteciologo_Id = -5
      this.listaTurnosAnasteciologo()
    }
  }
}
</script>
