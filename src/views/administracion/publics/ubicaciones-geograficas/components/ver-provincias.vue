<template>
  <div class="app-container">
    <el-card>
      <div style="position: relative;height: calc(100vh - 210px)">
        <el-row :gutter="10">
          <el-input
            v-model="listQuery.keyword"
            placeholder="Buscar"
            style="width: 300px"
            class="filter-item"
            clearable
            @clear="listaProvincias"
          />
          <el-button
            class="filter-item"
            type="primary"
            style="margin-left: 10px"
            icon="el-icon-search"
            @click="listaProvincias"
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
                label="PROVINCIA"
                min-width="500"
              />
              <el-table-column
                prop="distritos_count"
                label="NRO DISTRITOS"
                min-width="150"
              />
              <el-table-column
                header-align="center"
                align="center"
                label="DISTRITOS"
                width="250"
              >
                <template slot-scope="scope">
                  <el-button type="" icon="el-icon-view" plain @click="abrirModalVerDistritos(scope.row)">DISTRITOS</el-button>
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
              @pagination="listaProvincias"
            />
          </el-col>
          <el-col :span="24">
            <el-row :gutter="10" type="flex" justify="center">
              <el-button type="primary" plain @click="close">Cerrar</el-button>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- Dialogo para editar o Crear un servicio -->
    <el-dialog
      :title="tituloModalAgregarEditar"
      :visible.sync="modalAgregarEditar"
      append-to-body
      :width="widthModal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <!-- :before-close="dialogBeforeClose" -->
      <agregar-editar-provincia :provincia-editar-id="provinciaEditar_Id" :region-id="regionId" @close="closeModalAgregarEditar" />
    </el-dialog>
    <!-- Modal ver Distritos -->
    <el-dialog
      :title="tituloModalVerDistritos"
      :visible.sync="modalVerDistritos"
      append-to-body
      :width="widthModalVerDistritos"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="2vh"
    >
      <ver-distritos :provincia-id="provinciaVerDistritosId" @close="closeVerDistritos" />
    </el-dialog>
  </div>
</template>

<script>
// Utilidades
import { debounce } from '@/utils'
import Swal from 'sweetalert2'
// Resource
import ProvinciasResource from '@/api/provincias'
const provinciasResource = new ProvinciasResource()
// Componentes
import AgregarEditarProvincia from './agregar_editar_provincia'
import VerDistritos from './ver-distritos'
import Paginator from '@/components/Pagination'
// Resource
export default {
  name: 'VerProvincias',
  components: { AgregarEditarProvincia, VerDistritos, Paginator },
  props: {
    regionId: {
      required: true,
      type: Number
    }
  },
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
        keyword: '',
        regionId: -1
      },
      loading: false,
      provinciaEditar_Id: -1,
      tituloModalVerDistritos: '',
      modalVerDistritos: false,
      provinciaVerDistritosId: -1,
      widthModalVerDistritos: '80%'
    }
  },
  watch: {
    regionId(newVal, oldVal) {
      if (newVal !== oldVal && newVal > 0) {
        this.loadData()
      }
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      const windowWidth = document.documentElement.clientWidth
      if (windowWidth < 768) {
        this.widthModal = '90%'
        this.widthModalVerDistritos = '90%'
      } else {
        this.widthModal = '40%'
        this.widthModalVerDistritos = '80%'
      }
    })
    window.addEventListener('resize', this.__resizeHandler)
    this.loadData()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    loadData() {
      this.listQuery.regionId = this.regionId
      this.listaProvincias()
    },
    listaProvincias() {
      this.loading = true
      provinciasResource.list(this.listQuery)
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
      this.tituloModalAgregarEditar = 'REGISTRAR PROVINCIA'
      this.provinciaEditar_Id = -5
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
        this.handleEliminarProvincia(id)
      }
    },
    handleEliminarProvincia(regionId) {
      Swal.fire({
        title: '¿Está seguro de eliminar la provincia?',
        text: 'Si no se visualiza la información correcta se recomienda editar la provincia, o desactivarla.',
        icon: 'error',
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonColor: '#1e88e5',
        confirmButtonText: 'Sí, estoy seguro',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true
          provinciasResource.destroy(regionId)
            .then(
              (response) => {
                this.$message({
                  type: response.type,
                  message: response.message
                })
                this.loading = false
                this.listaProvincias()
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
      this.tituloModalAgregarEditar = 'EDITAR PROVINCIA'
      this.provinciaEditar_Id = regionId
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    closeModalAgregarEditar() {
      this.modalAgregarEditar = false
      this.tituloModalAgregarEditar = ''
      this.provinciaEditar_Id = -5
      this.listaProvincias()
    },
    close() {
      this.listQuery.regionId = -1
      this.$emit('close')
    },
    abrirModalVerDistritos({ id, nombre }) {
      this.tituloModalVerDistritos = 'VER DISTRITOS DE ' + nombre
      this.modalVerDistritos = true
      this.provinciaVerDistritosId = id
    },
    closeVerDistritos() {
      this.modalVerDistritos = false
      this.$nextTick(() => {
        this.tituloModalVerDistritos = ''
        this.provinciaVerDistritosId = -5
        this.loadData()
      })
    }
  }
}
</script>
