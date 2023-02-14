<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <h3 class="card-header">REGIONES</h3>
      </div>
      <div style="position: relative;height: calc(100vh - 210px)">
        <el-row :gutter="10">
          <el-input
            v-model="listQuery.keyword"
            placeholder="Buscar"
            style="width: 300px"
            class="filter-item"
            clearable
            @clear="listaRegiones"
          />
          <el-button
            class="filter-item"
            type="primary"
            style="margin-left: 10px"
            icon="el-icon-search"
            @click="listaRegiones"
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
              height="calc(calc(100vh - 350px))"
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
                label="REGION"
                min-width="500"
              />
              <el-table-column
                prop="provincias_count"
                label="NRO PROVINCIAS"
                min-width="150"
              />
              <el-table-column
                header-align="center"
                align="center"
                label="PROVINCIAS"
                width="250"
              >
                <template slot-scope="scope">
                  <el-button type="" icon="el-icon-view" plain @click="abrirModalVerProvincias(scope.row)">PROVINCIAS</el-button>
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
              @pagination="listaRegiones"
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
      <agregar-editar-region :region-id="regionEditar_Id" @close="closeModalAgregarEditar" />
    </el-dialog>
    <!-- Modal ver provincias -->
    <el-dialog
      :title="tituloModalVerProvincias"
      :visible.sync="modalVerProvincias"
      :width="widthModalVerProvincias"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="2vh"
    >
      <ver-provincias :region-id="regionVerProvinciasId" @close="closeVerProvincias" />
    </el-dialog>
  </div>
</template>

<script>
// Utilidades
import { debounce } from '@/utils'
import Swal from 'sweetalert2'
// Resource
import RegionesResource from '@/api/regiones'
const regionesResource = new RegionesResource()
// Componentes
import AgregarEditarRegion from './components/agregar_editar'
import VerProvincias from './components/ver-provincias'
import Paginator from '@/components/Pagination'
// Resource
export default {
  name: 'ConfigRegion',
  components: { AgregarEditarRegion, VerProvincias, Paginator },
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
      regionEditar_Id: -1,
      tituloModalVerProvincias: '',
      modalVerProvincias: false,
      regionVerProvinciasId: -1,
      widthModalVerProvincias: '80%'
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      const windowWidth = document.documentElement.clientWidth
      if (windowWidth < 768) {
        this.widthModal = '90%'
        this.widthModalVerProvincias = '90%'
      } else {
        this.widthModal = '40%'
        this.widthModalVerProvincias = '80%'
      }
    })
    window.addEventListener('resize', this.__resizeHandler)
    this.listaRegiones()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    listaRegiones() {
      this.loading = true
      regionesResource.list(this.listQuery)
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
      this.tituloModalAgregarEditar = 'REGISTRAR DESTINO REGION'
      this.regionEditar_Id = -5
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    handleCommand({ command, id }) {
      if (command === 'EDITAR') {
        this.abrirModalEditar(id)
      }
      if (command === 'ELIMINAR') {
        this.handleEliminarRegion(id)
      }
    },
    handleEliminarRegion(regionId) {
      Swal.fire({
        title: '¿Esta seguro de eliminar la region?',
        text: 'Si no se visualiza información incorrecta se recomienda editar la region, o desactivarla.',
        icon: 'error',
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonColor: '#1e88e5',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true
          regionesResource.destroy(regionId)
            .then(
              (response) => {
                this.$message({
                  type: response.type,
                  message: response.message
                })
                this.loading = false
                this.listaRegiones()
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
    abrirModalEditar(regionId) {
      this.tituloModalAgregarEditar = 'EDITAR REGION'
      this.regionEditar_Id = regionId
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    closeModalAgregarEditar() {
      this.modalAgregarEditar = false
      this.tituloModalAgregarEditar = ''
      this.regionEditar_Id = -5
      this.listaRegiones()
    },
    abrirModalVerProvincias({ id, nombre }) {
      this.tituloModalVerProvincias = 'VER PROVINCIAS DE ' + nombre
      this.modalVerProvincias = true
      this.regionVerProvinciasId = id
    },
    closeVerProvincias() {
      this.modalVerProvincias = false
      this.$nextTick(() => {
        this.tituloModalVerProvincias = ''
        this.regionVerProvinciasId = -5
        this.listaRegiones()
      })
    }
  }
}
</script>
