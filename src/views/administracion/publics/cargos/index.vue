<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <h3 class="card-header">CARGOS</h3>
      </div>
      <div style="position: relative; height: calc(100vh - 210px)">
        <el-row :gutter="10">
          <el-input
            v-model="listQuery.keyword"
            placeholder="Buscar"
            style="width: 300px"
            class="filter-item"
            clearable
            @clear="listaCargos"
            @keyup.enter.native="listaCargos"
          />
          <el-button
            class="filter-item"
            type="primary"
            style="margin-left: 10px"
            icon="el-icon-search"
            @click="listaCargos"
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
                label="NOMBRE CARGO"
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
              @pagination="listaCargos"
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
      <agregar-editar-cargo
        :cargo-id="cargoEditar_Id"
        @close="closeModalAgregarEditar"
      />
    </el-dialog>
  </div>
</template>

<script>
// Utilidades
import { debounce } from '@/utils'
// Componentes
import AgregarEditarCargo from './components/agregar_editar'
import Paginator from '@/components/Pagination'
// Resource
import CargosResource from '@/api/cargos'
import Swal from 'sweetalert2'
const cargosResource = new CargosResource()
// const cargosResource = new cargosResource()
export default {
  name: 'Cargos',
  components: { AgregarEditarCargo, Paginator },
  data() {
    return {
      loading: false,
      data: [],
      tituloModalAgregarEditar: '',
      modalAgregarEditar: false,
      widthModal: '40%',
      parametros: '',
      listQuery: {
        total: 0,
        page: 1,
        limit: 14,
        keyword: ''
      },
      cargoEditar_Id: -1
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
    this.listaCargos()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    listaCargos() {
      this.loading = true
      cargosResource
        .list(this.listQuery)
        .then((response) => {
          const { data, meta } = response
          this.data = data
          this.listQuery.total = meta.total
          this.loading = false
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    abrirModalAgregar() {
      this.tituloModalAgregarEditar = 'REGISTRAR CARGO'
      this.cargoEditar_Id = -5
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
        this.handleDesactivarCargo(id, false)
      }
      if (command === 'ACTIVAR') {
        this.handleDesactivarCargo(id, true)
      }
      if (command === 'ELIMINAR') {
        this.handleEliminarCargo(id)
      }
    },
    handleDesactivarCargo(cargo_id, activar) {
      if (activar) {
        this.loading = true
        cargosResource
          .desactivar(cargo_id)
          .then((response) => {
            this.$message({
              type: 'info',
              message: response.message
            })
            this.loading = false
            this.listaCargos()
          })
          .catch((error) => {
            console.log(error)
            this.loading = false
          })
      } else {
        Swal.fire({
          title: '¿Está seguro de desactivar El Cárgo?',
          text: 'El Área no podrá volver a usarse, hasta ser activada',
          icon: 'warning',
          reverseButtons: true,
          showCancelButton: true,
          confirmButtonColor: '#1e88e5',
          confirmButtonText: 'Sí, estoy seguro',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.loading = true
            cargosResource
              .desactivar(cargo_id)
              .then((response) => {
                this.$message({
                  type: 'info',
                  message: response.message
                })
                this.loading = false
                this.listaCargos()
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
    handleEliminarCargo(cargo_id) {
      Swal.fire({
        title: '¿Está seguro de eliminar la Cargo?',
        text: 'Realizar esta acción si es estrictamente necesario, si la Cargo está obsoleta solo debe desactivarla',
        icon: 'error',
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonColor: '#1e88e5',
        confirmButtonText: 'Sí, estoy seguro',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true
          cargosResource
            .destroy(cargo_id)
            .then((response) => {
              this.$message({
                type: 'info',
                message: response.message
              })
              this.loading = false
              this.listaCargos()
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
    abrirModalEditar(cargoId) {
      this.tituloModalAgregarEditar = 'EDITAR CARGO'
      this.cargoEditar_Id = cargoId
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    closeModalAgregarEditar() {
      this.modalAgregarEditar = false
      this.cargoEditar_Id = -1
      this.listaCargos()
    }
  }
}
</script>
