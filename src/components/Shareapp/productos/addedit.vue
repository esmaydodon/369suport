<template>
  <div>
    <el-form ref="formCreateEditProducto" v-loading="loading" :model="modelo" :rules="reglas" label-position="top">
      <!-- <el-button @click="handleGetDataTienda()">
        Actualizar tienda
      </el-button>
      <el-button @click="getDataProducto()">
        Actualizar producto
      </el-button> -->
      <!-- Datos generales del producto -->
      <el-row :gutter="10" class="py-3">
        <el-col :xs="24" :sm="8">
          <el-form-item label="RUC" prop="ruc">
            <div class="el-input__inner">
              {{ modelo.ruc }}
            </div>
            <!-- <el-input v-model="modelo.ruc" placeholder="RUC" /> -->
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="16">
          <el-form-item label="RAZON SOCIAL" prop="razonsocial">
            <!-- <el-input v-model="modelo.razonsocial" placeholder="Razón social" /> -->
            <div class="el-input__inner">
              {{ modelo.razonsocial }}
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="CATEGORIA" prop="categoria_id">
            <el-select v-model="modelo.categoria_id" style="width: 100%" clearable>
              <el-option
                v-for="item in listaCategorias"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Nombre" prop="nombre">
            <el-input v-model="modelo.nombre" placeholder="Nombre" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Precio" prop="precio">
            <el-input-number v-model="modelo.precio" :precision="2" style="width: 100%" placeholder="Precio" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="Descripción" prop="descripcion">
            <el-input
              v-model="modelo.descripcion"
              type="textarea"
              :rows="3"
              style="width: 100%"
              placeholder="Descripción"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="Descripción" prop="descripcion">
            <el-upload
              ref="upload"
              name="fileUpload"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :file-list="modelo.fotos"
            >
              <i slot="default" class="el-icon-plus" />
              <div slot="file" slot-scope="{file}">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt="Imagen"
                >
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in" />
                  </span>
                  <!-- <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleDownload(file)"
                  >
                    <i class="el-icon-download" />
                  </span> -->
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete" />
                  </span>
                </span>
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" type="flex" justify="center">
        <el-button type="primary" plain @click="close">Cancelar</el-button>
        <el-button v-if="modelo.id === 'undefined' || modelo.id <= 0" type="primary" @click="submitForm">
          Guardar
        </el-button>
        <el-button v-if="modelo.id > 0" type="primary" @click="submitForm">
          Actualizar
        </el-button>
        <el-button v-if="modelo.id > 0" type="danger" @click="deleteProducto">
          Eliminar
        </el-button>
      </el-row>
    </el-form>
    <!-- Vista previa de las imagenes -->
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
// Resource
import Resource from '@/api/resource'
import CategoriasResource from '@/api/categorias'
const categoriasResource = new CategoriasResource()
import ResourceTienda from '@/api/tienda'
const tiendaResource = new ResourceTienda()
const productoResource = new Resource('productos')
const fotosResource = new Resource('fotosproducto')
export default {
  name: 'CreateTienda',
  props: {
    tiendaid: {
      type: Number,
      default: () => {
        return -10
      }
    },
    productoid: {
      type: Number,
      default: () => {
        return -10
      }
    }
  },
  data() {
    return {
      loading: false,
      modelo: {
        id: undefined,
        tienda_id: undefined,
        ruc: '',
        razonsocial: '',
        nombre: '',
        precio: 0,
        categoria_id: undefined,
        fotos: []
      },
      modelTienda: {
        id: undefined,
        ruc: '',
        razonsocial: ''
      },
      reglas: {
        ruc: [{ required: true, message: 'El campo es obligatorio', trigger: 'blur' }],
        razonsocial: [{ required: true, message: 'El campo es obligatorio', trigger: 'blur' }],
        nombre: [{ required: true, message: 'El campo es obligatorio', trigger: 'blur' }],
        descripcion: [{ required: true, message: 'El campo es obligatorio', trigger: 'blur' }],
        precio: [{ required: true, message: 'El campo es obligatorio', trigger: 'blur' }],
        categoria_id: [{ required: true, message: 'El campo es obligatorio', trigger: 'blur' }]
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      listaCategorias: []
    }
  },
  watch: {
    productoid: function(newval, oldval) {
      this.modelo.id = this.productoid
      this.handleGetInitialData()
      // if (newval !== oldval && newval > 0) {
      // }
    }
  },
  mounted() {
    this.getListaCategorias()
    this.handleGetInitialData()
  },
  methods: {
    handleGetInitialData() {
      this.$nextTick(_ => {
        this.handleGetDataTienda()
        this.getDataProducto()
        this.$refs['formCreateEditProducto'].clearValidate()
      })
    },
    handleGetDataTienda() {
      if (this.tiendaid <= 0) {
        return
      }
      this.loading = true
      tiendaResource.get(this.tiendaid)
        .then((response) => {
          const { data } = response
          this.modelTienda = {
            id: data.id,
            ruc: data.ruc,
            razonsocial: data.razonsocial
          }
          this.modelo.tienda_id = this.modelTienda.id
          this.modelo.ruc = this.modelTienda.ruc
          this.modelo.razonsocial = this.modelTienda.razonsocial
          this.loading = false
        })
        .catch(_ => {
          this.$message('No se ha obtenido datos de la tienda')
          this.loading = false
        })
    },
    getDataProducto() {
      if (this.productoid <= 0) {
        return
      }
      this.loading = true
      productoResource.get(this.modelo.id)
        .then((response) => {
          const { state, data } = response
          if (state === 'success') {
            this.setDataModelProducto(data)
          } else {
            this.$message('El registro no ha sido encontrado')
          }
          this.loading = false
        })
        .catch(_ => {
          this.loading = false
          this.$message('No se ha obtenido datos del producto')
        })
    },
    getListaCategorias() {
      this.loading = true
      categoriasResource.listaCategoriasProductos()
        .then(
          (response) => {
            console.log(response)
            this.listaCategorias = response.data
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
    uploadImage(event) {
      const file = event.target.files[0]
      this.modelo.logo = file
      this.modelo.foto = URL.createObjectURL(file)
    },
    selectPosition(e) {
      const { lngLat } = e
      this.modelo.latitud = lngLat.lat
      this.modelo.longitud = lngLat.lng
    },
    submitForm() {
      this.$refs['formCreateEditProducto'].validate((valid) => {
        if (valid) {
          // Actualizar registro
          if (this.modelo.id !== undefined && this.modelo.id > 0) {
            this.sendUpdateData()
          } else {
            this.sendStoreData()
          }
        } else {
          this.loading = false
        }
      })
    },
    sendStoreData() {
      // Crear form data
      const formData = new FormData()
      formData.append('ruc', this.modelo.ruc)
      formData.append('razonsocial', this.modelo.razonsocial)
      formData.append('nombre', this.modelo.nombre)
      formData.append('descripcion', this.modelo.descripcion)
      formData.append('precio', this.modelo.precio)
      formData.append('tienda_id', this.modelo.tienda_id)
      formData.append('categoria_id', this.modelo.categoria_id)

      // const files = []
      let contFiles = 0

      this.$refs['upload'].uploadFiles.forEach(file => {
        if (file.status === 'ready') {
          contFiles++
          formData.append('files' + contFiles, file.raw)
        }
      })
      formData.append('totalFiles', contFiles)

      this.loading = true
      productoResource.store(formData)
        .then(
          (response) => {
            const { state, message, data } = response
            if (state === 'success') {
              this.setDataModelProducto(data)
              this.getDataProducto()
            }
            this.$message(message)
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
    sendUpdateData() {
      // Crear form data
      const formData = new FormData()
      formData.append('id', this.modelo.id)
      formData.append('ruc', this.modelo.ruc)
      formData.append('razonsocial', this.modelo.razonsocial)
      formData.append('nombre', this.modelo.nombre)
      formData.append('descripcion', this.modelo.descripcion)
      formData.append('precio', this.modelo.precio)
      formData.append('tienda_id', this.modelo.tienda_id)
      formData.append('categoria_id', this.modelo.categoria_id)

      // const files = []
      let contFiles = 0

      this.$refs['upload'].uploadFiles.forEach(file => {
        if (file.status === 'ready') {
          contFiles++
          formData.append('files' + contFiles, file.raw)
        }
      })
      formData.append('totalFiles', contFiles)

      this.loading = true
      productoResource.store(formData)
        .then(
          (response) => {
            const { state, message, data } = response
            if (state === 'success') {
              this.setDataModelProducto(data)
              this.getDataProducto()
            }
            this.$message(message)
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
    close() {
      this.modelo = {
        ruc: null,
        razonsocial: null,
        logo: null,
        foto: null,
        latitud: null,
        longitud: null,
        categoria_id: null,
        fotos: []
      }
      this.mapCenter = [-78.50252300459422, -7.165559127084376]
      this.$emit('close')
    },
    setDataModelProducto(data) {
      this.loading = true
      this.modelo = {
        id: data.id,
        tienda_id: data.tienda_id,
        ruc: data.ruc,
        razonsocial: data.razonsocial,
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        categoria_id: data.categoria_id,
        fotos: data.fotos
      }

      this.modelo.tienda_id = this.modelTienda.id
      this.modelo.ruc = this.modelTienda.ruc
      this.modelo.razonsocial = this.modelTienda.razonsocial

      this.loading = false
    },
    handleRemove(file) {
      let idImagen
      console.log(file)
      console.log(this.$refs['upload'].uploadFiles)
      const index = this.$refs['upload'].uploadFiles.findIndex((archivo) => {
        idImagen = file.id
        return archivo.uid === file.uid
      })
      // console.log(index, idImagen)
      if (index > -1) {
        this.$refs['upload'].uploadFiles.splice(index, 1)
      }
      if (idImagen !== 'undefined' && idImagen > 0) {
        this.handleRemoveImageRemote(idImagen)
      }
    },
    handleRemoveImageRemote(idimage) {
      fotosResource.destroy(idimage)
        .then((response) => {
          const { state, message } = response
          if (state === 'success') {
            this.$message(message)
          } else {
            this.$message(message)
          }
        })
        .catch(_ => {
          this.$message('No se ha eliminado la foto')
        })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
    },
    deleteProducto() {
      this.$confirm('Seguro que desea eliminar el producto?', 'Atención', {
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar',
        type: 'warning',
        center: true
      }).then(() => {
        this.loading = true
        productoResource.destroy(this.modelo.id)
          .then((response) => {
            const { state, message } = response
            if (state === 'success') {
              console.log('Llamar a funcion cerrar venta')
              this.handleEmitCloseToParent()
            }
            this.$message({
              type: state,
              message: message
            })
            this.loading = false
          })
          .catch(_ => {
            this.loading = false
            this.$message('No ha producido una excepción')
          })
      }).catch(() => {
        this.$message('Operación cancelada')
      })
    },
    handleEmitCloseToParent() {
      this.$emit('close', {})
    }
  }
}
</script>
