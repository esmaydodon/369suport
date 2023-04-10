<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <h3 class="card-header">ÁREAS</h3>
      </div>
      <div style="position: relative; height: calc(100vh - 210px)">
        <el-row :gutter="10">
          <el-input
            v-model="listQuery.keyword"
            placeholder="Buscar"
            style="width: 300px"
            class="filter-item"
            clearable
            @clear="listaAreas"
            @keyup.enter.native="listaAreas"
          />
          <el-button
            class="filter-item"
            type="primary"
            style="margin-left: 10px"
            icon="el-icon-search"
            @click="listaAreas"
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
                align="center"
                type="index"
                label="#"
                width="100"
              />
              <el-table-column
                prop="nombre"
                label="NOMBRE AREA"
                min-width="150"
              />
              <el-table-column
                prop="abreviatura"
                label="ABREVIATURA"
                min-width="400"
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
                label="SERVICIO"
              >
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.servicio" />
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
                      <el-dropdown-item
                        :command="{ command: 'EDITAR', id: scope.row.id }"
                        icon="el-icon-edit"
                      >Editar</el-dropdown-item>
                      <el-dropdown-item
                        v-if="scope.row.activo == true"
                        :command="{ command: 'DESACTIVAR', id: scope.row.id }"
                        icon="el-icon-remove"
                      >Desactivar</el-dropdown-item>
                      <el-dropdown-item
                        v-else
                        :command="{ command: 'ACTIVAR', id: scope.row.id }"
                        icon="el-icon-circle-plus"
                      >ACTIVAR</el-dropdown-item>
                      <el-dropdown-item
                        :command="{ command: 'ELIMINAR', id: scope.row.id }"
                        icon="el-icon-delete-solid"
                      >Eliminar</el-dropdown-item>
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
              @pagination="listaAreas"
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
      <agregar-editar-area
        :area-id="areaEditar_Id"
        @close="closeModalAgregarEditar"
      />
    </el-dialog>
    <!-- Modal vincular camas-->
    <el-dialog
      :title="'CAMAS DEL AREA: ' + areaVerCamaNombre"
      :visible.sync="modalVicularCamaArea"
      :width="widthModal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <listar-vincular-camas-area :area-id="areaVerCamas_Id" @close="cerrarModalCamas" />
    </el-dialog>
  </div>
</template>

<script>
// Utilidades
import { debounce } from '@/utils'
// Componentes
import AgregarEditarArea from './components/agregar_editar'
import ListarVincularCamasArea from './components/vincular_cama'
import Paginator from '@/components/Pagination'
// Resource
import AreasResource from '@/api/areas'
import Swal from 'sweetalert2'
const areasResource = new AreasResource()
// const areasResource = new AreasResource()
export default {
  name: 'Areas',
  components: { AgregarEditarArea, ListarVincularCamasArea, Paginator },
  data() {
    return {
      loading: false,
      data: [
        {
          id: null,
          nombre: '',
          servicio: null,
          abreviatura: '',
          activo:	true,
          area_padre_id: null
        }
      ],
      tituloModalAgregarEditar: '',
      modalVicularCamaArea: false,
      modalAgregarEditar: false,
      areaVerCamas_Id: -1,
      widthModal: '40%',
      parametros: '',
      listQuery: {
        total: 0,
        page: 1,
        limit: 14,
        keyword: ''
      },
      areaEditar_Id: -1,
      areaVerCamaNombre: ''
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
    this.listaAreas()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    listaAreas() {
      this.loading = true
      areasResource
        .list(this.listQuery)
        .then((response) => {
          const { data, meta } = response
          this.data = data
          // if (this.data.servicio === 0) {
          //   this.data.servicio = false
          //   console.log(this.data.servicio)
          // } else {
          //   this.data.servicio = true
          //   console.log(this.data.servicio)
          // }
          // // console.log(this.data)
          this.listQuery.total = meta.total
          this.loading = false
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    abrirModalAgregar() {
      this.tituloModalAgregarEditar = 'REGISTRAR AREA'
      this.areaEditar_Id = -5
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
        this.handleDesactivarArea(id, false)
      }
      if (command === 'ACTIVAR') {
        this.handleDesactivarArea(id, true)
      }
      if (command === 'ELIMINAR') {
        this.handleEliminarArea(id)
      }
    },
    handleDesactivarArea(area_id, activar) {
      if (activar) {
        this.loading = true
        areasResource
          .desactivar(area_id)
          .then((response) => {
            this.$message({
              type: 'info',
              message: response.message
            })
            this.loading = false
            this.listaAreas()
          })
          .catch((error) => {
            console.log(error)
            this.loading = false
          })
      } else {
        Swal.fire({
          title: '¿Esta seguro de desactivar El Área?',
          text: 'Al desactivar el área, se inhabilita las camas que estén registradas en el mismo y otras funciones en el sistema.',
          icon: 'warning',
          reverseButtons: true,
          showCancelButton: true,
          confirmButtonColor: '#1e88e5',
          confirmButtonText: 'Si, estoy seguro',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.loading = true
            areasResource
              .desactivar(area_id)
              .then((response) => {
                this.$message({
                  type: 'info',
                  message: response.message
                })
                this.loading = false
                this.listaAreas()
              })
              .catch((error) => {
                console.log(error)
                this.loading = false
              })
          } else {
            this.loading = false
          }
        })
      }
    },
    handleEliminarArea(area_id) {
      Swal.fire({
        title: '¿Esta seguro de eliminar la area?',
        text: 'Realizar esta acción si es estrictamente necesario, si la area está obsoleta solo debe desactivarla',
        icon: 'error',
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonColor: '#1e88e5',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true
          areasResource
            .destroy(area_id)
            .then((response) => {
              this.$message({
                type: 'info',
                message: response.message
              })
              this.loading = false
              this.listaAreas()
            })
            .catch((error) => {
              console.log(error)
              this.loading = false
            })
        } else {
          this.loading = false
        }
      })
    },
    abrirModalEditar(areaId) {
      this.tituloModalAgregarEditar = 'EDITAR AREA'
      this.areaEditar_Id = areaId
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    closeModalAgregarEditar() {
      this.modalAgregarEditar = false
      this.areaEditar_Id = -1
      this.listaAreas()
    },
    // Visualizar y vincular camas
    openModalCamas(id, nombreArea) {
      this.areaVerCamas_Id = id
      this.areaVerCamaNombre = nombreArea
      this.$nextTick(() => {
        this.modalVicularCamaArea = true
      })
    },
    cerrarModalCamas() {
      this.modalVicularCamaArea = false
      this.areaVerCamaNombre = ''
      this.areaVerCamas_Id = -5
    }
  }
}
</script>
