<template>
  <div class="app-container">
    <el-card v-if="checkPermission(['roles.listar'])" class="box-card border-top-primary" shadow="never">
      <div slot="header" class="box-card-header">
        <h3 class="card-header">ROLES</h3>
      </div>
      <div style="position: relative;height: calc(100vh - 210px)">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="card card-default">
              <div class="card-body">
                <div class="filter-container">
                  <el-input
                    v-model="listQuery.keybuscar"
                    placeholder="Buscar"
                    style="width: 300px"
                    class="filter-item"
                    clearable
                    @keyup.enter.native="handleBuscarDatos"
                  />
                  <el-button
                    class="filter-item"
                    type="primary"
                    icon="el-icon-search"
                    @click="handleBuscarDatos"
                  />

                  <el-button
                    v-if="checkPermission(['roles.crear'])"
                    class="filter-item"
                    style="margin-left: 10px"
                    type="primary"
                    icon="el-icon-plus"
                    @click="openFormCrearArea"
                  >
                    Agregar
                  </el-button>
                </div>

                <el-table
                  v-loading="listLoading"
                  :data="list"
                  border
                  height="calc(calc(100vh - 380px))"
                  fit
                  :row-class-name="tableRowClassName"
                  :header-row-class-name="tableHeaderRowClassName"
                >
                  <el-table-column align="center" label="Nro" width="80">
                    <template slot-scope="scope">
                      <span>{{ scope.row.index }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="Nombre">
                    <template slot-scope="scope">
                      <span>{{ scope.row.name }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="Tipo" align="center" width="110">
                    <template slot-scope="scope">
                      <span>{{ scope.row.guard_name }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column align="center" label="Permisos" width="90">
                    <template slot-scope="scope">
                      <i
                        v-permission="['roles.asignarpermisos']"
                        class="el-icon-document icon-btn-primary"
                        @click="openFormPermisos(scope.row.id)"
                      />
                    </template>
                  </el-table-column>

                  <el-table-column align="center" label="Acciones" width="100">
                    <template slot-scope="scope">
                      <i
                        v-show="scope.row.name == 'Administrador'"
                        v-permission="['roles.editar']"
                        class="el-icon-edit-outline icon-btn-primary"
                        @click="openFormEditar(scope.row.id)"
                      />

                      <i
                        v-show="scope.row.name != 'Administrador'"
                        v-permission="['roles.eliminar']"
                        class="el-icon-delete icon-btn-danger"
                        @click="
                          accionAreaEliminar(scope.row.id, scope.row.name)
                        "
                      />
                    </template>
                  </el-table-column>
                </el-table>

                <pagination
                  v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  layout="prev, pager, next"
                  @pagination="getLista"
                />

                <!-- Dialog Formulario crear -->
                <el-dialog
                  :title="'Registrar rol'"
                  :visible.sync="dialogFormVisible"
                  :close-on-click-modal="false"
                  top="5vh"
                  width="85%"
                >
                  <div v-loading="creandoRol" class="form-container py-3">
                    <el-form
                      ref="areaFormCrear"
                      :rules="reglasValidacion"
                      :model="nuevoRol"
                      label-position="left"
                      label-width="150px"
                      style="width: 100%"
                    >
                      <el-form-item label="Nombre" prop="name">
                        <el-input ref="nombre" v-model="nuevoRol.name" />
                      </el-form-item>

                      <el-form-item label="Tipo" prop="guard_name">
                        <el-input v-model="nuevoRol.guard_name" readonly />
                      </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <el-row type="flex" class="row-bg" justify="end">
                        <el-button @click="dialogFormVisible = false">
                          Cancelar
                        </el-button>
                        <el-button
                          type="primary"
                          @click="guardarRolFormCrear()"
                        >
                          Guardar
                        </el-button>
                      </el-row>
                    </div>
                  </div>
                </el-dialog>

                <!-- Dialog Formulario editar -->
                <el-dialog
                  :title="'Modificar datos de rol'"
                  :visible.sync="dialogFormEditarVisible"
                  :close-on-click-modal="false"
                  top="5vh"
                  width="85%"
                >
                  <div v-loading="creandoRol" class="form-container py-3">
                    <el-form
                      ref="rolFormEditar"
                      :rules="reglasValidacion"
                      :model="rolActual"
                      label-position="left"
                      label-width="150px"
                      style="max-width: 100%"
                    >
                      <el-form-item label="Nombre" prop="name">
                        <el-input ref="name" v-model="rolActual.name" />
                      </el-form-item>

                      <el-form-item label="Tipo" prop="guard_name">
                        <el-input v-model="rolActual.guard_name" readonly />
                      </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <el-row type="flex" class="row-bg" justify="end">
                        <el-button @click="dialogFormEditarVisible = false">
                          Cancelar
                        </el-button>
                        <el-button type="primary" @click="rolFormEditar()">
                          Guardar
                        </el-button>
                      </el-row>
                    </div>
                  </div>
                </el-dialog>

                <!-- Dialog formulario modificar permisos -->
                <el-dialog
                  :title="'Permisos para ' + rolActual.name"
                  :visible.sync="dialogFormPermisos"
                  :close-on-click-modal="false"
                  top="5vh"
                  width="90%"
                >
                  <!-- width="650px" -->
                  <div v-loading="creandoRol" class="form-container py-3">
                    <el-form
                      ref="rolFormPermisosRol"
                      :rules="reglasValidacion"
                      :model="rolActual"
                      label-position="top"
                      label-width="150px"
                      style="max-width: 100%"
                    >
                      <el-form-item>
                        <el-input
                          ref="filterTextPermiso"
                          v-model="filterTextPermiso"
                          placeholder="Buscar permiso"
                          clearable
                        />
                        <!-- class="text-filter" -->
                      </el-form-item>

                      <el-form-item>
                        <el-tree
                          ref="treePermisosRol"
                          :data="permisos"
                          show-checkbox
                          node-key="id"
                          class="permission-tree"
                          :lazy="true"
                          empty-text="Sin permisos"
                          :highlight-current="true"
                          :filter-node-method="filtrarPermiso"
                        />
                      </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <el-row type="flex" class="row-bg" justify="end">
                        <el-button @click="dialogFormPermisos = false">
                          Cancelar
                        </el-button>
                        <el-button
                          type="primary"
                          @click="guardarFormPermisos(rolActualId)"
                        >
                          Guardar
                        </el-button>
                      </el-row>
                    </div>
                  </div>
                </el-dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import RolResource from '@/api/role'
import Resource from '@/api/resource'
const rolesResource = new Resource('auth/roles')
const resourceRol = new RolResource()
import permission from '@/directive/permission' // Permission directive (v-permission)
import checkPermission from '@/utils/permission' // Permission checking

export default {
  name: 'RolesLista',
  directives: { permission },
  components: { Pagination },

  data() {
    return {
      list: [],
      permisos: [],
      permisosActuales: [],
      total: 0,
      listLoading: true,
      permissionProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      listQuery: {
        page: 1,
        limit: 14,
        keybuscar: ''
      },
      filterTextPermiso: '',
      dialogFormVisible: false,
      dialogFormEditarVisible: false,
      dialogFormPermisos: false,
      creandoRol: false,
      nuevoRol: {},
      rolActualId: 0,
      rolActual: {
        name: '',
        guard_name: ''
      },
      reglasValidacion: {
        name: [
          {
            required: true,
            message: 'El campo nombre es requerido',
            trigger: 'blur'
          }
        ],
        guard_name: [
          {
            required: true,
            message: 'El campo Guard name es requerido',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    currentRole() {
      const found = this.list.find((role) => role.id === this.rolActualId)
      if (found === undefined) {
        return { name: '', permissions: [] }
      }
      return found
    }
  },

  watch: {
    filterTextPermiso(val) {
      this.$refs.treePermisosRol.filter(val)
    }
  },
  mounted() {
  },
  created() {
    this.getLista()
  },
  methods: {
    checkPermission,
    async getLista() {
      const { limit, page } = this.listQuery
      this.listLoading = true
      const { data, meta } = await rolesResource.list(this.listQuery)
      this.list = data
      this.list.forEach((element, index) => {
        element['index'] = (page - 1) * limit + index + 1
      })
      this.total = meta.total
      this.listLoading = false
    },
    handleBuscarDatos() {
      this.listQuery.page = 1
      this.getLista()
    },
    openFormCrearArea() {
      this.resetnuevoRol()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['areaFormCrear'].clearValidate()
      })
      this.$nextTick(() => {
        this.$refs['nombre'].focus()
      })
    },

    resetnuevoRol() {
      this.nuevoRol = {
        name: '',
        guard_name: 'api'
      }
    },
    guardarRolFormCrear() {
      this.$refs['areaFormCrear'].validate((valid) => {
        if (valid) {
          this.creandoRol = true
          rolesResource
            .store(this.nuevoRol)
            .then((response) => {
              this.$message({
                message: 'Datos guardados correctamente',
                type: 'success',
                duration: 5.6 * 1000
              })
              this.resetnuevoRol()
              this.dialogFormVisible = false
              this.handleBuscarDatos() // LLamamos a la funcion filtrar datos
            })
            .catch((error) => {
              console.log(error)
            })
            .finally(() => {
              this.creandoRol = false
            })
        } else {
          console.log('Error el formulario no es valido')
          return false
        }
      })
    },
    async openFormEditar(id) {
      this.rolActualId = id
      this.creandoRol = true
      this.dialogFormEditarVisible = true
      // const found = this.list.find(area => area.id === id);
      const { data } = await rolesResource.get(id)
      this.rolActual = {
        id: data.id,
        name: data.name,
        guard_name: data.guard_name
      }
      this.creandoRol = false
      this.$nextTick(() => {
        this.$refs['rolFormEditar'].clearValidate()
      })
      this.$nextTick(() => {
        this.$refs['name'].focus()
      })
    },
    rolFormEditar() {
      this.$refs['rolFormEditar'].validate((valid) => {
        if (valid) {
          console.log('Guardando datos del area')
          this.creandoRol = true

          rolesResource
            .update(this.rolActualId, this.rolActual)
            .then((response) => {
              this.$message({
                message: 'Datos actualizados correctamente',
                type: 'success',
                duration: 5.6 * 1000
              })
              this.resetnuevoRol()
              this.dialogFormEditarVisible = false
              this.handleBuscarDatos() // LLamamos a la funcion filtrar datos
            })
            .catch((error) => {
              console.log(error)
            })
            .finally(() => {
              this.creandoRol = false
            })
        } else {
          console.log('Error el formulario no es valido')
          return false
        }
      })
    },
    accionAreaEliminar(id, nombre) {
      this.$confirm(
        'Seguro que desea eliminar el registro: ' + nombre + '?',
        'Atención',
        {
          confirmButtonText: 'Si, eliminar',
          cancelButtonText: 'Cancelar',
          type: 'warning'
        }
      )
        .then(() => {
          rolesResource
            .destroy(id)
            .then((respode) => {
              this.$message({
                type: 'success',
                message: 'Registro eliminado'
              })
              this.handleBuscarDatos()
            })
            .catch((error) => {
              console.log(error)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Operación cancelada'
          })
        })
    },

    async openFormPermisos(idrol) {
      this.permisos = []
      // this.permisosActuales = []
      this.rolActualId = idrol
      this.creandoRol = true
      this.dialogFormPermisos = true

      const found = this.list.find((permiso) => permiso.id === idrol)
      this.rolActual = {
        id: found.id,
        name: found.name,
        guard_name: found.guard_name
      }

      const { data } = await resourceRol.permissions(idrol)
      this.$nextTick(() => {
        data.permisos.forEach((permission) => {
          this.permisos.push(this.mormalizarPermiso(permission))
        })
      })

      this.$nextTick(() => {
        const permisosActuales = []
        data.permisosActuales.forEach((permission) => {
          permisosActuales.push(permission.id)
        })
        this.permisosActuales = permisosActuales
        this.$refs['treePermisosRol'].setCheckedKeys(
          JSON.parse(JSON.stringify(this.permisosActuales))
        )
      })

      this.$nextTick(() => {
        this.filterTextPermiso = ''
        this.$refs.filterTextPermiso.focus()
      })

      // console.log(this.permisosActuales)
      this.creandoRol = false
    },

    mormalizarPermiso(permission) {
      return {
        id: permission.id,
        name: permission.name,
        label: permission.name
      }
    },

    async guardarFormPermisos(idrol) {
      const permisosSelecionados = this.$refs.treePermisosRol.getCheckedKeys()
      // console.log(idrol, permisosSelecionados)

      this.creandoRol = true

      resourceRol
        .permissionsUpdate(idrol, { permisos: permisosSelecionados })
        .then((response) => {
          this.$message({
            message: 'Permisos actualizados correctamente',
            type: 'success',
            duration: 5 * 1000
          })
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.creandoRol = false
          this.dialogFormPermisos = false
          this.getLista()
        })
    },

    filtrarPermiso(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    permissionKeys(permissions) {
      return permissions.map((permssion) => permssion.id)
    },
    // Funciones para estilos
    tableRowClassName({ row, rowIndex }) {
      return 'py-2'
    },

    tableHeaderRowClassName({ row, rowIndex }) {}
  }
}
</script>

<style>
.el-tree {
  padding-left: 10px;
}

.el-tree-node__expand-icon.expanded,
.el-tree-node__content > .el-tree-node__expand-icon {
  display: none;
}

.text-filter {
  margin-bottom: 7px;
}
</style>
