<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <h3 class="card-header">VINCULO LABORAL</h3>
      </div>
      <div style="position: relative; height: calc(100vh - 210px)">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :md="12" :lg="8">
            <el-input
              v-model="listQuery.keyword"
              placeholder="Buscar"
              style="margin: 5px 0px; width: 100%"
              class="filter-item"
              clearable
              @clear="listaVinculoLaboral"
              @keyup.enter.native="listaVinculoLaboral"
            />
          </el-col>
          <el-col :xs="24" :sm="24" :md="4" :lg="2">
            <el-button
              class="filter-item"
              type="primary"
              style="margin: 5px 0px; width: 100%"
              icon="el-icon-search"
              @click="listaVinculoLaboral"
            />
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" :lg="8">
            <el-button
              class="filter-item"
              style="margin: 5px 0px; width: 100%"
              type="primary"
              icon="el-icon-plus"
              @click="abrirModalAgregarPersonaVinculoLaboral"
            >
              Agregar Persona + Vinculo Laboral + Esp
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
                min-width="250"
              />
              <!-- <el-table-column prop="area" label="AREA" min-width="150" />
              <el-table-column prop="cargo" label="CARGO" min-width="150" /> -->
              <el-table-column
                prop="tipopersonal"
                label="TIPO PERSONAL"
                min-width="141"
              />
              <el-table-column
                header-align="center"
                align="center"
                label="ESPECIALIDADES"
                min-width="250"
              >
                <template slot-scope="scope">
                  <div>
                    <el-button
                      v-if="scope.row.tipopersonal === 'ASISTENCIAL'"
                      type="info"
                      plain
                      @click="
                        openModalEspecialidades(
                          scope.row.persona_id,
                          scope.row.nombre_completo
                        )
                      "
                    >
                      <svg-icon
                        :key="scope.row.id"
                        icon-class="custom-lista-camas"
                        class-name="customIcon"
                      />
                    </el-button>
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column
                prop="fecha_inicio"
                label="FECHA INICIO"
                min-width="250"
              />
              <el-table-column
                prop="fecha_fin"
                label="FECHA FIN"
                min-width="250"
              /> -->
              <el-table-column
                header-align="center"
                align="center"
                label="VINCULO LABORAL"
                min-width="150"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.vinculolaboral == null"
                    type="info"
                    icon="el-icon-plus"
                    plain
                    @click="abriModalAgregarVinculoLaboral(scope.row)"
                  >CREAR</el-button>
                  <el-button
                    v-else
                    type="primary"
                    icon="el-icon-view"
                    plain
                    @click="abrirModalDetalleVinculoLaboral(scope.row)"
                  >VER</el-button>
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
                  <el-dropdown
                    v-if="scope.row.vinculolaboral"
                    trigger="click"
                    @command="handleCommand"
                  >
                    <el-button type="text" size="mini">
                      OPCIONES<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        :command="{
                          command: 'EDITAR',
                          id: scope.row.vinculolaboral,
                        }"
                        icon="el-icon-edit"
                      >Editar</el-dropdown-item>
                      <el-dropdown-item
                        :command="{
                          command: 'ELIMINAR',
                          id: scope.row.vinculolaboral,
                        }"
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
              @pagination="listaVinculoLaboral"
            />
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- Modal Agregar o Editar Vinculo LAboral -->
    <el-dialog
      :title="tituloModalAgregarEditar"
      :visible.sync="modalAgregarEditar"
      :width="widthModal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <agregar-editar-vinculo-laboral
        :vinculo-laboral-id="VinculoLaboralEditar_id"
        :vinculo-id="personaCrearVinculo_Id"
        @close="cerrarModalAgregarEditarVinculoLaboral"
      />
    </el-dialog>
    <!-- Modal Agregar Persona + Vinculo LAboral -->
    <el-dialog
      :title="tituloModalAgregarEditar"
      :visible.sync="modalAgregarPersonaVinculoLaboral"
      :width="widthModal"
      top="2vh"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <!-- <agregar-persona-vinculo-laboral :vinculo-laboral-id="VinculoLaboralEditar_id" @click="cerrarModalAgregarPersonaVinculoLaboral" @close="cerrarModalAgregarPersonaVinculoLaboral" /> -->
      <seleccionar-persona
        :vinculo-laboral-id="VinculoLaboralEditar_id"
        @close="vinculocancelado"
      />
    </el-dialog>
    <!-- Modal detalle historia clinica -->
    <el-dialog
      title="VINCULO LABORAL"
      :visible.sync="modalVerDetalleVinculoLaboral"
      fullscreen
    >
      <detalle-vinculo-laboral
        :vinculo-laboral-id="vinculoLaboralVerDetalleId"
        @close="cerrarModalDetalleVinculoLaboral"
      />
    </el-dialog>
    <!-- Modal vincular camas-->
    <el-dialog
      :title="'ESPECIALIDADES '"
      :visible.sync="modalVicularEspecialidades"
      :width="widthModal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <listar-especialidades
        :persona-id="personaVerEspecialidad_Id"
        @close="cerrarModalEspecialidades"
      />
    </el-dialog>
  </div>
</template>

<script>
// utils
import { debounce } from '@/utils'
import Swal from 'sweetalert2'
// Resource
// import HistoriasClinicasResource from '@/api/historiasclinicas'
// const historiasClinicasResource = new HistoriasClinicasResource()
// Resource Vinculo LAboral
import ListarEspecialidades from './components/vincular_especialidades'
import VinculoLaboralResource from '@/api/vinculolaboral'
const vinculoLaboralResource = new VinculoLaboralResource()
// @note components
// import AgregarEditarVinculoLaboral from './components/agregar_editar'
import SeleccionarPersona from './components/seleccionar_persona'
// import AgregarPersonaVinculoLaboral from './components/agregar_persona_Vinculo_laboral'
import DetalleVinculoLaboral from './components/detalle_vinculolaboral'
import Paginator from '@/components/Pagination'

export default {
  name: 'HistoriasClinicas',
  components: {
    DetalleVinculoLaboral,
    SeleccionarPersona,
    Paginator,
    ListarEspecialidades
  },
  data() {
    return {
      modalVicularEspecialidades: false,
      personaVerEspecialidad_Id: -3,
      defaulValue: -5,
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
      VinculoLaboralEditar_id: -1,
      personaCrearVinculo_Id: -1,
      // modal persona + historia clinica
      modalAgregarPersonaVinculoLaboral: false,
      // modal ver detalle historia clinica
      modalVerDetalleVinculoLaboral: false,
      vinculoLaboralVerDetalleId: -1
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
    this.listaVinculoLaboral()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    listaVinculoLaboral() {
      this.loading = true
      vinculoLaboralResource
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
    abriModalAgregarVinculoLaboral({ persona_id }) {
      this.tituloModalAgregarEditar = 'AGREGAR VINCULO LABORAL'
      this.personaCrearVinculo_Id = persona_id
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
        this.handleEliminarVinculoLaboral(id)
      }
    },
    abrirModalEditar(vinculo_laboral_id) {
      this.tituloModalAgregarEditar = 'EDITAR VINCULO LABORAL'
      this.VinculoLaboralEditar_id = vinculo_laboral_id
      this.$nextTick(() => {
        this.modalAgregarPersonaVinculoLaboral = true
      })
    },
    handleEliminarVinculoLaboral(vinculo_laboral_id) {
      Swal.fire({
        title: '¿Esta seguro de eliminar Vinculo Laboral?',
        text: 'Si se visualiza información incorrecta se recomienda editar Vinculo Laboral',
        icon: 'error',
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonColor: '#1e88e5',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true
          vinculoLaboralResource
            .destroy(vinculo_laboral_id)
            .then((response) => {
              this.$message({
                type: 'info',
                message: response.message
              })
              this.loading = false
              this.listaVinculoLaboral()
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
    cerrarModalAgregarEditarVinculoLaboral() {
      this.modalAgregarEditar = false
      this.VinculoLaboralEditar_id = -5
      this.tituloModalAgregarEditar = ''
      this.listaVinculoLaboral()
    },
    // Modal agregar persona mas  historia clinca
    abrirModalAgregarPersonaVinculoLaboral() {
      this.VinculoLaboralEditar_id = -3
      this.modalAgregarPersonaVinculoLaboral = true
      this.tituloModalAgregarEditar = 'AGREGAR VINCULO LABORAL'
    },
    cerrarModalAgregarPersonaVinculoLaboral() {
      this.modalAgregarPersonaVinculoLaboral = false
      this.listaVinculoLaboral()
    },
    abrirModalDetalleVinculoLaboral({ vinculolaboral }) {
      this.vinculoLaboralVerDetalleId = vinculolaboral
      this.$nextTick(() => {
        this.modalVerDetalleVinculoLaboral = true
      })
    },
    cerrarModalDetalleVinculoLaboral() {
      this.modalVerDetalleVinculoLaboral = false
      this.$nextTick(() => {
        this.vinculoLaboralVerDetalleId = -5
      })
    },
    // para que cuando edite nuevamente el mismo registro setee a id negativo
    vinculocancelado() {
      this.modalAgregarPersonaVinculoLaboral = false
      this.tituloModalAgregarEditar = ''
      this.$nextTick(() => {
        this.VinculoLaboralEditar_id = -3
      })
      this.listaVinculoLaboral()
    },
    // Visualizar y vincular camas
    openModalEspecialidades(id, nombrePersona) {
      this.personaVerEspecialidad_Id = id
      this.areaVerCamaNombre = nombrePersona
      // console.log(this.personaVerEspecialidad_Id)
      this.$nextTick(() => {
        this.modalVicularEspecialidades = true
      })
    },
    cerrarModalEspecialidades() {
      this.modalVicularEspecialidades = false
      this.areaVerCamaNombre = ''
      this.personaVerEspecialidad_Id = -5
    }
  }
}
</script>
