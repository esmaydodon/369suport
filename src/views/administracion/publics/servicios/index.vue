<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <h3 class="card-header">SERVICIOS</h3>
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
              @clear="listaServicios"
            />
          </el-col>
          <el-col :xs="24" :sm="24" :md="4" :lg="2">
            <el-button
              class="filter-item"
              type="primary"
              style="margin: 5px 0px; width: 100%;"
              icon="el-icon-search"
              @click="listaServicios"
            />
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="4">
            <el-button
              class="filter-item"
              style="margin: 5px 0px; width: 100%;"
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
                align="center"
                type="index"
                label="#"
                width="100"
              />
              <el-table-column
                prop="nombre"
                label="NOMBRE DEL SERVICIO"
                min-width="300"
              />
              <el-table-column
                header-align="center"
                align="center"
                label="CAMAS"
                min-width="80"
              >
                <template slot-scope="scope">
                  <div>
                    <el-button type="info" plain @click="openModalCamas(scope.row.id,scope.row.nombre)">
                      <svg-icon :key="scope.row.id" icon-class="custom-lista-camas" class-name="customIcon" />
                    </el-button>
                  </div>
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
              @pagination="listaServicios"
            />
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- Modal para editar o Crear un servicio -->
    <el-dialog
      :title="tituloModalAgregarEditar"
      :visible.sync="modalAgregarEditar"
      :width="widthModal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <agregar-editar-servicio
        :servicio-id="servicioEditar_Id"
        @close="closeModalAgregarEditar"
      />
    </el-dialog>
    <!-- Modal vincular camas-->
    <el-dialog
      :title="'CAMAS DEL SERVICIO: ' + servicioVerCamaNombre"
      :visible.sync="modalVicularCamaServicio"
      :width="widthModal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <listar-vincular-camas-servicio :servicio-id="servicioVerCamas_Id" @close="cerrarModalCamas" />
    </el-dialog>
  </div>
</template>

<script>
// Utilidades
import { debounce } from '@/utils'
// Componentes
import AgregarEditarServicio from './components/agregar_editar'
import ListarVincularCamasServicio from './components/vincular_cama'
import Paginator from '@/components/Pagination'
// Resource
import ServiciosResource from '@/api/servicios'
const serviciosResource = new ServiciosResource()
// Swal
import Swal from 'sweetalert2'
export default {
  name: 'Servicios',
  components: { AgregarEditarServicio, ListarVincularCamasServicio, Paginator },
  data() {
    return {
      loading: false,
      data: [],
      tituloModalAgregarEditar: '',
      modalAgregarEditar: false,
      modalVicularCamaServicio: false,
      widthModal: '40%',
      listQuery: {
        total: 0,
        page: 1,
        limit: 14,
        keyword: ''
      },
      servicioEditar_Id: -1,
      servicioVerCamas_Id: -1,
      servicioVerCamaNombre: ''
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
    this.listaServicios()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    listaServicios() {
      this.loading = true
      serviciosResource.list(this.listQuery)
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
      this.tituloModalAgregarEditar = 'REGISTRAR SERVICIO'
      this.servicioEditar_Id = -5
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
        this.handleDesactivarServicio(id, false)
      }
      if (command === 'ACTIVAR') {
        this.handleDesactivarServicio(id, true)
      }
      if (command === 'ELIMINAR') {
        this.handleEliminarServicio(id)
      }
    },
    abrirModalEditar(servicioId) {
      this.tituloModalAgregarEditar = 'EDITAR SERVICIO'
      this.servicioEditar_Id = servicioId
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    handleDesactivarServicio(servicio_id, activar) {
      if (activar) {
        this.loading = true
        serviciosResource.desactivar(servicio_id)
          .then(
            (response) => {
              this.$message({
                type: 'info',
                message: response.message
              })
              this.loading = false
              this.listaServicios()
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
          title: '¿Esta seguro de desactivar el servicio?',
          text: 'Al desactivar el servicio, se inhabilita las camas que estén registradas en el mismo y otras funciones en el sistema.',
          icon: 'warning',
          reverseButtons: true,
          showCancelButton: true,
          confirmButtonColor: '#1e88e5',
          confirmButtonText: 'Si, estoy seguro',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.loading = true
            serviciosResource.desactivar(servicio_id)
              .then(
                (response) => {
                  this.$message({
                    type: 'info',
                    message: response.message
                  })
                  this.loading = false
                  this.listaServicios()
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
    handleEliminarServicio(servicio_id) {
      Swal.fire({
        title: '¿Esta seguro de eliminar el servicio?',
        text: 'Si no se visualiza información incorrecta se recomienda editar el servicio, o desactivarlo, amenos que el servicio nunca haya sido parte del HRDC',
        icon: 'error',
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonColor: '#1e88e5',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true
          serviciosResource.destroy(servicio_id)
            .then(
              (response) => {
                this.$message({
                  type: 'info',
                  message: response.message
                })
                this.loading = false
                this.listaServicios()
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
    closeModalAgregarEditar() {
      this.modalAgregarEditar = false
      this.servicioEditar_Id = -1
      this.listaServicios()
    },
    // Visualizar y vincular camas
    openModalCamas(id, nombreServicio) {
      this.servicioVerCamas_Id = id
      this.servicioVerCamaNombre = nombreServicio
      this.$nextTick(() => {
        this.modalVicularCamaServicio = true
      })
    },
    cerrarModalCamas() {
      this.modalVicularCamaServicio = false
      this.servicioVerCamaNombre = ''
      this.servicioVerCamas_Id = -5
    }
  }
}
</script>
<style>
</style>
