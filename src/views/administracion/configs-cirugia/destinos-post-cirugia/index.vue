<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <h3 class="card-header">DESTINOS POST-CIRUGIA</h3>
      </div>
      <div style="position: relative;height: calc(100vh - 210px)">
        <el-row :gutter="10">
          <el-input
            v-model="listQuery.keyword"
            placeholder="Buscar"
            style="width: 300px"
            class="filter-item"
            clearable
            @clear="listaDestinosPostCirugia"
          />
          <el-button
            class="filter-item"
            type="primary"
            style="margin-left: 10px"
            icon="el-icon-search"
            @click="listaDestinosPostCirugia"
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
                label="Destino Post-Cirugia"
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
              @pagination="listaDestinosPostCirugia"
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
      <agregar-editar-destino-post-cirugia :destino-post-cirugia-id="destinoPostCirugia_Id" @close="closeModalAgregarEditar" />
    </el-dialog>
  </div>
</template>

<script>
// Utilidades
import { debounce } from '@/utils'
import Swal from 'sweetalert2'
// Resource
import DestinoPostCirugiaResource from '@/api/destino-post-cirugia'
const destinoPostCirugiaResource = new DestinoPostCirugiaResource()
// Componentes
import AgregarEditarDestinoPostCirugia from './components/agregar_editar'
import Paginator from '@/components/Pagination'
// Resource
export default {
  name: 'ConfigDestinosPostCirugia',
  components: { AgregarEditarDestinoPostCirugia, Paginator },
  data() {
    return {
      data: [],
      tituloModalAgregarEditar: '',
      modalAgregarEditar: false,
      widthModal: '40%',
      listQuery: {
        total: 0,
        page: 1,
        limit: 14,
        keyword: ''
      },
      loading: false,
      destinoPostCirugia_Id: -1
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      const windowWidth = document.documentElement.clientWidth
      if (windowWidth < 768) {
        this.widthModal = '90%'
      } else {
        this.widthModal = '40%'
      }
    })
    window.addEventListener('resize', this.__resizeHandler)
    this.listaDestinosPostCirugia()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    listaDestinosPostCirugia() {
      this.loading = true
      destinoPostCirugiaResource.list(this.listQuery)
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
      this.tituloModalAgregarEditar = 'REGISTRAR DESTINO POST-CIRUGIA'
      this.destinoPostCirugia_Id = -5
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
        this.handleCambiarEstadoDestinoPostCirugia(id, false)
      }
      if (command === 'ACTIVAR') {
        this.handleCambiarEstadoDestinoPostCirugia(id, true)
      }
      if (command === 'ELIMINAR') {
        this.handleEliminarDestinoPostCirugia(id)
      }
    },
    handleCambiarEstadoDestinoPostCirugia(destinoPostCirugiaId, activar) {
      if (activar) {
        this.loading = true
        destinoPostCirugiaResource.cambiarEstado(destinoPostCirugiaId)
          .then(
            (response) => {
              this.$message({
                type: 'info',
                message: response.message
              })
              this.loading = false
              this.listaDestinosPostCirugia()
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
          title: '¿Esta seguro de desactivar destino post-cirugia?',
          text: 'El destino post-cirugia no podrá volver a usarse, hasta ser activado',
          icon: 'warning',
          reverseButtons: true,
          showCancelButton: true,
          confirmButtonColor: '#1e88e5',
          confirmButtonText: 'Si, estoy seguro',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.loading = true
            destinoPostCirugiaResource.cambiarEstado(destinoPostCirugiaId)
              .then(
                (response) => {
                  this.$message({
                    type: 'info',
                    message: response.message
                  })
                  this.loading = false
                  this.listaDestinosPostCirugia()
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
    handleEliminarDestinoPostCirugia(destinoPostCirugiaId) {
      Swal.fire({
        title: '¿Esta seguro de eliminar destino post-cirugia?',
        text: 'Si no se visualiza información incorrecta se recomienda editar la destino post-cirugia, o desactivarlo.',
        icon: 'error',
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonColor: '#1e88e5',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true
          destinoPostCirugiaResource.destroy(destinoPostCirugiaId)
            .then(
              (response) => {
                this.$message({
                  type: 'info',
                  message: response.message
                })
                this.loading = false
                this.listaDestinosPostCirugia()
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
    abrirModalEditar(destinoPostCirugiaId) {
      this.tituloModalAgregarEditar = 'EDITAR DESTINO POST-CIRUGIA'
      this.destinoPostCirugia_Id = destinoPostCirugiaId
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    closeModalAgregarEditar() {
      this.modalAgregarEditar = false
      this.tituloModalAgregarEditar = ''
      this.destinoPostCirugia_Id = -5
      this.listaDestinosPostCirugia()
    }
  }
}
</script>
